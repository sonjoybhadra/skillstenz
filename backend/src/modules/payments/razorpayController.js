const crypto = require('crypto');
const Payment = require('./Payment');
const Membership = require('../memberships/Membership');
const Plan = require('../plans/Plan');
const User = require('../auth/User');
const ApiSettings = require('../settings/ApiSettings');

// Initialize Razorpay - will be done dynamically
let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (e) {
  console.log('Razorpay module not installed. Run: npm install razorpay');
}

const getRazorpayInstance = async () => {
  if (!Razorpay) {
    throw new Error('Razorpay module not installed. Run: npm install razorpay');
  }
  
  // First try environment variables, then fall back to database settings
  let keyId = process.env.RAZORPAY_KEY_ID;
  let keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  // If not in env, try to get from database
  if (!keyId || !keySecret) {
    try {
      const apiSettings = await ApiSettings.getSettings();
      if (apiSettings.razorpay?.enabled) {
        keyId = keyId || apiSettings.razorpay.keyId;
        keySecret = keySecret || apiSettings.razorpay.keySecret;
      }
    } catch (e) {
      console.log('Could not load API settings from database:', e.message);
    }
  }
  
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured. Please set them in Admin Settings → API & Payments');
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    
    // Fetch plan details
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    if (plan.price === 0) {
      return res.status(400).json({ message: 'Cannot create order for free plan' });
    }

    const razorpay = await getRazorpayInstance();
    
    // Amount in paise (smallest currency unit)
    const amountInPaise = Math.round(plan.price * 100);
    
    const options = {
      amount: amountInPaise,
      currency: plan.currency || 'INR',
      receipt: `order_${Date.now()}_${req.userId}`,
      notes: {
        userId: req.userId.toString(),
        planId: plan._id.toString(),
        planName: plan.name,
        duration: plan.duration,
        durationType: plan.durationType
      }
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = new Payment({
      userId: req.userId,
      amount: plan.price,
      currency: plan.currency || 'INR',
      paymentMethod: 'razorpay',
      orderId: order.id,
      status: 'pending',
      metadata: {
        planId: plan._id,
        planName: plan.name,
        duration: plan.duration,
        durationType: plan.durationType
      }
    });
    await payment.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
      plan: {
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        durationType: plan.durationType
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      // Update payment status to failed
      await Payment.findByIdAndUpdate(paymentId, { 
        status: 'failed',
        updatedAt: new Date()
      });
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update payment status
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { 
        status: 'completed',
        metadata: {
          ...req.body.metadata,
          razorpay_payment_id,
          razorpay_signature
        },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Create or update membership
    const { planId, duration, durationType } = payment.metadata;
    const plan = await Plan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Calculate expiry date
    const expiryDate = new Date();
    switch (durationType || plan.durationType) {
      case 'day':
        expiryDate.setDate(expiryDate.getDate() + (duration || plan.duration));
        break;
      case 'month':
        expiryDate.setMonth(expiryDate.getMonth() + (duration || plan.duration));
        break;
      case 'year':
        expiryDate.setFullYear(expiryDate.getFullYear() + (duration || plan.duration));
        break;
      case 'lifetime':
        expiryDate.setFullYear(expiryDate.getFullYear() + 100);
        break;
      default:
        expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // Get features from plan
    const features = plan.features
      .filter(f => f.included)
      .map(f => f.title);

    let membership = await Membership.findOne({ userId: payment.userId });
    
    if (membership) {
      // If extending existing membership
      if (membership.status === 'active' && membership.expiryDate > new Date()) {
        // Add duration to existing expiry
        const currentExpiry = new Date(membership.expiryDate);
        switch (durationType || plan.durationType) {
          case 'day':
            currentExpiry.setDate(currentExpiry.getDate() + (duration || plan.duration));
            break;
          case 'month':
            currentExpiry.setMonth(currentExpiry.getMonth() + (duration || plan.duration));
            break;
          case 'year':
            currentExpiry.setFullYear(currentExpiry.getFullYear() + (duration || plan.duration));
            break;
          case 'lifetime':
            currentExpiry.setFullYear(currentExpiry.getFullYear() + 100);
            break;
        }
        membership.expiryDate = currentExpiry;
      } else {
        membership.expiryDate = expiryDate;
      }
      
      membership.planType = plan.slug;
      membership.status = 'active';
      membership.features = features;
      membership.aiUsageLimit = plan.aiQueryLimit;
      membership.aiUsageCount = 0;
      membership.updatedAt = new Date();
      await membership.save();
    } else {
      membership = new Membership({
        userId: payment.userId,
        planType: plan.slug,
        status: 'active',
        features,
        aiUsageLimit: plan.aiQueryLimit,
        aiUsageCount: 0,
        expiryDate
      });
      await membership.save();
    }

    // Update user reference
    await User.findByIdAndUpdate(payment.userId, { membershipId: membership._id });

    // Link payment to membership
    payment.membershipId = membership._id;
    await payment.save();

    res.json({ 
      success: true,
      message: 'Payment verified and membership activated',
      membership: {
        planType: membership.planType,
        status: membership.status,
        expiryDate: membership.expiryDate
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};

// Razorpay webhook
exports.razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Verify webhook signature
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== req.headers['x-razorpay-signature']) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = req.body;
    const { payload } = event;

    switch (event.event) {
      case 'payment.captured':
        // Payment successful
        const paymentEntity = payload.payment.entity;
        await Payment.findOneAndUpdate(
          { orderId: paymentEntity.order_id },
          { 
            status: 'completed',
            metadata: { 
              razorpay_payment_id: paymentEntity.id,
              method: paymentEntity.method
            },
            updatedAt: new Date()
          }
        );
        break;

      case 'payment.failed':
        // Payment failed
        const failedPayment = payload.payment.entity;
        await Payment.findOneAndUpdate(
          { orderId: failedPayment.order_id },
          { status: 'failed', updatedAt: new Date() }
        );
        break;

      case 'refund.created':
        // Refund initiated
        const refund = payload.refund.entity;
        await Payment.findOneAndUpdate(
          { orderId: refund.payment_id },
          { status: 'refunded', updatedAt: new Date() }
        );
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const payments = await Payment.find({ userId: req.userId })
      .populate('membershipId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments({ userId: req.userId });

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const query = {};

    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('userId', 'email userType')
      .populate('membershipId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    // Calculate totals
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Razorpay key (public)
exports.getRazorpayKey = async (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
};

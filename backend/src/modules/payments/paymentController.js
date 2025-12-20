const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('./Payment');
const Membership = require('../memberships/Membership');
const User = require('../auth/User');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { planType, duration } = req.body;
    
    // Calculate amount based on plan and duration
    const amounts = {
      silver: 9.99, // per month
      gold: 19.99
    };

    if (!amounts[planType]) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    const amount = amounts[planType] * duration * 100; // Convert to cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        userId: req.userId,
        planType,
        duration
      }
    });

    // Create payment record
    const payment = new Payment({
      userId: req.userId,
      amount: amount / 100,
      paymentMethod: 'stripe',
      paymentIntentId: paymentIntent.id,
      status: 'pending'
    });
    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment creation failed' });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { paymentIntentId },
      { status: 'completed', updatedAt: new Date() },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Create or update membership
    const { planType, duration } = paymentIntent.metadata;
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(duration));

    let membership = await Membership.findOne({ userId: payment.userId });
    
    if (membership) {
      membership.planType = planType;
      membership.status = 'active';
      membership.expiryDate = expiryDate;
      membership.features = Membership.getPlanFeatures(planType);
      membership.aiUsageLimit = Membership.getAILimit(planType);
      membership.aiUsageCount = 0;
      membership.updatedAt = new Date();
      await membership.save();
    } else {
      membership = new Membership({
        userId: payment.userId,
        planType,
        expiryDate,
        features: Membership.getPlanFeatures(planType),
        aiUsageLimit: Membership.getAILimit(planType)
      });
      await membership.save();
    }

    // Update user membership reference
    await User.findByIdAndUpdate(payment.userId, { membershipId: membership._id });

    res.json({ message: 'Payment confirmed and membership activated', membership });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const payments = await Payment.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments({ userId: req.userId });

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.webhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

async function handlePaymentSuccess(paymentIntent) {
  // Similar logic as confirmPayment
  const payment = await Payment.findOneAndUpdate(
    { paymentIntentId: paymentIntent.id },
    { status: 'completed', updatedAt: new Date() },
    { new: true }
  );

  if (payment) {
    const { planType, duration, userId } = paymentIntent.metadata;
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(duration));

    let membership = await Membership.findOne({ userId });
    
    if (membership) {
      membership.planType = planType;
      membership.status = 'active';
      membership.expiryDate = expiryDate;
      membership.features = Membership.getPlanFeatures(planType);
      membership.aiUsageLimit = Membership.getAILimit(planType);
      membership.aiUsageCount = 0;
      await membership.save();
    } else {
      membership = new Membership({
        userId,
        planType,
        expiryDate,
        features: Membership.getPlanFeatures(planType),
        aiUsageLimit: Membership.getAILimit(planType)
      });
      await membership.save();
    }

    await User.findByIdAndUpdate(userId, { membershipId: membership._id });
  }
}

exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};
    
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
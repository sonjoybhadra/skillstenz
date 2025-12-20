const Plan = require('./Plan');

// Get all active plans (public)
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true })
      .sort({ order: 1, price: 1 });
    res.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single plan
exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ 
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ]
    });
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    res.json(plan);
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all plans including inactive
exports.getAllPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;
    const query = {};
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const plans = await Plan.find(query)
      .sort({ order: 1, price: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Plan.countDocuments(query);

    res.json({
      plans,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get all plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Create plan
exports.createPlan = async (req, res) => {
  try {
    const { name, description, price, currency, duration, durationType, features, aiQueryLimit, benefits, order, isPopular, isActive } = req.body;

    // Check if plan with same name exists
    const existingPlan = await Plan.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingPlan) {
      return res.status(400).json({ message: 'Plan with this name already exists' });
    }

    const plan = new Plan({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description,
      price,
      currency: currency || 'INR',
      duration: duration || 1,
      durationType: durationType || 'month',
      features: features || [],
      aiQueryLimit: aiQueryLimit || 10,
      benefits: benefits || {},
      order: order || 0,
      isPopular: isPopular || false,
      isActive: isActive !== false
    });

    await plan.save();
    res.status(201).json({ message: 'Plan created successfully', plan });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update plan
exports.updatePlan = async (req, res) => {
  try {
    const { name, description, price, currency, duration, durationType, features, aiQueryLimit, benefits, order, isPopular, isActive, razorpayPlanId } = req.body;

    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check for duplicate name
    if (name && name !== plan.name) {
      const existingPlan = await Plan.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      if (existingPlan) {
        return res.status(400).json({ message: 'Plan with this name already exists' });
      }
      plan.name = name;
      plan.slug = name.toLowerCase().replace(/\s+/g, '-');
    }

    if (description !== undefined) plan.description = description;
    if (price !== undefined) plan.price = price;
    if (currency !== undefined) plan.currency = currency;
    if (duration !== undefined) plan.duration = duration;
    if (durationType !== undefined) plan.durationType = durationType;
    if (features !== undefined) plan.features = features;
    if (aiQueryLimit !== undefined) plan.aiQueryLimit = aiQueryLimit;
    if (benefits !== undefined) plan.benefits = { ...plan.benefits, ...benefits };
    if (order !== undefined) plan.order = order;
    if (isPopular !== undefined) plan.isPopular = isPopular;
    if (isActive !== undefined) plan.isActive = isActive;
    if (razorpayPlanId !== undefined) plan.razorpayPlanId = razorpayPlanId;

    await plan.save();
    res.json({ message: 'Plan updated successfully', plan });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Delete plan
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Soft delete by setting isActive to false
    plan.isActive = false;
    await plan.save();

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Reorder plans
exports.reorderPlans = async (req, res) => {
  try {
    const { planOrders } = req.body; // [{ id: 'xxx', order: 1 }, ...]

    if (!Array.isArray(planOrders)) {
      return res.status(400).json({ message: 'planOrders must be an array' });
    }

    for (const item of planOrders) {
      await Plan.findByIdAndUpdate(item.id, { order: item.order });
    }

    res.json({ message: 'Plans reordered successfully' });
  } catch (error) {
    console.error('Reorder plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

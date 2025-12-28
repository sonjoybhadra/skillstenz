const TechnologyCategory = require('./TechnologyCategory');
const Technology = require('./Technology');

// Get all categories (public) - with technology counts
exports.getAllCategories = async (req, res) => {
  try {
    const { published = 'true', featured } = req.query;
    
    const query = {};
    if (published === 'true') query.isPublished = true;
    if (featured === 'true') query.featured = true;
    
    const categories = await TechnologyCategory.find(query)
      .sort({ order: 1, name: 1 });
    
    // Get technology counts for each category
    const categoryIds = categories.map(c => c._id);
    const techCounts = await Technology.aggregate([
      { $match: { category: { $in: categoryIds }, isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const countMap = {};
    techCounts.forEach(tc => {
      countMap[tc._id.toString()] = tc.count;
    });
    
    // Add counts to categories
    const categoriesWithCounts = categories.map(cat => {
      const catObj = cat.toObject();
      catObj.technologiesCount = countMap[cat._id.toString()] || 0;
      return catObj;
    });
    
    res.json({ categories: categoriesWithCounts });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to get categories', error: error.message });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const category = await TechnologyCategory.findOne({ slug });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Get technologies in this category
    const technologies = await Technology.find({ 
      category: category._id,
      isPublished: true 
    }).sort({ order: 1, name: 1 });
    
    res.json({ category, technologies });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Failed to get category', error: error.message });
  }
};

// Get all categories with technology counts (admin)
exports.getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await TechnologyCategory.find()
      .sort({ order: 1, name: 1 });
    
    // Get technology counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Technology.countDocuments({ category: cat._id });
        return {
          ...cat.toObject(),
          technologiesCount: count
        };
      })
    );
    
    res.json({ categories: categoriesWithCounts });
  } catch (error) {
    console.error('Get categories admin error:', error);
    res.status(500).json({ message: 'Failed to get categories', error: error.message });
  }
};

// Create category (admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, icon, color, image, order, isPublished, featured } = req.body;
    
    const existingCategory = await TechnologyCategory.findOne({ 
      $or: [{ name }, { slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }] 
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name or slug already exists' });
    }
    
    const category = new TechnologyCategory({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      icon,
      color,
      image,
      order: order || 0,
      isPublished: isPublished !== false,
      featured: featured === true
    });
    
    await category.save();
    
    res.status(201).json({ category, message: 'Category created successfully' });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

// Update category (admin)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, color, image, order, isPublished, featured } = req.body;
    
    const category = await TechnologyCategory.findById(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check for duplicate name/slug
    if (name && name !== category.name) {
      const existing = await TechnologyCategory.findOne({ name, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }
    
    Object.assign(category, {
      name: name || category.name,
      slug: slug || category.slug,
      description: description !== undefined ? description : category.description,
      icon: icon || category.icon,
      color: color || category.color,
      image: image !== undefined ? image : category.image,
      order: order !== undefined ? order : category.order,
      isPublished: isPublished !== undefined ? isPublished : category.isPublished,
      featured: featured !== undefined ? featured : category.featured
    });
    
    await category.save();
    
    res.json({ category, message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

// Delete category (admin)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if any technologies use this category
    const techCount = await Technology.countDocuments({ category: id });
    if (techCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category: ${techCount} technologies are using it. Please reassign them first.` 
      });
    }
    
    const category = await TechnologyCategory.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

// Reorder categories (admin)
exports.reorderCategories = async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, order }
    
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ message: 'Orders array is required' });
    }
    
    await Promise.all(
      orders.map(({ id, order }) => 
        TechnologyCategory.findByIdAndUpdate(id, { order })
      )
    );
    
    res.json({ message: 'Categories reordered successfully' });
  } catch (error) {
    console.error('Reorder categories error:', error);
    res.status(500).json({ message: 'Failed to reorder categories', error: error.message });
  }
};

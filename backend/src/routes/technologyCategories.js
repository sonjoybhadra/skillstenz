const express = require('express');
const categoryController = require('../modules/technologies/categoryController');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

// Admin routes
router.get('/admin/all', checkAuth, checkRole(['admin']), categoryController.getAllCategoriesAdmin);
router.post('/', checkAuth, checkRole(['admin']), categoryController.createCategory);
router.put('/:id', checkAuth, checkRole(['admin']), categoryController.updateCategory);
router.delete('/:id', checkAuth, checkRole(['admin']), categoryController.deleteCategory);
router.post('/reorder', checkAuth, checkRole(['admin']), categoryController.reorderCategories);

module.exports = router;

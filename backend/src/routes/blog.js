const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../../middlewares/auth');
const articleController = require('../modules/blog/articleController');
const categoryController = require('../modules/blog/categoryController');
const tagController = require('../modules/blog/tagController');
const commentController = require('../modules/blog/commentController');

// ===== ARTICLES =====
// Public routes
router.get('/articles', articleController.getArticles);
router.get('/articles/:slug', articleController.getArticleBySlug);

// Protected routes
router.post('/articles/:id/like', auth, articleController.toggleLike);

// Admin routes
router.post('/articles', adminAuth, articleController.createArticle);
router.put('/articles/:id', adminAuth, articleController.updateArticle);
router.delete('/articles/:id', adminAuth, articleController.deleteArticle);

// ===== CATEGORIES =====
// Public routes
router.get('/categories', categoryController.getCategories);
router.get('/categories/:slug', categoryController.getCategoryBySlug);

// Admin routes
router.post('/categories', adminAuth, categoryController.createCategory);
router.put('/categories/:id', adminAuth, categoryController.updateCategory);
router.delete('/categories/:id', adminAuth, categoryController.deleteCategory);

// ===== TAGS =====
// Public routes
router.get('/tags', tagController.getTags);
router.get('/tags/:slug', tagController.getTagBySlug);

// Admin routes
router.post('/tags', adminAuth, tagController.createTag);
router.put('/tags/:id', adminAuth, tagController.updateTag);
router.delete('/tags/:id', adminAuth, tagController.deleteTag);

// ===== COMMENTS =====
// Public routes
router.get('/articles/:articleId/comments', commentController.getCommentsByArticle);

// Protected routes
router.post('/comments', auth, commentController.createComment);
router.put('/comments/:id', auth, commentController.updateComment);
router.delete('/comments/:id', auth, commentController.deleteComment);
router.post('/comments/:id/like', auth, commentController.toggleLike);

module.exports = router;

const express = require('express');
const router = express.Router();
const bookmarkController = require('../modules/bookmarks/bookmarkController');
const { authenticate } = require('../middlewares/auth');

// All routes require authentication
router.use(authenticate);

router.get('/', bookmarkController.getUserBookmarks);
router.post('/', bookmarkController.addBookmark);
router.get('/check', bookmarkController.checkBookmark);
router.put('/:id', bookmarkController.updateBookmark);
router.delete('/:id', bookmarkController.removeBookmark);

module.exports = router;

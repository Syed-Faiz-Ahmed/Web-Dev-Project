const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Favorites routes (Protected)
router.get('/favorites', auth, userController.getFavorites);
router.post('/favorites', auth, userController.addFavorite);
router.delete('/favorites/:daycareId', auth, userController.removeFavorite);

// Dashboard Routes (Protected)
router.get('/dashboard', auth, userController.getUserDashboard);
router.get('/inquiries', auth, userController.getUserInquiries);

module.exports = router;

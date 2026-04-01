const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const jwt = require('jsonwebtoken');

// Optional Auth Middleware to grab user.id if logged in, but not block if guest
const optionalAuth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            req.user = decoded;
        }
    } catch (err) {
        // Just ignore invalid token for optional auth, let them be arbitrary guest
    }
    next();
};

router.post('/', optionalAuth, inquiryController.createInquiry);

// Add endpoint to simulate daycare reply updating the status
router.put('/:id/status', optionalAuth, inquiryController.updateInquiryStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Subscribe to push notifications
// @route   POST /api/notifications/subscribe
// @access  Private
router.post('/subscribe', protect, async (req, res, next) => {
  try {
    const { subscription } = req.body;
    
    if (!subscription) {
      return res.status(400).json({ message: 'Missing subscription object' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In 2.0, we just store one subscription or update it.
    // The model schema in User.js has 'subscription: { type: Object }'
    user.subscription = subscription;
    await user.save();

    res.status(201).json({ message: 'Push subscription saved successfully.' });
  } catch (error) {
    console.error('Subscription Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

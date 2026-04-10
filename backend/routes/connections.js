const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/connections/request/:userId
// @desc    Send connection request
// @access  Private
router.post('/request/:userId', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already connected
    if (currentUser.connections.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Already connected' });
    }

    // Check if request already sent
    if (targetUser.pendingConnections.includes(req.user.id)) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    targetUser.pendingConnections.push(req.user.id);
    await targetUser.save();

    res.json({ message: 'Connection request sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/connections/accept/:userId
// @desc    Accept connection request
// @access  Private
router.post('/accept/:userId', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const requestUser = await User.findById(req.params.userId);

    if (!requestUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from pending
    const pendingIndex = currentUser.pendingConnections.indexOf(req.params.userId);
    if (pendingIndex === -1) {
      return res.status(400).json({ message: 'No pending request from this user' });
    }

    currentUser.pendingConnections.splice(pendingIndex, 1);
    
    // Add to connections for both users
    currentUser.connections.push(req.params.userId);
    requestUser.connections.push(req.user.id);

    await currentUser.save();
    await requestUser.save();

    res.json({ message: 'Connection accepted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/connections/:userId
// @desc    Remove connection
// @access  Private
router.delete('/:userId', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove connection from both users
    currentUser.connections = currentUser.connections.filter(
      id => id.toString() !== req.params.userId
    );
    targetUser.connections = targetUser.connections.filter(
      id => id.toString() !== req.user.id
    );

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Connection removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/connections
// @desc    Get user's connections
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('connections', 'firstName lastName profilePicture headline location');

    res.json(user.connections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/connections/pending
// @desc    Get pending connection requests
// @access  Private
router.get('/pending', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('pendingConnections', 'firstName lastName profilePicture headline');

    res.json(user.pendingConnections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

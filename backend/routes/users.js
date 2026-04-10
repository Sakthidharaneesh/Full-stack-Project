const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/users/search
// @desc    Search users
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const query = req.query.q || '';
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { headline: { $regex: query, $options: 'i' } },
        { industry: { $regex: query, $options: 'i' } }
      ]
    })
    .select('-password')
    .limit(10);

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('connections', 'firstName lastName profilePicture headline');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/:id
// @desc    Update user profile by ID
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is updating their own profile
    if (user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const {
      firstName,
      lastName,
      headline,
      location,
      industry,
      about,
      experience,
      education,
      skills
    } = req.body;

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (headline !== undefined) user.headline = headline;
    if (location !== undefined) user.location = location;
    if (industry !== undefined) user.industry = industry;
    if (about !== undefined) user.about = about;
    if (experience) user.experience = experience;
    if (education) user.education = education;
    if (skills) user.skills = skills;

    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const {
    firstName,
    lastName,
    headline,
    location,
    industry,
    about,
    experience,
    education,
    skills
  } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (headline) user.headline = headline;
    if (location) user.location = location;
    if (industry) user.industry = industry;
    if (about) user.about = about;
    if (experience) user.experience = experience;
    if (education) user.education = education;
    if (skills) user.skills = skills;

    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');

const upload = multer({ storage: multer.memoryStorage() });

// @route   POST api/users/upload-resume
// @desc    Upload resume, parse text to extract skills to improve job matching
// @access  Private
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse the PDF using pdf-parse v2 API
    const parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    const resumeText = result.text.toLowerCase();

    // A predefined list of common skills to look for in the resume
    const commonSkills = [
      'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'go', 'rust',
      'react', 'node.js', 'angular', 'vue', 'express', 'django', 'flask', 'spring',
      'html', 'css', 'typescript', 'mongodb', 'sql', 'postgresql', 'mysql', 'aws',
      'docker', 'kubernetes', 'git', 'machine learning', 'data analysis', 'marketing',
      'sales', 'project management', 'agile', 'scrum', 'seo', 'leadership'
    ];

    // Find which skills are mentioned in the resume
    const extractedSkills = commonSkills.filter(skill => resumeText.includes(skill));

    // Update user's skills array
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Merge existing skills with newly extracted skills, ensuring no duplicates
    const currentSkills = user.skills.map(s => s.toLowerCase());
    const newSkills = [...new Set([...currentSkills, ...extractedSkills])];

    // Format new skills nicely (capitalize first letter)
    user.skills = newSkills.map(skill => skill.charAt(0).toUpperCase() + skill.slice(1));
    await user.save();

    res.json({ 
      message: 'Resume parsed successfully!', 
      extractedSkills,
      updatedSkills: user.skills
    });
  } catch (err) {
    console.error('Error parsing resume:', err);
    res.status(500).json({ message: 'Server error during resume parsing' });
  }
});

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

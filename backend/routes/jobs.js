const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// @route   POST api/jobs
// @desc    Create a job posting
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      postedBy: req.user.id
    });

    const job = await newJob.save();
    const populatedJob = await Job.findById(job._id)
      .populate('postedBy', 'firstName lastName profilePicture');

    res.json(populatedJob);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = search ? {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    } : {};
    
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate('postedBy', 'firstName lastName profilePicture company');

    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'firstName lastName profilePicture')
      .populate('applicants.user', 'firstName lastName profilePicture headline');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/jobs/:id/apply
// @desc    Apply to a job
// @access  Private
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const hasApplied = job.applicants.some(
      applicant => applicant.user.toString() === req.user.id
    );

    if (hasApplied) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    job.applicants.push({ user: req.user.id });
    await job.save();

    res.json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/jobs/:id
// @desc    Update a job
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('postedBy', 'firstName lastName profilePicture');

    res.json(updatedJob);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

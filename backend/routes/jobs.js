const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
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
// @desc    Get all jobs and calculate match score
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const search = req.query.search || '';
    const type = req.query.type;
    const workplaceType = req.query.workplaceType;
    const domain = req.query.domain;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (type) query.type = type;
    if (workplaceType) query.workplaceType = workplaceType;
    if (domain) query.domain = domain;
    
    // Fetch the current user to get their skills for job matching
    const currentUser = await User.findById(req.user.id);
    let jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate('postedBy', 'firstName lastName profilePicture company')
      .lean();

    // Calculate match score
    if (currentUser && currentUser.skills && currentUser.skills.length > 0) {
      const userSkills = currentUser.skills.map(s => s.toLowerCase());
      
      jobs = jobs.map(job => {
        let matchScore = 0;
        if (job.requirements && job.requirements.length > 0) {
          const reqs = job.requirements.map(r => r.toLowerCase());
          const matchedSkills = userSkills.filter(userSkill => 
            reqs.some(req => req.includes(userSkill) || userSkill.includes(req))
          );
          matchScore = Math.round((matchedSkills.length / reqs.length) * 100);
          
          // Cap the score at 100
          if (matchScore > 100) matchScore = 100;
        }
        return { ...job, matchScore };
      });
    }

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

// @route   POST api/jobs/:id/save
// @desc    Save or unsave a job
// @access  Private
router.post('/:id/save', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize savedJobs if it doesn't exist
    if (!user.savedJobs) {
      user.savedJobs = [];
    }

    const isSaved = user.savedJobs.includes(req.params.id);
    let message = '';
    
    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(jobId => jobId.toString() !== req.params.id);
      message = 'Job removed from saved list';
    } else {
      user.savedJobs.push(req.params.id);
      message = 'Job saved successfully';
    }

    await user.save();
    res.json({ message, savedJobs: user.savedJobs });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/jobs/:id/applicants/:userId/status
// @desc    Update applicant status (Recruiter only)
// @access  Private
router.put('/:id/applicants/:userId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Verify user owns the job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const applicant = job.applicants.find(a => a.user.toString() === req.params.userId);
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });

    applicant.status = status;
    await job.save();

    res.json(job);
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

const JobPosition = require('./JobPosition');
const JobApplication = require('../../models/JobApplication');

// Get all active job positions
exports.getJobs = async (req, res) => {
  try {
    const { department, type, location, featured } = req.query;

    const filter = { isActive: true };
    if (department) filter.department = department;
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (featured === 'true') filter.isFeatured = true;

    const jobs = await JobPosition.find(filter)
      .select('-applicationEmail -applications')
      .sort({ isFeatured: -1, createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

// Get single job by slug
exports.getJobBySlug = async (req, res) => {
  try {
    const job = await JobPosition.findOne({ slug: req.params.slug, isActive: true });
    
    if (!job) {
      return res.status(404).json({ message: 'Job position not found' });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job', error: error.message });
  }
};

// Admin: Get all jobs including inactive
exports.getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, department } = req.query;

    const filter = {};
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (department) filter.department = department;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await JobPosition.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await JobPosition.countDocuments(filter);

    res.json({
      jobs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

// Admin: Create job
exports.createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Generate slug if not provided
    if (!jobData.slug) {
      jobData.slug = jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const job = await JobPosition.create(jobData);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

// Admin: Update job
exports.updateJob = async (req, res) => {
  try {
    const job = await JobPosition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job', error: error.message });
  }
};

// Admin: Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await JobPosition.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
};

// Admin: Toggle job status
exports.toggleJobStatus = async (req, res) => {
  try {
    const job = await JobPosition.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle job status', error: error.message });
  }
};

// Get benefits (admin configurable)
exports.getBenefits = async (req, res) => {
  try {
    // These could come from a settings collection
    const defaultBenefits = [
      { icon: '🏠', title: 'Remote Work', description: 'Work from anywhere in the world' },
      { icon: '📚', title: 'Learning Budget', description: '$2,000/year for courses and conferences' },
      { icon: '🏥', title: 'Health Insurance', description: 'Comprehensive health coverage' },
      { icon: '🎯', title: 'Equity', description: 'Stock options for all employees' },
      { icon: '🌴', title: 'Unlimited PTO', description: 'Take time off when you need it' },
      { icon: '💻', title: 'Equipment', description: 'Top-of-the-line setup' },
    ];

    res.json(defaultBenefits);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch benefits', error: error.message });
  }
};

// Public: Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { name, email, phone, coverLetter, linkedinUrl, portfolioUrl, experience, expectedSalary, noticePeriod } = req.body;
    
    const job = await JobPosition.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or no longer accepting applications' });
    }
    
    // Check if already applied
    const existingApplication = await JobApplication.findOne({ job: jobId, email });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this position' });
    }
    
    const application = new JobApplication({
      job: jobId,
      user: req.user?.id,
      name,
      email,
      phone,
      coverLetter,
      linkedinUrl,
      portfolioUrl,
      experience,
      expectedSalary,
      noticePeriod,
      resume: req.file?.path // If using multer for file uploads
    });
    
    await application.save();
    
    // Update applications count
    job.applicationsCount = (job.applicationsCount || 0) + 1;
    await job.save();
    
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
};

// Admin: Get all applications
exports.getApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, jobId } = req.query;
    const filter = {};
    
    if (status && status !== 'all') filter.status = status;
    if (jobId) filter.job = jobId;
    
    const applications = await JobApplication.find(filter)
      .populate('job', 'title department')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await JobApplication.countDocuments(filter);
    
    res.json({
      applications,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

// Admin: Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        notes,
        reviewedBy: req.user.id,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('job', 'title');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json({ application, message: 'Application updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update application', error: error.message });
  }
};

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, underscores and hyphens']
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'instructor', 'student'],
    default: 'student'
  },
  userType: {
    type: String,
    enum: ['fresher', 'experienced'],
    default: 'student'
  },
  
  // Profile
  title: String,
  profileImage: {
    type: String,
    default: ''
  },
  bio: String,
  phone: String,
  location: String,
  website: String,
  skills: [String],
  interests: [String],
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    youtube: String
  },
  
  // Resume Template Preference
  resumeTemplate: {
    type: String,
    enum: ['modern', 'classic', 'minimal', 'creative', 'professional', 'elegant'],
    default: 'modern'
  },
  
  // Resume/Portfolio Data
  experience: [{
    title: String,
    company: String,
    location: String,
    startDate: String,
    endDate: String,
    current: { type: Boolean, default: false },
    description: String
  }],
  education: [{
    degree: String,
    school: String,
    field: String,
    startYear: Number,
    endYear: Number
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String,
    github: String,
    image: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    link: String
  }],
  achievements: [String],
  
  // Certificates earned
  certificates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  }],
  
  // Public Profile Settings
  isPublic: { type: Boolean, default: true },
  
  // Email Verification & OTP
  isEmailVerified: { type: Boolean, default: false },
  emailOTP: {
    code: String,
    expiresAt: Date,
    attempts: { type: Number, default: 0 }
  },
  
  // Instructor specific
  instructorTitle: String,
  instructorBio: String,
  expertise: [String],
  
  // Enrollments
  enrolledCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completedLessons: [String],
    lastAccessedAt: Date
  }],
  
  // Stats
  completedCourses: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  badges: [{
    name: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  
  membershipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership'
  },
  profileCompletionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  accountStatus: {
    type: String,
    enum: ['active', 'blocked', 'pending'],
    default: 'active'
  },
  isVerified: { type: Boolean, default: false },
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastLogin: Date
}, {
  timestamps: true
});

// Generate username from email if not provided
userSchema.pre('save', async function(next) {
  if (!this.username && this.email) {
    const baseUsername = this.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    let username = baseUsername;
    let counter = 1;
    
    while (await mongoose.models.User.findOne({ username, _id: { $ne: this._id } })) {
      username = `${baseUsername}-${counter}`;
      counter++;
    }
    this.username = username;
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshTokens;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
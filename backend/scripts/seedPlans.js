const mongoose = require('mongoose');
require('dotenv').config();

const Plan = require('../src/modules/plans/Plan');

const plans = [
  {
    name: 'Free',
    slug: 'free',
    description: 'Get started with basic features',
    price: 0,
    currency: 'INR',
    duration: 0,
    durationType: 'lifetime',
    features: [
      { title: 'Access to basic courses', included: true },
      { title: '10 AI queries per day', included: true },
      { title: 'Basic resume template', included: true },
      { title: 'Community support', included: true },
      { title: 'All technologies access', included: false },
      { title: 'Premium templates', included: false },
      { title: 'Priority support', included: false },
      { title: 'Certificate access', included: false }
    ],
    aiQueryLimit: 10,
    benefits: {
      accessAllCourses: false,
      accessAllTechnologies: false,
      premiumTemplates: false,
      prioritySupport: false,
      certificateAccess: false,
      resumeBuilder: true,
      careerTools: false
    },
    order: 0,
    isPopular: false,
    isActive: true
  },
  {
    name: 'Silver',
    slug: 'silver',
    description: 'Perfect for serious learners',
    price: 299,
    currency: 'INR',
    duration: 1,
    durationType: 'month',
    features: [
      { title: 'Access to all courses', included: true },
      { title: '100 AI queries per day', included: true },
      { title: 'Premium resume templates', included: true },
      { title: 'Email support', included: true },
      { title: 'All technologies access', included: true },
      { title: 'Certificate access', included: true },
      { title: 'Priority support', included: false },
      { title: 'Career tools', included: false }
    ],
    aiQueryLimit: 100,
    benefits: {
      accessAllCourses: true,
      accessAllTechnologies: true,
      premiumTemplates: true,
      prioritySupport: false,
      certificateAccess: true,
      resumeBuilder: true,
      careerTools: false
    },
    order: 1,
    isPopular: true,
    isActive: true
  },
  {
    name: 'Gold',
    slug: 'gold',
    description: 'Ultimate learning experience',
    price: 599,
    currency: 'INR',
    duration: 1,
    durationType: 'month',
    features: [
      { title: 'Access to all courses', included: true },
      { title: 'Unlimited AI queries', included: true },
      { title: 'All premium templates', included: true },
      { title: 'Priority phone & email support', included: true },
      { title: 'All technologies access', included: true },
      { title: 'Certificate access', included: true },
      { title: '1-on-1 mentorship sessions', included: true },
      { title: 'Career tools & job placement', included: true }
    ],
    aiQueryLimit: 0, // Unlimited
    benefits: {
      accessAllCourses: true,
      accessAllTechnologies: true,
      premiumTemplates: true,
      prioritySupport: true,
      certificateAccess: true,
      resumeBuilder: true,
      careerTools: true
    },
    order: 2,
    isPopular: false,
    isActive: true
  },
  {
    name: 'Platinum',
    slug: 'platinum',
    description: 'Best value for annual commitment',
    price: 4999,
    currency: 'INR',
    duration: 1,
    durationType: 'year',
    features: [
      { title: 'Everything in Gold plan', included: true },
      { title: 'Unlimited AI queries', included: true },
      { title: '2 months free (save ₹2,189)', included: true },
      { title: 'Exclusive webinars', included: true },
      { title: 'Early access to new features', included: true },
      { title: 'Personal career counselor', included: true },
      { title: 'Resume review by experts', included: true },
      { title: 'Interview preparation', included: true }
    ],
    aiQueryLimit: 0,
    benefits: {
      accessAllCourses: true,
      accessAllTechnologies: true,
      premiumTemplates: true,
      prioritySupport: true,
      certificateAccess: true,
      resumeBuilder: true,
      careerTools: true
    },
    order: 3,
    isPopular: false,
    isActive: true
  }
];

async function seedPlans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtootalk');
    console.log('Connected to MongoDB');

    // Clear existing plans
    await Plan.deleteMany({});
    console.log('Cleared existing plans');

    // Insert new plans
    await Plan.insertMany(plans);
    console.log('Plans seeded successfully!');
    console.log('Created plans:');
    plans.forEach(p => console.log(`  - ${p.name}: ₹${p.price}/${p.durationType}`));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding plans:', error);
    process.exit(1);
  }
}

seedPlans();

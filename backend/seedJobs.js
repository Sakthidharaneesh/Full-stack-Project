const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');

dotenv.config();

const dummyJobs = [
  {
    title: 'Senior Frontend Developer',
    company: 'TechFlow Solutions',
    location: 'San Francisco, CA',
    type: 'Full-time',
    workplaceType: 'Hybrid',
    domain: 'Software Engineering',
    description: 'We are looking for a Senior Frontend Developer to lead our React engineering team. You will build scalable UI components and optimize performance across our core SaaS product.',
    requirements: ['React', 'JavaScript', 'TypeScript', 'Redux', '5+ years experience'],
    salary: { min: 130000, max: 160000, currency: 'USD' }
  },
  {
    title: 'Data Scientist (Machine Learning)',
    company: 'Nexus Analytics',
    location: 'New York, NY',
    type: 'Full-time',
    workplaceType: 'Remote',
    domain: 'Data Science',
    description: 'Join our data team to build predictive models and machine learning pipelines that power our recommendation engines.',
    requirements: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Analysis'],
    salary: { min: 140000, max: 180000, currency: 'USD' }
  },
  {
    title: 'Marketing Director',
    company: 'Global Brands Media',
    location: 'Chicago, IL',
    type: 'Full-time',
    workplaceType: 'On-site',
    domain: 'Marketing',
    description: 'Looking for a seasoned Marketing Director to oversee global campaigns, manage ad spend, and drive inbound growth.',
    requirements: ['Marketing', 'SEO', 'Leadership', '7+ years experience'],
    salary: { min: 110000, max: 150000, currency: 'USD' }
  },
  {
    title: 'SMB Account Executive',
    company: 'SalesForcePro',
    location: 'Austin, TX',
    type: 'Full-time',
    workplaceType: 'Remote',
    domain: 'Sales',
    description: 'We need an energetic Account Executive to close SMB deals, maintain a healthy pipeline, and hit quarterly quotas.',
    requirements: ['Sales', 'Communication', 'CRM', 'B2B Sales'],
    salary: { min: 60000, max: 120000, currency: 'USD' }
  },
  {
    title: 'UX/UI Product Designer',
    company: 'Creative Studios',
    location: 'London, UK',
    type: 'Contract',
    workplaceType: 'Hybrid',
    domain: 'Design',
    description: 'Contract role for a UI/UX designer to revamp our mobile application interface. Must have a strong portfolio demonstrating user-centric design.',
    requirements: ['Figma', 'Prototyping', 'User Research', 'CSS'],
    salary: { min: 70000, max: 90000, currency: 'USD' }
  },
  {
    title: 'Operations Manager',
    company: 'Logistics Hub',
    location: 'Seattle, WA',
    type: 'Full-time',
    workplaceType: 'On-site',
    domain: 'General',
    description: 'Manage daily operations, oversee supply chain logistics, and optimize warehouse processes.',
    requirements: ['Operations', 'Project Management', 'Agile', 'Leadership'],
    salary: { min: 85000, max: 115000, currency: 'USD' }
  },
  {
    title: 'Backend Node.js Engineer',
    company: 'CloudSync',
    location: 'Denver, CO',
    type: 'Contract',
    workplaceType: 'Remote',
    domain: 'Software Engineering',
    description: 'Help us scale our microservices backend using Node.js and AWS. 6-month contract with potential for extension.',
    requirements: ['Node.js', 'Express', 'MongoDB', 'AWS', 'Docker'],
    salary: { min: 90000, max: 120000, currency: 'USD' }
  },
  {
    title: 'Data Analyst Internship',
    company: 'FinTech Group',
    location: 'Boston, MA',
    type: 'Internship',
    workplaceType: 'Hybrid',
    domain: 'Data Science',
    description: 'Summer internship for a data analyst. You will clean datasets, create Tableau dashboards, and support the quantitative team.',
    requirements: ['SQL', 'Data Analysis', 'Python', 'Excel'],
    salary: { min: 40000, max: 50000, currency: 'USD' }
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to DB, seeding jobs...");
    const user = await User.findOne({});
    if (!user) {
      console.log("No users found. Please create a user first or run seed.js");
      process.exit(1);
    }
    
    // Add postedBy to all dummy jobs
    const jobsToInsert = dummyJobs.map(job => ({ ...job, postedBy: user._id }));
    
    await Job.insertMany(jobsToInsert);
    console.log(`Successfully added ${jobsToInsert.length} fake jobs across all domains!`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
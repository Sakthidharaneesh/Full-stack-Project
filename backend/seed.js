const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const User = require('./models/User');
const Post = require('./models/Post');
const Job = require('./models/Job');
const Message = require('./models/Message');

// Sample data
const sampleUsers = [
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    password: 'password123',
    headline: 'Senior Software Engineer at Tech Corp',
    location: 'San Francisco, CA',
    profilePicture: 'https://i.pravatar.cc/150?img=47',
    industry: 'Technology',
    about: 'Passionate software engineer with 8+ years of experience in full-stack development. Love working with modern web technologies and building scalable applications.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'AWS'],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: new Date('2020-01-01'),
        current: true,
        description: 'Leading development of cloud-based SaaS platform'
      }
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'Master of Science',
        fieldOfStudy: 'Computer Science',
        startDate: new Date('2012-09-01'),
        endDate: new Date('2014-06-01')
      }
    ]
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    password: 'password123',
    headline: 'Product Manager | AI & Machine Learning',
    location: 'New York, NY',
    profilePicture: 'https://i.pravatar.cc/150?img=12',
    industry: 'Technology',
    about: 'Product manager specializing in AI/ML products. Former data scientist with a passion for turning complex technology into user-friendly solutions.',
    skills: ['Product Management', 'Machine Learning', 'Data Analysis', 'Agile', 'Python'],
    experience: [
      {
        title: 'Senior Product Manager',
        company: 'AI Innovations Inc',
        location: 'New York, NY',
        startDate: new Date('2019-03-01'),
        current: true,
        description: 'Leading AI product development and strategy'
      }
    ],
    education: [
      {
        school: 'MIT',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: new Date('2010-09-01'),
        endDate: new Date('2014-06-01')
      }
    ]
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@email.com',
    password: 'password123',
    headline: 'UX/UI Designer | Creating Delightful Experiences',
    location: 'Austin, TX',
    profilePicture: 'https://i.pravatar.cc/150?img=5',
    industry: 'Design',
    about: 'Creative designer with a focus on user-centered design. I believe in the power of good design to solve real problems and improve lives.',
    skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD', 'Prototyping', 'User Testing'],
    experience: [
      {
        title: 'Lead UX Designer',
        company: 'Design Studio',
        location: 'Austin, TX',
        startDate: new Date('2018-06-01'),
        current: true,
        description: 'Leading design for mobile and web applications'
      }
    ],
    education: [
      {
        school: 'Rhode Island School of Design',
        degree: 'Bachelor of Fine Arts',
        fieldOfStudy: 'Graphic Design',
        startDate: new Date('2012-09-01'),
        endDate: new Date('2016-05-01')
      }
    ]
  },
  {
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@email.com',
    password: 'password123',
    headline: 'DevOps Engineer | Cloud Infrastructure Specialist',
    location: 'Seattle, WA',
    profilePicture: 'https://i.pravatar.cc/150?img=14',
    industry: 'Technology',
    about: 'DevOps engineer passionate about automation, scalability, and reliability. Building robust cloud infrastructure for modern applications.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
    experience: [
      {
        title: 'DevOps Engineer',
        company: 'Cloud Systems Co',
        location: 'Seattle, WA',
        startDate: new Date('2019-01-01'),
        current: true,
        description: 'Managing cloud infrastructure and deployment pipelines'
      }
    ],
    education: [
      {
        school: 'University of Washington',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Information Technology',
        startDate: new Date('2013-09-01'),
        endDate: new Date('2017-06-01')
      }
    ]
  },
  {
    firstName: 'Jessica',
    lastName: 'Martinez',
    email: 'jessica.martinez@email.com',
    password: 'password123',
    headline: 'Data Scientist | Analytics & Insights',
    location: 'Boston, MA',
    profilePicture: 'https://i.pravatar.cc/150?img=9',
    industry: 'Data Science',
    about: 'Data scientist with expertise in machine learning and statistical analysis. Turning data into actionable insights for business growth.',
    skills: ['Python', 'R', 'Machine Learning', 'SQL', 'Tableau', 'Statistics'],
    experience: [
      {
        title: 'Senior Data Scientist',
        company: 'Analytics Pro',
        location: 'Boston, MA',
        startDate: new Date('2018-09-01'),
        current: true,
        description: 'Building predictive models and analytics solutions'
      }
    ],
    education: [
      {
        school: 'Harvard University',
        degree: 'PhD',
        fieldOfStudy: 'Statistics',
        startDate: new Date('2014-09-01'),
        endDate: new Date('2018-06-01')
      }
    ]
  }
];

const samplePosts = [
  {
    content: 'Excited to announce that I just completed a major project migration to microservices! The journey was challenging but incredibly rewarding. Key takeaways: planning is everything, communication is crucial, and never underestimate the power of good documentation. 🚀 #SoftwareEngineering #Microservices',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop'
  },
  {
    content: 'Just published a new article on AI ethics and responsible machine learning. As we build more powerful AI systems, it\'s critical that we consider their societal impact. Would love to hear your thoughts! #AI #MachineLearning #Ethics',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop'
  },
  {
    content: 'Design tip of the day: Always design with accessibility in mind from the start, not as an afterthought. Your users will thank you! 🎨♿ #UXDesign #Accessibility',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop'
  },
  {
    content: 'Successfully reduced our deployment time from 2 hours to 15 minutes using automated CI/CD pipelines. The future is automated! 💪 #DevOps #Automation #CI/CD',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop'
  },
  {
    content: 'Data doesn\'t lie, but it can be misleading if not properly analyzed. Always question your assumptions and validate your findings. Happy analyzing! 📊 #DataScience #Analytics',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
  },
  {
    content: 'Just wrapped up an amazing workshop on React Hooks and performance optimization. The community\'s enthusiasm for learning is truly inspiring! Thank you to everyone who attended. 🙏 #ReactJS #WebDevelopment #Community',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop'
  },
  {
    content: 'Proud to share that our team just launched the new product feature we\'ve been working on for months! User feedback has been overwhelmingly positive. Hard work pays off! 🎉 #ProductLaunch #TeamWork',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop'
  },
  {
    content: 'Coffee, code, and creativity ☕💻 Starting the week with a new challenge: building a real-time collaborative editor. Any tips or resources you\'d recommend? #MondayMotivation #WebDev',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop'
  },
  {
    content: 'Interesting observation: The best code is often the code you delete. Sometimes less really is more. Clean, simple, maintainable > complex and clever. #CleanCode #BestPractices',
  },
  {
    content: 'Attending the Tech Summit next week! Looking forward to networking and learning about the latest trends in cloud computing and serverless architecture. Who else is going? 🚀 #TechSummit #CloudComputing',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop'
  },
  {
    content: 'Just hit 10k followers! Thank you all for being part of this journey. Your support and engagement mean everything. Here\'s to building, learning, and growing together! 🎊 #Milestone #Grateful',
  },
  {
    content: 'Working remotely has taught me the importance of clear communication and async collaboration. What are your top tools and practices for remote team productivity? 🏠💼 #RemoteWork #Productivity',
  },
  {
    content: 'Debugging is like being a detective in a crime movie where you are also the murderer. 🕵️‍♂️😅 Anyone else having one of those days? #DeveloperHumor #Debugging',
  },
  {
    content: 'Excited to announce I\'m mentoring aspiring developers through Code Academy! If you\'re looking to break into tech, feel free to reach out. Always happy to help! 🌟 #Mentorship #CodingCommunity',
  },
  {
    content: 'The best investment you can make is in yourself. Just completed a certification in AWS Solutions Architect. Never stop learning! 📚 #ContinuousLearning #AWS #CloudCertification',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop'
  }
];

const sampleJobs = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovators Inc',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'We are looking for a Senior Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.',
    requirements: [
      '5+ years of experience in web development',
      'Strong knowledge of React and Node.js',
      'Experience with MongoDB or similar databases',
      'Excellent problem-solving skills',
      'Bachelor\'s degree in Computer Science or related field'
    ],
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    }
  },
  {
    title: 'Product Manager - AI/ML',
    company: 'Future AI Solutions',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our team as a Product Manager focusing on AI and machine learning products. You will work with cross-functional teams to define product strategy and roadmap.',
    requirements: [
      '3+ years of product management experience',
      'Understanding of AI/ML concepts',
      'Strong analytical and communication skills',
      'Experience with agile methodologies',
      'MBA or technical degree preferred'
    ],
    salary: {
      min: 130000,
      max: 170000,
      currency: 'USD'
    }
  },
  {
    title: 'UX/UI Designer',
    company: 'Creative Digital Agency',
    location: 'Remote',
    type: 'Full-time',
    description: 'We\'re seeking a talented UX/UI Designer to create beautiful and intuitive user experiences for our clients. You should have a strong portfolio and passion for design.',
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Strong portfolio demonstrating design thinking',
      'Experience with user research and testing',
      'Excellent communication skills'
    ],
    salary: {
      min: 90000,
      max: 130000,
      currency: 'USD'
    }
  },
  {
    title: 'DevOps Engineer',
    company: 'Cloud Infrastructure Co',
    location: 'Seattle, WA',
    type: 'Full-time',
    description: 'Looking for an experienced DevOps Engineer to manage our cloud infrastructure and improve our deployment processes.',
    requirements: [
      '4+ years of DevOps experience',
      'Strong knowledge of AWS or Azure',
      'Experience with Docker and Kubernetes',
      'Proficiency in scripting (Python, Bash)',
      'Understanding of CI/CD best practices'
    ],
    salary: {
      min: 110000,
      max: 160000,
      currency: 'USD'
    }
  },
  {
    title: 'Data Scientist',
    company: 'Analytics Insights Ltd',
    location: 'Boston, MA',
    type: 'Full-time',
    description: 'Join our data science team to build predictive models and extract insights from large datasets. You will work on challenging problems across various industries.',
    requirements: [
      'Master\'s or PhD in Statistics, Computer Science, or related field',
      'Strong programming skills in Python or R',
      'Experience with machine learning algorithms',
      'Knowledge of SQL and data visualization tools',
      'Excellent analytical and problem-solving skills'
    ],
    salary: {
      min: 115000,
      max: 165000,
      currency: 'USD'
    }
  },
  {
    title: 'Frontend Developer (React)',
    company: 'StartUp Innovations',
    location: 'Austin, TX',
    type: 'Full-time',
    description: 'We\'re looking for a passionate Frontend Developer to build amazing user interfaces with React. Join a fast-paced startup environment!',
    requirements: [
      '2+ years of React development experience',
      'Strong JavaScript/TypeScript skills',
      'Experience with modern CSS frameworks',
      'Understanding of responsive design',
      'Team player with great communication skills'
    ],
    salary: {
      min: 80000,
      max: 120000,
      currency: 'USD'
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Job.deleteMany({});
    await Message.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      users.push(user);
    }
    console.log(`👥 Created ${users.length} users`);

    // Create connections between users (make everyone connected)
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        // Connect all users with each other
        users[i].connections.push(users[j]._id);
        users[j].connections.push(users[i]._id);
      }
      await users[i].save();
    }
    console.log('🔗 Created connections between all users');

    // Create posts (distribute among all users)
    for (let i = 0; i < samplePosts.length; i++) {
      const post = new Post({
        ...samplePosts[i],
        author: users[i % users.length]._id,
        createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000) // Random time in last 2 weeks
      });
      
      // Add random likes (more realistic numbers)
      const numLikes = Math.floor(Math.random() * (users.length * 2)) + 2; // 2-10 likes
      for (let j = 0; j < numLikes; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!post.likes.includes(randomUser._id)) {
          post.likes.push(randomUser._id);
        }
      }
      
      // Add random comments with varied text
      const commentTexts = [
        'Great post! Very insightful.',
        'Thanks for sharing this! Really helpful.',
        'Couldn\'t agree more! 👍',
        'This is exactly what I needed to read today.',
        'Awesome work! Keep it up!',
        'Very informative. Learned a lot from this.',
        'Love this perspective! 💯',
        'Can you share more details about this?',
        'Brilliant! This is so relevant right now.',
        'Thanks for the valuable insights!',
        'This resonates with me so much!',
        'Impressive! How long did this take?'
      ];
      
      const numComments = Math.floor(Math.random() * 5); // 0-4 comments
      for (let j = 0; j < numComments; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        post.comments.push({
          user: randomUser._id,
          text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
          createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)
        });
      }
      
      await post.save();
    }
    console.log(`📝 Created ${samplePosts.length} posts`);

    // Create jobs
    for (let i = 0; i < sampleJobs.length; i++) {
      const job = new Job({
        ...sampleJobs[i],
        postedBy: users[Math.floor(Math.random() * users.length)]._id
      });
      
      // Add random applicants
      const numApplicants = Math.floor(Math.random() * 3);
      for (let j = 0; j < numApplicants; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const alreadyApplied = job.applicants.some(
          app => app.user.toString() === randomUser._id.toString()
        );
        if (!alreadyApplied) {
          job.applicants.push({
            user: randomUser._id,
            status: 'pending'
          });
        }
      }
      
      await job.save();
    }
    console.log(`💼 Created ${sampleJobs.length} jobs`);

    // Create conversation messages between connected users
    const messageContents = [
      "Hi! Would love to connect and discuss potential collaboration opportunities.",
      "Thanks for connecting! How's your project going?",
      "Great to be connected with you. Let's catch up sometime!",
      "Hey, I saw your recent post. Really insightful!",
      "Would you be interested in a coffee chat next week?",
      "I'm working on something exciting. Would love your feedback!",
      "Thanks for the recommendation on that tool. It's been super helpful!",
      "Are you attending the tech conference next month?",
      "Your expertise in this area is impressive. Any tips for beginners?",
      "Let's schedule a call to discuss the opportunities.",
      "I loved your recent article. Very well written!",
      "Do you have any openings on your team?",
      "Thanks for accepting my connection request!",
      "Would you be open to mentoring?",
      "I'd like to pick your brain about career growth."
    ];

    // Create multiple message conversations
    const conversationPairs = [
      [0, 1], [0, 2], [0, 3], // Sarah with Michael, Emily, David
      [1, 2], [1, 4], // Michael with Emily, Jessica
      [2, 3], [2, 4], // Emily with David, Jessica
      [3, 4], // David with Jessica
      [1, 3] // Michael with David
    ];

    for (const [senderIdx, recipientIdx] of conversationPairs) {
      // Create 2-4 messages in each conversation
      const numMessages = 2 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < numMessages; i++) {
        const isEven = i % 2 === 0;
        const sender = isEven ? users[senderIdx] : users[recipientIdx];
        const recipient = isEven ? users[recipientIdx] : users[senderIdx];
        
        const message = new Message({
          sender: sender._id,
          recipient: recipient._id,
          content: messageContents[Math.floor(Math.random() * messageContents.length)],
          read: Math.random() > 0.3, // 70% read
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last week
        });
        
        await message.save();
      }
    }
    
    const totalMessages = await Message.countDocuments();
    console.log(`💬 Created ${totalMessages} messages in ${conversationPairs.length} conversations`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Posts: ${samplePosts.length}`);
    console.log(`   - Jobs: ${sampleJobs.length}`);
    console.log(`   - Messages: ${await Message.countDocuments()}`);
    console.log(`   - All users are connected to each other`);
    console.log('\n🔐 You can login with any of these accounts:');
    sampleUsers.forEach(user => {
      console.log(`   Email: ${user.email} | Password: password123`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();

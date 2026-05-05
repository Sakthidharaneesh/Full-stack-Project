const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to DB, updating jobs...");
    const sakthi = await User.findOne({ email: 'sakthidharaneesh1719@gmail.com' });
    const sakthiCollege = await User.findOne({ email: 'sakthidharaneesh.l2024aida@sece.ac.in' });
    
    if (sakthi || sakthiCollege) {
      const jobs = await Job.find({});
      if (jobs.length >= 6) {
        if (sakthi) {
            await Job.findByIdAndUpdate(jobs[0]._id, { postedBy: sakthi._id });
            await Job.findByIdAndUpdate(jobs[1]._id, { postedBy: sakthi._id });
            await Job.findByIdAndUpdate(jobs[2]._id, { postedBy: sakthi._id });
            console.log("Assigned 3 jobs to sakthidharaneesh1719@gmail.com");
        }
        if (sakthiCollege) {
            await Job.findByIdAndUpdate(jobs[3]._id, { postedBy: sakthiCollege._id });
            await Job.findByIdAndUpdate(jobs[4]._id, { postedBy: sakthiCollege._id });
            await Job.findByIdAndUpdate(jobs[5]._id, { postedBy: sakthiCollege._id });
            console.log("Assigned 3 jobs to sakthidharaneesh.l2024aida@sece.ac.in");
        }
      }
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MapPinIcon, BriefcaseIcon, CurrencyDollarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';

const Jobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    salary: { min: '', max: '', currency: 'USD' }
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post(`/api/jobs/${jobId}/apply`);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error applying to job');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...newJob,
        requirements: newJob.requirements.split('\n').filter(r => r.trim()),
        salary: {
          min: parseInt(newJob.salary.min),
          max: parseInt(newJob.salary.max),
          currency: newJob.salary.currency
        }
      };
      
      if (editingJob) {
        const res = await axios.put(`/api/jobs/${editingJob._id}`, jobData);
        setJobs(jobs.map(job => job._id === editingJob._id ? res.data : job));
        alert('Job updated successfully!');
      } else {
        const res = await axios.post('/api/jobs', jobData);
        setJobs([res.data, ...jobs]);
        alert('Job posted successfully!');
      }
      
      setShowCreateForm(false);
      setEditingJob(null);
      setNewJob({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        description: '',
        requirements: '',
        salary: { min: '', max: '', currency: 'USD' }
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving job');
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setNewJob({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements?.join('\n') || '',
      salary: job.salary || { min: '', max: '', currency: 'USD' }
    });
    setShowCreateForm(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
      alert('Job deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting job');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
        >
          Post a Job
        </button>
      </div>

      {showCreateForm && (
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingJob ? 'Edit Job Posting' : 'Post a New Job'}</h2>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <select
                  value={newJob.type}
                  onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary ($)
                </label>
                <input
                  type="number"
                  value={newJob.salary.min}
                  onChange={(e) => setNewJob({ ...newJob, salary: { ...newJob.salary, min: e.target.value }})}
                  className="input-field"
                  placeholder="80000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary ($)
                </label>
                <input
                  type="number"
                  value={newJob.salary.max}
                  onChange={(e) => setNewJob({ ...newJob, salary: { ...newJob.salary, max: e.target.value }})}
                  className="input-field"
                  placeholder="120000"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                className="input-field resize-none"
                rows="4"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements (one per line)
              </label>
              <textarea
                value={newJob.requirements}
                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                className="input-field resize-none"
                rows="4"
                placeholder="Bachelor's degree in Computer Science&#10;3+ years of experience&#10;Proficient in React and Node.js"
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingJob ? 'Update Job' : 'Post Job'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingJob(null);
                  setNewJob({
                    title: '',
                    company: '',
                    location: '',
                    type: 'Full-time',
                    description: '',
                    requirements: '',
                    salary: { min: '', max: '', currency: 'USD' }
                  });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">No job listings available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} onApply={handleApply} onEdit={handleEditJob} onDelete={handleDeleteJob} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

const JobCard = ({ job, onApply, onEdit, onDelete, user }) => {
  const isOwnJob = job.postedBy?._id === user?._id;

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-lg text-gray-700">{job.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {job.type}
          </span>
          {isOwnJob && (
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(job)}
                className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                title="Edit job"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(job._id)}
                className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                title="Delete job"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPinIcon className="w-5 h-5 mr-2" />
          <span className="text-sm">{job.location}</span>
        </div>
        
        {job.salary && (
          <div className="flex items-center text-gray-600">
            <CurrencyDollarIcon className="w-5 h-5 mr-2" />
            <span className="text-sm">
              ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()} {job.salary.currency}
            </span>
          </div>
        )}
        
        <div className="flex items-center text-gray-600">
          <BriefcaseIcon className="w-5 h-5 mr-2" />
          <span className="text-sm">{job.applicants?.length || 0} applicants</span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

      {job.requirements && job.requirements.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Requirements:</h4>
          <ul className="list-disc list-inside space-y-1">
            {job.requirements.slice(0, 3).map((req, index) => (
              <li key={index} className="text-sm text-gray-600">{req}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        {!isOwnJob && (
          <button
            onClick={() => onApply(job._id)}
            className="btn-primary"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default Jobs;

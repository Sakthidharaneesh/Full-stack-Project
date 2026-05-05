import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MapPinIcon, BriefcaseIcon, CurrencyDollarIcon, PencilIcon, TrashIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { AuthContext } from '../context/AuthContext';

const Jobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Custom states for the new features
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'saved', 'applied', 'managed'
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    workplaceType: '',
    domain: ''
  });
  
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    workplaceType: 'On-site',
    domain: 'General',
    description: '',
    requirements: '',
    salary: { min: '', max: '', currency: 'USD' }
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filters]);

  const fetchSavedJobs = async () => {
    try {
      // Get current user profile to extract savedJobIds
      const res = await axios.get(`/api/users/profile/${user.id}`);
      setSavedJobIds(res.data.savedJobs || []);
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.workplaceType) params.append('workplaceType', filters.workplaceType);
      if (filters.domain) params.append('domain', filters.domain);

      const res = await axios.get(`/api/jobs?${params.toString()}`);
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplicantStatus = async (jobId, applicantId, status) => {
    try {
      await axios.put(`/api/jobs/${jobId}/applicants/${applicantId}/status`, { status });
      alert('Status updated!');
      fetchJobs(); // refresh to show new status
    } catch (err) {
      alert('Error updating status');
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

  const handleUploadResume = async () => {
    if (!resumeFile) return;
    setUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const res = await axios.post('/api/users/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Fetch latest jobs to get updated match scores
      const jobsRes = await axios.get('/api/jobs');
      setJobs(jobsRes.data);
      
      // Calculate top recommendations based on match score
      const recommendations = jobsRes.data
        .filter(j => j.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
        
      setAnalysisResult({
        skills: res.data.extractedSkills || [],
        recommendations
      });

      setResumeFile(null);
    } catch (err) {
      console.error(err);
      alert('Error uploading resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      const res = await axios.post(`/api/jobs/${jobId}/save`);
      setSavedJobIds(res.data.savedJobs);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving job');
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
        workplaceType: 'On-site',
        domain: 'General',
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
      workplaceType: job.workplaceType || 'On-site',
      domain: job.domain || 'General',
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
    <div className="max-w-6xl mx-auto space-y-6 relative">
      {/* Resume Analysis Modal */}
      {analysisResult && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                AI Resume Analysis Report
              </h2>
              <button 
                onClick={() => setAnalysisResult(null)} 
                className="text-gray-400 hover:text-gray-800 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="mb-8 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-sm uppercase tracking-wider font-bold text-blue-800 mb-3 flex items-center">
                <BriefcaseIcon className="w-4 h-4 mr-2" />
                Detected Skills
              </h3>
              {analysisResult.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysisResult.skills.map((skill, index) => (
                    <span key={index} className="bg-white border border-blue-200 text-blue-700 text-sm px-3 py-1 font-medium rounded-full shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm italic">No specific tech skills were automatically detected. Make sure your resume is a readable PDF, and update your profile manually if needed!</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Recommended Jobs Based on Match</h3>
              {analysisResult.recommendations.length > 0 ? (
                <div className="space-y-4">
                  {analysisResult.recommendations.map(job => (
                    <div key={job._id} className="border border-gray-100 bg-white hover:bg-gray-50 transition-colors shadow-sm rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                        <div className="flex items-center text-gray-600 mt-1 text-sm space-x-3">
                          <span className="flex items-center"><BriefcaseIcon className="w-4 h-4 mr-1"/>{job.company}</span>
                          <span className="flex items-center"><MapPinIcon className="w-4 h-4 mr-1"/>{job.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full border ${job.matchScore >= 75 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                          {job.matchScore}% Match
                        </span>
                        <button 
                          onClick={() => { setAnalysisResult(null); setActiveTab('all'); setFilters({...filters, search: job.title}); }} 
                          className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center"
                        >
                          View Job &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">We couldn't find any highly matched jobs based strictly on the extracted skills right now.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
        >
          Post a Job
        </button>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex space-x-4 border-b pb-4">
          {['all', 'saved', 'applied', 'managed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium rounded-lg capitalize ${activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab} Jobs
            </button>
          ))}
        </div>
        
        {activeTab === 'all' && (
          <div className="flex flex-wrap gap-4">
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={filters.search} 
              onChange={e => setFilters({...filters, search: e.target.value})} 
              className="input-field max-w-xs"
            />
            <select value={filters.domain} onChange={e => setFilters({...filters, domain: e.target.value})} className="input-field max-w-xs">
              <option value="">All Domains</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Data Science">Data Science</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Design">Design</option>
              <option value="General">General</option>
            </select>
            <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className="input-field max-w-xs">
              <option value="">Any Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <select value={filters.workplaceType} onChange={e => setFilters({...filters, workplaceType: e.target.value})} className="input-field max-w-xs">
              <option value="">Any Workplace</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            
            {/* Resume Upload utility */}
            <div className="ml-auto flex items-center border-[1px] border-dashed border-gray-300 p-1 pl-3 rounded-lg bg-gray-50/50">
               <span className="text-sm text-gray-600 mr-2 font-medium">Smart Match Resume:</span>
               <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => setResumeFile(e.target.files[0])} 
                  className="text-xs file:text-xs file:btn-secondary file:py-1 file:px-2 file:border-0"
               />
               <button 
                  onClick={handleUploadResume}
                  disabled={!resumeFile || uploadingResume}
                  className="btn-primary text-xs py-1 px-3 ml-2 disabled:opacity-50"
               >
                 {uploadingResume ? 'Scanning...' : 'Analyze'}
               </button>
            </div>
          </div>
        )}
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
                  Job Domain/Industry *
                </label>
                <select
                  value={newJob.domain}
                  onChange={(e) => setNewJob({ ...newJob, domain: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Design">Design</option>
                  <option value="General">General</option>
                </select>
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
                  Workplace Type
                </label>
                <select
                  value={newJob.workplaceType}
                  onChange={(e) => setNewJob({ ...newJob, workplaceType: e.target.value })}
                  className="input-field"
                >
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    workplaceType: 'On-site',
                    domain: 'General',
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
          <p className="text-gray-500">No job listings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.filter(job => {
            if (activeTab === 'saved') return savedJobIds.includes(job._id);
            if (activeTab === 'applied') return job.applicants?.some(a => a.user?._id === user?._id || a.user === user?._id);
            if (activeTab === 'managed') return job.postedBy?._id === user?._id;
            return true;
          }).map(job => (
            <JobCard 
              key={job._id} 
              job={job} 
              onApply={handleApply} 
              onEdit={handleEditJob} 
              onDelete={handleDeleteJob} 
              user={user} 
              savedJobIds={savedJobIds}
              onSave={handleSaveJob}
              activeTab={activeTab}
              onUpdateStatus={handleUpdateApplicantStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const JobCard = ({ job, onApply, onEdit, onDelete, user, savedJobIds, onSave, activeTab, onUpdateStatus }) => {
  const isOwnJob = job.postedBy?._id === user?._id;
  const isSaved = savedJobIds?.includes(job._id);
  const applicantInfo = job.applicants?.find(a => a.user?._id === user?._id || a.user === user?._id);
  const hasApplied = !!applicantInfo;

  return (
    <div className="card p-6 flex flex-col hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-lg text-gray-700">{job.company}</p>
          {job.matchScore !== undefined && (
            <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${job.matchScore >= 75 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {job.matchScore}% Match
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isOwnJob && (
            <button 
              onClick={() => onSave(job._id)} 
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title={isSaved ? "Remove from saved" : "Save this job"}
            >
              {isSaved ? <BookmarkIconSolid className="w-6 h-6 text-blue-600" /> : <BookmarkIcon className="w-6 h-6" />}
            </button>
          )}
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {job.type}
          </span>
          {job.workplaceType && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {job.workplaceType}
            </span>
          )}
          {job.domain && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {job.domain}
            </span>
          )}
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

      {/* Recruiter Dashboard View (Managed Jobs) */}
      {activeTab === 'managed' && isOwnJob && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-2">Applicants Tracking</h4>
          {job.applicants?.length > 0 ? (
            <div className="space-y-3">
              {job.applicants.map(applicant => (
                <div key={applicant.user._id || applicant.user} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
                  <span className="font-medium truncate max-w-[150px]">
                    {applicant.user.firstName ? `${applicant.user.firstName} ${applicant.user.lastName}` : 'Applicant'}
                  </span>
                  <select 
                    value={applicant.status || 'pending'}
                    onChange={(e) => onUpdateStatus(job._id, applicant.user._id || applicant.user, e.target.value)}
                    className="border rounded p-1 text-sm bg-white cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-sm text-gray-500">No applicants yet.</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
        <span className="text-xs text-gray-500 flex flex-col gap-1">
          Posted {new Date(job.createdAt).toLocaleDateString()}
          {hasApplied && (
            <span className={`px-2 py-0.5 rounded font-semibold w-fit ${
              applicantInfo.status === 'accepted' ? 'bg-green-100 text-green-700' :
              applicantInfo.status === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              Status: <span className="capitalize">{applicantInfo.status || 'pending'}</span>
            </span>
          )}
        </span>
        {!isOwnJob && activeTab !== 'managed' && (
          <button
            onClick={() => onApply(job._id)}
            disabled={hasApplied}
            className={`btn-primary ${hasApplied ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Jobs;

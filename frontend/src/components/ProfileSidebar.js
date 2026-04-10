import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PlusIcon, EllipsisHorizontalIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';

const ProfileSidebar = () => {
  const { user } = useContext(AuthContext);
  const [showSkillsMenu, setShowSkillsMenu] = useState(false);
  const [showPortfolioMenu, setShowPortfolioMenu] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState(user?.skills || ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'AWS']);
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ title: '', imageUrl: '' });
  const [portfolioItems, setPortfolioItems] = useState([
    { id: 1, title: 'Analytics Dashboard', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop', likes: 23000, views: 889 }
  ]);

  const stats = [
    { label: 'Followers', value: user?.connections?.length || 0 },
    { label: 'Following', value: user?.connections?.length || 0 },
    { label: 'Projects', value: user?.experience?.length || 0 }
  ];

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddPortfolio = () => {
    if (newPortfolio.title.trim() && newPortfolio.imageUrl.trim()) {
      const portfolio = {
        id: Date.now(),
        title: newPortfolio.title,
        imageUrl: newPortfolio.imageUrl,
        likes: 0,
        views: 0
      };
      setPortfolioItems([...portfolioItems, portfolio]);
      setNewPortfolio({ title: '', imageUrl: '' });
      setIsAddingPortfolio(false);
    }
  };

  const handleRemovePortfolio = (id) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="card p-6">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <img
              src={user?.profilePicture || 'https://ui-avatars.com/api/?name=' + user?.firstName + '+' + user?.lastName}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <Link to={`/profile/${user?._id}`} className="block">
            <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{user?.headline || 'Professional'}</p>
            <p className="text-xs text-blue-600 mt-2 hover:underline">View profile</p>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-xl font-bold text-gray-900">{stat.value > 999 ? Math.floor(stat.value/1000) + 'k' : stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Skills</h3>
          <div className="relative">
            <button 
              onClick={() => setShowSkillsMenu(!showSkillsMenu)}
              className="text-gray-400 hover:text-gray-600"
            >
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
            {showSkillsMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    setIsEditingSkills(!isEditingSkills);
                    setShowSkillsMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>{isEditingSkills ? 'Done Editing' : 'Edit Skills'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors relative group"
            >
              {skill}
              {isEditingSkills && (
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>

        {isEditingSkills && (
          <div className="mt-4 flex space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Add new skill..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Portfolio */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Your portfolio</h3>
          <div className="relative">
            <button 
              onClick={() => setShowPortfolioMenu(!showPortfolioMenu)}
              className="text-gray-400 hover:text-gray-600"
            >
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
            {showPortfolioMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    setIsAddingPortfolio(true);
                    setShowPortfolioMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Portfolio</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {portfolioItems.map((item) => (
            <div key={item.id} className="relative">
              <div className="relative group cursor-pointer">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-medium">{item.title}</p>
                </div>
                <button
                  onClick={() => handleRemovePortfolio(item.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mt-2">
                <span className="flex items-center">
                  <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  {item.likes > 999 ? Math.floor(item.likes / 1000) + 'k' : item.likes}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {item.views}
                </span>
              </div>
            </div>
          ))}
        </div>

        {isAddingPortfolio ? (
          <div className="mt-4 space-y-3 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
            <input
              type="text"
              value={newPortfolio.title}
              onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
              placeholder="Portfolio title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              value={newPortfolio.imageUrl}
              onChange={(e) => setNewPortfolio({ ...newPortfolio, imageUrl: e.target.value })}
              placeholder="Image URL..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleAddPortfolio}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAddingPortfolio(false);
                  setNewPortfolio({ title: '', imageUrl: '' });
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingPortfolio(true)}
            className="mt-4 w-full flex items-center justify-center space-x-2 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="font-medium">Add portfolio</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileSidebar;

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  MapPinIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  PencilIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, loadUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    headline: '',
    location: '',
    industry: '',
    about: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`/api/users/${id}`);
        setUser(res.data);
        setEditForm({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          headline: res.data.headline || '',
          location: res.data.location || '',
          industry: res.data.industry || '',
          about: res.data.about || ''
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [id]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        headline: user.headline || '',
        location: user.location || '',
        industry: user.industry || '',
        about: user.about || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`/api/users/${id}`, editForm);
      setUser(res.data);
      setIsEditing(false);
      if (currentUser?._id === id) {
        await loadUser();
      }
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const isOwnProfile = currentUser?._id === id;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card p-12 text-center">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        {/* Cover Image with Gradient Overlay */}
        <div className="relative h-64 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        {/* Profile Content */}
        <div className="relative px-6 sm:px-8 pb-8">
          {/* Profile Picture */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-20 sm:-mt-16">
              <div className="relative">
                <div className="w-40 h-40 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-blue-600">
                  <img
                    src={user.profilePicture || 'https://ui-avatars.com/api/?name=' + user.firstName + '+' + user.lastName + '&size=160&background=4f46e5&color=fff&bold=true&font-size=0.4'}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* User Info */}
              <div className="mt-4 sm:mt-0 sm:ml-6 sm:mb-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        placeholder="First Name"
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        placeholder="Last Name"
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <input
                      type="text"
                      value={editForm.headline}
                      onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                      placeholder="Professional Headline"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        placeholder="Location"
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="text"
                        value={editForm.industry}
                        onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                        placeholder="Industry"
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-lg text-gray-700 mt-2 font-medium">{user.headline}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600">
                      {user.location && (
                        <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg">
                          <MapPinIcon className="w-4 h-4 mr-1.5 text-gray-500" />
                          <span className="text-sm font-medium">{user.location}</span>
                        </div>
                      )}
                      {user.industry && (
                        <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-lg">
                          <BriefcaseIcon className="w-4 h-4 mr-1.5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">{user.industry}</span>
                        </div>
                      )}
                      {user.connections && (
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                          {user.connections.length} connections
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="mt-6 sm:mt-0 sm:mb-4 flex flex-wrap gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleEditToggle}
                      disabled={saving}
                      className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XMarkIcon className="w-5 h-5" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <PencilIcon className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
          About
        </h2>
        {isEditing ? (
          <textarea
            value={editForm.about}
            onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
            placeholder="Write about yourself..."
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            rows="6"
          />
        ) : (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{user.about || 'No information added yet.'}</p>
        )}
      </div>

      {/* Experience Section */}
      {user.experience && user.experience.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            Experience
          </h2>
          <div className="space-y-6">
            {user.experience.map((exp, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <BriefcaseIcon className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{exp.title}</h3>
                  <p className="text-gray-700 font-medium mt-1">{exp.company}</p>
                  <p className="text-sm text-gray-500 mt-1 font-medium">
                    {new Date(exp.startDate).toLocaleDateString()} - 
                    {exp.current ? ' Present' : ` ${new Date(exp.endDate).toLocaleDateString()}`}
                  </p>
                  {exp.description && (
                    <p className="text-gray-600 mt-3 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {user.education && user.education.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            Education
          </h2>
          <div className="space-y-6">
            {user.education.map((edu, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <AcademicCapIcon className="w-7 h-7 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{edu.school}</h3>
                  <p className="text-gray-700 font-medium mt-1">{edu.degree} in {edu.fieldOfStudy}</p>
                  <p className="text-sm text-gray-500 mt-1 font-medium">
                    {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {user.skills && user.skills.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl text-sm font-semibold border border-blue-100 hover:shadow-md transition-shadow"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="glass-effect sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12 animate-gradient">
                <svg className="w-7 h-7 text-white group-hover:animate-bounce-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:block animate-gradient">Connex</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="relative group">
                <MagnifyingGlassIcon className="w-5 h-5 text-blue-500 absolute left-4 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search something..."
                  className="w-80 pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-300 shadow-md hover:shadow-lg animate-fade-in"
                />
              </form>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            <NavIcon to="/" icon={HomeIcon} />
            <NavIcon to="/network" icon={UserGroupIcon} />
            <NavIcon to="/jobs" icon={BriefcaseIcon} />
            <NavIcon to="/messages" icon={ChatBubbleLeftIcon} />
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 rounded-xl"
              >
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-96 glass-effect rounded-2xl shadow-2xl py-3 z-50 animate-fade-in">
                  <div className="px-6 py-3 border-b border-gray-200/50">
                    <h3 className="font-bold text-gray-900 text-lg gradient-text">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <NotificationItem 
                      text="John Smith liked your post"
                      time="2 hours ago"
                      unread={true}
                    />
                    <NotificationItem 
                      text="Sarah Lee commented on your post"
                      time="5 hours ago"
                      unread={true}
                    />
                    <NotificationItem 
                      text="Mark Davis sent you a connection request"
                      time="1 day ago"
                      unread={false}
                    />
                    <NotificationItem 
                      text="You have 3 new messages"
                      time="2 days ago"
                      unread={false}
                    />
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <Link to={`/profile/${user?._id}`} className="flex items-center space-x-3 hover:opacity-80">
                <img
                  src={user?.profilePicture || 'https://ui-avatars.com/api/?name=' + user?.firstName + '+' + user?.lastName}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">View profile</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavIcon = ({ to, icon: Icon }) => {
  return (
    <Link
      to={to}
      className="relative p-2.5 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-xl group"
    >
      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
    </Link>
  );
};

const NotificationItem = ({ text, time, unread }) => (
  <div className={`px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-300 ${unread ? 'bg-blue-50/50' : ''}`}>
    <div className="flex items-start space-x-4">
      <div className="flex-1">
        <p className={`text-sm ${unread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
          {text}
        </p>
        <p className="text-xs text-gray-500 mt-1.5">{time}</p>
      </div>
      {unread && <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-1 animate-pulse shadow-lg"></div>}
    </div>
  </div>
);

export default Navbar;

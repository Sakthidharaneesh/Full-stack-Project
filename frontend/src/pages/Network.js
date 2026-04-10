import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Network = () => {
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
    fetchPendingRequests();
  }, []);

  const fetchConnections = async () => {
    try {
      const res = await axios.get('/api/connections');
      setConnections(res.data);
    } catch (err) {
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get('/api/connections/pending');
      setPendingRequests(res.data);
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(`/api/users/search/${query}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  const handleConnect = async (userId) => {
    try {
      await axios.post(`/api/connections/request/${userId}`);
      alert('Connection request sent!');
    } catch (err) {
      console.error('Error sending connection request:', err);
    }
  };

  const handleAccept = async (userId) => {
    try {
      await axios.post(`/api/connections/accept/${userId}`);
      fetchConnections();
      fetchPendingRequests();
    } catch (err) {
      console.error('Error accepting connection:', err);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await axios.delete(`/api/connections/${userId}`);
      setConnections(connections.filter(conn => conn._id !== userId));
    } catch (err) {
      console.error('Error removing connection:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="card p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for professionals..."
          className="input-field"
        />
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Search Results</h2>
          <div className="space-y-4">
            {searchResults.map(user => (
              <UserCard key={user._id} user={user} onConnect={handleConnect} />
            ))}
          </div>
        </div>
      )}

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Pending Requests ({pendingRequests.length})
          </h2>
          <div className="space-y-4">
            {pendingRequests.map(user => (
              <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={user.profilePicture || 'https://via.placeholder.com/48'}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{user.headline}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAccept(user._id)}
                    className="btn-primary"
                  >
                    <CheckIcon className="w-5 h-5 inline mr-1" />
                    Accept
                  </button>
                  <button className="btn-secondary">
                    <XMarkIcon className="w-5 h-5 inline mr-1" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Connections */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          My Connections ({connections.length})
        </h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : connections.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No connections yet. Start networking!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map(user => (
              <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.profilePicture || 'https://via.placeholder.com/48'}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{user.headline}</p>
                    {user.location && (
                      <p className="text-xs text-gray-500">{user.location}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(user._id)}
                  className="text-gray-500 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const UserCard = ({ user, onConnect }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePicture || 'https://via.placeholder.com/48'}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-gray-600">{user.headline}</p>
        </div>
      </div>
      <button
        onClick={() => onConnect(user._id)}
        className="btn-primary"
      >
        <UserPlusIcon className="w-5 h-5 inline mr-1" />
        Connect
      </button>
    </div>
  );
};

export default Network;

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  BriefcaseIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState({
    users: [],
    posts: [],
    jobs: []
  });
  const [loading, setLoading] = useState(false);

  const searchAll = useCallback(async () => {
    if (!query) {
      setResults({ users: [], posts: [], jobs: [] });
      return;
    }

    setLoading(true);
    try {
      const [usersRes, postsRes, jobsRes] = await Promise.all([
        axios.get(`/api/users/search?q=${query}`),
        axios.get(`/api/posts?search=${query}`),
        axios.get(`/api/jobs?search=${query}`)
      ]);

      setResults({
        users: usersRes.data || [],
        posts: postsRes.data || [],
        jobs: jobsRes.data || []
      });
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    searchAll();
  }, [searchAll]);

  const totalResults = results.users.length + results.posts.length + results.jobs.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
        </div>
        <p className="text-gray-600">
          {loading ? 'Searching...' : `Found ${totalResults} results`}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({totalResults})
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'people'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            People ({results.users.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'posts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Posts ({results.posts.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'jobs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Jobs ({results.jobs.length})
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* People Results */}
              {(activeTab === 'all' || activeTab === 'people') && results.users.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                    People
                  </h2>
                  <div className="space-y-4">
                    {results.users.map((user) => (
                      <Link
                        key={user._id}
                        to={`/profile/${user._id}`}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <img
                          src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&size=80&background=4f46e5&color=fff&bold=true`}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">{user.headline}</p>
                          {user.location && (
                            <p className="text-gray-500 text-xs mt-1">{user.location}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts Results */}
              {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                    Posts
                  </h2>
                  <div className="space-y-4">
                    {results.posts.map((post) => (
                      <div
                        key={post._id}
                        className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={post.author?.profilePicture || `https://ui-avatars.com/api/?name=${post.author?.firstName}+${post.author?.lastName}&size=48&background=4f46e5&color=fff&bold=true`}
                            alt={`${post.author?.firstName} ${post.author?.lastName}`}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <Link to={`/profile/${post.author?._id}`} className="font-semibold text-gray-900 hover:text-blue-600">
                              {post.author?.firstName} {post.author?.lastName}
                            </Link>
                            <p className="text-sm text-gray-600">{post.author?.headline}</p>
                            <p className="text-gray-700 mt-2">{post.content}</p>
                            {post.image && (
                              <img
                                src={post.image}
                                alt="Post"
                                className="mt-3 rounded-lg w-full max-h-96 object-cover"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs Results */}
              {(activeTab === 'all' || activeTab === 'jobs') && results.jobs.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                    Jobs
                  </h2>
                  <div className="space-y-4">
                    {results.jobs.map((job) => (
                      <div
                        key={job._id}
                        className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-bold text-gray-900">{job.title}</h3>
                        <p className="text-gray-700 mt-1">{job.company}</p>
                        <p className="text-gray-600 text-sm mt-1">{job.location} · {job.type}</p>
                        {job.salary && (
                          <p className="text-blue-600 font-semibold text-sm mt-2">
                            ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} {job.salary.currency}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {totalResults === 0 && !loading && (
                <div className="text-center py-12">
                  <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No results found for "{query}"</p>
                  <p className="text-gray-500 text-sm mt-2">Try different keywords or check your spelling</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;

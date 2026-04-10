import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import RightSidebar from '../components/RightSidebar';
import { HeartIcon, ChatBubbleLeftIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !selectedMedia) return;

    setUploading(true);
    try {
      let mediaUrl = '';
      
      if (selectedMedia) {
        // Convert file to base64 or upload to server
        const reader = new FileReader();
        mediaUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(selectedMedia);
        });
      }

      const res = await axios.post('/api/posts', { 
        content: newPost,
        image: mediaType === 'image' ? mediaUrl : '',
        video: mediaType === 'video' ? mediaUrl : ''
      });
      setPosts([res.data, ...posts]);
      setNewPost('');
      setSelectedMedia(null);
      setMediaPreview(null);
      setMediaType(null);
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleMediaSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMedia(file);
      setMediaType(type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`/api/posts/${postId}/like`);
      setPosts(posts.map(post => post._id === postId ? { ...post, likes: res.data.likes } : post));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId, text) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/comment`, { text });
      setPosts(posts.map(post => post._id === postId ? res.data : post));
    } catch (err) {
      console.error('Error commenting:', err);
    }
  };
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(`/api/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleEditPost = async (postId, updatedData) => {
    try {
      const res = await axios.put(`/api/posts/${postId}`, updatedData);
      setPosts(posts.map(post => post._id === postId ? res.data : post));
    } catch (err) {
      console.error('Error editing post:', err);
      alert('Failed to update post. Please try again.');
    }
  };
  const [suggestedUsers, setSuggestedUsers] = useState([
    { name: 'John Smith', added: false },
    { name: 'Sarah Lee', added: false },
    { name: 'Mark Davis', added: false },
    { name: 'Lisa Brown', added: false },
    { name: 'Alex Turner', added: false },
    { name: 'Anna White', added: false }
  ]);

  const handleAddConnection = (index) => {
    const updatedUsers = [...suggestedUsers];
    updatedUsers[index].added = true;
    setSuggestedUsers(updatedUsers);
    setTimeout(() => {
      const filtered = suggestedUsers.filter((_, i) => i !== index);
      setSuggestedUsers(filtered);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 animate-gradient">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Fixed */}
          <div className="col-span-3 animate-slide-in-left sticky top-20 self-start h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
            <ProfileSidebar />
          </div>

          {/* Main Feed - Scrollable */}
          <div className="col-span-6 space-y-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
            {/* Suggested Users */}
            <div className="card p-6 hover:shadow-2xl transition-all duration-300 animate-scale-in">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-gray-900 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">Recommended for you</h3>
                <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-xl">
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                {suggestedUsers.map((suggestedUser, index) => (
                  <div key={index} className="flex flex-col items-center flex-shrink-0 group animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center border-2 border-white shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 animate-gradient ${suggestedUser.added ? 'opacity-50 scale-95' : 'group-hover:animate-wiggle'}`}>
                        <span className="text-white font-bold text-xl uppercase">
                          {suggestedUser.name.substring(0, 2)}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleAddConnection(index)}
                        disabled={suggestedUser.added}
                        className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-xl flex items-center justify-center border-2 border-white shadow-lg transition-all duration-300 ${suggestedUser.added ? 'bg-gradient-to-r from-green-500 to-emerald-600 scale-110' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-125 hover:rotate-12'}`}
                      >
                        <span className="text-white text-sm font-bold">{suggestedUser.added ? '✓' : '+'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-700 mt-3 font-semibold">{suggestedUser.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Post */}
            <div className="card p-6 hover:shadow-2xl transition-all duration-300">
              <form onSubmit={handleCreatePost}>
                <div className="flex space-x-4">
                  <img
                    src={user?.profilePicture || 'https://ui-avatars.com/api/?name=' + user?.firstName + '+' + user?.lastName}
                    alt="Profile"
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-lg"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-300 bg-gradient-to-br from-gray-50 to-blue-50/30 hover:shadow-md"
                      rows="3"
                    />
                    
                    {/* Media Preview */}
                    {mediaPreview && (
                      <div className="mt-3 relative">
                        <button
                          type="button"
                          onClick={handleRemoveMedia}
                          className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white rounded-full p-2 hover:bg-opacity-90 z-10"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {mediaType === 'image' ? (
                          <img
                            src={mediaPreview}
                            alt="Preview"
                            className="w-full rounded-lg max-h-96 object-cover"
                          />
                        ) : (
                          <video
                            src={mediaPreview}
                            controls
                            className="w-full rounded-lg max-h-96"
                          />
                        )}
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex space-x-3">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={(e) => handleMediaSelect(e, 'image')}
                          className="hidden"
                        />
                        <label 
                          htmlFor="image-upload"
                          className="p-3 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-2xl transition-all duration-300 cursor-pointer group shadow-md hover:shadow-xl"
                          title="Add photo"
                        >
                          <svg className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </label>
                        
                        <input
                          type="file"
                          id="video-upload"
                          accept="video/*"
                          onChange={(e) => handleMediaSelect(e, 'video')}
                          className="hidden"
                        />
                        <label 
                          htmlFor="video-upload"
                          className="p-3 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 rounded-2xl transition-all duration-300 cursor-pointer group shadow-md hover:shadow-xl"
                          title="Add video"
                        >
                          <svg className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </label>
                      </div>
                      <button
                        type="submit"
                        disabled={(!newPost.trim() && !selectedMedia) || uploading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {uploading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Posting...
                          </span>
                        ) : 'Post'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Posts Feed */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-500">No posts yet. Be the first to share something!</p>
              </div>
            ) : (
              posts.map(post => <PostCard key={post._id} post={post} onLike={handleLike} onComment={handleComment} onDelete={handleDeletePost} onEdit={handleEditPost} user={user} />)
            )}
          </div>

          {/* Right Sidebar - Fixed */}
          <div className="col-span-3 animate-slide-in-right sticky top-20 self-start h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide" style={{animationDelay: '0.2s'}}>
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

const PostCard = ({ post, onLike, onComment, onDelete, onEdit, user }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showMenu, setShowMenu] = useState(false);
  const isLiked = post.likes?.includes(user?._id);
  const isOwnPost = post.author?._id === user?._id;

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post._id, commentText);
      setCommentText('');
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author?.firstName} ${post.author?.lastName}`,
        text: post.content,
        url: postUrl
      }).catch(() => {
        copyToClipboard(postUrl);
      });
    } else {
      copyToClipboard(postUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      alert('Post saved!');
    } else {
      alert('Post unsaved!');
    }
  };

  return (
    <div className="card p-6">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <img
            src={post.author?.profilePicture || 'https://ui-avatars.com/api/?name=' + post.author?.firstName + '+' + post.author?.lastName}
            alt={`${post.author?.firstName} ${post.author?.lastName}`}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold text-gray-900">
              {post.author?.firstName} {post.author?.lastName}
            </h3>
            <p className="text-sm text-gray-500">{post.author?.headline}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(post.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        {isOwnPost && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600"
            >
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-2">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  Edit Post
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(post._id);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            rows="4"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                onEdit(post._id, { content: editContent });
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditContent(post.content);
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
      )}

      {/* Post Media */}
      {post.image && (
        <img
          src={post.image}
          alt="Post content"
          className="w-full rounded-xl mb-4 object-cover max-h-96"
        />
      )}
      
      {post.video && (
        <video
          src={post.video}
          controls
          className="w-full rounded-xl mb-4 max-h-96"
        />
      )}

      {/* Post Actions */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center space-x-2 transition-colors ${
            isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
          }`}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          {isLiked ? (
            <HeartIconSolid className="w-6 h-6" />
          ) : (
            <HeartIcon className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="text-gray-600 hover:text-blue-600 transition-colors"
          title="Comment"
        >
          <ChatBubbleLeftIcon className="w-6 h-6" />
        </button>

        <button 
          onClick={handleShare}
          className="text-gray-600 hover:text-blue-600 transition-colors"
          title="Share"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>

        <button 
          onClick={handleSave}
          className={`ml-auto transition-colors ${
            isSaved ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
          title={isSaved ? 'Unsave' : 'Save'}
        >
          {isSaved ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </button>
      </div>

      {/* Like and Comment Counts */}
      {(post.likes?.length > 0 || post.comments?.length > 0) && (
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3 pb-3 border-b border-gray-200">
          <span>
            {post.likes?.length > 0 && `${post.likes.length} ${post.likes.length === 1 ? 'like' : 'likes'}`}
          </span>
          <span>
            {post.comments?.length > 0 && `${post.comments.length} ${post.comments.length === 1 ? 'comment' : 'comments'}`}
          </span>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex space-x-3 mb-4">
            <img
              src={user?.profilePicture || 'https://ui-avatars.com/api/?name=' + user?.firstName + '+' + user?.lastName}
              alt="You"
              className="w-8 h-8 rounded-full object-cover"
            />
            <form onSubmit={handleSubmitComment} className="flex-1 flex space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm font-medium">
                Post
              </button>
            </form>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {post.comments?.map((comment, index) => (
              <div key={index} className="flex space-x-3">
                <img
                  src={comment.user?.profilePicture || 'https://ui-avatars.com/api/?name=' + comment.user?.firstName}
                  alt={`${comment.user?.firstName} ${comment.user?.lastName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <p className="font-semibold text-sm text-gray-900">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-800">{comment.text}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 px-4">
                    <button className="text-xs text-gray-500 hover:text-blue-600 font-medium">Like</button>
                    <button className="text-xs text-gray-500 hover:text-blue-600 font-medium">Reply</button>
                    <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;

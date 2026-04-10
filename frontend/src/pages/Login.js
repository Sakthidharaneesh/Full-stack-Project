import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-md animate-gradient"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '0.5s'}}></div>
      
      <div className="glass-effect rounded-3xl shadow-2xl p-12 w-full max-w-md relative z-10 transform hover:scale-105 transition-transform duration-500 animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mb-4 shadow-2xl animate-float">
            <svg className="w-12 h-12 text-white animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-gradient animate-slide-in-left">Welcome to Connex</h1>
          <p className="text-gray-600 animate-fade-in" style={{animationDelay: '0.2s'}}>Connect. Learn. Grow Together.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8 bg-gray-100/50 rounded-2xl p-1.5 shadow-inner">
          <button className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg transition-all transform scale-105">
            Login
          </button>
          <Link
            to="/register"
            className="flex-1 py-3 px-6 bg-transparent text-gray-700 font-semibold text-center hover:bg-white/50 transition-all rounded-xl"
          >
            Signup
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border-2 border-red-200 text-red-700 rounded-2xl text-sm font-medium shadow-lg">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="group animate-slide-in-right" style={{animationDelay: '0.1s'}}>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="Email Address"
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium group-hover:shadow-lg"
            />
          </div>

          <div className="group animate-slide-in-right" style={{animationDelay: '0.2s'}}>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              placeholder="Password"
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium group-hover:shadow-lg"
            />
          </div>

          <div className="text-left">
            <button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Not a member?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Signup now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

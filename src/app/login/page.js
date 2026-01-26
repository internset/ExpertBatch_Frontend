'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Signup state
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Common state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Frontend only - save dummy token and user data
    try {
      // Generate dummy token
      const dummyToken = 'dummy_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Create dummy user data
      const dummyUser = {
        id: '1',
        firstName: loginEmail.split('@')[0] || 'User',
        lastName: 'Student',
        username: loginEmail.split('@')[0] || 'user',
        email: loginEmail,
        role: 'student'
      };

      // Save to localStorage (session)
      localStorage.setItem('token', dummyToken);
      localStorage.setItem('user', JSON.stringify(dummyUser));

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to student dashboard
      router.push('/student/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    // Frontend only - save dummy token and user data
    try {
      // Generate dummy token
      const dummyToken = 'dummy_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Create dummy user data
      const dummyUser = {
        id: '1',
        firstName: signupFirstName || 'User',
        lastName: signupLastName || 'Student',
        username: signupEmail.split('@')[0] || 'user',
        email: signupEmail,
        role: 'student'
      };

      // Save to localStorage (session)
      localStorage.setItem('token', dummyToken);
      localStorage.setItem('user', JSON.stringify(dummyUser));

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect to student dashboard
      router.push('/student/dashboard');
    } catch (err) {
      setError('Signup failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Dynamic Content based on Tab */}
      {activeTab === 'login' ? (
        <div 
          className="hidden lg:flex lg:w-1/3 relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#ED2024]/85 to-[#C91A1A]/70"></div>
          <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Trusted by Leading Organizations
            </h1>
            <div className="space-y-6 w-full">
              <div>
                <div className="text-5xl font-bold mb-2">50K+</div>
                <div className="text-lg text-white/90">Candidates Assessed</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">500+</div>
                <div className="text-lg text-white/90">Companies Using Our Platform</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">95%</div>
                <div className="text-lg text-white/90">Accuracy Rate in Skill Assessment</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">24/7</div>
                <div className="text-lg text-white/90">Proctoring & Support Available</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="hidden lg:flex lg:w-1/3 relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#ED2024]/85 to-[#C91A1A]/70"></div>
          <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Start Your Journey Today
            </h1>
            <div className="space-y-5 w-full">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✓</div>
                <div>
                  <div className="text-lg font-semibold mb-1">Skill-Based Assessment</div>
                  <div className="text-white/90">Get evaluated on real-world skills, not just credentials</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">✓</div>
                <div>
                  <div className="text-lg font-semibold mb-1">Instant Results</div>
                  <div className="text-white/90">Receive detailed performance reports immediately</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">✓</div>
                <div>
                  <div className="text-lg font-semibold mb-1">Career Opportunities</div>
                  <div className="text-white/90">Connect with top companies looking for your skills</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">✓</div>
                <div>
                  <div className="text-lg font-semibold mb-1">Secure & Fair</div>
                  <div className="text-white/90">Advanced proctoring ensures fair assessment for everyone</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 lg:p-12">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/Expertbatch Logo.svg"
                alt="ExpertBatch Logo"
                width={201}
                height={32}
                priority
                className="h-[1.875rem] w-auto"
              />
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white">
            {/* Content */}
            <div className="p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6">
                  <div className="font-medium">{error}</div>
                </div>
              )}

              {/* Login Form */}
              {activeTab === 'login' && (
                <form
                  onSubmit={handleLogin}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-[24px] font-semibold text-gray-900 mb-2">
                      Login to your ExpertBatch account
                    </h2>
                  </div>

                  <div>
                    <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="loginEmail"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300"
                      placeholder="Email Address"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="loginPassword"
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 pr-12 py-3 border border-gray-300"
                        placeholder="Password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                      >
                        {showLoginPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center ">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="border-gray-300 text-[#ED2024] cursor-pointer"
                      />
                      <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-[#ED2024] font-semibold hover:text-[#C91A1A] transition-colors">
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-[#ED2024] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : 'Login to ExpertBatch'}
                  </button>
                </form>
              )}

              {/* Signup Form */}
              {activeTab === 'signup' && (
                <form
                  onSubmit={handleSignup}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-[24px] font-semibold text-gray-900 mb-2">
                      Create your ExpertBatch account
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="signupFirstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        id="signupFirstName"
                        type="text"
                        value={signupFirstName}
                        onChange={(e) => setSignupFirstName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="signupLastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        id="signupLastName"
                        type="text"
                        value={signupLastName}
                        onChange={(e) => setSignupLastName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="signupEmail"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="signupPassword"
                          type={showSignupPassword ? 'text' : 'password'}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="w-full px-4 pr-12 py-3 border border-gray-300"
                          placeholder="At least 6 characters"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                        >
                          {showSignupPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signupConfirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="signupConfirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          className="w-full px-4 pr-12 py-3 border border-gray-300"
                          placeholder="Confirm your password"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                        >
                          {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 border-gray-300 text-[#ED2024]"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                      <Link href="#" className="text-[#ED2024]">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="#" className="text-[#ED2024]">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-[#ED2024] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : 'Create Account'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            {activeTab === 'login' ? (
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setActiveTab('signup');
                    setError('');
                  }}
                  className="text-[#ED2024] font-semibold hover:text-[#C91A1A] transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                  }}
                  className="text-[#ED2024] font-semibold hover:text-[#C91A1A] transition-colors cursor-pointer"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

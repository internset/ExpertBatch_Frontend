'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';
import {
  FiArrowLeft,
  FiClock,
  FiBook,
  FiCheckCircle,
  FiBarChart,
  FiUsers,
  FiPlay,
  FiEye,
  FiEyeOff,
  FiZap,
  FiShield,
  FiTarget,
  FiAward,
  FiDollarSign,
  FiStar,
  FiTrendingUp,
  FiGlobe,
  FiFileText,
  FiSettings,
  FiX,
  FiAlertCircle
} from 'react-icons/fi';

export default function TestDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const skillName = params.skillName ? decodeURIComponent(params.skillName) : '';

  // Dummy data - will be replaced with API call later
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Login/Signup Modal State
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
  
  // Auth state
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Generic dummy data for all skills - same data for every test
  const getGenericSkillData = (skillName) => ({
    id: '1',
    name: skillName,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    fullDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    duration: '45',
    difficulty: 'Intermediate',
    testType: 'Technical Assessment',
    topics: [
      { id: '1', name: 'Fundamentals & Core Concepts' },
      { id: '2', name: 'Advanced Techniques & Patterns' },
      { id: '3', name: 'Best Practices & Optimization' },
      { id: '4', name: 'Real-world Applications' },
      { id: '5', name: 'Troubleshooting & Debugging' }
    ],
    coveredSkills: [
      'Core Concepts & Fundamentals',
      'Advanced Techniques',
      'Problem Solving',
      'Best Practices',
      'Performance Optimization',
      'Error Handling & Debugging'
    ],
    useCases: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    pricing: {
      price: 15,
      features: ['Unlimited attempts', 'Detailed reports', 'Proctoring included', '24/7 support', 'PDF certificate']
    },
    stats: {
      totalCandidates: '150K+',
      averageScore: '78%',
      completionRate: '92%',
      companiesUsing: '3.5K+'
    },
    requirements: [
      'Basic understanding of programming concepts',
      'Familiarity with fundamental principles',
      'Knowledge of related technologies recommended'
    ],
    whatYouGet: [
      'Comprehensive skill assessment',
      'Detailed performance report',
      'Percentile ranking',
      'Topic-wise breakdown',
      'Proctoring report',
      'PDF certificate (optional)'
    ]
  });

  // Dummy skills list for matching
  const dummySkills = [
    { name: 'JavaScript' },
    { name: 'Python' },
    { name: 'React' },
    { name: 'Node.js' },
    { name: 'SQL' },
    { name: 'TypeScript' },
    { name: 'AWS Cloud' },
    { name: 'Docker' },
    { name: 'Git & Version Control' }
  ];

  useEffect(() => {
    // Always use generic data for any skill name
    if (skillName) {
      const genericData = getGenericSkillData(skillName);
      setSkill(genericData);
    } else {
      setSkill(null);
    }
    setLoading(false);
  }, [skillName]);

  const handleStartAssessment = () => {
    // Show login modal
    setShowLoginModal(true);
  };
  
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    setAuthError('');
    setActiveTab('login');
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

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

      // Close modal and redirect to payment
      setShowLoginModal(false);
      router.push(`/test-library/${encodeURIComponent(skillName)}/payment`);
    } catch (err) {
      setAuthError('Login failed. Please try again.');
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    // Validation
    if (signupPassword !== signupConfirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    
    if (signupPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }
    
    setAuthLoading(true);
    
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

      // Close modal and redirect to payment
      setShowLoginModal(false);
      router.push(`/test-library/${encodeURIComponent(skillName)}/payment`);
    } catch (err) {
      setAuthError('Signup failed. Please try again.');
      setAuthLoading(false);
    }
  };

  const handlePreviewQuestions = () => {
    router.push(`/test-library/${encodeURIComponent(skillName)}/preview`);
  };

  const handlePurchase = () => {
    router.push(`/test-library/${encodeURIComponent(skillName)}/payment`);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  const handleGoToPayment = () => {
    setShowPaymentModal(false);
    router.push(`/test-library/${encodeURIComponent(skillName)}/payment`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-12 w-12 border-b-2 border-[#ED2024]"></div>
            <p className="text-gray-600">Loading assessment details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Assessment not found</h1>
            <p className="text-gray-600 mb-6">The assessment you're looking for doesn't exist.</p>
            <Link
              href="/test-library"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ED2024] text-white hover:bg-[#C91A1A] transition-colors font-semibold"
            >
              <FiArrowLeft className="h-5 w-5" />
              Back to Test Library
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-700 border-green-200',
    'Intermediate': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Advanced': 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Breadcrumb Navigation */}
      <section className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/test-library" className="text-gray-600 hover:text-gray-900 transition-colors">
              Test Library
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{skill.name}</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Test Details */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
                    {skill.name} Assessment
                  </h1>
                </div>


                {/* Duration */}
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-2">
                    <FiClock className="h-4 w-4 text-gray-700" />
                  </div>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 font-medium text-sm border border-gray-200">
                    {skill.duration} min
                  </span>
                </div>

                {/* Difficulty */}
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-2">
                    <FiBarChart className="h-4 w-4 text-gray-700" />
                  </div>
                  <span className={`px-4 py-2 font-medium text-sm border ${difficultyColors[skill.difficulty] || 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                    {skill.difficulty}
                  </span>
                </div>

                {/* Pricing Section */}
                {skill.pricing && (
                  <div className="">
                    <div className="bg-gradient-to-br from-[#ED2024]/10 to-[#C91A1A]/10 p-4 border-2 border-[#ED2024]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Price</span>
                        <FiDollarSign className="h-5 w-5 text-[#ED2024]" />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#ED2024]">${skill.pricing.price}</span>
                        <span className="text-sm text-gray-600">USD</span>
                      </div>
                      <div className="w-full flex flex-row items-end justify-between">
                        <p className="text-xs text-gray-600 mt-2 mb-3">One-time payment</p>
                        <div className="flex justify-end">
                          <button
                            onClick={handlePurchase}
                            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-[#ED2024] to-[#C91A1A] text-white hover:from-[#C91A1A] hover:to-[#A01515] font-semibold text-sm flex items-center justify-center gap-2"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className=" space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={handleStartAssessment}
                      className="cursor-pointer w-full py-3 bg-[#ED2024] text-white hover:bg-[#C91A1A] font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <FiPlay className="h-4 w-4" />
                      Start Assessment
                    </button>
                    <button
                      onClick={handlePreviewQuestions}
                      className="cursor-pointer w-full py-3 bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <FiEye className="h-4 w-4" />
                      Preview Questions
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Test Information */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Summary Section */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Summary of the {skill.name} Assessment
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {skill.fullDescription || skill.description}
                  </p>
                </div>

                {/* Covered Skills */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    Covered Skills
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skill?.coveredSkills?.map((coveredSkill, index) => (
                      <div
                        className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200"
                      >
                        <FiCheckCircle className="h-6 w-6 text-[#ED2024] flex-shrink-0" />
                        <span className="text-gray-800 font-semibold text-base">{coveredSkill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topics List */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    Topics Covered
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skill?.topics?.map((topic, index) => (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-gray-200"
                      >
                        <div className="bg-[#ED2024] p-2.5 flex-shrink-0">
                          <FiTarget className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-gray-800 font-semibold text-base">{topic.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use Cases */}
                {skill.useCases && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                      Use the {skill.name} Assessment to Hire
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {skill.useCases}
                    </p>
                  </div>
                )}

                {/* Statistics Section */}
                {skill.stats && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Assessment Statistics</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#ED2024] mb-1">{skill.stats.totalCandidates}</div>
                        <div className="text-sm text-gray-600">Candidates Assessed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#ED2024] mb-1">{skill.stats.averageScore}</div>
                        <div className="text-sm text-gray-600">Average Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#ED2024] mb-1">{skill.stats.completionRate}</div>
                        <div className="text-sm text-gray-600">Completion Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#ED2024] mb-1">{skill.stats.companiesUsing}</div>
                        <div className="text-sm text-gray-600">Companies Using</div>
                      </div>
                    </div>
                  </div>
                )}


                {/* Requirements */}
                {skill.requirements && skill.requirements.length > 0 && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                      Prerequisites
                    </h2>
                    <div className="bg-blue-50 p-5 border border-blue-200">
                      <p className="text-gray-700 mb-3 font-medium">Before taking this assessment, candidates should have:</p>
                      <ul className="space-y-2">
                        {skill.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <FiCheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* What You Get */}
                {skill.whatYouGet && skill.whatYouGet.length > 0 && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                      What You Get
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {skill.whatYouGet.map((item, index) => (
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#ED2024]/5 to-[#C91A1A]/5 border border-[#ED2024]/20"
                        >
                          <FiAward className="h-5 w-5 text-[#ED2024] flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features Highlight */}
                <div className="bg-gradient-to-br from-[#ED2024]/5 to-[#C91A1A]/5 p-6 border border-[#ED2024]/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose This Assessment?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <FiShield className="h-5 w-5 text-[#ED2024] flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Advanced Proctoring</h4>
                        <p className="text-sm text-gray-600">AI-powered monitoring ensures exam integrity</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiBarChart className="h-5 w-5 text-[#ED2024] flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Detailed Analytics</h4>
                        <p className="text-sm text-gray-600">Comprehensive performance reports and insights</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiAward className="h-5 w-5 text-[#ED2024] flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Skill-Based Evaluation</h4>
                        <p className="text-sm text-gray-600">Targeted assessment of specific capabilities</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiUsers className="h-5 w-5 text-[#ED2024] flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Fair Assessment</h4>
                        <p className="text-sm text-gray-600">Standardized evaluation for all candidates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Required Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 p-6 sm:p-8 max-w-md w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2">
                  <FiAlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Payment Required
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4 leading-relaxed">
                Please complete the payment to access the assessment. You need to purchase this assessment before you can start taking it.
              </p>

              <div className="bg-gray-50 p-4 border border-gray-200 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Assessment Price:</span>
                  <span className="text-2xl font-bold text-[#ED2024]">
                    ${skill.pricing?.price || 15}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> After successful payment, you'll be redirected to start the assessment immediately.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleGoToPayment}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#ED2024] to-[#C91A1A] text-white hover:from-[#C91A1A] hover:to-[#A01515] font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FiDollarSign className="h-5 w-5" />
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login/Signup Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 p-6 sm:p-8 max-w-2xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {activeTab === 'login' ? 'Login to Continue' : 'Create Account'}
              </h2>
              <button
                onClick={handleCloseLoginModal}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setAuthError('');
                }}
                className={`px-4 py-2 font-semibold text-sm transition-colors ${
                  activeTab === 'login'
                    ? 'text-[#ED2024] border-b-2 border-[#ED2024]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab('signup');
                  setAuthError('');
                }}
                className={`px-4 py-2 font-semibold text-sm transition-colors ${
                  activeTab === 'signup'
                    ? 'text-[#ED2024] border-b-2 border-[#ED2024]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6">
                <div className="font-medium">{authError}</div>
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <h3 className="text-[24px] font-semibold text-gray-900 mb-2">
                    Login to your ExpertBatch account
                  </h3>
                </div>

                <div>
                  <label htmlFor="modalLoginEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="modalLoginEmail"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300"
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="modalLoginPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="modalLoginPassword"
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="modalRememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="border-gray-300 text-[#ED2024] cursor-pointer"
                    />
                    <label htmlFor="modalRememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-[#ED2024] font-semibold hover:text-[#C91A1A] transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full px-6 py-3 bg-[#ED2024] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? 'Loading...' : 'Login to ExpertBatch'}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <h3 className="text-[24px] font-semibold text-gray-900 mb-2">
                    Create your ExpertBatch account
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modalSignupFirstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      id="modalSignupFirstName"
                      type="text"
                      value={signupFirstName}
                      onChange={(e) => setSignupFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="modalSignupLastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      id="modalSignupLastName"
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
                  <label htmlFor="modalSignupEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="modalSignupEmail"
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
                    <label htmlFor="modalSignupPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="modalSignupPassword"
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
                    <label htmlFor="modalSignupConfirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="modalSignupConfirmPassword"
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
                    id="modalTerms"
                    className="mt-1 border-gray-300 text-[#ED2024]"
                    required
                  />
                  <label htmlFor="modalTerms" className="ml-2 text-sm text-gray-600">
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
                  disabled={authLoading}
                  className="w-full px-6 py-3 bg-[#ED2024] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? 'Loading...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

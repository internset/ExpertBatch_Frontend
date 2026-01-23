'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Dummy data - will be replaced with API call later
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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
    // Show payment required modal
    setShowPaymentModal(true);
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED2024]"></div>
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ED2024] text-white rounded-lg hover:bg-[#C91A1A] transition-colors font-semibold"
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
            <Link href="/" className="text-[#ED2024] hover:text-[#C91A1A] transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/test-library" className="text-[#ED2024] hover:text-[#C91A1A] transition-colors">
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
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Title */}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
                    {skill.name} Assessment
                  </h1>
                </div>

                {/* Test Type Badge */}
                <div className="flex items-center gap-2">
                  <div className="bg-[#ED2024] rounded-lg p-2">
                    <FiBook className="h-4 w-4 text-white" />
                  </div>
                  <span className="px-4 py-2 bg-[#ED2024]/10 text-[#ED2024] rounded-lg font-medium text-sm border border-[#ED2024]/20">
                    {skill.testType}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 rounded-lg p-2">
                    <FiClock className="h-4 w-4 text-gray-700" />
                  </div>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm border border-gray-200">
                    {skill.duration} min
                  </span>
                </div>

                {/* Difficulty */}
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 rounded-lg p-2">
                    <FiBarChart className="h-4 w-4 text-gray-700" />
                  </div>
                  <span className={`px-4 py-2 rounded-lg font-medium text-sm border ${
                    difficultyColors[skill.difficulty] || 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {skill.difficulty}
                  </span>
                </div>

                {/* Topics Count */}
                {skill.topics && skill.topics.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Topics Covered</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {skill.topics.length} {skill.topics.length === 1 ? 'topic' : 'topics'}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-6 space-y-3">
                  <motion.button
                    onClick={handleStartAssessment}
                    className="cursor-pointer w-full px-6 py-4 bg-[#ED2024] text-white rounded-lg hover:bg-[#C91A1A] transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiPlay className="h-5 w-5" />
                    Start Assessment
                  </motion.button>
                  <motion.button
                    onClick={handlePreviewQuestions}
                    className="cursor-pointer w-full px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiEye className="h-5 w-5" />
                    Preview Questions
                  </motion.button>
                  
                  {/* Pricing Button */}
                  {skill.pricing && (
                    <motion.button
                      onClick={handlePurchase}
                      className="cursor-pointer w-full px-6 py-4 bg-gradient-to-r from-[#ED2024] to-[#C91A1A] text-white rounded-lg hover:from-[#C91A1A] hover:to-[#A01515] transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiDollarSign className="h-5 w-5" />
                      Purchase - ${skill.pricing.price}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Test Information */}
            <div className="lg:col-span-2">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
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
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-[#ED2024] transition-colors"
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
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-[#ED2024] hover:shadow-md transition-all"
                      >
                        <div className="bg-[#ED2024] rounded-lg p-2.5 flex-shrink-0">
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
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
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
                    <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
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
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#ED2024]/5 to-[#C91A1A]/5 rounded-lg border border-[#ED2024]/20"
                        >
                          <FiAward className="h-5 w-5 text-[#ED2024] flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features Highlight */}
                <div className="bg-gradient-to-br from-[#ED2024]/5 to-[#C91A1A]/5 rounded-xl p-6 border border-[#ED2024]/20">
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
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Required Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 max-w-md w-full mx-4 shadow-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 rounded-full p-2">
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
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Assessment Price:</span>
                  <span className="text-2xl font-bold text-[#ED2024]">
                    ${skill.pricing?.price || 15}
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> After successful payment, you'll be redirected to start the assessment immediately.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleGoToPayment}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#ED2024] to-[#C91A1A] text-white rounded-lg hover:from-[#C91A1A] hover:to-[#A01515] transition-all font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FiDollarSign className="h-5 w-5" />
                Proceed to Payment
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}

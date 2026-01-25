'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiCheckCircle,
  FiPlus,
  FiAward,
  FiShoppingCart,
  FiFileText,
  FiDownload,
  FiUser,
  FiArrowRight
} from 'react-icons/fi';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, []);

  const userName = user?.firstName || user?.username || 'Niranjan';

  // Summary Stats
  const summaryCards = [
    { label: 'Active Tests', count: 2, buttonText: 'View Tests >', color: 'blue' },
    { label: 'Pending Invites', count: 1, buttonText: 'View Invites >', color: 'yellow' },
    { label: 'Results Ready', count: 3, buttonText: 'View Results >', color: 'green' },
  ];

  // Active/Upcoming Tests
  const activeTests = [
    {
      id: 1,
      title: 'JavaScript Fundamentals Test',
      badge: { type: 'self-purchased', icon: FiCheckCircle, color: 'red' },
      status: 'Not Started',
      validTill: 'Feb 25, 2026',
      attemptsLeft: 1,
      buttonText: 'Start Test >',
    },
    {
      id: 2,
      title: 'Frontend Assessment',
      badge: { type: 'invited', text: 'Invited by Acme Technologies', icon: FiPlus, color: 'green' },
      invitedBy: 'Acme Technologies Pvt Ltd',
      deadline: 'Jan 30, 2026',
      buttonText: 'Start Test >',
    },
  ];

  // Pending Invitations
  const pendingInvitations = [
    {
      id: 1,
      title: 'UI/UX Screening Test',
      icon: FiAward,
      iconColor: 'green',
      organisation: 'DesignLabs',
      deadline: 'Jan 28, 2026',
    },
  ];

  // Recently Completed
  const completedTests = [
    {
      id: 1,
      title: 'Data Structures Assessment',
      icon: FiAward,
      iconColor: 'blue',
      badge: { type: 'self-purchased', icon: FiCheckCircle, color: 'red' },
      score: '78%',
      status: 'Passed',
      buttonText: 'View Report >',
    },
    {
      id: 2,
      title: 'Backend Developer Test',
      icon: FiAward,
      iconColor: 'red',
      badge: { type: 'invited', text: 'Invited by FintechCorp', icon: FiPlus, color: 'green' },
      score: '82%',
      status: 'Result Shared with Organisation',
      buttonText: 'View Report >',
    },
  ];

  // Quick Actions
  const quickActions = [
    { label: 'Buy a Test', icon: FiShoppingCart, href: '/student/buy-tests' },
    { label: 'View Invitations', icon: FiFileText, href: '/student/invitations' },
    { label: 'Download Certificates', icon: FiDownload, href: '/student/certificates' },
    { label: 'Update Profile', icon: FiUser, href: '/student/profile' },
  ];

  return (
    <>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Hello, {userName} 👋
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Track your tests, invitations, and results in one place.
          </p>
          <p className="text-gray-600">
            You currently have <strong className="text-gray-900">2 active tests</strong> and <strong className="text-gray-900">1 pending invitation</strong>.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
            >
              <div className="text-sm font-medium text-gray-600 mb-2">{card.label}</div>
              <div className="text-4xl font-bold text-gray-900 mb-4">{card.count}</div>
              <button
                onClick={() => router.push(card.buttonText.includes('Tests') ? '/student/my-tests' : card.buttonText.includes('Invites') ? '/student/invitations' : '/student/results')}
                className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active / Upcoming Tests */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Active / Upcoming Tests</h2>
              <div className="space-y-4">
                {activeTests.map((test) => (
                  <div
                    key={test.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                  >
                    {/* Badge at top left */}
                    {test.badge && (
                      <div className="mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${
                          test.badge.color === 'red' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                          {test.badge.icon && <test.badge.icon className="h-3.5 w-3.5" />}
                          {test.badge.type === 'self-purchased' ? 'Self-Purchased' : test.badge.text}
                        </span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{test.title}</h3>
                    
                    {/* Separator Line */}
                    <div className="border-t border-gray-200 mb-4"></div>
                    
                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      {test.status && (
                        <p className="text-sm text-gray-700">Status: <span className="font-medium text-gray-900">{test.status}</span></p>
                      )}
                      {test.validTill && (
                        <p className="text-sm text-gray-700">Valid Till: <span className="font-medium text-gray-900">{test.validTill}</span></p>
                      )}
                      {test.attemptsLeft && (
                        <p className="text-sm text-gray-700">Attempts Left: <span className="font-medium text-gray-900">{test.attemptsLeft}</span></p>
                      )}
                      {test.invitedBy && (
                        <p className="text-sm text-gray-700">Invited by: <span className="font-medium text-gray-900">{test.invitedBy}</span></p>
                      )}
                      {test.deadline && (
                        <p className="text-sm text-gray-700">Deadline: <span className="font-medium text-gray-900">{test.deadline}</span></p>
                      )}
                    </div>
                    
                    {/* Button at bottom right */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => router.push('/student/my-tests')}
                        className="cursor-pointer px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                      >
                        Start Test
                        <FiArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Invitations */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Invitations</h2>
              <div className="space-y-4">
                {pendingInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-lg ${
                        invitation.iconColor === 'green' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <invitation.icon className={`h-6 w-6 ${
                          invitation.iconColor === 'green' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{invitation.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">Organisation: <span className="font-medium">{invitation.organisation}</span></p>
                        <p className="text-sm text-gray-600 mb-1">Deadline: <span className="font-medium">{invitation.deadline}</span></p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => router.push('/student/invitations')}
                        className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Accept
                      </button>
                      <button
                        className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Completed */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Completed</h2>
              <div className="space-y-4">
                {completedTests.map((test) => (
                  <div
                    key={test.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                  >
                    {/* Badge at top left */}
                    {test.badge && (
                      <div className="mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${
                          test.badge.color === 'red' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                          {test.badge.icon && <test.badge.icon className="h-3.5 w-3.5" />}
                          {test.badge.type === 'self-purchased' ? 'Self-Purchased' : test.badge.text}
                        </span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{test.title}</h3>
                    
                    {/* Separator Line */}
                    <div className="border-t border-gray-200 mb-4"></div>
                    
                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-700">Score: <span className="font-medium text-gray-900">{test.score}</span></p>
                      <p className="text-sm text-gray-700">Status: <span className="font-medium text-gray-900">{test.status}</span></p>
                    </div>
                    
                    {/* Button at bottom right */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => router.push('/student/results')}
                        className="cursor-pointer px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                      >
                        View Report
                        <FiArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => router.push(action.href)}
                      className="cursor-pointer w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Icon className="h-5 w-5" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiPlus, FiArrowRight, FiGrid, FiList } from 'react-icons/fi';

export default function MyTestsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'self-purchased', 'invited', 'completed'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const allTests = [
    {
      id: 1,
      title: 'JavaScript Fundamentals Test',
      badge: { type: 'self-purchased', icon: FiCheckCircle, color: 'red' },
      status: 'Not Started',
      validTill: 'Feb 25, 2026',
      attemptsLeft: 1,
      isCompleted: false,
    },
    {
      id: 2,
      title: 'Frontend Assessment',
      badge: { type: 'invited', text: 'Invited by Acme Technologies', icon: FiPlus, color: 'green' },
      invitedBy: 'Acme Technologies Pvt Ltd',
      deadline: 'Jan 30, 2026',
      isCompleted: false,
    },
    {
      id: 3,
      title: 'React Advanced Concepts',
      badge: { type: 'self-purchased', icon: FiCheckCircle, color: 'red' },
      status: 'In Progress',
      validTill: 'Mar 15, 2026',
      attemptsLeft: 2,
      isCompleted: false,
    },
    {
      id: 4,
      title: 'Node.js Backend Test',
      badge: { type: 'invited', text: 'Invited by TechCorp', icon: FiPlus, color: 'green' },
      invitedBy: 'TechCorp Solutions',
      deadline: 'Feb 10, 2026',
      isCompleted: false,
    },
    {
      id: 5,
      title: 'Data Structures Assessment',
      badge: { type: 'self-purchased', icon: FiCheckCircle, color: 'red' },
      status: 'Completed',
      score: '85%',
      completedDate: 'Jan 15, 2026',
      isCompleted: true,
    },
    {
      id: 6,
      title: 'Full Stack Developer Test',
      badge: { type: 'invited', text: 'Invited by DevCorp', icon: FiPlus, color: 'green' },
      status: 'Completed',
      score: '78%',
      completedDate: 'Jan 10, 2026',
      isCompleted: true,
    },
  ];

  // Filter tests based on active tab
  const filteredTests = activeTab === 'all' 
    ? allTests 
    : activeTab === 'self-purchased'
    ? allTests.filter(test => test.badge.type === 'self-purchased' && !test.isCompleted)
    : activeTab === 'invited'
    ? allTests.filter(test => test.badge.type === 'invited' && !test.isCompleted)
    : allTests.filter(test => test.isCompleted);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Tests</h1>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`cursor-pointer p-2 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-white text-[#ED2024] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`cursor-pointer p-2 rounded transition-colors ${
              viewMode === 'list' ? 'bg-white text-[#ED2024] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiList className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'all'
              ? 'border-[#ED2024] text-[#ED2024]'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          All Tests
        </button>
        <button
          onClick={() => setActiveTab('self-purchased')}
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'self-purchased'
              ? 'border-[#ED2024] text-[#ED2024]'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Self-Purchased
        </button>
        <button
          onClick={() => setActiveTab('invited')}
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'invited'
              ? 'border-[#ED2024] text-[#ED2024]'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Invited
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'completed'
              ? 'border-[#ED2024] text-[#ED2024]'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Tests Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
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
                {test.score && (
                  <p className="text-sm text-gray-700">Score: <span className="font-medium text-gray-900">{test.score}</span></p>
                )}
                {test.completedDate && (
                  <p className="text-sm text-gray-700">Completed: <span className="font-medium text-gray-900">{test.completedDate}</span></p>
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
                {test.isCompleted ? (
                  <button
                    onClick={() => router.push('/student/results')}
                    className="cursor-pointer px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                  >
                    View Report
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/test/skill/javascript')}
                    className="cursor-pointer px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                  >
                    Start Test
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
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
                {test.score && (
                  <p className="text-sm text-gray-700">Score: <span className="font-medium text-gray-900">{test.score}</span></p>
                )}
                {test.completedDate && (
                  <p className="text-sm text-gray-700">Completed: <span className="font-medium text-gray-900">{test.completedDate}</span></p>
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
                {test.isCompleted ? (
                  <button
                    onClick={() => router.push('/student/results')}
                    className="cursor-pointer px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                  >
                    View Report
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/test/skill/javascript')}
                    className="cursor-pointer px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                  >
                    Start Test
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tests found in this category.</p>
        </div>
      )}
    </div>
  );
}

'use client';

import Image from 'next/image';
import { FiClock, FiBook } from 'react-icons/fi';

export default function ExamInstructions({ skill, questions, onStartExam, error }) {
  const skillName = skill?.name || 'Skill';
  const duration = skill?.duration || 'N/A';
  const totalQuestions = Array.isArray(questions) ? questions.length : 0;
  const topics = skill?.topics || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Image
              src="/Expertbatch Logo.svg"
              alt="ExpertBatch Logo"
              width={201}
              height={32}
              className="h-8 w-auto"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-[#ED2024] to-[#C91A1A] px-8 py-6 flex flex-row items-center justify-between">
            <h1 className="text-3xl font-bold text-white mb-4">
              {skillName} Test Instructions
            </h1>
            {/* Begin Assessment Button - Top */}
            <div className="flex justify-center ">
              <button
                onClick={onStartExam}
                className="cursor-pointer px-12 py-4 bg-white text-[#ED2024] rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white"
              >
                Begin Assessment
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Time Duration Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6 flex items-start gap-4">
                <div className="bg-blue-500 rounded-full p-3">
                  <FiClock className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-blue-900 mb-1 uppercase tracking-wide">Time Duration</h2>
                  <p className="text-3xl font-bold text-blue-700">{duration} <span className="text-lg font-semibold">minutes</span></p>
                </div>
              </div>

              {/* Total Questions Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-6 flex items-start gap-4">
                <div className="bg-green-500 rounded-full p-3">
                  <FiBook className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-green-900 mb-1 uppercase tracking-wide">Total Questions</h2>
                  <p className="text-3xl font-bold text-green-700">{totalQuestions} <span className="text-lg font-semibold">questions</span></p>
                </div>
              </div>
            </div>

            {/* Topics Section */}
            <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#ED2024] rounded"></span>
                Topics
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                This assessment evaluates your understanding of <strong className="text-[#ED2024]">{skillName}</strong>. Topics may include, but are not limited to:
              </p>
              {topics.length > 0 ? (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <ul className="list-none space-y-2.5">
                    {topics.map((topic, index) => {
                      const topicName = typeof topic === 'string' ? topic : (topic.name || topic.topicName || 'Unknown Topic');
                      return (
                        <li key={topic.id || index} className="flex items-center gap-3 text-gray-800">
                          <span className="text-[#ED2024] text-xl font-bold">●</span>
                          <span className="text-base leading-relaxed mt-[1px]">{topicName}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 italic bg-white rounded-lg p-4 border border-gray-200">No specific topics listed.</p>
              )}
            </div>

            {/* Test Instructions */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#ED2024] rounded"></span>
                Test Instructions
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li className="leading-relaxed">
                    You will have <strong className="text-[#ED2024] font-bold">{duration} minutes</strong> to complete <strong className="text-[#ED2024] font-bold">{totalQuestions} questions</strong>. A timer will be displayed at the top of the test window. The test will end automatically when time is up.
                  </li>
                  <li className="leading-relaxed">
                    Each question is a multiple choice question (MCQ), with one or more correct options. In order to mark your response, select the appropriate option button.
                  </li>
                  <li className="leading-relaxed">
                    There is no negative marking. You are encouraged to attempt all questions. However, you may skip any question if needed.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-red-600">DO NOT</strong> use browser navigation buttons (back or forward), right-click menus, or keyboard shortcuts during the test.
                  </li>
                  <li className="leading-relaxed">
                    If your internet connection is disrupted during the test, log back into your Internset account to continue from where you left off.
                  </li>
                  <li className="leading-relaxed">
                    Do not use calculators, mobile phones, or any other electronic devices during the test.
                  </li>
                </ol>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <span className="text-red-500 font-bold">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Begin Assessment Button - Bottom */}
            <div className="flex justify-center pt-4 border-t border-gray-200 mt-8">
              <button
                onClick={onStartExam}
                className="cursor-pointer px-12 py-4 bg-gradient-to-r from-[#ED2024] to-[#C91A1A] text-white rounded-lg hover:from-[#C91A1A] hover:to-[#A01515] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Begin Assessment
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


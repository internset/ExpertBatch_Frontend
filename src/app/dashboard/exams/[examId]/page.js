'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { examsAPI } from '@/lib/api';
import { RingLoader } from 'react-spinners';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiClock, FiUser, FiBook, FiCamera, FiMonitor } from 'react-icons/fi';
import Image from 'next/image';

export default function ExamDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId;
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (examId) {
      fetchExamDetails();
    }
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await examsAPI.getOne(examId);
      setExam(data);
    } catch (err) {
      setError(err.message || 'Failed to load exam details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '-';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  };

  // Parse proctoring info to separate screencaptures and facecaptures
  const getProctoringImages = () => {
    if (!exam.proctoringInfo || !Array.isArray(exam.proctoringInfo)) {
      return { screencaptures: [], facecaptures: [] };
    }
    
    const screencaptures = exam.proctoringInfo
      .filter(item => item.type === 'screencapture')
      .map(item => ({
        image: item.image,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    
    const facecaptures = exam.proctoringInfo
      .filter(item => item.type === 'facecapture')
      .map(item => ({
        image: item.image,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    
    return { screencaptures, facecaptures };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RingLoader color="#ED2024" size={60} loading={true} />
            <p className="text-[0.9rem] font-medium text-[#666]">Loading exam details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !exam) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="bg-white rounded-lg border border-red-200 p-8 max-w-2xl">
            <div className="text-center">
              <FiXCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-primary-black mb-2">Error Loading Exam</h1>
              <p className="text-gray-600 mb-4">{error || 'Exam not found'}</p>
              <button
                onClick={() => router.push('/dashboard/exams')}
                className="px-6 py-2 bg-[#ED2024] text-white rounded hover:bg-[#C91A1A] transition-colors font-medium"
              >
                Back to Exams
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard/exams')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-black transition-colors"
            >
              <FiArrowLeft className="h-5 w-5" />
              <span className="text-[0.9rem] font-medium">Back to Exams</span>
            </button>
          </div>
          <div>
            <h2 className="text-primary-black text-[1.75rem]/[1.5rem] font-semibold md:text-2xl">
              Exam Details
            </h2>
            <p className="mt-2 text-[0.9rem] font-medium text-[#666] md:text-[1rem]">
              Complete information about this exam submission
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white p-6">
            <h3 className="text-lg font-semibold text-primary-black mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <FiUser className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Candidate Name</p>
                  <p className="text-[0.9rem] font-medium text-primary-black">{exam.candidateName || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiUser className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="text-[0.9rem] font-medium text-primary-black">{exam.userId || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiBook className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Exam Name</p>
                  <p className="text-[0.9rem] font-medium text-primary-black">{exam.examName || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiBook className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Skill ID</p>
                  <p className="text-[0.9rem] font-medium text-primary-black">{exam.skillId || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiClock className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Exam Start Time</p>
                  <p className="text-[0.9rem] font-medium text-primary-black">
                    {formatDate(exam.examStartTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiClock className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Exam End Time</p>
                  <p className="text-[0.9rem] font-medium text-primary-black">
                    {formatDate(exam.examEndTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiClock className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-[0.9rem] font-medium text-primary-black">
                    {calculateDuration(exam.examStartTime, exam.examEndTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Results Card */}
          {exam.overall && (
            <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white p-6">
              <h3 className="text-lg font-semibold text-primary-black mb-4">Overall Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Score</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {exam.overall.score?.toFixed(2) || 0} / {exam.overall.maxScore || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Percentage</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {exam.overall.percentage || 0}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Correct Answers</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {exam.overall.absoluteScore || '0 / 0'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Percentile</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {exam.overall.percentile?.toFixed(1) || 'N/A'}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section Results Card */}
          {exam.section && (
            <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white p-6">
              <h3 className="text-lg font-semibold text-primary-black mb-4">Section Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Section Name</p>
                  <p className="text-lg font-semibold text-primary-black">
                    {exam.section.name || '-'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Score</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {exam.section.score?.toFixed(2) || 0} / {exam.section.maxScore || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Percentage</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {exam.section.percentage || 0}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Percentile</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {exam.section.percentile?.toFixed(1) || 'N/A'}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Topic-wise Breakdown */}
          {exam.topics && exam.topics.length > 0 && (
            <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white p-6">
              <h3 className="text-lg font-semibold text-primary-black mb-4">Topic-wise Breakdown</h3>
              <div className="space-y-3">
                {exam.topics.map((topic, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-primary-black">{topic.topicName || 'Unknown Topic'}</p>
                        <p className="text-sm text-gray-600 mt-1">Topic ID: {topic.topicId}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded">
                        {topic.absoluteScore || '0 / 0'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-600">Score</p>
                        <p className="text-sm font-semibold text-primary-black">
                          {topic.score?.toFixed(2) || 0} / {topic.maxScore || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Percentage</p>
                        <p className="text-sm font-semibold text-primary-black">
                          {topic.percentage || 0}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Percentile</p>
                        <p className="text-sm font-semibold text-primary-black">
                          {topic.percentile?.toFixed(1) || 'N/A'}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proctoring Images - Side by Side */}
          {(() => {
            const { screencaptures, facecaptures } = getProctoringImages();
            const hasProctoringImages = screencaptures.length > 0 || facecaptures.length > 0;
            
            if (!hasProctoringImages) {
              return (
                <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white p-6">
                  <p className="text-gray-600 text-center">No proctoring images available for this exam.</p>
                </div>
              );
            }

            const maxCount = Math.max(screencaptures.length, facecaptures.length);

            return (
              <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white p-6">
                <h3 className="text-lg font-semibold text-primary-black mb-4">Proctoring Images</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Screenshots - Left Side */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <FiMonitor className="h-5 w-5 text-gray-600" />
                      <h4 className="text-md font-semibold text-primary-black">
                        Screenshots ({screencaptures.length})
                      </h4>
                    </div>
                    {screencaptures.length > 0 ? (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {screencaptures.map((screenshot, index) => {
                          const timestamp = screenshot.createdAt || screenshot.updatedAt;
                          const imageDate = timestamp ? formatDate(timestamp) : 'N/A';
                          return (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                              <img
                                src={screenshot.image}
                                alt={`Screenshot ${index + 1}`}
                                className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition-opacity bg-gray-50"
                                onClick={() => window.open(screenshot.image, '_blank')}
                              />
                              <div className="p-2 bg-gray-50 text-center border-t border-gray-200">
                                <p className="text-xs text-gray-600 font-medium">Screenshot {index + 1}</p>
                                <p className="text-xs text-gray-500 mt-1">Time: {imageDate}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-8 text-center bg-gray-50">
                        <FiMonitor className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No screenshots available</p>
                      </div>
                    )}
                  </div>

                  {/* Face Captures - Right Side */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <FiCamera className="h-5 w-5 text-gray-600" />
                      <h4 className="text-md font-semibold text-primary-black">
                        Face Captures ({facecaptures.length})
                      </h4>
                    </div>
                    {facecaptures.length > 0 ? (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {facecaptures.map((capture, index) => {
                          const timestamp = capture.createdAt || capture.updatedAt;
                          const imageDate = timestamp ? formatDate(timestamp) : 'N/A';
                          return (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                              <img
                                src={capture.image}
                                alt={`Face capture ${index + 1}`}
                                className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition-opacity bg-gray-50"
                                onClick={() => window.open(capture.image, '_blank')}
                              />
                              <div className="p-2 bg-gray-50 text-center border-t border-gray-200">
                                <p className="text-xs text-gray-600 font-medium">Face Capture {index + 1}</p>
                                <p className="text-xs text-gray-500 mt-1">Time: {imageDate}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-8 text-center bg-gray-50">
                        <FiCamera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No face captures available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </DashboardLayout>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { examsAPI, skillsAPI } from '@/lib/api';
import { RingLoader } from 'react-spinners';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import Image from 'next/image';

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.skillId;
  const { user, logout } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [skill, setSkill] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Redirect admin users
    if (user && (user.role === 'superadmin' || user.role === 'admin')) {
      router.push('/dashboard');
      return;
    }

    fetchExamData();
  }, [user, skillId, router]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      const [questionsData, skillData] = await Promise.all([
        examsAPI.getQuestions(skillId),
        skillsAPI.getOne(skillId).catch(() => null),
      ]);
      setQuestions(questionsData || []);
      setSkill(skillData);
      
      // Initialize answers object
      const initialAnswers = {};
      (questionsData || []).forEach((q) => {
        initialAnswers[q.id] = [];
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError('Failed to load exam. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setStartTime(new Date());
  };

  const handleOptionChange = (questionId, optionId, isMultiSelect) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      
      if (isMultiSelect) {
        // Toggle option for multi-select
        if (currentAnswers.includes(optionId)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter((id) => id !== optionId),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, optionId],
          };
        }
      } else {
        // Single select - replace with new option
        return {
          ...prev,
          [questionId]: [optionId],
        };
      }
    });
  };

  const handleSubmitExam = async () => {
    if (!examStarted) return;

    const answeredQuestions = Object.keys(answers).filter(
      (qId) => answers[qId] && answers[qId].length > 0
    );

    if (answeredQuestions.length === 0) {
      setError('Please answer at least one question before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const submitData = {
        skillId: skillId,
        userId: user?.id,
        candidateName: `${user?.firstName} ${user?.lastName}`,
        examName: skill?.name || 'Exam',
        examStartTime: startTime?.toISOString(),
        answers: Object.keys(answers).map((questionId) => ({
          questionId: questionId,
          selectedOptionIds: answers[questionId] || [],
        })),
      };

      const resultData = await examsAPI.submit(submitData);
      setResult(resultData);
      setExamSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit exam. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (examStarted && !examSubmitted) {
      if (confirm('Are you sure you want to leave? Your progress will be lost.')) {
        router.push('/exam');
      }
    } else {
      router.push('/exam');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <RingLoader color="#ED2024" size={60} loading={true} />
          <p className="text-[0.9rem] font-medium text-[#666]">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <FiArrowLeft className="h-5 w-5" />
              </button>
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-primary-black mb-4">
              {skill?.name || 'Exam'} - Instructions
            </h1>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Exam Details:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Total Questions: {questions.length}</li>
                  <li>Skill: {skill?.name || 'N/A'}</li>
                  <li>Some questions may have multiple correct answers</li>
                  <li>Read each question carefully before answering</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Select all correct answers for each question</li>
                  <li>You can change your answers before submitting</li>
                  <li>Once submitted, you cannot change your answers</li>
                  <li>Make sure you have answered all questions</li>
                </ul>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleStartExam}
                className="px-6 py-2 bg-[#ED2024] text-white rounded hover:bg-[#C91A1A] transition-colors font-medium"
              >
                Start Exam
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (examSubmitted && result) {
    return (
      <div className="min-h-screen bg-gray-50">
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-primary-black mb-2">Exam Submitted Successfully!</h1>
              <p className="text-gray-600">Your exam has been submitted and graded.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Your Results:</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Score</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {result.totalScore?.toFixed(2) || 0} / {result.maxScore || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Percentage</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {result.maxScore
                      ? ((result.totalScore / result.maxScore) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {result.totalCorrectCount || 0} / {result.totalQuestions || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Percentile</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {result.percentile?.toFixed(1) || 'N/A'}%
                  </p>
                </div>
              </div>
            </div>

            {result.topicBreakdown && result.topicBreakdown.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Topic-wise Breakdown:</h3>
                <div className="space-y-3">
                  {result.topicBreakdown.map((topic, index) => (
                    <div key={index} className="bg-gray-50 rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{topic.topicName}</span>
                        <span className="text-sm text-gray-600">
                          {topic.correctCount} / {topic.totalQuestions} correct
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Score: {topic.score?.toFixed(2) || 0} / {topic.maxScore || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => router.push('/exam')}
              className="w-full px-6 py-3 bg-[#ED2024] text-white rounded hover:bg-[#C91A1A] transition-colors font-medium"
            >
              Back to Exam Portal
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <Image
                src="/Expertbatch Logo.svg"
                alt="ExpertBatch Logo"
                width={201}
                height={32}
                className="h-8 w-auto"
              />
              <h1 className="text-lg font-semibold text-primary-black">
                {skill?.name || 'Exam'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Question {Object.keys(answers).filter((qId) => answers[qId]?.length > 0).length} / {questions.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-black">
                  Question {index + 1}
                </h3>
                {question.multiSelect && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Multiple Answers
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-4">{question.questionText}</p>

              {question.difficultyLevel && (
                <p className="text-sm text-gray-500 mb-4">
                  Difficulty: <span className="capitalize">{question.difficultyLevel}</span>
                </p>
              )}

              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = answers[question.id]?.includes(option.id) || false;
                  return (
                    <label
                      key={option.id}
                      className={`flex items-start gap-3 p-3 rounded border-2 cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-[#ED2024] bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type={question.multiSelect ? 'checkbox' : 'radio'}
                        name={`question-${question.id}`}
                        checked={isSelected}
                        onChange={() =>
                          handleOptionChange(question.id, option.id, question.multiSelect)
                        }
                        className="mt-1"
                      />
                      <span className="flex-1 text-gray-700">{option.text}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 sticky bottom-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Answered: {Object.keys(answers).filter((qId) => answers[qId]?.length > 0).length} / {questions.length}
            </div>
            <button
              onClick={handleSubmitExam}
              disabled={submitting}
              className="px-8 py-3 bg-[#ED2024] text-white rounded hover:bg-[#C91A1A] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}



'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { examsAPI } from '@/lib/api';
import { RingLoader } from 'react-spinners';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiClock, FiBook } from 'react-icons/fi';
import Image from 'next/image';

export default function PublicExamPage() {
  const router = useRouter();
  const params = useParams();
  const skillName = params.skillName;
  const [questions, setQuestions] = useState([]);
  const [skill, setSkill] = useState(null);
  const [skillId, setSkillId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchExamData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Step 1: Call the API with skillName to get skill object
      const decodedSkillName = decodeURIComponent(skillName);
      console.log('Step 1: Fetching skill data for:', decodedSkillName);
      const skillData = await examsAPI.getQuestionsBySkillName(decodedSkillName, true); // skipAuth = true
      console.log('Skill data received:', skillData);
      
      // Validate skill data
      if (!skillData || !skillData.id) {
        throw new Error(`Skill "${decodedSkillName}" not found. Please check the skill name and try again.`);
      }
      
      // Set skill info
      setSkill(skillData);
      setSkillId(skillData.id);
      
      // Step 2: Call the API with skillId to get questions
      console.log('Step 2: Fetching questions for skillId:', skillData.id);
      const questionsData = await examsAPI.getQuestions(skillData.id, true); // skipAuth = true
      console.log('Questions data received:', questionsData);
      
      // Validate and set questions - ensure it's always an array
      if (Array.isArray(questionsData)) {
        setQuestions(questionsData);
      } else {
        console.warn('Questions data is not an array:', questionsData);
        setQuestions([]);
      }
      
      // Initialize answers object
      const questionsList = Array.isArray(questionsData) ? questionsData : [];
      const initialAnswers = {};
      questionsList.forEach((q) => {
        if (q && q.id) {
          initialAnswers[q.id] = [];
        }
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError(err.message || 'Failed to load exam. Please try again.');
      console.error('Error fetching exam data:', err);
      // Ensure questions is always an array even on error
      setQuestions([]);
      setSkill(null);
      setSkillId(null);
    } finally {
      setLoading(false);
    }
  }, [skillName]);

  useEffect(() => {
    if (skillName && mounted) {
      fetchExamData();
    }
  }, [skillName, mounted, fetchExamData]);

  const handleStartExam = () => {
    if (!candidateName.trim()) {
      setError('Please enter your name to start the exam.');
      return;
    }
    setExamStarted(true);
    setStartTime(new Date());
    setError('');
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

    if (!skillId && Array.isArray(questions) && questions.length > 0 && questions[0].skillId) {
      setSkillId(questions[0].skillId);
    }

    if (!skillId) {
      setError('Unable to submit exam. Skill information is missing.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const submitData = {
        skillId: skillId,
        userId: 'public-user-id', // Hardcoded userId for public exams
        candidateName: candidateName.trim(),
        examName: skill?.name || decodeURIComponent(skillName) || 'Exam',
        examStartTime: startTime?.toISOString(),
        answers: Object.keys(answers).map((questionId) => ({
          questionId: questionId,
          selectedOptionIds: answers[questionId] || [],
        })),
      };

      const resultData = await examsAPI.submit(submitData, true); // skipAuth = true
      setResult(resultData);
      setExamSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit exam. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <RingLoader color="#ED2024" size={60} loading={true} />
          <p className="text-[0.9rem] font-medium text-[#666]">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error && !skill) {
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
          <div className="bg-white rounded-lg border border-red-200 p-8">
            <div className="text-center">
              <FiXCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-primary-black mb-2">Error Loading Exam</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#ED2024] text-white rounded hover:bg-[#C91A1A] transition-colors font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!examStarted) {
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
            <h1 className="text-2xl font-bold text-primary-black mb-4">
              {skill?.name || 'Exam'} - Instructions
            </h1>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Exam Details:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Total Questions: {Array.isArray(questions) ? questions.length : 0}</li>
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
                  <li>This is a public exam - no login required</li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ED2024] focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleStartExam}
                disabled={!candidateName.trim()}
                className="px-6 py-2 bg-[#ED2024] text-white rounded hover:bg-[#C91A1A] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {result.overall?.score?.toFixed(2) || 0} / {result.overall?.maxScore || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Percentage</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {result.overall?.percentage || 0}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {result.overall?.absoluteScore || '0 / 0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Percentile</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {result.overall?.percentile?.toFixed(1) || 'N/A'}%
                  </p>
                </div>
              </div>
            </div>

            {result.topics && result.topics.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Topic-wise Breakdown:</h3>
                <div className="space-y-3">
                  {result.topics.map((topic, index) => (
                    <div key={index} className="bg-gray-50 rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{topic.topicName}</span>
                        <span className="text-sm text-gray-600">
                          {topic.absoluteScore}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Score: {topic.score?.toFixed(2) || 0} / {topic.maxScore || 0} ({topic.percentage || 0}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Thank you for taking the exam!</p>
            </div>
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
                Question {Object.keys(answers).filter((qId) => answers[qId]?.length > 0).length} / {Array.isArray(questions) ? questions.length : 0}
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
          {Array.isArray(questions) && questions.length > 0 ? (
            questions.map((question, index) => (
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
            ))
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <FiBook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No questions available</p>
              <p className="text-sm text-gray-500">Please check if the skill name is correct.</p>
            </div>
          )}
        </div>

        {Array.isArray(questions) && questions.length > 0 && (
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
        )}
      </main>
    </div>
  );
}

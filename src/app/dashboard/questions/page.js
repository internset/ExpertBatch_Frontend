'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { questionsAPI, skillsAPI, topicsAPI } from '@/lib/api';
import { getButtonClasses, getInputClasses } from '@/design-system/admin-design-system';
import { FiRefreshCw, FiPlus } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [selectedSkill, selectedTopic]);

  const fetchSkills = async () => {
    try {
      const data = await skillsAPI.getAll();
      setSkills(data || []);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    }
  };

  const fetchTopics = async (skillId) => {
    try {
      const data = await topicsAPI.getBySkill(skillId);
      const topicsList = Array.isArray(data) ? data : (data?.data || data?.topics || []);
      setTopics(topicsList);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
    }
  };

  const fetchQuestions = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const data = await questionsAPI.getAll(selectedSkill || null, selectedTopic || null);
      setQuestions(data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch questions');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCreate = () => {
    router.push('/dashboard/questions/create');
  };

  const handleEdit = (question) => {
    router.push(`/dashboard/questions/${question.id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await questionsAPI.delete(id);
      fetchQuestions();
    } catch (err) {
      setError(err.message || 'Failed to delete question');
    }
  };

  return (
    <DashboardLayout>
      <div className="">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-primary-black text-[1.75rem]/[1.5rem] font-semibold md:text-2xl">
              Questions Management
            </h2>
            <p className="mt-2 text-[0.9rem] font-medium text-[#666] md:text-[1rem]">
              Create and manage questions for exams
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchQuestions}
              disabled={isRefreshing}
              className={`flex items-center gap-2 rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white px-4 py-2 text-[0.9rem] font-medium transition-colors cursor-pointer ${
                isRefreshing
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                  : "text-primary-black hover:bg-[rgba(0,0,0,0.02)] hover:border-[#ED2024]"
              }`}
              title="Refresh questions list"
            >
              <FiRefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button onClick={handleCreate} className={getButtonClasses('primary', false)}>
              <FiPlus className="h-4 w-4" />
              Add Question
            </button>
          </div>
        </div>

        <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white">
          <div className="p-6">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-black">
                  Filter by Skill
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => {
                    setSelectedSkill(e.target.value);
                    setSelectedTopic('');
                    if (e.target.value) {
                      fetchTopics(e.target.value);
                    } else {
                      setTopics([]);
                    }
                  }}
                  className={getInputClasses(false)}
                >
                  <option value="">All Skills</option>
                  {skills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-black">
                  Filter by Topic
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className={getInputClasses(false)}
                  disabled={!selectedSkill}
                >
                  <option value="">All Topics</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <RingLoader color="#ED2024" size={60} loading={true} />
                  <p className="text-[0.9rem] font-medium text-[#666]">Loading questions...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-[0.9rem] font-medium text-red-500">{error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No questions found</div>
                ) : (
                  questions.map((question) => (
                    <div
                      key={question.id}
                      className="border border-[rgba(0,0,0,0.125)] rounded p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-primary-black">{question.questionText}</p>
                          <div className="mt-2 flex gap-2">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {question.difficultyLevel}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              Score: {question.score}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(question)}
                            className={getButtonClasses('secondary', false)}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(question.id)}
                            className={getButtonClasses('danger', false)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        {question.options?.map((option, idx) => (
                          <div
                            key={idx}
                            className={`text-sm ${
                              option.isCorrect ? 'text-green-600 font-medium' : 'text-gray-600'
                            }`}
                          >
                            {idx + 1}. {option.text} {option.isCorrect && '✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

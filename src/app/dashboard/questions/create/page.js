'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { questionsAPI, skillsAPI, topicsAPI } from '@/lib/api';
import { getButtonClasses, getInputClasses } from '@/design-system/admin-design-system';
import { FiArrowLeft } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';

export default function CreateQuestionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionId = searchParams.get('id'); // For editing existing question
  const isEditMode = !!questionId;

  const [skills, setSkills] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    skillId: '',
    topicId: '',
    questionText: '',
    difficultyLevel: 'MEDIUM',
    score: 10,
    correctOptionsCount: 1,
    options: [
      { text: '', isCorrect: false, score: 0 },
      { text: '', isCorrect: false, score: 0 },
      { text: '', isCorrect: false, score: 0 },
      { text: '', isCorrect: false, score: 0 },
    ],
  });

  useEffect(() => {
    fetchSkills();
    if (isEditMode && questionId) {
      fetchQuestion(questionId);
    } else {
      setLoading(false);
    }
  }, [questionId, isEditMode]);

  useEffect(() => {
    if (formData.skillId) {
      fetchTopics(formData.skillId);
    } else {
      setTopics([]);
    }
  }, [formData.skillId]);

  const fetchSkills = async () => {
    try {
      const data = await skillsAPI.getAll();
      setSkills(data || []);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
      setError('Failed to load skills');
    }
  };

  const fetchTopics = async (skillId) => {
    try {
      const data = await topicsAPI.getBySkill(skillId);
      const topicsList = Array.isArray(data) ? data : (data?.data || data?.topics || []);
      setTopics(topicsList);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
      setTopics([]);
    }
  };

  const fetchQuestion = async (id) => {
    try {
      setLoading(true);
      // Note: You may need to add a getOne method to questionsAPI
      const data = await questionsAPI.getAll();
      const question = Array.isArray(data) ? data.find(q => q.id === id) : null;
      
      if (question) {
        setFormData({
          skillId: question.skillId,
          topicId: question.topicId,
          questionText: question.questionText,
          difficultyLevel: question.difficultyLevel || 'MEDIUM',
          score: question.score,
          correctOptionsCount: question.correctOptionsCount || 1,
          options: question.options || [
            { text: '', isCorrect: false, score: 0 },
            { text: '', isCorrect: false, score: 0 },
            { text: '', isCorrect: false, score: 0 },
            { text: '', isCorrect: false, score: 0 },
          ],
        });
      } else {
        setError('Question not found');
      }
    } catch (err) {
      console.error('Failed to fetch question:', err);
      setError('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (formData.options.length < 8) {
      setFormData({
        ...formData,
        options: [...formData.options, { text: '', isCorrect: false, score: 0 }],
      });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 4) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEditMode) {
        await questionsAPI.update(questionId, formData);
      } else {
        await questionsAPI.create(formData);
      }
      router.push('/dashboard/questions');
    } catch (err) {
      setError(err.message || 'Failed to save question');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RingLoader color="#ED2024" size={60} loading={true} />
            <p className="text-[0.9rem] font-medium text-[#666]">Loading...</p>
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
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white px-2 py-2 text-[0.9rem] font-medium transition-colors cursor-pointer text-primary-black hover:bg-[rgba(0,0,0,0.02)] hover:border-[#ED2024]"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-primary-black text-[1.75rem]/[1.5rem] font-semibold md:text-2xl">
                {isEditMode ? 'Edit Question' : 'Create Question'}
              </h2>
              <p className="mt-2 text-[0.9rem] font-medium text-[#666] md:text-[1rem]">
                {isEditMode ? 'Update question details' : 'Add a new question to the system'}
              </p>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className={getButtonClasses('secondary', false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="question-form"
              disabled={saving}
              className={getButtonClasses('primary', saving)}
            >
              {saving ? 'Saving...' : isEditMode ? 'Update Question' : 'Create Question'}
            </button>
          </div>
        </div>

        <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white">
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form id="question-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Skill and Topic Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-black">
                    Skill <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.skillId}
                    onChange={(e) => {
                      setFormData({ ...formData, skillId: e.target.value, topicId: '' });
                    }}
                    className={getInputClasses(false)}
                    required
                    disabled={isEditMode}
                  >
                    <option value="">Select a skill</option>
                    {skills.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-black">
                    Topic <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.topicId}
                    onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                    className={getInputClasses(false)}
                    required
                    disabled={!formData.skillId || isEditMode}
                  >
                    <option value="">Select a topic</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                  {!formData.skillId && (
                    <p className="mt-1 text-xs text-gray-500">Please select a skill first</p>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-black">
                  Question Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className={getInputClasses(false)}
                  rows="4"
                  placeholder="Enter your question here..."
                  required
                />
              </div>

              {/* Difficulty, Score, and Correct Options Count */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-black">
                    Difficulty Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.difficultyLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, difficultyLevel: e.target.value })
                    }
                    className={getInputClasses(false)}
                    required
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-black">
                    Total Score <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.score}
                    onChange={(e) =>
                      setFormData({ ...formData, score: parseInt(e.target.value) || 10 })
                    }
                    className={getInputClasses(false)}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-black">
                    Number of Correct Answers <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.correctOptionsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, correctOptionsCount: parseInt(e.target.value) || 1 })
                    }
                    className={getInputClasses(false)}
                    min="1"
                    max="3"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">How many options should be marked as correct? (1-3)</p>
                </div>
              </div>

              {/* Options */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-primary-black">
                    Options <span className="text-red-500">*</span>
                  </label>
                  {formData.options.length < 8 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-sm text-[#ED2024] hover:text-[#C91A1A] hover:underline cursor-pointer font-medium"
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {formData.options.map((option, index) => (
                    <div key={index} className="border border-[rgba(0,0,0,0.125)] rounded p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-primary-black">Option {index + 1}</span>
                        {formData.options.length > 4 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="ml-auto text-red-600 hover:text-red-800 cursor-pointer text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-600">
                            Option Text <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                            className={getInputClasses(false)}
                            placeholder={`Enter option ${index + 1} text`}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">
                              Score
                            </label>
                            <input
                              type="number"
                              value={option.score}
                              onChange={(e) =>
                                handleOptionChange(index, 'score', parseInt(e.target.value) || 0)
                              }
                              className={getInputClasses(false)}
                              placeholder="0"
                              min="0"
                            />
                          </div>
                          <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer w-full">
                              <input
                                type="checkbox"
                                checked={option.isCorrect}
                                onChange={(e) =>
                                  handleOptionChange(index, 'isCorrect', e.target.checked)
                                }
                                className="w-4 h-4 text-[#ED2024] border-gray-300 rounded focus:ring-[#ED2024]"
                              />
                              <span className="text-xs font-medium text-primary-black">Correct</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


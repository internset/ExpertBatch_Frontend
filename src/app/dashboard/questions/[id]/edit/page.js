'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { questionsAPI, skillsAPI, topicsAPI } from '@/lib/api';
import { getButtonClasses, getInputClasses } from '@/design-system/admin-design-system';
import { FiArrowLeft } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.id;
  
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
    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  useEffect(() => {
    if (formData.skillId) {
      fetchTopics(formData.skillId);
    }
  }, [formData.skillId]);

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
      setTopics([]);
    }
  };

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const data = await questionsAPI.getOne(questionId);
      setFormData({
        skillId: data.skillId,
        topicId: data.topicId,
        questionText: data.questionText,
        difficultyLevel: data.difficultyLevel || 'MEDIUM',
        score: data.score,
        correctOptionsCount: data.correctOptionsCount || 1,
        options: data.options || [
          { text: '', isCorrect: false, score: 0 },
          { text: '', isCorrect: false, score: 0 },
          { text: '', isCorrect: false, score: 0 },
          { text: '', isCorrect: false, score: 0 },
        ],
      });
    } catch (err) {
      setError('Failed to load question');
      console.error(err);
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
      await questionsAPI.update(questionId, formData);
      router.push('/dashboard/questions');
    } catch (err) {
      setError(err.message || 'Failed to update question');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RingLoader color="#ED2024" size={60} loading={true} />
            <p className="text-[0.9rem] font-medium text-[#666]">Loading question...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[87rem] px-3 md:px-10 md:pt-12 min-[87rem]:px-3">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-primary-black text-[1.75rem]/[1.5rem] font-semibold md:text-2xl">
              Edit Question
            </h2>
            <p className="mt-2 text-[0.9rem] font-medium text-[#666] md:text-[1rem]">
              Update question details and options
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/questions')}
            className={`flex items-center gap-2 rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white px-4 py-2 text-[0.9rem] font-medium transition-colors cursor-pointer text-primary-black hover:bg-[rgba(0,0,0,0.02)] hover:border-[#ED2024]`}
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Questions
          </button>
        </div>

        <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white">
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-black">
                  Question Text
                </label>
                <textarea
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className={getInputClasses(false)}
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-black">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficultyLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, difficultyLevel: e.target.value })
                    }
                    className={getInputClasses(false)}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-black">
                    Score
                  </label>
                  <input
                    type="number"
                    value={formData.score}
                    onChange={(e) =>
                      setFormData({ ...formData, score: parseInt(e.target.value) })
                    }
                    className={getInputClasses(false)}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-primary-black">
                  Correct Options Count
                </label>
                <input
                  type="number"
                  value={formData.correctOptionsCount}
                  onChange={(e) =>
                    setFormData({ ...formData, correctOptionsCount: parseInt(e.target.value) })
                  }
                  className={getInputClasses(false)}
                  min="1"
                  max="3"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-lg font-semibold text-primary-black">Options</label>
                  {formData.options.length < 8 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-sm text-[#ED2024] hover:underline cursor-pointer font-medium"
                    >
                      + Add Option
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {formData.options.map((option, index) => (
                    <div key={index} className="border border-[rgba(0,0,0,0.125)] rounded p-4">
                      <div className="mb-2">
                        <label className="block text-sm font-medium mb-2 text-primary-black">
                          Option {index + 1}
                        </label>
                        <textarea
                          value={option.text}
                          onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                          className={getInputClasses(false)}
                          rows="2"
                          placeholder={`Enter option ${index + 1} text`}
                          required
                        />
                      </div>
                      <div className="flex gap-4 items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) =>
                              handleOptionChange(index, 'isCorrect', e.target.checked)
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium">Mark as Correct</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">Score:</label>
                          <input
                            type="number"
                            value={option.score}
                            onChange={(e) =>
                              handleOptionChange(index, 'score', parseInt(e.target.value) || 0)
                            }
                            className={`w-24 ${getInputClasses(false)}`}
                            min="0"
                          />
                        </div>
                        {formData.options.length > 4 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="ml-auto text-red-600 hover:text-red-800 cursor-pointer font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t border-[rgba(0,0,0,0.125)]">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/questions')}
                  className={getButtonClasses('secondary', false)}
                >
                  Cancel
                </button>
                <button type="submit" className={getButtonClasses('primary', saving)} disabled={saving}>
                  {saving ? 'Updating...' : 'Update Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


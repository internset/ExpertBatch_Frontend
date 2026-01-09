'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { topicsAPI, skillsAPI } from '@/lib/api';
import { getButtonClasses, getInputClasses } from '@/design-system/admin-design-system';
import { FiRefreshCw, FiPlus } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [formData, setFormData] = useState({ name: '', skillId: '' });
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (skills.length > 0) {
      if (selectedSkill) {
        fetchTopics(selectedSkill);
      } else {
        fetchAllTopics();
      }
    }
  }, [selectedSkill, skills]);

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
      setIsRefreshing(true);
      setLoading(true);
      const data = await topicsAPI.getBySkill(skillId);
      setTopics(data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch topics');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchAllTopics = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const allTopics = [];
      for (const skill of skills) {
        try {
          const skillTopics = await topicsAPI.getBySkill(skill.id);
          allTopics.push(...(skillTopics || []));
        } catch (e) {
          // Skip if error
        }
      }
      setTopics(allTopics);
      setError('');
    } catch (err) {
      setError('Failed to fetch topics');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCreate = () => {
    setEditingTopic(null);
    setFormData({ name: '', skillId: skills[0]?.id || '' });
    setShowModal(true);
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({ name: topic.name, skillId: topic.skillId });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTopic) {
        await topicsAPI.update(editingTopic.id, { name: formData.name });
      } else {
        await topicsAPI.create(formData);
      }
      setShowModal(false);
      if (selectedSkill) {
        fetchTopics(selectedSkill);
      } else {
        fetchAllTopics();
      }
    } catch (err) {
      setError(err.message || 'Failed to save topic');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;
    try {
      await topicsAPI.delete(id);
      if (selectedSkill) {
        fetchTopics(selectedSkill);
      } else {
        fetchAllTopics();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete topic');
    }
  };

  return (
    <DashboardLayout>
      <div className="">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-primary-black text-[1.75rem]/[1.5rem] font-semibold md:text-2xl">
              Topics Management
            </h2>
            <p className="mt-2 text-[0.9rem] font-medium text-[#666] md:text-[1rem]">
              Manage topics for each skill in the platform
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                if (selectedSkill) {
                  fetchTopics(selectedSkill);
                } else {
                  fetchAllTopics();
                }
              }}
              disabled={isRefreshing}
              className={`flex items-center gap-2 rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white px-4 py-2 text-[0.9rem] font-medium transition-colors ${
                isRefreshing
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                  : "text-primary-black hover:bg-[rgba(0,0,0,0.02)] hover:border-[#ED2024]"
              }`}
              title="Refresh topics list"
            >
              <FiRefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button onClick={handleCreate} className={getButtonClasses('primary', false)}>
              <FiPlus className="h-4 w-4" />
              Add Topic
            </button>
          </div>
        </div>

        <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white">
          <div className="p-0">
            <div className="mb-4 p-4">
              <label className="block text-sm font-medium mb-2 text-primary-black">
                Filter by Skill
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-1  rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <RingLoader color="#ED2024" size={60} loading={true} />
                  <p className="text-[0.9rem] font-medium text-[#666]">Loading topics...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-[0.9rem] font-medium text-red-500">{error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[rgba(0,0,0,0.125)]">
                  <thead className="bg-[rgba(0,0,0,0.02)]">
                    <tr>
                      <th className="px-6 py-1 text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Name
                      </th>
                      <th className="px-6 py-1  text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Skill
                      </th>
                      <th className="px-6 py-1  text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(0,0,0,0.125)] bg-white">
                    {topics.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                          No topics found
                        </td>
                      </tr>
                    ) : (
                      topics.map((topic) => {
                        const skill = skills.find((s) => s.id === topic.skillId);
                        return (
                          <tr key={topic.id} className="hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                            <td className="whitespace-nowrap px-6 py-2 text-[0.9rem] font-medium text-primary-black">
                              {topic.name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-2 text-[0.9rem] text-primary-black">
                              {skill?.name || '-'}
                            </td>
                            <td className="whitespace-nowrap px-6 py-2 text-[0.9rem]">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(topic)}
                                  className={getButtonClasses('secondary', false)}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(topic.id)}
                                  className={getButtonClasses('danger', false)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-primary-black">
                {editingTopic ? 'Edit Topic' : 'Create Topic'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-black">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={getInputClasses(false)}
                    required
                  />
                </div>
                {!editingTopic && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary-black">
                      Skill
                    </label>
                    <select
                      value={formData.skillId}
                      onChange={(e) => setFormData({ ...formData, skillId: e.target.value })}
                      className={getInputClasses(false)}
                      required
                    >
                      <option value="">Select a skill</option>
                      {skills.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                          {skill.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={getButtonClasses('secondary', false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={getButtonClasses('primary', false)}>
                    {editingTopic ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


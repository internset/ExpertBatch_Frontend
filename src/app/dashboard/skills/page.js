'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { skillsAPI } from '@/lib/api';
import { getButtonClasses, getInputClasses } from '@/design-system/admin-design-system';
import { FiRefreshCw, FiPlus } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const data = await skillsAPI.getAll();
      setSkills(data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch skills');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCreate = () => {
    setEditingSkill(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({ name: skill.name, description: skill.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await skillsAPI.update(editingSkill.id, formData);
      } else {
        await skillsAPI.create(formData);
      }
      setShowModal(false);
      fetchSkills();
    } catch (err) {
      setError(err.message || 'Failed to save skill');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await skillsAPI.delete(id);
      fetchSkills();
    } catch (err) {
      setError(err.message || 'Failed to delete skill');
    }
  };

  return (
    <DashboardLayout>
      <div className="">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-primary-black text-[1.75rem]/[1.5rem] font-semibold md:text-2xl">
              Skills Management
            </h2>
            <p className="mt-2 text-[0.9rem] font-medium text-[#666] md:text-[1rem]">
              Manage and organize skills in the platform
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchSkills}
              disabled={isRefreshing}
              className={`flex items-center gap-2 rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white px-4 py-2 text-[0.9rem] font-medium transition-colors ${
                isRefreshing
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                  : "text-primary-black hover:bg-[rgba(0,0,0,0.02)] hover:border-[#ED2024]"
              }`}
              title="Refresh skills list"
            >
              <FiRefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button onClick={handleCreate} className={getButtonClasses('primary', false)}>
              <FiPlus className="h-4 w-4" />
              Add Skill
            </button>
          </div>
        </div>

        <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white">
          <div className="">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <RingLoader color="#ED2024" size={60} loading={true} />
                  <p className="text-[0.9rem] font-medium text-[#666]">Loading skills...</p>
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
                      <th className="px-6 py-3 text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(0,0,0,0.125)] bg-white">
                    {skills.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                          No skills found
                        </td>
                      </tr>
                    ) : (
                      skills.map((skill) => (
                        <tr key={skill.id} className="hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                          <td className="whitespace-nowrap px-6 py-4 text-[0.9rem] font-medium text-primary-black">
                            {skill.name}
                          </td>
                          <td className="px-6 py-4 text-[0.9rem] text-primary-black">
                            {skill.description || '-'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-[0.9rem]">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(skill)}
                                className={getButtonClasses('secondary', false)}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(skill.id)}
                                className={getButtonClasses('danger', false)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
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
                {editingSkill ? 'Edit Skill' : 'Create Skill'}
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
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary-black">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={getInputClasses(false)}
                    rows="3"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={getButtonClasses('secondary', false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={getButtonClasses('primary', false)}>
                    {editingSkill ? 'Update' : 'Create'}
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


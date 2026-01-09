'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { examsAPI, skillsAPI } from '@/lib/api';
import { FiRefreshCw } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      let data;
      if (selectedFilter === 'all') {
        data = await examsAPI.getAll();
      } else if (selectedFilter === 'user' && filterValue) {
        data = await examsAPI.getByUser(filterValue);
      } else if (selectedFilter === 'skill' && filterValue) {
        data = await examsAPI.getBySkill(filterValue);
      } else {
        data = await examsAPI.getAll();
      }
      setExams(data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch exams');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [selectedFilter, filterValue]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-primary-black text-[1.75rem]/[1.5rem] font-semibold md:text-2xl">
              Exams Management
            </h2>
            <p className="mt-2 text-[0.9rem] font-medium text-[#666] md:text-[1rem]">
              View and manage exam results and submissions
            </p>
          </div>
          
          {/* Refresh Button */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchExams}
              disabled={isRefreshing}
              className={`flex items-center gap-2 rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white px-4 py-2 text-[0.9rem] font-medium transition-colors ${
                isRefreshing
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                  : "cursor-pointer text-primary-black hover:bg-[rgba(0,0,0,0.02)] hover:border-[#ED2024]"
              }`}
              title="Refresh exams list"
            >
              <FiRefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white">
          <div className="">
            <div className="mb-4 flex gap-4 p-4">
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setFilterValue('');
                }}
                className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white px-4 py-2 text-[0.9rem]"
              >
                <option value="all">All Exams</option>
                <option value="user">By User</option>
                <option value="skill">By Skill</option>
              </select>
              {selectedFilter !== 'all' && (
                <input
                  type="text"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder={`Enter ${selectedFilter} ID`}
                  className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white px-4 py-2 text-[0.9rem]"
                />
              )}
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
                  <p className="text-[0.9rem] font-medium text-[#666]">Loading exams...</p>
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
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Skill ID
                      </th>
                      <th className="px-6 py-3 text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Total Score
                      </th>
                      <th className="px-6 py-3 text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Submitted At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(0,0,0,0.125)] bg-white">
                    {exams.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No exams found
                        </td>
                      </tr>
                    ) : (
                      exams.map((exam) => (
                        <tr key={exam.id} className="hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                          <td className="whitespace-nowrap px-6 py-4 text-[0.9rem] font-medium text-primary-black">
                            {exam.userId}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-[0.9rem] text-primary-black">
                            {exam.skillId}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-[0.9rem] font-medium text-primary-black">
                            {exam.totalScore || 0}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-[0.9rem] text-primary-black">
                            {exam.maxScore || '-'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-[0.9rem] text-primary-black">
                            {exam.createdAt ? formatDate(exam.createdAt) : '-'}
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
      </div>
    </DashboardLayout>
  );
}


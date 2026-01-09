'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { usersAPI } from '@/lib/api';
import { getStatusBadgeClasses, getRoleBadgeClasses } from '@/design-system/admin-design-system';
import { FiRefreshCw } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.users || response.data || response || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-primary-black text-[1.75rem]/[1.5rem] font-semibold md:text-2xl">
              Users Management
            </h2>
            <p className="mt-2 text-[0.9rem] font-medium text-[#666] md:text-[1rem]">
              View and manage all users in the platform
            </p>
          </div>
          
          {/* Refresh Button */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchUsers}
              disabled={isRefreshing}
              className={`flex items-center gap-2 rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white px-4 py-2 text-[0.9rem] font-medium transition-colors ${
                isRefreshing
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                  : "cursor-pointer text-primary-black hover:bg-[rgba(0,0,0,0.02)] hover:border-[#ED2024]"
              }`}
              title="Refresh users list"
            >
              <FiRefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
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
                  <p className="text-[0.9rem] font-medium text-[#666]">Loading users...</p>
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
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-[0.9rem] font-semibold uppercase tracking-wider text-primary-black">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(0,0,0,0.125)] bg-white">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => {
                        const roleBadge = getRoleBadgeClasses(user.role);
                        return (
                          <tr key={user.id} className="hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                            <td className="whitespace-nowrap px-6 py-4 text-[0.9rem] font-medium text-primary-black">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-[0.9rem] text-primary-black">
                              {user.email}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-[0.9rem]">
                              <span className={roleBadge.classes}>{roleBadge.displayText}</span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-[0.9rem]">
                              <span className={getStatusBadgeClasses(user.status)}>
                                {user.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-[0.9rem] text-primary-black">
                              {new Date(user.createdAt).toLocaleDateString()}
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
      </div>
    </DashboardLayout>
  );
}


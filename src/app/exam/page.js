'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { skillsAPI } from '@/lib/api';
import { RingLoader } from 'react-spinners';
import { FiBook, FiLogOut, FiUser } from 'react-icons/fi';
import Image from 'next/image';

export default function ExamPortalPage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    // Redirect admin users to dashboard
    if (user && (user.role === 'superadmin' || user.role === 'admin')) {
      router.push('/dashboard');
      return;
    }

    fetchSkills();
  }, [user, authLoading, router]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await skillsAPI.getAll();
      setSkills(data || []);
      setError('');
    } catch (err) {
      setError('Failed to load skills. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (skillId) => {
    router.push(`/exam/${skillId}`);
  };

  const handleLogout = () => {
    logout();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <RingLoader color="#ED2024" size={60} loading={true} />
          <p className="text-[0.9rem] font-medium text-[#666]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
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
              <h1 className="text-xl font-semibold text-primary-black">Exam Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiUser className="h-4 w-4" />
                <span>{user.firstName} {user.lastName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary-black mb-2">Select a Skill to Take Exam</h2>
          <p className="text-gray-600">Choose a skill below to start your exam</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {skills.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <FiBook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No skills available</p>
            <p className="text-sm text-gray-500">Please contact your administrator to add skills.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleStartExam(skill.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <FiBook className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-primary-black mb-2">{skill.name}</h3>
                {skill.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{skill.description}</p>
                )}
                <button
                  className="w-full mt-4 px-4 py-2 bg-[#ED2024] text-white rounded hover:bg-[#C91A1A] transition-colors font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartExam(skill.id);
                  }}
                >
                  Start Exam
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}



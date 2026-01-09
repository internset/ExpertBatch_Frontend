'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { usersAPI, skillsAPI, examsAPI, topicsAPI, questionsAPI } from '@/lib/api';
import { FiUsers, FiTarget, FiBook, FiHelpCircle, FiFileText, FiRefreshCw } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    users: 0,
    skills: 0,
    topics: 0,
    questions: 0,
    exams: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setIsRefreshing(true);
      const [users, skills, questions, exams] = await Promise.all([
        usersAPI.getAll().catch(() => ({ users: [] })),
        skillsAPI.getAll().catch(() => []),
        questionsAPI.getAll().catch(() => []),
        examsAPI.getAll().catch(() => []),
      ]);

      // Count topics from all skills
      let totalTopics = 0;
      if (skills && Array.isArray(skills) && skills.length > 0) {
        try {
          const topicPromises = skills.map(skill => 
            topicsAPI.getBySkill(skill.id).catch(() => [])
          );
          const allTopics = await Promise.all(topicPromises);
          totalTopics = allTopics.reduce((sum, topics) => sum + (topics?.length || 0), 0);
        } catch (e) {
          console.error('Error fetching topics:', e);
          totalTopics = 0;
        }
      }

      setStats({
        users: users.users?.length || users.data?.length || users.length || 0,
        skills: skills.length || 0,
        topics: totalTopics,
        questions: questions.length || 0,
        exams: exams.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats.users, 
      icon: FiUsers, 
      color: 'bg-blue-500',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      route: '/dashboard/users'
    },
    { 
      label: 'Total Skills', 
      value: stats.skills, 
      icon: FiTarget, 
      color: 'bg-green-500',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      route: '/dashboard/skills'
    },
    { 
      label: 'Total Topics', 
      value: stats.topics, 
      icon: FiBook, 
      color: 'bg-purple-500',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      route: '/dashboard/topics'
    },
    { 
      label: 'Total Questions', 
      value: stats.questions, 
      icon: FiHelpCircle, 
      color: 'bg-orange-500',
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
      route: '/dashboard/questions'
    },
    { 
      label: 'Total Exams', 
      value: stats.exams, 
      icon: FiFileText, 
      color: 'bg-indigo-500',
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      route: '/dashboard/exams'
    },
  ];

  return (
    <DashboardLayout>
      <div className="">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-primary-black text-[1.75rem]/[1.5rem] font-semibold md:text-2xl">
              Dashboard
            </h2>
            <p className="mt-2 text-[0.9rem] font-medium text-[#666] md:text-[1rem]">
              Overview of your platform statistics and key metrics
            </p>
          </div>
          
          {/* Refresh Button */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchStats}
              disabled={isRefreshing}
              className={`flex items-center gap-2 rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white px-4 py-2 text-[0.9rem] font-medium transition-colors ${
                isRefreshing
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                  : "cursor-pointer text-primary-black hover:bg-[rgba(0,0,0,0.02)] hover:border-[#ED2024]"
              }`}
              title="Refresh statistics"
            >
              <FiRefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <RingLoader color="#ED2024" size={60} loading={true} />
              <p className="text-[0.9rem] font-medium text-[#666]">Loading statistics...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  onClick={() => router.push(stat.route)}
                  className="cursor-pointer rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-[0.25rem]`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[0.85rem] font-medium text-[#666] mb-1">{stat.label}</p>
                    <p className="text-[2rem] font-bold text-primary-black">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


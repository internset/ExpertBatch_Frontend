'use client';

import { FiShield, FiBarChart, FiUsers, FiClock, FiAward, FiBookOpen } from 'react-icons/fi';

export default function FeaturesSection() {
  const features = [
    {
      icon: FiShield,
      title: 'Advanced Proctoring',
      description: 'AI-powered monitoring with real-time screen capture and face detection to ensure exam integrity and prevent cheating during assessments.'
    },
    {
      icon: FiBarChart,
      title: 'Real-Time Analytics',
      description: 'Comprehensive performance reports with percentile rankings, detailed topic breakdowns, and visual analytics to make data-driven hiring decisions.'
    },
    {
      icon: FiUsers,
      title: 'User Management',
      description: 'Complete admin dashboard with role-based access control for managing users, skills, topics, questions, and exam configurations efficiently.'
    },
    {
      icon: FiClock,
      title: 'Timed Assessments',
      description: 'Configurable exam duration with automatic submission, real-time countdown, and time tracking to ensure fair and consistent evaluation.'
    },
    {
      icon: FiAward,
      title: 'Performance Tracking',
      description: 'Track candidate progress across multiple skills and topics with detailed percentile comparisons and comprehensive performance metrics.'
    },
    {
      icon: FiBookOpen,
      title: 'Skill-Based Testing',
      description: 'Organize assessments by skills and topics for targeted evaluation, enabling precise assessment of candidate capabilities in specific areas.'
    }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Why Choose ExpertBatch?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Powerful features designed to make skill-based talent assessments seamless and secure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Accent line */}
                <div className="absolute left-0 top-0 w-1 h-16 bg-gradient-to-b from-[#ED2024] to-[#C91A1A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="pl-8">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#ED2024] to-[#C91A1A] rounded-0">
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

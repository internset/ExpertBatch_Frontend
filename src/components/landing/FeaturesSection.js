'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiShield, FiBarChart, FiUsers, FiClock, FiAward, FiBookOpen } from 'react-icons/fi';

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: FiShield,
      title: 'Advanced Proctoring',
      description: 'AI-powered monitoring with real-time screen capture and face detection to ensure exam integrity and prevent cheating during assessments.',
      gradient: 'from-blue-50 to-sky-50',
      border: 'border-blue-100',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: FiBarChart,
      title: 'Real-Time Analytics',
      description: 'Comprehensive performance reports with percentile rankings, detailed topic breakdowns, and visual analytics to make data-driven hiring decisions.',
      gradient: 'from-green-50 to-emerald-50',
      border: 'border-green-100',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: FiUsers,
      title: 'User Management',
      description: 'Complete admin dashboard with role-based access control for managing users, skills, topics, questions, and exam configurations efficiently.',
      gradient: 'from-purple-50 to-pink-50',
      border: 'border-purple-100',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: FiClock,
      title: 'Timed Assessments',
      description: 'Configurable exam duration with automatic submission, real-time countdown, and time tracking to ensure fair and consistent evaluation.',
      gradient: 'from-orange-50 to-amber-50',
      border: 'border-orange-100',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      icon: FiAward,
      title: 'Performance Tracking',
      description: 'Track candidate progress across multiple skills and topics with detailed percentile comparisons and comprehensive performance metrics.',
      gradient: 'from-teal-50 to-cyan-50',
      border: 'border-teal-100',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600'
    },
    {
      icon: FiBookOpen,
      title: 'Skill-Based Testing',
      description: 'Organize assessments by skills and topics for targeted evaluation, enabling precise assessment of candidate capabilities in specific areas.',
      gradient: 'from-indigo-50 to-blue-50',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.15,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  const titleVariants = {
    hover: {
      x: 5,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={headingVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose ExpertBatch?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make skill-based talent assessments seamless and secure
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${feature.gradient} rounded-lg p-6 sm:p-8 border ${feature.border} shadow-sm hover:shadow-xl transition-shadow`}
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className="bg-[#ED2024] rounded-lg p-3 w-fit mb-4"
                  variants={iconVariants}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </motion.div>
                <motion.h3
                  className="text-xl font-bold text-gray-900 mb-3"
                  variants={titleVariants}
                >
                  {feature.title}
                </motion.h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

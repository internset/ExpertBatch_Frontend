'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';
import { 
  FiTarget, 
  FiShield, 
  FiBarChart, 
  FiUsers, 
  FiAward,
  FiGlobe,
  FiTrendingUp
} from 'react-icons/fi';

export default function AboutPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const values = [
    {
      icon: FiTarget,
      title: 'Mission-Driven',
      description: 'Empowering organizations to make data-driven hiring decisions through comprehensive skill assessments.'
    },
    {
      icon: FiShield,
      title: 'Security First',
      description: 'Enterprise-grade security and advanced proctoring to ensure assessment integrity and data protection.'
    },
    {
      icon: FiBarChart,
      title: 'Data-Driven',
      description: 'Comprehensive analytics and insights to help you understand candidate capabilities and make informed decisions.'
    },
    {
      icon: FiUsers,
      title: 'User-Centric',
      description: 'Designed with both administrators and candidates in mind, ensuring intuitive and seamless experiences.'
    }
  ];

  const stats = [
    { number: '992K+', label: 'Candidates Assessed' },
    { number: '9.9K+', label: 'Organizations Trust Us' },
    { number: '5M+', label: 'Skills-Tested Talent Pool' },
    { number: '100+', label: 'Skills Available' }
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

  const itemVariants = {
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

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 py-16 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              About <span className="text-[#ED2024]">ExpertBatch</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing talent assessment by providing organizations with a comprehensive, 
              skill-based platform to evaluate and build their talent pool with confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section ref={ref} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  ExpertBatch was born from the need to bridge the gap between talent and opportunity. 
                  We recognized that traditional hiring processes often fail to accurately assess a candidate's 
                  true capabilities, leading to poor hiring decisions and missed opportunities.
                </p>
                <p>
                  Our platform combines advanced proctoring technology with comprehensive skill-based assessments 
                  to help organizations identify the right talent. We believe that skills, not just credentials, 
                  should be the primary factor in hiring decisions.
                </p>
                <p>
                  Today, ExpertBatch serves thousands of organizations worldwide, helping them build 
                  skills-tested talent pools and make data-driven hiring decisions with confidence.
                </p>
              </div>
            </div>
            <motion.div
              className="bg-gradient-to-br from-[#ED2024]/10 to-[#C91A1A]/10 rounded-2xl p-8 lg:p-12"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-[#ED2024] rounded-lg p-3">
                    <FiGlobe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Global Reach</h3>
                    <p className="text-gray-600">Serving organizations worldwide</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#ED2024] rounded-lg p-3">
                    <FiTrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Continuous Innovation</h3>
                    <p className="text-gray-600">Constantly improving our platform</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#ED2024] rounded-lg p-3">
                    <FiAward className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Trusted Platform</h3>
                    <p className="text-gray-600">Trusted by leading organizations</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-6 text-center border border-gray-200 shadow-sm"
                variants={itemVariants}
              >
                <div className="text-3xl sm:text-4xl font-bold text-[#ED2024] mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="bg-[#ED2024] rounded-lg p-3 w-fit mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#ED2024] to-[#C91A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Join Us on This Journey
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Be part of the future of talent assessment. Let's build better teams together.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiCheckCircle, FiAward } from 'react-icons/fi';

export default function BenefitsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const benefits = [
    {
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with encrypted data transmission and secure storage to protect sensitive assessment data.'
    },
    {
      title: 'Easy to Use',
      description: 'Intuitive interface designed for both administrators and candidates, ensuring smooth user experience across all roles.'
    },
    {
      title: 'Comprehensive Reports',
      description: 'Detailed PDF reports with visualizations, performance metrics, and percentile rankings for informed decision-making.'
    },
    {
      title: 'Scalable Platform',
      description: 'Handle multiple exams simultaneously with robust performance, supporting organizations of all sizes.'
    },
    {
      title: 'Certificates & Credentials',
      description: 'Generate and issue skill-based certificates to candidates upon successful completion of assessments, validating their expertise.'
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      x: 5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={headingVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Key Benefits
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                variants={iconVariants}
                className="flex-shrink-0 mt-1"
              >
                {index === 4 ? (
                  <FiAward className="h-6 w-6 text-[#ED2024]" />
                ) : (
                  <FiCheckCircle className="h-6 w-6 text-[#ED2024]" />
                )}
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

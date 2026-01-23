'use client';

import { useRouter } from 'next/navigation';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const headingVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const backgroundVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          variants={backgroundVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          variants={backgroundVariants}
          animate="animate"
          transition={{ delay: 2, duration: 8 }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight"
            variants={headingVariants}
          >
            Skill-Based{' '} Talent
            <motion.span
              className="block bg-gradient-to-r from-[#ED2024] via-[#C91A1A] to-[#ED2024] bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Assessment Platform
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-4 leading-relaxed max-w-3xl mx-auto font-medium"
            variants={itemVariants}
          >
            Test candidates on specific skills with advanced proctoring
          </motion.p>
          <motion.p
            className="text-base sm:text-lg text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto"
            variants={itemVariants}
          >
            ExpertBatch helps organizations assess talent through skill-based exams with real-time monitoring, 
            detailed analytics, and comprehensive performance reports. Build your skills-tested talent pool with confidence.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleGetStarted}
              className="cursor-pointer inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#ED2024] to-[#C91A1A] text-white text-base font-semibold rounded-[5px] hover:from-[#C91A1A] hover:to-[#A01515] transition-all shadow-xl hover:shadow-2xl min-w-[200px]"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Get Started
              <motion.span
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <FiArrowRight className="h-5 w-5" />
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

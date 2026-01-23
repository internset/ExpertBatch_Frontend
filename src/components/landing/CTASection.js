'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight, FiCheck, FiZap } from 'react-icons/fi';

export default function CTASection() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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

  const benefits = [
    'No credit card required',
    'Free trial available',
    'Setup in minutes'
  ];

  return (
    <section ref={ref} className="relative py-20 sm:py-24 lg:py-28 bg-gradient-to-br from-[#ED2024] via-[#C91A1A] to-[#A01515] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Icon Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm"
          >
            <FiZap className="h-8 w-8 text-white" />
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight"
          >
            Ready to Transform Your
            <span className="block">Talent Assessment Process?</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of organizations using ExpertBatch to build their skills-tested talent pool. 
            Start assessing candidates with confidence today.
          </motion.p>


          {/* CTA Button */}
          <motion.button
            onClick={handleGetStarted}
            className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-white text-[#ED2024] text-base sm:text-lg font-bold rounded-lg hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl min-w-[200px]"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Get Started Free
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
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export default function StatisticsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const statistics = [
    {
      initialValue: 992000,
      suffix: '+',
      description: 'candidates assessed on skills annually'
    },
    {
      initialValue: 9900,
      suffix: 'K+',
      description: 'organizations use ExpertBatch for talent assessment'
    },
    {
      initialValue: 5000000,
      suffix: 'M+',
      description: 'skills-tested candidates in our talent pool'
    }
  ];

  const [values, setValues] = useState(
    statistics.map(stat => stat.initialValue)
  );

  const rafRefs = useRef([]);

  const formatNumber = (num, suffix) => {
    if (suffix === 'M+') {
      return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M+`;
    }
    if (suffix === 'K+') {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K+`;
    }
    return `${num.toLocaleString()}+`;
  };

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const animate = (index, start, end, duration = 2000) => {
    let startTime = null;

    const step = timestamp => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.floor(start + (end - start) * eased);

      setValues(prev => {
        const updated = [...prev];
        updated[index] = current;
        return updated;
      });

      if (progress < 1) {
        rafRefs.current[index] = requestAnimationFrame(step);
      } else {
        // pause → reset → re-run
        setTimeout(() => {
          setValues(prev => {
            const updated = [...prev];
            updated[index] = start;
            return updated;
          });

          setTimeout(() => {
            animate(index, start, end, duration);
          }, 400);
        }, 2500);
      }
    };

    rafRefs.current[index] = requestAnimationFrame(step);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      statistics.forEach((stat, index) => {
        const target = Math.floor(stat.initialValue * 1.05);
        animate(index, stat.initialValue, target);
      });
    }, 800);

    return () => {
      clearTimeout(delay);
      rafRefs.current.forEach(id => cancelAnimationFrame(id));
    };
  }, []);

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
    hidden: { opacity: 0, y: 50, scale: 0.9 },
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
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section ref={ref} className="relative bg-pink-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-10"
          variants={headingVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            PROVEN RESULTS IN
            <span className="block mt-1">TALENT ASSESSMENT</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-[6px] p-6 sm:p-8 text-center
                         border border-gray-100 shadow-sm"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                className="text-4xl sm:text-5xl font-bold text-[#ED2024] mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
              >
                {formatNumber(values[index], stat.suffix)}
              </motion.div>
              <div className="text-sm sm:text-base text-[#ED2024] font-medium">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

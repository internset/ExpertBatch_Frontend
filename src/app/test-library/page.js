'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';
import {
  FiBook,
  FiClock,
  FiArrowRight,
  FiSearch,
  FiGrid,
  FiList,
  FiX
} from 'react-icons/fi';

export default function TestLibraryPage() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Dummy data - will be replaced with API call later
  const [skills, setSkills] = useState([
    {
      id: '1',
      name: 'JavaScript',
      description: 'Test your knowledge of JavaScript fundamentals, ES6+ features, async programming, and modern JavaScript patterns. This assessment covers core concepts, DOM manipulation, and advanced topics.',
      duration: '45',
      topics: [
        { id: '1', name: 'Variables & Data Types' },
        { id: '2', name: 'Functions & Scope' },
        { id: '3', name: 'ES6+ Features' }
      ]
    },
    {
      id: '2',
      name: 'Python',
      description: 'Evaluate your Python programming skills including syntax, data structures, object-oriented programming, and popular libraries. Perfect for assessing backend development capabilities.',
      duration: '50',
      topics: [
        { id: '4', name: 'Python Basics' },
        { id: '5', name: 'Data Structures' },
        { id: '6', name: 'OOP Concepts' }
      ]
    },
    {
      id: '3',
      name: 'React',
      description: 'Assess your React.js expertise including components, hooks, state management, routing, and performance optimization. Ideal for frontend developer evaluation.',
      duration: '40',
      topics: [
        { id: '7', name: 'Components & Props' },
        { id: '8', name: 'Hooks & State' },
        { id: '9', name: 'React Router' }
      ]
    },
    {
      id: '4',
      name: 'Node.js',
      description: 'Test your Node.js and backend development skills including Express.js, REST APIs, database integration, and server-side best practices.',
      duration: '55',
      topics: [
        { id: '10', name: 'Node.js Core' },
        { id: '11', name: 'Express.js' },
        { id: '12', name: 'Database Integration' }
      ]
    },
    {
      id: '5',
      name: 'SQL',
      description: 'Evaluate your database query skills including complex joins, subqueries, indexing, optimization, and database design principles.',
      duration: '35',
      topics: [
        { id: '13', name: 'Basic Queries' },
        { id: '14', name: 'Joins & Subqueries' },
        { id: '15', name: 'Database Design' }
      ]
    },
    {
      id: '6',
      name: 'TypeScript',
      description: 'Test your TypeScript knowledge including type system, interfaces, generics, decorators, and integration with modern frameworks.',
      duration: '45',
      topics: [
        { id: '16', name: 'Type System' },
        { id: '17', name: 'Interfaces & Types' },
        { id: '18', name: 'Advanced Types' }
      ]
    },
    {
      id: '7',
      name: 'AWS Cloud',
      description: 'Assess your AWS cloud computing expertise including EC2, S3, Lambda, IAM, and cloud architecture best practices for scalable applications.',
      duration: '60',
      topics: [
        { id: '19', name: 'Compute Services' },
        { id: '20', name: 'Storage & Database' },
        { id: '21', name: 'Security & IAM' }
      ]
    },
    {
      id: '8',
      name: 'Docker',
      description: 'Evaluate your containerization skills including Docker images, containers, Docker Compose, orchestration, and container best practices.',
      duration: '40',
      topics: [
        { id: '22', name: 'Docker Basics' },
        { id: '23', name: 'Docker Compose' },
        { id: '24', name: 'Container Orchestration' }
      ]
    },
    {
      id: '9',
      name: 'Git & Version Control',
      description: 'Test your Git proficiency including branching strategies, merging, rebasing, conflict resolution, and collaborative workflows.',
      duration: '30',
      topics: [
        { id: '25', name: 'Git Basics' },
        { id: '26', name: 'Branching & Merging' },
        { id: '27', name: 'Advanced Git' }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // TODO: Add API call here later
  // useEffect(() => {
  //   fetchSkills();
  // }, []);
  //
  // const fetchSkills = async () => {
  //   try {
  //     const data = await skillsAPI.getAll();
  //     setSkills(data || []);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const filteredSkills = skills.filter(skill =>
    skill.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartTest = (skillName) => {
    router.push(`/test-library/${encodeURIComponent(skillName)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: 0.3,
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
              Test <span className="text-[#ED2024]">Library</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Explore our comprehensive collection of skill-based assessments.
              Choose from a wide range of skills to evaluate candidate capabilities.
            </p>

            {/* Search Bar */}
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Search for skills or assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED2024] focus:border-[#ED2024] text-gray-900 text-base shadow-sm transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={ref} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Stats and View Toggle */}
          <motion.div
            className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            variants={headingVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Available Assessments
              </h2>
              <p className="text-gray-600">
                {filteredSkills.length} {filteredSkills.length === 1 ? 'assessment' : 'assessments'} available
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`cursor-pointer p-2 rounded transition-all ${viewMode === 'grid'
                      ? 'bg-white text-[#ED2024] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <FiGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`cursor-pointer p-2 rounded transition-all ${viewMode === 'list'
                      ? 'bg-white text-[#ED2024] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <FiList className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Skills Grid/List */}
          {filteredSkills.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <FiBook className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchTerm ? 'No assessments found' : 'No assessments available'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchTerm
                  ? `We couldn't find any assessments matching "${searchTerm}". Try adjusting your search terms.`
                  : 'Please contact your administrator to add assessments to the library.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#ED2024] text-white rounded-lg hover:bg-[#C91A1A] transition-colors font-semibold"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
                : 'space-y-4'
              }
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id || index}
                  className={`bg-white rounded-xl border-2 border-gray-200  hover:shadow-xl transition-all cursor-pointer overflow-hidden ${viewMode === 'list' ? 'flex items-center gap-6 p-6' : 'p-6'
                    }`}
                  variants={cardVariants}
                  whileHover="hover"
                  onClick={() => handleStartTest(skill.name)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Icon and Duration */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-gradient-to-br from-[#ED2024] to-[#C91A1A] rounded-xl p-4 shadow-lg">
                          <FiBook className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                          <FiClock className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {skill.duration || '40'} min
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                        {skill.name || 'Untitled Assessment'}
                      </h3>

                      {/* Description */}
                      {skill.description && (
                        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 min-h-[4.5rem]">
                          {skill.description}
                        </p>
                      )}

                      {/* Topics Count (if available) */}
                      {skill.topics && skill.topics.length > 0 && (
                        <div className="mb-4 text-sm text-gray-500">
                          {skill.topics.length} {skill.topics.length === 1 ? 'topic' : 'topics'}
                        </div>
                      )}

                      {/* CTA Button */}
                      <button
                        className="cursor-pointer w-full mt-auto px-4 py-3 bg-[#ED2024] text-white rounded-lg hover:bg-[#C91A1A] transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTest(skill.name);
                        }}
                      >
                        Start Assessment
                        <FiArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="bg-gradient-to-br from-[#ED2024] to-[#C91A1A] rounded-xl p-4 shadow-lg flex-shrink-0">
                        <FiBook className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                            {skill.name || 'Untitled Assessment'}
                          </h3>
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 flex-shrink-0">
                            <FiClock className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              {skill.duration || '40'} min
                            </span>
                          </div>
                        </div>
                        {skill.description && (
                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                            {skill.description}
                          </p>
                        )}
                        {skill.topics && skill.topics.length > 0 && (
                          <div className="text-sm text-gray-500 mb-4">
                            {skill.topics.length} {skill.topics.length === 1 ? 'topic' : 'topics'}
                          </div>
                        )}
                      </div>
                      <button
                        className="px-6 py-3 bg-[#ED2024] text-white rounded-lg hover:bg-[#C91A1A] transition-all font-semibold flex items-center gap-2 shadow-md hover:shadow-lg flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTest(skill.name);
                        }}
                      >
                        Start
                        <FiArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

'use client';

import { useState } from 'react';
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
  FiX,
  FiTarget
} from 'react-icons/fi';

export default function TestLibraryPage() {
  const router = useRouter();

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


  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 py-16 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Test <span className="text-[#ED2024]">Library</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Explore our comprehensive collection of skill-based assessments.
              Choose from a wide range of skills to evaluate candidate capabilities.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Search for skills or assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 focus:outline-none text-gray-900 text-base"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Stats and View Toggle */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              <div className="flex items-center bg-gray-100 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`cursor-pointer p-2 rounded ${viewMode === 'grid'
                    ? 'bg-white text-[#ED2024]'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <FiGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`cursor-pointer p-2 rounded ${viewMode === 'list'
                    ? 'bg-white text-[#ED2024]'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <FiList className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Skills Grid/List */}
          {filteredSkills.length === 0 ? (
            <div className="text-center py-16">
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#ED2024] text-white hover:bg-[#C91A1A] transition-colors font-semibold"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div
              className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
                : 'space-y-4'
              }
            >
              {filteredSkills.map((skill, index) => (
                <div
                  key={skill.id || index}
                  className={`bg-white border-2 border-gray-200 cursor-pointer overflow-hidden ${viewMode === 'list' ? 'flex items-start gap-6 p-6' : 'p-6'
                    }`}
                  onClick={() => handleStartTest(skill.name)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Icon and Duration */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-gradient-to-br from-[#ED2024] to-[#C91A1A] p-4">
                          <FiBook className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex flex-col items-center justify-start gap-2">
                          <div className="flex items-center gap-2 bg-gray-100 w-24 justify-center py-1.5">
                            <FiClock className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              {skill.duration || '40'} min
                            </span>
                          </div>
                          {/* Topics Count (if available) */}
                          {skill.topics && skill.topics.length > 0 && (
                            <div className="flex items-center gap-2 bg-gray-100 w-24 justify-center py-1.5">
                              <FiTarget className="h-4 w-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                {skill.topics.length} {skill.topics.length === 1 ? 'topic' : 'topics'}
                              </span>
                            </div>
                          )}
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



                      {/* CTA Button */}
                      <button
                        className="cursor-pointer w-full mt-auto px-4 py-3 bg-[#ED2024] text-white hover:bg-[#C91A1A] font-semibold flex items-center justify-center gap-2"
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
                      <div className="flex flex-col items-center justify-between gap-2">
                        <div className="bg-gradient-to-br from-[#ED2024] to-[#C91A1A] p-4 flex-shrink-0">
                          <FiBook className="h-16 w-16 text-white" />
                        </div>
                        <button
                          className="cursor-pointer w-full flex justify-center py-2 bg-[#ED2024] text-white hover:bg-[#C91A1A] font-semibold flex items-center gap-2 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartTest(skill.name);
                          }}
                        >
                          Start
                          <FiArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                            {skill.name || 'Untitled Assessment'}
                          </h3>
                        </div>
                        {skill.description && (
                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                            {skill.description}
                          </p>
                        )}
                        <div className="flex items-center justify-start gap-2">
                          {skill.topics && skill.topics.length > 0 && (
                            <div className="flex items-center gap-2 bg-gray-100 w-24 justify-center py-1.5">
                              <FiTarget className="h-4 w-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                {skill.topics.length} {skill.topics.length === 1 ? 'topic' : 'topics'}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 flex-shrink-0">
                            <FiClock className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              {skill.duration || '40'} min
                            </span>
                          </div>
                        </div>
                      </div>

                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

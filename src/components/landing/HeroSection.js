'use client';

import { useRouter } from 'next/navigation';
import { FiArrowRight } from 'react-icons/fi';

export default function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Static gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[#ED2024] to-[#C91A1A] rounded-full mix-blend-screen filter blur-[120px] opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-25" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-screen filter blur-[90px] opacity-20" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#ED2024]/20 to-[#C91A1A]/20 rounded-2xl backdrop-blur-sm border border-white/10 rotate-12 hidden lg:block" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-white/10 hidden lg:block" />
      <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm border border-white/10 -rotate-12 hidden lg:block" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
            <span className="block text-white mb-2">
              Skill-Based
            </span>
            <span className="block bg-gradient-to-r from-[#ED2024] via-[#FF4444] to-[#ED2024] bg-clip-text text-transparent">
              Talent Assessment
            </span>
            <span className="block text-white mt-2">
              Platform
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-6 leading-relaxed max-w-4xl mx-auto font-light">
            Test candidates on specific skills with{' '}
            <span className="text-white font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              advanced proctoring
            </span>
          </p>

          <p className="text-base sm:text-lg text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto">
            ExpertBatch helps organizations assess talent through skill-based exams with real-time monitoring, 
            detailed analytics, and comprehensive performance reports. Build your skills-tested talent pool with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="cursor-pointer inline-flex items-center justify-center px-8 py-4 border border-[#ED2024] bg-gradient-to-r from-[#ED2024] to-[#C91A1A] text-white text-lg font-semibold rounded-0 min-w-[220px] shadow-2xl shadow-red-500/50"
            >
              <span className="flex items-center gap-2">
                Get Started
                <FiArrowRight className="h-5 w-5" />
              </span>
            </button>

            <button
              className="cursor-pointer inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-semibold rounded-0 min-w-[220px]"
            >
              Watch Demo
              <span className="ml-2 text-2xl">▶</span>
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}

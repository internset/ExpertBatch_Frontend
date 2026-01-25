'use client';

import { useRouter } from 'next/navigation';
import { FiArrowRight, FiZap } from 'react-icons/fi';

export default function CTASection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <section className="relative py-20 sm:py-24 lg:py-28 bg-gradient-to-br from-[#ED2024] via-[#C91A1A] to-[#A01515] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <FiZap className="h-8 w-8 text-white" />
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to Transform Your
            <span className="block">Talent Assessment Process?</span>
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of organizations using ExpertBatch to build their skills-tested talent pool. 
            Start assessing candidates with confidence today.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleGetStarted}
            className="cursor-pointer shahdow-0 inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-white text-[#ED2024] text-base sm:text-lg font-bold hover:bg-gray-50 min-w-[200px]"
          >
            Get Started Free
            <span className="ml-2">
              <FiArrowRight className="h-5 w-5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

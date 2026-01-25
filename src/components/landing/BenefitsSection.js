'use client';

import { FiCheckCircle, FiAward } from 'react-icons/fi';

export default function BenefitsSection() {
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

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f4f608_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f608_1px,transparent_1px)] bg-[size_4rem_4rem]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            Key Benefits
          </h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative flex items-start gap-6 pb-8 border-b border-gray-200 last:border-0 last:pb-0"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[#ED2024] to-[#C91A1A] rounded-0">
                  {index === 4 ? (
                    <FiAward className="h-6 w-6 text-white" />
                  ) : (
                    <FiCheckCircle className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

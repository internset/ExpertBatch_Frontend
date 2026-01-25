'use client';

export default function StatisticsSection() {
  const statistics = [
    {
      value: '992K+',
      description: 'candidates assessed on skills annually'
    },
    {
      value: '9.9K+',
      description: 'organizations use ExpertBatch for talent assessment'
    },
    {
      value: '5M+',
      description: 'skills-tested candidates in our talent pool'
    }
  ];

  return (
    <section className="relative bg-pink-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            PROVEN RESULTS IN
            <span className="block mt-1">TALENT ASSESSMENT</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-[6px] p-6 sm:p-8 text-center border border-gray-100"
            >
              <div className="text-4xl sm:text-5xl font-bold text-[#ED2024] mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-[#ED2024] font-medium">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

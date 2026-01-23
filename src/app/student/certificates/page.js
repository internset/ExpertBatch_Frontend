'use client';

import { FiDownload } from 'react-icons/fi';

export default function CertificatesPage() {
  const certificates = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      date: 'Jan 15, 2026',
      score: '85%',
    },
    {
      id: 2,
      title: 'Data Structures Assessment',
      date: 'Jan 10, 2026',
      score: '78%',
    },
  ];

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Certificates</h1>
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{cert.title}</h3>
                  <p className="text-sm text-gray-600">Completed on: {cert.date}</p>
                  <p className="text-sm text-gray-600">Score: <span className="font-medium">{cert.score}</span></p>
                </div>
                <button className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
                  <FiDownload className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}

'use client';

import { FiAward, FiCheckCircle, FiPlus } from 'react-icons/fi';

export default function ResultsPage() {
  const results = [
    {
      id: 1,
      title: 'Data Structures Assessment',
      icon: FiAward,
      iconColor: 'blue',
      badge: { type: 'self-purchased', icon: FiCheckCircle, color: 'red' },
      score: '78%',
      status: 'Passed',
    },
    {
      id: 2,
      title: 'Backend Developer Test',
      icon: FiAward,
      iconColor: 'red',
      badge: { type: 'invited', text: 'Invited by FintechCorp', icon: FiPlus, color: 'green' },
      score: '82%',
      status: 'Result Shared with Organisation',
    },
  ];

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Results</h1>
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${
                  result.iconColor === 'blue' ? 'bg-blue-100' : result.iconColor === 'red' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <result.icon className={`h-6 w-6 ${
                    result.iconColor === 'blue' ? 'text-blue-600' : result.iconColor === 'red' ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                    {result.badge && (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        result.badge.color === 'red' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {result.badge.icon && <result.badge.icon className="h-3 w-3" />}
                        {result.badge.type === 'self-purchased' ? 'Self-Purchased' : result.badge.text}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Score: <span className="font-medium text-gray-900">{result.score}</span></p>
                  <p className="text-sm text-gray-600 mb-1">Status: <span className="font-medium">{result.status}</span></p>
                </div>
              </div>
              <button className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                View Report {'>'}
              </button>
            </div>
          ))}
        </div>
      </div>
  );
}

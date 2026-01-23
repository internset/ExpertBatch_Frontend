'use client';

import { useRouter } from 'next/navigation';

export default function BuyTestsPage() {
  const router = useRouter();

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Buy Tests</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">Browse and purchase tests from our test library.</p>
          <button
            onClick={() => router.push('/test-library')}
            className="cursor-pointer px-6 py-3 bg-[#ED2024] text-white rounded-lg hover:bg-[#C91A1A] transition-colors font-semibold"
          >
            Go to Test Library
          </button>
        </div>
      </div>
  );
}

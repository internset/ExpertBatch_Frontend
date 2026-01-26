'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';

export default function PaymentPage() {
  const params = useParams();
  const skillName = params.skillName ? decodeURIComponent(params.skillName) : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Breadcrumb Navigation */}
      <section className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/test-library" className="text-gray-600 hover:text-gray-900 transition-colors">
              Test Library
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/test-library/${encodeURIComponent(skillName)}`} className="text-gray-600 hover:text-gray-900 transition-colors">
              {skillName}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Payment</span>
          </nav>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Page
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Here will show Stripe payment page
          </p>
          <p className="text-sm text-gray-500">
            Stripe payment integration will be implemented here
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

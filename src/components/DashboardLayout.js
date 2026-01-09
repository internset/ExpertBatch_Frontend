'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for initialization to complete before checking auth
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Redirect non-admin users to exam portal
    if (user && user.role !== 'superadmin' && user.role !== 'admin') {
      router.push('/exam');
      return;
    }
  }, [user, loading, router]);

  // Show loading while initializing or if no user yet
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="text-lg font-medium text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 transition-all duration-300" style={{ marginLeft: '16rem' }}>
        {children}
      </main>
    </div>
  );
}


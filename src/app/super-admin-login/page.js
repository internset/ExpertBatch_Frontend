'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getInputClasses, getButtonClasses } from '@/design-system/admin-design-system';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Default admin credentials - these match the backend .env file
  const defaultEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'superadmin@expert.com';
  const defaultPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'expert@123';

  const fillCredentials = () => {
    setEmail(defaultEmail);
    setPassword(defaultPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Redirect based on user role
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.role === 'superadmin' || userData.role === 'admin') {
        router.push('/dashboard');
      } else {
        // Regular users go to exam portal
        router.push('/exam');
      }
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="rounded-[0.25rem] border border-[rgba(0,0,0,0.125)] bg-white p-8 shadow-lg">
          <div className="flex justify-center mb-6">
            <Image
              src="/Expertbatch Logo.svg"
              alt="ExpertBatch Logo"
              width={201}
              height={32}
              priority
              className="h-[1.875rem] w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6 text-primary-black">
            Super Admin Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <div className="font-semibold mb-1">{error}</div>
                {error.includes('Invalid credentials') && (
                  <div className="text-xs mt-2 text-red-600">
                    Please check your backend <code className="bg-red-100 px-1 rounded">.env</code> file for <code className="bg-red-100 px-1 rounded">SUPERADMIN_EMAIL</code> and <code className="bg-red-100 px-1 rounded">SUPERADMIN_PASSWORD</code>
                  </div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-primary-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={getInputClasses(false)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-primary-black">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={getInputClasses(false)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={getButtonClasses('primary', loading)}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <>
              <div className="bg-gray-50 rounded p-3 space-y-1 mb-2">
                <div className="text-xs">
                  <span className="font-semibold text-gray-600">Email:</span>{' '}
                  <span className="text-gray-800 font-mono">superadmin@expert.com</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-gray-600">Password:</span>{' '}
                  <span className="text-gray-800 font-mono">expert@123</span>
                </div>
              </div>
              <button
                type="button"
                onClick={fillCredentials}
                className="text-xs text-[#ED2024] hover:text-[#C91A1A] hover:underline cursor-pointer"
              >
                Click to fill credentials
              </button>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}


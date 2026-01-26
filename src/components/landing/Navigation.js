'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    router.push('/login');
  };

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Test Library', href: '/test-library' },
    { label: 'Contact Us', href: '/contact' }
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="cursor-pointer flex items-center"
            >
              <Image
                src="/Expertbatch Logo.svg"
                alt="ExpertBatch Logo"
                width={201}
                height={32}
                className="w-auto"
                style={{ height: '1.875rem' }}
                priority
              />
            </button>
          </div>

          {/* Right Side Navigation Links */}
          <div className="flex items-center gap-6">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={link.onClick}
                  className={`cursor-pointer text-sm font-medium transition-colors ${isActive(link.href)
                    ? 'text-[#ED2024]'
                    : 'text-gray-700 hover:text-[#ED2024]'
                    }`}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={handleLogin}
                className="cursor-pointer px-4 py-1.5 bg-[#ED2024] text-white text-sm font-medium hover:bg-[#C91A1A] transition-colors"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer md:hidden p-2 text-gray-700 hover:text-[#ED2024] transition-colors"
            >

              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu - 60% Width from Left */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Side Menu - 60% Width, Full Height */}
            <div className={`fixed top-0 left-0 h-full w-[80%] bg-white z-50 md:hidden transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}>
              <div className="flex flex-col h-full">
                {/* Header with Close Button */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200">
                  <Image
                    src="/Expertbatch Logo.svg"
                    alt="ExpertBatch Logo"
                    width={201}
                    height={32}
                    className="w-auto"
                    style={{ height: '1.875rem' }}
                  />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="cursor-pointer p-2 text-gray-700 hover:text-[#ED2024] transition-colors"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 px-4 sm:px-6 py-4 space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        if (link.onClick) link.onClick();
                        setMobileMenuOpen(false);
                      }}
                      className={`cursor-pointer w-[150px] block p-2 text-lg font-medium transition-colors ${isActive(link.href)
                        ? 'text-[#ED2024] bg-[#ED2024]/10'
                        : 'text-gray-700 hover:text-[#ED2024] hover:bg-gray-50'
                        }`}
                    >
                      {link.label}
                    </a>
                  ))}
                  <button
                    onClick={() => {
                      handleLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="cursor-pointer w-[150px] p-2 bg-[#ED2024] text-white text-lg font-medium hover:bg-[#C91A1A] transition-colors text-center"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

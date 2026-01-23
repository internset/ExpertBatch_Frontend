'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
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
                className="h-8 w-auto"
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
                  className={`cursor-pointer text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-[#ED2024]'
                      : 'text-gray-700 hover:text-[#ED2024]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={handleLogin}
                className="cursor-pointer px-4 py-2 bg-[#ED2024] text-white text-sm font-medium rounded-[5px] hover:bg-[#C91A1A] transition-colors"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer md:hidden p-2 text-gray-700 hover:text-[#ED2024] transition-colors"
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-gray-200"
            >
              <div className="py-4 space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      if (link.onClick) link.onClick();
                      setMobileMenuOpen(false);
                    }}
                    className={`cursor-pointer block px-4 py-2 text-base font-medium transition-colors ${
                      isActive(link.href)
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
                  className="cursor-pointer block w-full text-left px-4 py-2 bg-[#ED2024] text-white text-base font-medium rounded-lg hover:bg-[#C91A1A] transition-colors"
                >
                  Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

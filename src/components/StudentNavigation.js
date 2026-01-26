'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome,
  FiBook,
  FiMail,
  FiShoppingCart,
  FiAward,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser
} from 'react-icons/fi';

export default function StudentNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get user from localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, []);

  const navLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/student/my-tests', label: 'My Tests', icon: FiBook },
    { href: '/student/invitations', label: 'Invitations', icon: FiMail },
    { href: '/student/buy-tests', label: 'Buy Tests', icon: FiShoppingCart },
    { href: '/student/certificates', label: 'Certificates', icon: FiAward },
  ];

  const isActive = (href) => pathname === href;

  const handleLogout = () => {
    // Remove token and user from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  const userName = user?.firstName || user?.username || 'User';
  const userInitials = userName.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="cursor-pointer"
            >
              <Image
                src="/Expertbatch Logo.svg"
                alt="ExpertBatch Logo"
                width={201}
                height={32}
                className="h-[1.875rem] w-auto"
              />
            </button>
          </div>

          {/* Right Side - Navigation and Profile */}
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.href}
                    onClick={() => router.push(link.href)}
                    className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      isActive(link.href)
                        ? 'text-[#ED2024] bg-red-50'
                        : 'text-gray-700 hover:text-[#ED2024] hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* User Profile with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="cursor-pointer flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {userName}
                </span>
                <div className="h-8 w-8 rounded-full bg-[#ED2024] text-white flex items-center justify-center text-sm font-semibold">
                  {userInitials}
                </div>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg py-2 z-50">
                  <button
                    onClick={() => {
                      router.push('/student/profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="cursor-pointer w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FiUser className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.href}
                  onClick={() => {
                    router.push(link.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`cursor-pointer w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive(link.href)
                      ? 'text-[#ED2024] bg-red-50'
                      : 'text-gray-700 hover:text-[#ED2024] hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

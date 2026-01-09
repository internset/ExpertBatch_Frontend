'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  FiHome,
  FiUsers,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiTarget,
  FiBook,
  FiHelpCircle,
  FiFileText,
} from 'react-icons/fi';
import ConfirmationModal from './ConfirmationModal';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: FiHome, exact: true },
  { href: '/dashboard/users', label: 'Users', icon: FiUsers, exact: false },
  { href: '/dashboard/skills', label: 'Skills', icon: FiTarget, exact: false },
  { href: '/dashboard/topics', label: 'Topics', icon: FiBook, exact: false },
  { href: '/dashboard/questions', label: 'Questions', icon: FiHelpCircle, exact: false },
  { href: '/dashboard/exams', label: 'Exams', icon: FiFileText, exact: false },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Update main content margin when sidebar state changes
    const main = document.querySelector('main');
    if (main) {
      main.style.marginLeft = isOpen ? '16rem' : '3rem';
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (href, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={handleToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-12'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between px-3 h-[50px] border-b border-gray-200">
            {isOpen ? (
              <div className="flex items-center flex-1">
                <Image
                  src="/Expertbatch Logo.svg"
                  alt="ExpertBatch Logo"
                  width={201}
                  height={32}
                  priority
                  className="h-6 w-auto"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <Image
                  src="/Expertbatch Logo.svg"
                  alt="ExpertBatch"
                  width={32}
                  height={32}
                  priority
                  className="h-6 w-6"
                />
              </div>
            )}
            <button
              onClick={handleToggle}
              className="p-1.5 rounded-[5px] hover:bg-gray-100 transition-colors cursor-pointer ml-2"
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isOpen ? (
                <FiChevronLeft className="w-4 h-4" />
              ) : (
                <FiChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="p-2 space-y-1 overflow-y-auto flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);

              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`flex items-center gap-2 px-2 py-2 rounded-[5px] transition-colors text-xs w-full cursor-pointer ${
                    active
                      ? 'bg-[#ED2024] text-white hover:bg-[#C91A1A] focus:bg-[#C91A1A] active:bg-[#C91A1A]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {isOpen && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          {isOpen && user && (
            <div className="border-t border-gray-200 p-2">
              <div className="mb-2 px-2">
                <p className="text-xs font-medium text-primary-black truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <div className="border-t border-gray-200 p-2">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 px-2 py-2 rounded-[5px] bg-red-600 text-white hover:bg-red-700 transition-colors w-full text-xs cursor-pointer"
            >
              <FiLogOut className="w-4 h-4" />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access the admin panel."
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
        icon={FiLogOut}
        iconColor="text-red-500"
      />
    </>
  );
}

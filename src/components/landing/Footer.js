'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiLinkedin,
  FiTwitter,
  FiFacebook,
  FiArrowRight,
  FiShield,
  FiBarChart,
  FiUsers,
  FiBookOpen
} from 'react-icons/fi';

export default function Footer() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Integrations', href: '#' }
    ],
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' }
    ],
    resources: [
      { label: 'Documentation', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'FAQs', href: '#faq' },
      { label: 'Support', href: '#' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'GDPR', href: '#' }
    ]
  };

  const features = [
    { icon: FiShield, label: 'Proctoring' },
    { icon: FiBarChart, label: 'Analytics' },
    { icon: FiUsers, label: 'User Management' },
    { icon: FiBookOpen, label: 'Skill Testing' }
  ];

  return (
    <footer className="bg-white text-gray-900">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image
                src="/Expertbatch Logo.svg"
                alt="ExpertBatch Logo"
                width={201}
                height={32}
                className="h-[1.875rem] w-auto mb-4"
                priority
              />
              <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm">
                ExpertBatch is a leading skill-based talent assessment platform helping organizations
                build their skills-tested talent pool with confidence.
              </p>
            </div>

            {/* Quick Features */}
            <div className="flex flex-wrap gap-3 mb-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 rounded-[0px] px-3 py-2 text-xs text-gray-700"
                  >
                    <IconComponent className="h-3 w-3 text-[#ED2024]" />
                    <span>{feature.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="cursor-pointer text-gray-600 hover:text-[#ED2024] transition-colors"
              >
                <FiLinkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="cursor-pointer text-gray-600 hover:text-[#ED2024] transition-colors"
              >
                <FiTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="cursor-pointer text-gray-600 hover:text-[#ED2024] transition-colors"
              >
                <FiFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="cursor-pointer text-gray-600 hover:text-[#ED2024] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span>{link.label}</span>
                    <FiArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="cursor-pointer text-gray-600 hover:text-[#ED2024] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span>{link.label}</span>
                    <FiArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="cursor-pointer text-gray-600 hover:text-[#ED2024] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span>{link.label}</span>
                    <FiArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="cursor-pointer text-gray-600 hover:text-[#ED2024] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span>{link.label}</span>
                    <FiArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <FiMail className="h-4 w-4 text-[#ED2024] flex-shrink-0" />
              <a href="mailto:support@expertbatch.com" className="cursor-pointer hover:text-[#ED2024] transition-colors">
                support@expertbatch.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="h-4 w-4 text-[#ED2024] flex-shrink-0" />
              <a href="tel:+1234567890" className="cursor-pointer hover:text-[#ED2024] transition-colors">
                +1 (234) 567-890
              </a>
            </div>
            <div className="flex items-center gap-3">
              <FiMapPin className="h-4 w-4 text-[#ED2024] flex-shrink-0" />
              <span>Global - Serving Organizations Worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <p>© {new Date().getFullYear()} ExpertBatch. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={handleGetStarted}
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#ED2024] text-white text-sm font-semibold rounded-[0px] hover:bg-[#C91A1A] transition-colors"
              >
                Get Started
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

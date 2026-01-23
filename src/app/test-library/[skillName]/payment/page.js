'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';
import { 
  FiArrowLeft,
  FiCreditCard,
  FiLock,
  FiCheckCircle,
  FiX,
  FiDollarSign
} from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const skillName = params.skillName ? decodeURIComponent(params.skillName) : '';
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    country: 'US'
  });
  
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const price = 15;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number (add spaces every 4 digits)
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date (MM/YY)
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format CVV (max 4 digits)
    else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').slice(0, 4);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    if (!formData.cardholderName || formData.cardholderName.length < 2) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      
      // Redirect to assessment after 2 seconds
      setTimeout(() => {
        router.push(`/test/skill/${encodeURIComponent(skillName)}`);
      }, 2000);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg border border-green-200 p-8 max-w-md w-full text-center shadow-lg"
          >
            <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to assessment...</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#ED2024] hover:text-[#C91A1A] transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/test-library" className="text-[#ED2024] hover:text-[#C91A1A] transition-colors">
              Test Library
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/test-library/${encodeURIComponent(skillName)}`} className="text-[#ED2024] hover:text-[#C91A1A] transition-colors">
              {skillName}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Payment</span>
          </nav>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#ED2024] to-[#C91A1A] px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Complete Payment</h1>
                <p className="text-white/90 text-sm">{skillName} Assessment</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">${price}</div>
                <div className="text-white/80 text-sm">One-time payment</div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ED2024] focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ED2024] focus:border-transparent ${
                    errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <FiCreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )}
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ED2024] focus:border-transparent ${
                  errors.cardholderName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.cardholderName && (
                <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
              )}
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ED2024] focus:border-transparent ${
                    errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ED2024] focus:border-transparent ${
                    errors.cvv ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <FiLock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-800 font-medium mb-1">Secure Payment</p>
                <p className="text-xs text-blue-700">
                  Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#ED2024] to-[#C91A1A] text-white rounded-lg hover:from-[#C91A1A] hover:to-[#A01515] transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FiLock className="h-5 w-5" />
                  Pay ${price}
                </>
              )}
            </button>

            {/* Back Link */}
            <div className="text-center">
              <Link
                href={`/test-library/${encodeURIComponent(skillName)}`}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#ED2024] transition-colors"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back to Assessment Details
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

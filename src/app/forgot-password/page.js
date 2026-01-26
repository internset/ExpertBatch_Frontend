'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiCheckCircle, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Verify OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    // TODO: Replace with actual API call to send OTP
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('').filter(char => /^\d$/.test(char));
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);
    
    // Focus last input
    const lastIndex = Math.min(digits.length - 1, 5);
    const lastInput = document.getElementById(`otp-${lastIndex}`);
    if (lastInput) lastInput.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    
    // TODO: Replace with actual API call to verify OTP
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(3); // Move to new password step
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setOtp(['', '', '', '', '', '']);
    setLoading(true);
    
    // TODO: Replace with actual API call to resend OTP
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // OTP resent successfully
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    // TODO: Replace with actual API call to reset password
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep(4); // Show success, then redirect to login
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (step === 4) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Company Collaborations */}
        <div 
          className="hidden lg:flex lg:w-1/3 relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#ED2024]/85 to-[#C91A1A]/70"></div>
          <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Trusted by Industry Leaders
            </h1>
            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-md">
              Join thousands of companies that trust ExpertBatch for their talent assessment needs
            </p>
            <div className="space-y-4 w-full">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-xl font-semibold mb-1">Fortune 500 Companies</div>
                <div className="text-white/80 text-sm">200+ leading enterprises</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-xl font-semibold mb-1">Tech Startups</div>
                <div className="text-white/80 text-sm">300+ innovative companies</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-xl font-semibold mb-1">Global Partnerships</div>
                <div className="text-white/80 text-sm">50+ countries worldwide</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Success Form */}
        <div className="flex-1 flex items-center justify-center bg-white p-8 lg:p-12">
          <div className="w-full max-w-2xl">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/Expertbatch Logo.svg"
                  alt="ExpertBatch Logo"
                  width={201}
                  height={32}
                  priority
                  className="h-[1.875rem] w-auto"
                />
              </Link>
            </div>

            <div className="bg-white p-8 text-center">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-[#ED2024]/10 flex items-center justify-center">
                  <FiCheckCircle className="h-12 w-12 text-[#ED2024]" />
                </div>
              </div>

              <h1 className="text-[24px] font-semibold text-gray-900 mb-4">
                Password Reset Successful!
              </h1>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your password has been reset successfully. Redirecting to login...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Company Collaborations */}
      <div 
        className="hidden lg:flex lg:w-1/3 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#ED2024]/85 to-[#C91A1A]/70"></div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Trusted by Industry Leaders
          </h1>
          <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-md">
            Join thousands of companies that trust ExpertBatch for their talent assessment needs
          </p>
          <div className="space-y-4 w-full">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-xl font-semibold mb-1">Fortune 500 Companies</div>
              <div className="text-white/80 text-sm">200+ leading enterprises</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-xl font-semibold mb-1">Tech Startups</div>
              <div className="text-white/80 text-sm">300+ innovative companies</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-xl font-semibold mb-1">Global Partnerships</div>
              <div className="text-white/80 text-sm">50+ countries worldwide</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 lg:p-12">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/Expertbatch Logo.svg"
              alt="ExpertBatch Logo"
              width={201}
              height={32}
              priority
              className="h-[1.875rem] w-auto"
            />
          </div>

          {/* Card */}
          <div className="bg-white">
            {/* Content */}
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-[24px] font-semibold text-gray-900 mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-600">
                  Please enter the email address associated with your account and we will send you a password reset link.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6">
                  <div className="font-medium">{error}</div>
                </div>
              )}

              {/* Step 1: Enter Email */}
              {step === 1 && (
                <form
                  onSubmit={handleEmailSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      className="w-full px-4 py-3 border border-gray-300"
                      placeholder="Email address"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-[#ED2024] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : (
                      <>
                        Send Reset Link
                        <FiArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Verify OTP */}
              {step === 2 && (
                <form
                  onSubmit={handleVerifyOtp}
                  className="space-y-5"
                >
                  <div>
                    <p className="text-sm text-gray-600 mb-4 text-center">
                      We've sent a 6-digit OTP to <strong className="text-gray-900">{email}</strong>
                    </p>
                    
                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                      Enter OTP
                    </label>
                    <div className="flex justify-center gap-2 mb-4">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                          className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300"
                          required
                        />
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-sm text-[#ED2024] disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full px-6 py-3 bg-[#ED2024] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : (
                      <>
                        Verify OTP
                        <FiArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <form
                  onSubmit={handlePasswordReset}
                  className="space-y-5"
                >
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setError('');
                        }}
                        className="w-full px-4 pr-12 py-3 border border-gray-300"
                        placeholder="Enter new password (min 6 characters)"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                      >
                        {showNewPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError('');
                        }}
                        className="w-full px-4 pr-12 py-3 border border-gray-300"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                      >
                        {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-[#ED2024] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : (
                      <>
                        Reset Password
                        <FiArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm text-gray-600"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Did you remember your password?{' '}
              <Link href="/login" className="text-[#ED2024]">
                Try Logging in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth';
import RegisterForm from '@/components/RegisterForm';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get('tab') === 'register' ? 'register' : 'signin';
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign in state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateSignInForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateSignInForm()) {
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    password: string;
    country: string;
  }) => {
    setError('');
    setLoading(true);

    try {
      await signUp(data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#111111] border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc62d] focus:ring-1 focus:ring-[#ffc62d] transition-all duration-200 hover:border-gray-600";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-1.5";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={240}
              height={64}
              className="mx-auto h-16 w-auto"
              priority
            />
          </div>

          <div className="bg-[#0a0a0a] rounded-xl p-6 shadow-xl border border-gray-800/50">
            <div className="flex mb-6">
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-2.5 text-center border-b-2 transition-all duration-200 ${
                  activeTab === 'signin'
                    ? 'border-[#ffc62d] text-[#ffc62d]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 text-center border-b-2 transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'border-[#ffc62d] text-[#ffc62d]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {activeTab === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-5">
                {error && (
                  <div className="bg-red-900/50 text-red-400 p-3.5 rounded-lg text-sm border border-red-900/50 animate-fadeIn">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className={labelClasses}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationErrors.email) {
                        setValidationErrors(prev => ({ ...prev, email: undefined }));
                      }
                    }}
                    className={`${inputClasses} ${validationErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="example@gmail.com"
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className={labelClasses}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (validationErrors.password) {
                          setValidationErrors(prev => ({ ...prev, password: undefined }));
                        }
                      }}
                      className={`${inputClasses} ${validationErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter your password"
                    />
                    {validationErrors.password && (
                      <p className="mt-1 text-sm text-red-400">{validationErrors.password}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-700 bg-[#111111] text-[#ffc62d] focus:ring-[#ffc62d] focus:ring-offset-0 transition-colors"
                    />
                    <span className="ml-2 text-sm text-gray-400">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-gray-400 hover:text-[#ffc62d] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ffc62d] text-black py-2.5 rounded-lg font-medium hover:bg-[#ffd65c] transition-all duration-200 disabled:opacity-50 disabled:hover:bg-[#ffc62d] transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>
            ) : (
              <RegisterForm
                onSubmit={handleRegister}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
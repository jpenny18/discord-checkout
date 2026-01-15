'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth';
import RegisterForm from '@/components/RegisterForm';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
    </div>
  );
}

function AuthContent() {
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

  const inputClasses = "w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#ffc62d] focus:ring-1 focus:ring-[#ffc62d] transition-all duration-200 hover:border-white/20";
  const labelClasses = "block text-xs font-medium text-gray-300 mb-1.5";

  return (
    <div className="min-h-screen bg-[#09090b] text-white relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ffc62d]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/3 rounded-full blur-[180px]" />
      </div>

      {/* Content Container */}
      <div className="relative min-h-screen flex">
        {/* Left Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8 lg:mb-12">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={200}
                height={54}
                className="mx-auto h-14 w-auto"
                priority
              />
              <h1 className="mt-6 text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="mt-2 text-gray-400 text-sm">
                Sign in to access your trading journey
              </p>
            </div>

            {/* Auth Card */}
            <div className="backdrop-blur-xl rounded-2xl p-5 lg:p-6 shadow-2xl border" style={{
              backgroundColor: 'color-mix(in oklab, var(--color-white) 3%, transparent)',
              borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)'
            }}>
              {/* Tabs */}
              <div className="flex mb-6 p-1 rounded-lg border" style={{
                backgroundColor: 'color-mix(in oklab, var(--color-white) 2%, transparent)',
                borderColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)'
              }}>
                <button
                  onClick={() => setActiveTab('signin')}
                  className={`flex-1 py-2.5 text-center rounded-md transition-all duration-200 font-medium text-sm ${
                    activeTab === 'signin'
                      ? 'bg-[#ffc62d] text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-2.5 text-center rounded-md transition-all duration-200 font-medium text-sm ${
                    activeTab === 'register'
                      ? 'bg-[#ffc62d] text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>

              {activeTab === 'signin' ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  {error && (
                    <div className="bg-red-500/10 backdrop-blur-sm text-red-400 p-3 rounded-lg text-xs border border-red-500/20 animate-fadeIn">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      Email Address
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
                      placeholder="you@example.com"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>
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
                        className={`${inputClasses} pr-12 ${validationErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="mt-1 text-xs text-red-400">{validationErrors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-gray-600 bg-black/40 text-[#ffc62d] focus:ring-[#ffc62d] focus:ring-offset-0 transition-colors"
                      />
                      <span className="ml-2 text-xs text-gray-300 group-hover:text-white transition-colors">
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-xs text-gray-400 hover:text-[#ffc62d] transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#ffc62d] to-[#ffb700] text-black py-2.5 rounded-lg font-semibold text-sm hover:shadow-[0_0_30px_rgba(255,198,45,0.4)] transition-all duration-200 disabled:opacity-50 disabled:hover:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      'Sign In'
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

            {/* Footer Text */}
            <p className="mt-6 text-center text-sm text-gray-400">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-[#ffc62d] hover:text-[#ffd65c] transition-colors">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy" className="text-[#ffc62d] hover:text-[#ffd65c] transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Right Side - Hero Content (Hidden on mobile, visible on desktop) */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative z-10 px-12">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/5" />
          <div className="max-w-lg space-y-8 relative z-10">
            {/* Hero Text */}
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Trade with
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#ffc62d] to-[#ffb700] bg-clip-text text-transparent">
                  Confidence
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Start mastering the markets with our comprehensive training and trading tools.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                'Professional Trading Journal',
                'Zero to Confident Education',
                'Real-Time Market Alerts',
                'Trading Competitions'
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-4 p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                    borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)'
                  }}
                >
                  <span className="text-lg font-medium text-white">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t" style={{
              borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)'
            }}>
              {[
                { value: '150k+', label: 'Trades Journaled' },
                { value: '200+', label: 'Completed Training' },
                { value: '4', label: 'Monthly Competitions' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#ffc62d] to-[#ffb700] bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Glow Effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-[#ffc62d]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthContent />
    </Suspense>
  );
}

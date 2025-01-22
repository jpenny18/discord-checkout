'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface RegisterFormProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    password: string;
    country: string;
  }) => Promise<void>;
  loading: boolean;
  error: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  country?: string;
}

export default function RegisterForm({ onSubmit, loading, error }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+1',
    password: '',
    country: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Name validation
    if (formData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (formData.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    // Country validation
    if (!formData.country) {
      errors.country = 'Please select your country';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClasses = "w-full bg-[#111111] border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc62d] focus:ring-1 focus:ring-[#ffc62d] transition-all duration-200 hover:border-gray-600";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-1.5";
  const selectClasses = `${inputClasses} appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")] bg-no-repeat bg-right-4 bg-[length:20px_20px]`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/50 text-red-400 p-3.5 rounded-lg text-sm border border-red-900/50 animate-fadeIn">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="firstName" className={labelClasses}>
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleInput}
            className={`${inputClasses} ${validationErrors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="John"
          />
          {validationErrors.firstName && (
            <p className="mt-1 text-sm text-red-400">{validationErrors.firstName}</p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className={labelClasses}>
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleInput}
            className={`${inputClasses} ${validationErrors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Doe"
          />
          {validationErrors.lastName && (
            <p className="mt-1 text-sm text-red-400">{validationErrors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInput}
          className={`${inputClasses} ${validationErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
          placeholder="example@gmail.com"
        />
        {validationErrors.email && (
          <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className={labelClasses}>
          Phone
        </label>
        <div className="grid grid-cols-[100px_1fr] gap-2">
          <select
            id="countryCode"
            name="countryCode"
            required
            value={formData.countryCode}
            onChange={handleInput}
            className={selectClasses}
          >
            <option value="+1">+1</option>
            <option value="+44">+44</option>
            <option value="+61">+61</option>
            {/* Add more country codes as needed */}
          </select>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleInput}
            className={`${inputClasses} ${validationErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="123-456-7890"
          />
        </div>
        {validationErrors.phone && (
          <p className="mt-1 text-sm text-red-400">{validationErrors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="country" className={labelClasses}>
          Country of residence
        </label>
        <select
          id="country"
          name="country"
          required
          value={formData.country}
          onChange={handleInput}
          className={`${selectClasses} ${validationErrors.country ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
        >
          <option value="">Select country</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="CA">Canada</option>
          {/* Add more countries as needed */}
        </select>
        {validationErrors.country && (
          <p className="mt-1 text-sm text-red-400">{validationErrors.country}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className={labelClasses}>
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleInput}
            className={`${inputClasses} ${validationErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter your password"
          />
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
        {validationErrors.password && (
          <p className="mt-1 text-sm text-red-400">{validationErrors.password}</p>
        )}
      </div>

      <div className="text-sm text-gray-400 bg-[#111111] p-4 rounded-lg border border-gray-800/50">
        Note that only one registration is allowed per client. Multiple registrations or registrations with invalid data may lead to the termination of the services.
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
          'Register'
        )}
      </button>
    </form>
  );
} 
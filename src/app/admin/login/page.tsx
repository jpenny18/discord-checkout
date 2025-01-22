'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signIn } from '@/lib/auth';
import Image from 'next/image';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signIn(email, password);
      
      // Check if user has admin role in Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      
      if (!userData?.roles?.includes('admin')) {
        throw new Error('Unauthorized access');
      }

      router.push('/admin');
    } catch (error) {
      setError('Invalid credentials or unauthorized access');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already logged in as admin
  if (user) {
    router.push('/admin');
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="Ascendant Academy Logo"
            width={64}
            height={64}
            className="mx-auto rounded-full"
          />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Admin Login
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-lg bg-[#111111] p-6">
            {error && (
              <div className="rounded-lg bg-red-900/50 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-[#1a1a1a] px-3 py-2 text-white focus:border-[#ffc62d] focus:outline-none focus:ring-1 focus:ring-[#ffc62d]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#ffc62d] px-4 py-2 text-center text-sm font-medium text-black transition-colors hover:bg-[#ffd35f] disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
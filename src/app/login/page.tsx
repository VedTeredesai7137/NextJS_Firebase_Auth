'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser, validateEmail, validatePassword, onAuthStateChanged, getAuth } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        router.push('/home');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) {
      setError(emailError);
      return;
    }
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      await loginUser(email, password);
      router.push('/home');
    } catch (error: unknown) {
      const authError = error as { userFriendlyMessage?: string };
      setError(authError.userFriendlyMessage || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-5 font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-black mb-2">
            Welcome Back
          </h1>
          <p className="text-base text-gray-600">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-6 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-medium text-black mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white text-black outline-none transition-colors focus:border-emerald-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white text-black outline-none transition-colors focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-5 text-white border-none rounded-lg text-base font-medium transition-colors mb-6 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-600 cursor-pointer'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 m-0">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-emerald-500 no-underline font-medium hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
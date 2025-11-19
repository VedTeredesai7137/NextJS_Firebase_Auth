'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, auth } from '@/lib/firebase';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/home');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-base m-0">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-black m-0">Reg-login</h1>
            </div>
            <nav className="flex gap-4">
              <Link href="/login">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded cursor-pointer transition-all hover:bg-gray-50">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 border border-transparent rounded cursor-pointer transition-all hover:bg-emerald-600">
                  Get Started
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4">
        <div className="py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-emerald-500">Reg-login</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              A secure and modern authentication system built with Firebase and Next.js.
              Create your account or sign in to get started.
            </p>

            <div className="flex flex-col gap-4 justify-center mb-16">
              <Link href="/register">
                <button className="text-lg py-4 px-8 w-full font-medium text-white bg-emerald-500 border border-transparent rounded-lg cursor-pointer transition-all hover:bg-emerald-600">
                  Create Account
                </button>
              </Link>
              <Link href="/login">
                <button className="text-lg py-4 px-8 w-full font-medium text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the power of modern authentication with these key features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Secure Authentication
              </h4>
              <p className="text-gray-600">
                Built with Firebase Auth for enterprise-grade security and reliability
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Lightning Fast
              </h4>
              <p className="text-gray-600">
                Optimized performance with Next.js and modern web technologies
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Beautiful Design
              </h4>
              <p className="text-gray-600">
                Clean, modern interface with a consistent green theme throughout
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of users who trust our secure authentication system
            </p>
            <div className="flex flex-col gap-4 justify-center">
              <Link href="/register">
                <button className="text-lg py-4 px-8 w-full font-medium text-white bg-emerald-500 border border-transparent rounded-lg cursor-pointer transition-all hover:bg-emerald-600">
                  Create Your Account
                </button>
              </Link>
              <Link href="/login">
                <button className="text-lg py-4 px-8 w-full font-medium text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                  Already Have an Account?
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h4 className="text-lg font-bold text-gray-900 mb-2">Reg-login</h4>
          <p className="text-gray-600">Firebase YEa - Secure Authentication Made Simple</p>
        </div>
      </footer>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, auth, User } from '@/lib/firebase';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        router.push('/home');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#666666', fontSize: '16px', margin: '0' }}>Loading...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e5e5',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#000000',
                margin: '0'
              }}>
                Reg-login
              </h1>
            </div>
            <nav style={{ display: 'flex', gap: '16px' }}>
              <Link href="/login">
                <button style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ffffff',
                  backgroundColor: '#10b981',
                  border: '1px solid transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  Get Started
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{" "}
              <span className="text-green-600">Reg-login</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              A secure and modern authentication system built with Firebase and Next.js. 
              Create your account or sign in to get started.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/register">
                <button className="text-lg px-8 py-4 w-full sm:w-auto font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Create Account
                </button>
              </Link>
              <Link href="/login">
                <button className="text-lg px-8 py-4 w-full sm:w-auto font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
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
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Secure Authentication</h4>
              <p className="text-gray-600">
                Built with Firebase Auth for enterprise-grade security and reliability
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h4>
              <p className="text-gray-600">
                Optimized performance with Next.js and modern web technologies
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Beautiful Design</h4>
              <p className="text-gray-600">
                Clean, modern interface with a consistent green theme throughout
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16">
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of users who trust our secure authentication system
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="text-lg px-8 py-4 w-full sm:w-auto font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Create Your Account
                </button>
              </Link>
              <Link href="/login">
                <button className="text-lg px-8 py-4 w-full sm:w-auto font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Already Have an Account?
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Reg-login</h4>
            <p className="text-gray-600">Firebase YEa - Secure Authentication Made Simple</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
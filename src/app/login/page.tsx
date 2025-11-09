'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser, validateEmail, validatePassword, onAuthStateChanged, auth } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
    } catch (error: any) {
      setError(error.userFriendlyMessage || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#000000',
            margin: '0 0 8px 0'
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666666',
            margin: '0'
          }}>
            Sign in to your account
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '24px',
                color: '#dc2626',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                marginBottom: '6px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                marginBottom: '6px'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 20px',
                backgroundColor: isLoading ? '#9ca3af' : '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                marginBottom: '24px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) (e.target as HTMLElement).style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) (e.target as HTMLElement).style.backgroundColor = '#10b981';
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div style={{
            textAlign: 'center',
            paddingTop: '16px',
            borderTop: '1px solid #f3f4f6'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#666666',
              margin: '0'
            }}>
              Don't have an account?{' '}
              <Link 
                href="/register" 
                style={{
                  color: '#10b981',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.textDecoration = 'underline'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.textDecoration = 'none'}
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
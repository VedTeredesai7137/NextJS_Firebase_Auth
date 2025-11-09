'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser, onAuthStateChanged, getAuth, User } from '@/lib/firebase';

// Prevent static generation - this page requires client-side Firebase
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;
    
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{
            color: '#666666',
            fontSize: '16px',
            margin: '0'
          }}>
            Loading...
          </p>
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

  if (!user) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e5e5',
        padding: '0 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#000000',
            margin: '0'
          }}>
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffffff',
              color: '#dc2626',
              border: '1px solid #dc2626',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isLoggingOut ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLoggingOut) {
                (e.target as HTMLElement).style.backgroundColor = '#dc2626';
                (e.target as HTMLElement).style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoggingOut) {
                (e.target as HTMLElement).style.backgroundColor = '#ffffff';
                (e.target as HTMLElement).style.color = '#dc2626';
              }
            }}
          >
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Welcome Section */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#166534',
            margin: '0 0 8px 0'
          }}>
            Welcome back, {user.displayName || 'User'}! 👋
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#15803d',
            margin: '0'
          }}>
            You have successfully logged in to your account.
          </p>
        </div>

        {/* Account Information */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#000000',
            margin: '0 0 24px 0'
          }}>
            Account Information
          </h3>
          
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Name
              </span>
              <span style={{
                fontSize: '14px',
                color: '#000000'
              }}>
                {user.displayName || 'Not provided'}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Email
              </span>
              <span style={{
                fontSize: '14px',
                color: '#000000'
              }}>
                {user.email}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Account Created
              </span>
              <span style={{
                fontSize: '14px',
                color: '#000000'
              }}>
                {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Last Sign In
              </span>
              <span style={{
                fontSize: '14px',
                color: '#000000'
              }}>
                {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: '32px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#000000',
            margin: '0 0 24px 0'
          }}>
            Quick Actions
          </h3>
          
          <div style={{
            display: 'grid',
            gap: '12px'
          }}>
            <button style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#f9fafb';
              (e.target as HTMLElement).style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#ffffff';
              (e.target as HTMLElement).style.borderColor = '#e5e5e5';
            }}>
              Update Profile
            </button>
            
            <button style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#f9fafb';
              (e.target as HTMLElement).style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#ffffff';
              (e.target as HTMLElement).style.borderColor = '#e5e5e5';
            }}>
              Change Password
            </button>
            
            <button style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#f9fafb';
              (e.target as HTMLElement).style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#ffffff';
              (e.target as HTMLElement).style.borderColor = '#e5e5e5';
            }}>
              Account Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
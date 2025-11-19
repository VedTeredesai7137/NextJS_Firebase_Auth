'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser, onAuthStateChanged, getAuth, User } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-base m-0">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold text-black m-0">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`px-4 py-2 bg-white text-red-600 border border-red-600 rounded text-sm font-medium transition-all ${
              isLoggingOut 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:bg-red-600 hover:text-white cursor-pointer'
            }`}
          >
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-10 px-5">
        {/* Welcome Section */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 mb-8 text-center">
          <h2 className="text-3xl font-semibold text-green-800 mb-2">
            Welcome back, {user.displayName || 'User'}! 👋
          </h2>
          <p className="text-base text-green-700 m-0">
            You have successfully logged in to your account.
          </p>
        </div>

        {/* Account Information */}
        <div className="bg-white border border-gray-300 rounded-xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-black mb-6">
            Account Information
          </h3>
          
          <div className="grid gap-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">Name</span>
              <span className="text-sm text-black">{user.displayName || 'Not provided'}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <span className="text-sm text-black">{user.email}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">Account Created</span>
              <span className="text-sm text-black">
                {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-700">Last Sign In</span>
              <span className="text-sm text-black">
                {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-300 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-black mb-6">
            Quick Actions
          </h3>
          
          <div className="grid gap-3">
            <button className="w-full py-4 px-5 bg-white text-black border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-all text-left hover:bg-gray-50 hover:border-emerald-500">
              Update Profile
            </button>
            
            <button className="w-full py-4 px-5 bg-white text-black border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-all text-left hover:bg-gray-50 hover:border-emerald-500">
              Change Password
            </button>
            
            <button className="w-full py-4 px-5 bg-white text-black border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-all text-left hover:bg-gray-50 hover:border-emerald-500">
              Account Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
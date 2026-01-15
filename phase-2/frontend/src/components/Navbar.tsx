import React from 'react';
import Link from 'next/link';
import { mockAuth } from '../lib/auth';

interface NavbarProps {
  user?: {
    id: string;
    email: string;
    name: string;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const handleLogout = async () => {
    await mockAuth.signOut();
    // In a real app, this would redirect to home page
    window.location.href = '/';
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">
            Todo App
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden md:inline text-gray-300">Welcome, {user.name}</span>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
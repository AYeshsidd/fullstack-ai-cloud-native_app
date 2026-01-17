'use client';

import React, { useState, useEffect } from 'react';
import { TodoList } from '../../components/TodoList';
import { TodoForm } from '../../components/TodoForm';
import { Navbar } from '../../components/Navbar';
import { mockAuth } from '../../lib/auth';

export default function DashboardPage() {
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [todoStats, setTodoStats] = useState({ total: 0, pending: 0, completed: 0 });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get current user from auth
        let currentUser = mockAuth.getCurrentUser();

        if (!currentUser) {
          // Try to get user from auth state
          currentUser = mockAuth.getUser();
        }

        if (currentUser && currentUser.id) {
          setUserId(currentUser.id);
        } else {
          // If no user in state, try to refresh user data from API
          const refreshedUser = await mockAuth.refreshUser();

          if (refreshedUser && refreshedUser.id) {
            setUserId(refreshedUser.id);
          } else {
            // Check if there's a token in localStorage that might indicate a logged-in user
            if (typeof window !== 'undefined') {
              const token = localStorage.getItem('access_token');
              if (token) {
                setError('User session found but user data not loaded. Please log in again.');
              } else {
                setError('User not authenticated');
              }
            } else {
              setError('User not authenticated');
            }
          }
        }
      } catch (err) {
        setError('Authentication check failed');
      } finally {
        setLoading(false);
      }
    };

    // Wait a bit to ensure auth state is properly initialized
    const timer = setTimeout(checkAuth, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleAddTodo = (todo: any) => {
    // The TodoList component will automatically update the list
    setSuccess('Todo added successfully!');
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleAddSuccess = (message: string) => {
    setSuccess(message);
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleAddError = (message: string) => {
    setError(message);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Navbar user={mockAuth.getCurrentUser() || mockAuth.getUser() || null} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feedback messages */}
        {(error || success) && (
          <div className={`mb-6 rounded-lg p-4 shadow-md transform transition-all duration-300 ${error ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'} animate-fadeIn`}>
            <div className="flex items-start">
              <div className={error ? 'text-red-500' : 'text-green-500'}>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  {error ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  )}
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm ${error ? 'text-red-700' : 'text-green-700'}`}>
                  {error || success}
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => { setError(null); setSuccess(null); }}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {mockAuth.getCurrentUser()?.name?.charAt(0).toUpperCase() ||
                 mockAuth.getUser()?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="ml-4 text-left">
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome back, {mockAuth.getCurrentUser()?.name?.split(' ')[0] ||
                              mockAuth.getUser()?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage your tasks efficiently and stay productive
              </p>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600">
              Organize your work and life. Track your progress and achieve your goals one task at a time.
            </p>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-transform duration-300 hover:scale-[1.02] animate-fadeIn">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
                <p className="text-2xl font-bold text-gray-900">{todoStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-transform duration-300 hover:scale-[1.02] animate-fadeIn delay-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-2xl font-bold text-gray-900">{todoStats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-transform duration-300 hover:scale-[1.02] animate-fadeIn delay-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="text-2xl font-bold text-gray-900">{todoStats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="transform transition-transform duration-300 hover:-translate-y-1 animate-fadeIn">
            <TodoForm
              userId={userId}
              onAddTodo={handleAddTodo}
              onAddSuccess={handleAddSuccess}
              onAddError={handleAddError}
            />
          </div>
          <div className="transform transition-transform duration-300 hover:-translate-y-1 animate-fadeIn delay-100">
            <TodoList
              userId={userId}
              onStatsChange={setTodoStats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
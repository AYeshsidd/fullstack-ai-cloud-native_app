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
    // Refresh the todo list after adding a new one
    console.log('Added new todo:', todo);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={null} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="text-red-500">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <a
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );

  const user = mockAuth.getCurrentUser() || mockAuth.getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user || null} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Todo Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your tasks efficiently</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <TodoForm userId={userId} onAddTodo={handleAddTodo} />
          </div>

          <div>
            <TodoList userId={userId}/>
          </div>
          


          <div>
             
          </div>
        </div>
      </div>
    </div>
  );
}
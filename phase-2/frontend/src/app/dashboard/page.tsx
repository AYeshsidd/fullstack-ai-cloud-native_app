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
    // In a real implementation, we would get the user from the auth provider
    const currentUser = mockAuth.getCurrentUser();
    if (currentUser) {
      setUserId(currentUser.id);
    } else {
      setError('User not authenticated');
    }
    setLoading(false);
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
      </div>
    </div>
  );

  const user = mockAuth.getCurrentUser();

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
            <TodoList userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
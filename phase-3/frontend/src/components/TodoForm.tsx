import React, { useState } from 'react';
import { apiClient, CreateTodoData } from '../lib/api-client';

interface TodoFormProps {
  userId: string;
  onAddTodo: (todo: any) => void;
  onAddSuccess?: (message: string) => void;
  onAddError?: (message: string) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ userId, onAddTodo, onAddSuccess, onAddError }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      onAddError && onAddError('Title is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const todoData: CreateTodoData = {
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false
      };

      const response = await apiClient.createTodo(userId, todoData);

      if (response.success && response.data) {
        onAddTodo(response.data);
        setTitle('');
        setDescription('');
        onAddSuccess && onAddSuccess('Todo added successfully!');
      } else {
        const errorMsg = response.error || 'Failed to create todo';
        setError(errorMsg);
        onAddError && onAddError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMsg);
      onAddError && onAddError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-bold text-gray-900">Create New Task</h3>
          <p className="text-sm text-gray-500">Add a task to your todo list</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg p-4 bg-red-50 border-l-4 border-red-500 animate-fadeIn">
          <div className="flex items-start">
            <div className="text-red-500">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 shadow-sm hover:shadow-md"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about this task..."
            rows={3}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 shadow-sm hover:shadow-md resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Task...
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="-ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Task
            </span>
          )}
        </button>
      </form>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { TodoItem } from './TodoItem';
import { apiClient, TodoTask } from '../lib/api-client';

interface TodoListProps {
  userId: string;
}

export const TodoList: React.FC<TodoListProps> = ({ userId }) => {
  const [todos, setTodos] = useState<TodoTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, [userId]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getTodos(userId);

      if (response.success && response.data) {
        setTodos(response.data);
      } else {
        setError(response.error || 'Failed to fetch todos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const response = await apiClient.deleteTodo(userId, id);

    if (response.success) {
      setTodos(todos.filter(todo => todo.id !== id));
    } else {
      setError(response.error || 'Failed to delete todo');
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const response = await apiClient.updateTodoCompletion(userId, id, !completed);

    if (response.success && response.data) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    } else {
      setError(response.error || 'Failed to update todo');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
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
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Todo List</h2>
      {todos.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No todos yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new todo.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
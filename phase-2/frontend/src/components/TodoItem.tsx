import React from 'react';
import { TodoTaskRead } from '../../../backend/schemas/todo'; // This would be an API response type in a real app

interface TodoItemProps {
  todo: TodoTaskRead;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onToggleComplete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      onDelete(todo.id);
    }
  };

  const handleToggle = () => {
    onToggleComplete(todo.id, todo.completed);
  };

  return (
    <li className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <div className="flex-1 min-w-0">
          <p className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {todo.title}
          </p>
          {todo.description && (
            <p className="text-sm text-gray-500 mt-1">
              {todo.description}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Created: {new Date(todo.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </li>
  );
};
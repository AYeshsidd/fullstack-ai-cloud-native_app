'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface AuthFormProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
  isLoading?: boolean;
  submitButtonText: string;
  linkText: string;
  linkHref: string;
  linkLabel: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  children,
  onSubmit,
  error,
  isLoading = false,
  submitButtonText,
  linkText,
  linkHref,
  linkLabel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-md w-full">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-1 bg-gradient-to-r from-indigo-500 to-cyan-500">
            <div className="bg-white rounded-xl p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600">
                  {subtitle}{' '}
                  <Link href={linkHref} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                    {linkLabel}
                  </Link>
                </p>
              </div>

              <form onSubmit={onSubmit} className="mt-8 space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-lg bg-red-50 p-4 border border-red-200"
                  >
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-5">
                  {children}
                </div>

                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      submitButtonText
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-sm text-gray-500">
          {linkText}{' '}
          <Link href={linkHref} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            {linkLabel}
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
'use client';

import React from 'react';
import Link from 'next/link';
import { mockAuth } from '../lib/auth';

export default function HomePage() {
  const user = mockAuth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-indigo-600">TodoFlow</h1>
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.name}</span>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <div className="flex space-x-3 md:space-x-4">
                  <Link
                    href="/auth/signin"
                    className=" px-1 py-1 md:px-4 md:py-2 text-gray-700 hover:shadow-lg hover:shadow-indigo-400 transition duration-200 border  border-indigo-500 rounded-xl md:rounded-2xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-1 py-1 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-400 transition duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Streamline Your <span className="text-indigo-600">Productivity</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A modern todo application designed to help you organize tasks, boost productivity, and achieve your goals with ease.
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 text-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg border border-indigo-600 hover:bg-indigo-50 transition duration-200 text-lg"
                >
                  Sign In
                </Link>
              </div>
            )}
            {user && (
              <Link
                href="/dashboard"
                className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 text-lg"
              >
                Start Managing Tasks
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your tasks efficiently and effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition duration-200 cursor-pointer hover:shadow-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Task Management</h3>
              <p className="text-gray-600">Create, update, and organize your tasks with ease. Mark them as complete and track your progress.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg hover:shadow-indigo-200 cursor-pointer transition duration-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Authentication</h3>
              <p className="text-gray-600">Enterprise-grade security with JWT authentication and encrypted data storage for your peace of mind.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition duration-200 cursor-pointer hover:shadow-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cross-Device Sync</h3>
              <p className="text-gray-600">Access your tasks from anywhere. Stay productive across all your devices with real-time synchronization.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition duration-200 cursor-pointer hover:shadow-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">Instant updates across all devices. Changes reflect immediately without any manual refresh needed.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition duration-200 cursor-pointer hover:shadow-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Organization</h3>
              <p className="text-gray-600">Intelligent categorization and tagging system to keep your tasks organized and searchable.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition duration-200 cursor-pointer hover:shadow-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Time Tracking</h3>
              <p className="text-gray-600">Monitor how much time you spend on different tasks to optimize your productivity and efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Use Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Should Use TodoFlow?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed for individuals and teams who want to stay organized and productive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Students</h3>
              <p className="text-gray-600 text-center">
                Organize assignments, track deadlines, and manage study schedules to excel academically.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Professionals</h3>
              <p className="text-gray-600 text-center">
                Manage work projects, prioritize tasks, and collaborate with team members for maximum efficiency.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Teams</h3>
              <p className="text-gray-600 text-center">
                Collaborate on projects, assign tasks, and track team progress with shared workspaces and dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of users who have transformed their workflow with TodoFlow.
          </p>
          {!user && (
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition duration-200 text-lg"
            >
              Get Started Free
            </Link>
          )}
          {user && (
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition duration-200 text-lg"
            >
              Start Managing Tasks
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2026 TodoFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthForm } from '../../../components/auth/AuthForm';
import { ControlledPasswordVisibilityToggle } from '../../../components/auth/PasswordVisibilityToggle';
import { mockAuth } from '../../../lib/auth';
import { signinSchema, SigninFormData } from '../../../lib/validation';

export default function SigninPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await mockAuth.signIn(data.email, data.password);

      if (result.error) {
        setError(result.error);
      } else {
        // Redirect to dashboard on successful sign in
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Sign in to your account"
      subtitle="Or"
      onSubmit={handleSubmit(onSubmit)}
      error={error}
      isLoading={isLoading}
      submitButtonText="Sign In"
      linkText="Don't have an account?"
      linkHref="/auth/signup"
      linkLabel="Sign up"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          disabled={isLoading}
          placeholder="Enter your email"
          className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <ControlledPasswordVisibilityToggle
          control={control}
          name="password"
          id="password"
          placeholder="Enter your password"
          disabled={isLoading}
          label=""
          required={true}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
    </AuthForm>
  );
}
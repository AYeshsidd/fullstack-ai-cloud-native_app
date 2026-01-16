import { z } from 'zod';

// Define Zod schema for signup form
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    })
});

// Define Zod schema for signin form
export const signinSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
});

// Define TypeScript types based on Zod schemas
export type SignupFormData = z.infer<typeof signupSchema>;
export type SigninFormData = z.infer<typeof signinSchema>;
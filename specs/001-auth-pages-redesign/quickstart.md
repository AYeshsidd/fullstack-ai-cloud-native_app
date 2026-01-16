# Quickstart Guide: Auth Pages Redesign

**Feature**: Auth Pages Redesign (Phase II: Full-Stack Web Application)
**Branch**: `001-auth-pages-redesign`
**Created**: 2026-01-15

## Overview

This guide provides instructions to quickly set up and run the authentication pages redesign. The implementation upgrades the Sign Up and Sign In pages to match the modern, professional SaaS design of the Home page, using the same color palette, typography, and design principles.

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- npm or yarn package manager
- Access to the project repository

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Navigate to the Phase 2 Directory

```bash
cd phase-2
```

### 3. Set up the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### 4. Set up the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd phase-2/frontend  # From the repository root
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Key Endpoints

### Backend API (running on http://localhost:8000)
- Authentication endpoints follow the pattern: `/api/v1/auth/`
- Todo endpoints follow the pattern: `/api/v1/users/{user_id}/tasks`

### Frontend (running on http://localhost:3000)
- Sign Up page: `/auth/signup`
- Sign In page: `/auth/signin`
- Dashboard: `/dashboard`

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/todo_app
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

## Running the Application

1. Ensure both backend (port 8000) and frontend (port 3000) servers are running
2. Open your browser to `http://localhost:3000`
3. Navigate to the sign up page at `/auth/signup` to create a new account
4. Use the sign in page at `/auth/signin` to log in with an existing account

## Testing the Auth Pages Redesign

1. Visit the sign up page (`/auth/signup`) and verify the modern SaaS design:
   - Consistent color palette with the home page
   - Modern form layout and spacing
   - Smooth animations on input focus and button hover
   - Password visibility toggle
   - Form validation feedback

2. Visit the sign in page (`/auth/signin`) and verify the same design elements

3. Test the responsive design on different screen sizes

4. Verify that form validation works correctly with appropriate error messages

## Troubleshooting

### Common Issues

1. **Backend not connecting to database**:
   - Verify your DATABASE_URL in `.env` is correct
   - Ensure your PostgreSQL server is running

2. **Frontend can't connect to backend**:
   - Verify NEXT_PUBLIC_API_URL in `.env.local` points to your running backend
   - Check that the backend server is running on the specified port

3. **Authentication not working**:
   - Ensure both frontend and backend are using the same JWT_SECRET
   - Verify that CORS settings allow requests from frontend to backend

### API Documentation
Backend API documentation is available at `http://localhost:8000/docs` when the server is running.
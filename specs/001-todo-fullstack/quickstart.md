# Quickstart Guide: Evolution of Todo - Phase II Full-Stack Web Application

## Overview
This guide provides instructions for setting up and running the full-stack Todo application with authentication and persistent storage.

## Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL-compatible database (Neon Serverless PostgreSQL recommended)
- Git

## Environment Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd Ai_Todo
```

### 2. Set up the project structure
```bash
mkdir -p phase-2/{frontend,backend}
```

### 3. Environment Variables
Copy the example environment files and configure them:

**Backend (.env)**:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_app
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

## Backend Setup (FastAPI)

### 1. Navigate to backend directory
```bash
cd phase-2/backend
```

### 2. Create virtual environment and install dependencies
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlmodel psycopg[binary] python-multipart python-jose[cryptography] passlib[bcrypt] python-dotenv better-exceptions
```

### 3. Create the project structure
```bash
mkdir -p models schemas api database core
touch main.py requirements.txt
```

### 4. Run the backend server
```bash
uvicorn main:app --reload --port 8000
```

## Frontend Setup (Next.js)

### 1. Navigate to frontend directory
```bash
cd phase-2/frontend
```

### 2. Initialize Next.js project
```bash
npm create next-app@latest .
# Select options: App Router, TypeScript, ESLint, Tailwind CSS, etc.
```

### 3. Install additional dependencies
```bash
npm install @types/node @types/react @types/react-dom better-auth
```

### 4. Run the development server
```bash
npm run dev
```

## Database Setup

### 1. Initialize the database
```bash
cd phase-2/backend
# Run database initialization script
python -c "
from database.session import engine
from models.todo import User, TodoTask
from sqlmodel import SQLModel

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

import asyncio
asyncio.run(create_tables())
"
```

## Running the Application

### 1. Start the backend
```bash
cd phase-2/backend
uvicorn main:app --reload --port 8000
```

### 2. In a new terminal, start the frontend
```bash
cd phase-2/frontend
npm run dev
```

### 3. Access the application
- Frontend: http://localhost:3000
- Backend API docs: http://localhost:8000/docs
- Backend API redoc: http://localhost:8000/redoc

## API Endpoints

Once running, the following API endpoints will be available:

- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task for a user
- `GET /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a specific task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a specific task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Update task completion status

## Authentication

All API endpoints (except authentication endpoints) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token_here>
```

Tokens are obtained by registering/logging in through the frontend application.

## Development Commands

### Backend
```bash
# Run with auto-reload
uvicorn main:app --reload

# Run tests
pytest

# Format code
black .
```

### Frontend
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Format code
npm run format
```
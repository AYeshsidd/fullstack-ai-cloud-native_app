# Evolution of Todo - Phase II: Full-Stack Web Application

This is the Phase II implementation of the Todo application, transforming it from a console-based app to a full-stack web application with authentication and persistent storage.

## Project Structure

```
phase-2/
├── backend/                 # FastAPI backend with authentication and database
│   ├── main.py             # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   ├── models/             # Database models (SQLModel)
│   ├── schemas/            # Pydantic schemas
│   ├── api/                # API routes
│   ├── database/           # Database session management
│   ├── core/               # Core utilities (security, config)
│   └── tests/              # Backend tests
├── frontend/               # Next.js frontend application
│   ├── package.json        # Node.js dependencies
│   ├── next.config.js      # Next.js configuration
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # Utility functions
│   │   └── styles/         # Global styles
│   └── public/             # Static assets
└── README.md               # This file
```

## Technologies Used

- **Frontend**: Next.js 16+ with App Router
- **Backend**: FastAPI with Python 3.11+
- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLModel
- **Authentication**: Better Auth with JWT tokens

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL-compatible database (Neon Serverless PostgreSQL recommended)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd phase-2/backend
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

4. Set up environment variables in `.env` file (copy from `.env.example`)

5. Run the application:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd phase-2/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local` file

4. Run the development server:
   ```bash
   npm run dev
   ```

## API Documentation

Backend API documentation is available at `http://localhost:8000/docs` when running the development server.

## Features

- User authentication and authorization
- Secure JWT-based authentication
- User-specific todo management
- All five core Todo operations: Add, View/List, Update, Delete, Mark complete/incomplete
- Data isolation between users
- Responsive web interface

## Security

- All API endpoints require authentication (except public auth endpoints)
- User data isolation enforced at the API level
- Secure JWT handling with proper expiration and validation
- Password hashing for user credentials
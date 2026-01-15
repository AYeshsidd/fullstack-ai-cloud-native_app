# Research Summary: Evolution of Todo - Phase II Full-Stack Web Application

## Overview
This document summarizes research conducted to support the implementation of the full-stack Todo application with authentication and persistent storage.

## Resolved Unknowns

### 1. Testing Framework Selection
**Decision**: Use Jest for frontend testing and pytest for backend testing
**Rationale**: Jest is the standard testing framework for Next.js applications and provides excellent integration with React/Next.js. Pytest is the standard for Python/FastAPI applications and integrates well with SQLModel.
**Alternatives considered**:
- Frontend: Vitest (faster but newer), Cypress (E2E focus)
- Backend: unittest (built-in but less feature-rich), nose (legacy)

### 2. Database Connection Pooling
**Decision**: Use SQLModel with SQLAlchemy engine configured with connection pooling
**Rationale**: SQLModel is built on SQLAlchemy which provides robust connection pooling out of the box. Neon Serverless PostgreSQL works well with connection pooling configurations.
**Alternatives considered**:
- Raw asyncpg (PostgreSQL-specific, less ORM features)
- Databases library (lighter but less feature-complete)

### 3. JWT Secret Management
**Decision**: Store JWT secret in environment variables shared between frontend and backend
**Rationale**: Environment variables are the standard approach for managing secrets in containerized/deployed applications. Sharing the secret enables both frontend (Better Auth) and backend (FastAPI) to validate JWT tokens.
**Alternatives considered**:
- Configuration management systems (overkill for this scale)
- Secrets management services (not needed for this phase)

### 4. Frontend API Client Strategy
**Decision**: Create a centralized API client that automatically injects JWT tokens
**Rationale**: Centralized approach ensures consistent authentication handling across all API calls and simplifies token management.
**Alternatives considered**:
- Individual API calls with manual token handling (error-prone)
- Third-party libraries like RTK Query or SWR (adds complexity)

### 5. User Identification from JWT Claims
**Decision**: Extract user ID from the 'sub' claim in JWT tokens
**Rationale**: The 'sub' (subject) claim is the standard location for user identifier in JWT tokens according to RFC 7519.
**Alternatives considered**:
- Custom claims (non-standard)
- Multiple claims for redundancy (unnecessary complexity)

## Architecture Patterns

### Backend Architecture
- FastAPI with dependency injection for clean separation of concerns
- SQLModel for ORM operations with proper async support
- Middleware for authentication validation
- Pydantic schemas for request/response validation

### Frontend Architecture
- Next.js App Router for page routing and layout management
- Better Auth for user authentication and session management
- Component-based architecture with reusable UI elements
- Client-side data fetching with proper error handling

### Security Considerations
- All API endpoints require authentication except public auth endpoints
- User data isolation enforced at the API level by filtering by user ID
- Proper CORS configuration to prevent cross-origin attacks
- Secure JWT handling with HttpOnly cookies where appropriate

## Technology Stack Justification

### Next.js (Frontend)
- React-based with excellent ecosystem
- Built-in optimizations (SSR, SSG, ISR)
- File-based routing with App Router
- Strong TypeScript support

### FastAPI (Backend)
- Modern Python web framework with async support
- Automatic API documentation (Swagger/OpenAPI)
- Built-in validation with Pydantic
- Excellent performance characteristics

### SQLModel (Data Layer)
- Combines SQLAlchemy and Pydantic
- Type-safe database models
- Async support for modern applications
- Maintained by the FastAPI author

### Better Auth (Authentication)
- Modern authentication solution designed for Next.js
- JWT support with refresh token rotation
- Social login capabilities for future expansion
- Good security practices out of the box
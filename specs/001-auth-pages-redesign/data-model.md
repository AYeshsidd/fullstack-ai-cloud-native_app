# Data Model: Evolution of Todo - Phase II: Full-Stack Web Application

## Overview
This document defines the data models for the authentication pages redesign feature. The primary data entities remain the same as the existing application, but we'll enhance the authentication flow with improved UI/UX elements.

## User Model

### User
Represents an authenticated user with unique identifier and account information.

**Fields**:
- `id`: String (Primary Key) - Unique identifier for the user
- `email`: String - User's email address (unique, valid email format)
- `name`: String - User's display name (1-100 characters)
- `hashed_password`: String - BCrypt hashed password (not exposed in responses)
- `created_at`: DateTime - Timestamp when user account was created
- `updated_at`: DateTime - Timestamp when user account was last updated

**Relationships**:
- One-to-many: User has many Todo Tasks

**Validation Rules**:
- Email must be unique across all users
- Email must follow valid email format
- Name must be 1-100 characters
- ID must be unique and immutable

## Todo Task Model

### TodoTask
Represents a user's task with all required properties and associations.

**Fields**:
- `id`: String (Primary Key) - Unique identifier for the task
- `title`: String - Task title (required, 1-200 characters)
- `description`: String - Optional task description (nullable, max 1000 characters)
- `completed`: Boolean - Whether the task is completed (default: false)
- `user_id`: String (Foreign Key) - Reference to the owning user
- `created_at`: DateTime - Timestamp when task was created
- `updated_at`: DateTime - Timestamp when task was last updated

**Relationships**:
- Many-to-one: TodoTask belongs to one User
- User owns multiple TodoTasks

**Validation Rules**:
- Title must be 1-200 characters
- Description must be null or 1-1000 characters if provided
- Completed must be boolean (true/false)
- User_id must reference an existing user
- A task can only be owned by one user
- Task cannot be created without a valid user reference

## Authentication-Specific Models

### UserRegistration
Represents the data required for user registration.

**Fields**:
- `email`: String - User's email address (required, unique, valid format)
- `name`: String - User's display name (required, 1-100 characters)
- `password`: String - User's password (required, min 8 characters with complexity)

**Validation Rules**:
- Email must follow valid format and be unique
- Name must be 1-100 characters
- Password must meet complexity requirements (min 8 chars, 1 uppercase, 1 lowercase, 1 number)

### UserLogin
Represents the data required for user authentication.

**Fields**:
- `email`: String - User's email address (required, valid format)
- `password`: String - User's password (required)

**Validation Rules**:
- Email must follow valid format
- Password must be provided

### UserSession
Represents an authenticated user session.

**Fields**:
- `user_id`: String - Reference to the authenticated user
- `access_token`: String - JWT access token
- `refresh_token`: String - JWT refresh token (optional)
- `expires_at`: DateTime - Expiration timestamp for the session
- `created_at`: DateTime - Timestamp when session was created

## State Transitions

### Todo Task States
- **Active**: Default state when task is created (completed = false)
- **Completed**: When task is marked as done (completed = true)

**Valid Transitions**:
- Active ↔ Completed (can toggle back and forth)

## Business Logic Constraints

1. **User Ownership**: Each task must be associated with exactly one user
2. **Data Isolation**: Users can only access/modify their own tasks
3. **Immutability**: Task ID and user_id cannot be changed after creation
4. **Timestamps**: created_at is set on creation, updated_at is updated on any modification

## API Integration Points

The data model supports all required API operations:
- Create: Insert new task with user_id
- Read: Query tasks filtered by user_id
- Update: Modify task properties except user_id
- Delete: Remove task (CASCADE removes from user)
- Complete: Toggle completed status
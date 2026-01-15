# Data Model: Evolution of Todo - Phase II Full-Stack Web Application

## Overview
This document defines the data models for the full-stack Todo application, including their fields, relationships, and validation rules.

## User Model

### User
Represents an authenticated user with unique identifier and account information.

**Fields**:
- `id`: String (Primary Key) - Unique identifier for the user
- `email`: String - User's email address (unique, valid email format)
- `name`: String - User's display name
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

## Indexes

1. **User ID Index**: On `user_id` field for efficient user-based queries
2. **Completed Status Index**: On `completed` field for filtering by completion status
3. **Creation Date Index**: On `created_at` field for chronological ordering
4. **Composite Index**: On `(user_id, created_at)` for efficient user timeline queries

## Database Schema

```sql
-- Users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Todo tasks table
CREATE TABLE todo_tasks (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_todo_tasks_user_id ON todo_tasks(user_id);
CREATE INDEX idx_todo_tasks_completed ON todo_tasks(completed);
CREATE INDEX idx_todo_tasks_created_at ON todo_tasks(created_at);
CREATE INDEX idx_todo_tasks_user_created ON todo_tasks(user_id, created_at);
```

## API Integration Points

The data model supports all required API operations:
- Create: Insert new task with user_id
- Read: Query tasks filtered by user_id
- Update: Modify task properties except user_id
- Delete: Remove task (CASCADE removes from user)
- Complete: Toggle completed status
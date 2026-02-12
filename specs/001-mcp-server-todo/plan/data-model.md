# Data Model: MCP Server & Todo Tools

**Feature**: MCP Server & Todo Tools
**Created**: 2026-02-08

## Todo Task Entity

### Fields
- **id** (string, primary key)
  - Unique identifier for the task
  - Auto-generated using UUID
- **title** (string, required)
  - Task title or description in short form
  - Length: 1-200 characters
- **description** (string, optional)
  - Detailed description of the task
  - Length: max 1000 characters
- **completed** (boolean)
  - Whether the task is completed or pending
  - Default: false
- **user_id** (string, foreign key)
  - Reference to the user who owns this task
  - Links to User entity id field
- **created_at** (datetime)
  - Timestamp when the task was created
  - Auto-populated on creation
- **updated_at** (datetime)
  - Timestamp when the task was last modified
  - Auto-populated on creation and updates

### Relationships
- **Belongs to**: User (via user_id foreign key)
  - Each task is owned by exactly one user
  - User can have many tasks

### Validation Rules
- Title must be 1-200 characters
- Description must be 0-1000 characters if provided
- user_id must reference an existing user
- completed field must be a boolean value

### State Transitions
- Initial state: `completed = false`
- Transition to: `completed = true` via complete_task operation
- No transition back to false (completed tasks remain completed)

## User Entity

### Fields
- **id** (string, primary key)
  - Unique identifier for the user
  - Auto-generated using UUID
- **email** (string, required, unique)
  - User's email address
  - Used for authentication
- **name** (string, required)
  - User's display name
- **hashed_password** (string, required)
  - Password stored as hash for security

### Relationships
- **Has many**: TodoTask (via user_id foreign key)
  - Each user can own multiple tasks
  - User can have zero or more tasks

### Validation Rules
- Email must be valid email format and unique
- Name must be provided
- Hashed password must be stored securely (never plaintext)
- All fields are required except where noted

## MCP Tool Entity (Conceptual)

### Fields
- **name** (string)
  - Name of the tool (e.g., "add_task", "list_tasks")
- **input_schema** (JSON schema)
  - Defines required and optional input parameters
- **output_schema** (JSON schema)
  - Defines expected output structure
- **authentication_required** (boolean)
  - Whether the tool requires authentication context

### Purpose
- Conceptual entity representing the tool interface
- Not persisted as a database entity
- Used for documentation and validation purposes
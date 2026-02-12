# Data Model: Conversation Persistence & Stateless Flow

**Feature**: Conversation Persistence & Stateless Flow
**Created**: 2026-02-08

## Conversation Entity

### Fields
- **id** (string, primary key)
  - Unique identifier for the conversation
  - Auto-generated using UUID
- **user_id** (string, foreign key)
  - Reference to the user who owns this conversation
  - Links to User entity id field
- **created_at** (datetime)
  - Timestamp when the conversation was started
  - Auto-populated on creation
- **updated_at** (datetime)
  - Timestamp when the conversation was last updated
  - Auto-updated on changes

### Relationships
- **Belongs to**: User (via user_id foreign key)
  - Each conversation is owned by exactly one user
  - User can have multiple conversations
- **Has many**: Message (via conversation_id foreign key)
  - Each conversation contains multiple messages

### Validation Rules
- user_id must reference an existing user
- created_at and updated_at are automatically managed

## Message Entity

### Fields
- **id** (string, primary key)
  - Unique identifier for the message
  - Auto-generated using UUID
- **conversation_id** (string, foreign key)
  - Reference to the conversation this message belongs to
  - Links to Conversation entity id field
- **role** (string, enum: "user", "assistant", "tool")
  - The role of the message sender
- **content** (string)
  - The actual content of the message
  - Min length: 1, Max length: 5000
- **timestamp** (datetime)
  - When the message was created
  - Auto-populated on creation
- **tool_calls** (JSON, optional)
  - Details of any tools called in this message
  - Stored as JSON object
- **tool_responses** (JSON, optional)
  - Responses from tools called in this message
  - Stored as JSON object

### Relationships
- **Belongs to**: Conversation (via conversation_id foreign key)
  - Each message belongs to exactly one conversation
  - Conversation can have multiple messages

### Validation Rules
- conversation_id must reference an existing conversation
- role must be one of "user", "assistant", or "tool"
- content must be provided and between 1-5000 characters
- timestamp is automatically managed

## ToolCall Entity

### Fields
- **id** (string, primary key)
  - Unique identifier for the tool call
  - Auto-generated using UUID
- **conversation_id** (string, foreign key)
  - Reference to the conversation this tool call belongs to
  - Links to Conversation entity id field
- **message_id** (string, foreign key)
  - Reference to the message that triggered this tool call
  - Links to Message entity id field
- **tool_name** (string)
  - Name of the MCP tool that was called
  - e.g., "add_task", "list_tasks", "update_task", "complete_task", "delete_task"
- **tool_input** (JSON)
  - Input parameters passed to the tool
  - Stored as JSON object
- **tool_output** (JSON, optional)
  - Result returned by the tool
  - Stored as JSON object
- **timestamp** (datetime)
  - When the tool call was executed
  - Auto-populated on creation

### Relationships
- **Belongs to**: Conversation (via conversation_id foreign key)
  - Each tool call belongs to exactly one conversation
  - Conversation can have multiple tool calls
- **Belongs to**: Message (via message_id foreign key)
  - Each tool call is associated with exactly one message
  - Message can trigger multiple tool calls

### Validation Rules
- conversation_id and message_id must reference existing records
- tool_name must be a valid MCP tool
- tool_input must be valid JSON
- timestamp is automatically managed

## User Entity (Reused from Existing Models)

### Fields
- **id** (string, primary key)
  - Unique identifier for the user
  - Auto-generated using UUID
- **email** (string, unique)
  - User's email address
  - Used for authentication
- **name** (string)
  - User's display name
- **hashed_password** (string)
  - Password stored as hash for security

### Relationships
- **Has many**: Conversation (via user_id foreign key)
  - Each user can own multiple conversations
  - User can have zero or more conversations
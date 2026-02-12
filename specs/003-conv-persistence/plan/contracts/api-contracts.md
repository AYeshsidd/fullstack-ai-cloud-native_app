# API Contracts: Conversation Persistence & Stateless Flow

**Feature**: Conversation Persistence & Stateless Flow
**Created**: 2026-02-08

## Chat Endpoint Contract

### Endpoint
```
POST /api/users/{user_id}/chat
```

### Request Parameters
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID of the user sending the message"
    }
  },
  "required": ["user_id"]
}
```

### Request Body
```json
{
  "type": "object",
  "properties": {
    "message": {
      "type": "string",
      "minLength": 1,
      "maxLength": 1000,
      "description": "The natural language message from the user"
    },
    "conversation_id": {
      "type": "string",
      "description": "Optional ID of an existing conversation to continue",
      "nullable": true
    }
  },
  "required": ["message"],
  "additionalProperties": false
}
```

### Response Schema
```json
{
  "type": "object",
  "properties": {
    "response": {
      "type": "string",
      "description": "The AI assistant's response to the user message"
    },
    "conversation_id": {
      "type": "string",
      "description": "ID of the conversation (new or existing)"
    },
    "tool_calls": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Name of the MCP tool that was called"
          },
          "input": {
            "type": "object",
            "description": "Input parameters passed to the tool"
          },
          "output": {
            "type": "object",
            "description": "Result returned by the tool"
          },
          "status": {
            "type": "string",
            "enum": ["success", "error"],
            "description": "Status of the tool call"
          }
        },
        "required": ["name", "input", "output", "status"]
      },
      "description": "Details of all MCP tools called during processing"
    },
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "role": {
            "type": "string",
            "enum": ["user", "assistant", "tool"],
            "description": "Role of the message sender"
          },
          "content": {
            "type": "string",
            "description": "Content of the message"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time",
            "description": "When the message was created"
          }
        },
        "required": ["role", "content", "timestamp"]
      },
      "description": "Recent messages in the conversation"
    }
  },
  "required": ["response", "conversation_id", "tool_calls", "messages"],
  "additionalProperties": false
}
```

### Validation
- user_id must exist in the database and correspond to a valid user
- message must be provided and non-empty (1-1000 characters)
- conversation_id (if provided) must exist in the database and belong to the user
- conversation_id in response matches the conversation used for processing

### Behavior
- If conversation_id is provided, validates that the conversation exists and belongs to the user
- If no conversation_id provided, creates a new conversation
- Stores the user's message in the database with timestamp
- Retrieves the full conversation history from database (including the new message)
- Runs OpenAI Agent with conversation history to generate response
- Executes any MCP tool calls requested by the AI agent and records them in the database
- Stores the AI's response in the database
- Returns the AI response, conversation ID, tool call details, and recent messages

---

## Conversation List Endpoint Contract

### Endpoint
```
GET /api/users/{user_id}/conversations
```

### Request Parameters
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID of the user requesting conversations"
    }
  },
  "required": ["user_id"]
}
```

### Response Schema
```json
{
  "type": "object",
  "properties": {
    "conversations": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier of the conversation"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "description": "When the conversation was created"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time",
            "description": "When the conversation was last updated"
          }
        },
        "required": ["id", "created_at", "updated_at"]
      }
    }
  },
  "required": ["conversations"],
  "additionalProperties": false
}
```

### Validation
- user_id must exist in the database and correspond to a valid user
- Only returns conversations belonging to the specified user

### Behavior
- Returns a list of all conversations for the specified user
- Each conversation includes basic metadata but not the full message history
- Conversations are sorted by updated_at timestamp (most recent first)

---

## Conversation Detail Endpoint Contract

### Endpoint
```
GET /api/users/{user_id}/conversations/{conversation_id}
```

### Request Parameters
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID of the user requesting the conversation"
    },
    "conversation_id": {
      "type": "string",
      "description": "ID of the conversation to retrieve"
    }
  },
  "required": ["user_id", "conversation_id"]
}
```

### Response Schema
```json
{
  "type": "object",
  "properties": {
    "conversation": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier of the conversation"
        },
        "created_at": {
          "type": "string",
          "format": "date-time",
          "description": "When the conversation was created"
        },
        "updated_at": {
          "type": "string",
          "format": "date-time",
          "description": "When the conversation was last updated"
        },
        "messages": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "role": {
                "type": "string",
                "enum": ["user", "assistant", "tool"],
                "description": "Role of the message sender"
              },
              "content": {
                "type": "string",
                "description": "Content of the message"
              },
              "timestamp": {
                "type": "string",
                "format": "date-time",
                "description": "When the message was created"
              }
            },
            "required": ["role", "content", "timestamp"]
          }
        }
      },
      "required": ["id", "created_at", "updated_at", "messages"]
    }
  },
  "required": ["conversation"],
  "additionalProperties": false
}
```

### Validation
- user_id must exist in the database and correspond to a valid user
- conversation_id must exist in the database and belong to the specified user
- Messages are returned in chronological order (oldest first)

### Behavior
- Returns detailed information about a specific conversation
- Includes all messages in the conversation in chronological order
- Includes metadata about the conversation (creation and update times)
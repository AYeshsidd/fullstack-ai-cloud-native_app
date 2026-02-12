# API Contracts: AI Chat Endpoint

**Feature**: AI Chat Endpoint
**Created**: 2026-02-08

## Chat Endpoint Contract

### Endpoint
```
POST /api/{user_id}/chat
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
          }
        },
        "required": ["role", "content"]
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
- message must be provided and non-empty
- conversation_id (if provided) must exist in the database and belong to the user

### Behavior
- Receives a natural language message from a user
- Fetches conversation history from database
- Runs OpenAI Agent with MCP tools to process the request
- Executes appropriate MCP tool calls based on AI interpretation
- Stores user message and AI response in database
- Returns AI response and details of any tool calls made

---

## Conversation History Endpoint Contract

### Endpoint
```
GET /api/{user_id}/conversations
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

### Behavior
- Returns a list of all conversations for the specified user
- Each conversation includes basic metadata but not the full message history

---

## Conversation Detail Endpoint Contract

### Endpoint
```
GET /api/{user_id}/conversations/{conversation_id}
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

### Behavior
- Returns detailed information about a specific conversation
- Includes all messages in the conversation
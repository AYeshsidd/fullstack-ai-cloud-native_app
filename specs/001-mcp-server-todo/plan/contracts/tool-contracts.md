# Tool Contracts: MCP Server & Todo Tools

**Feature**: MCP Server & Todo Tools
**Created**: 2026-02-08

## add_task Tool Contract

### Input Schema
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID of the user creating the task"
    },
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200,
      "description": "Title of the new task"
    },
    "description": {
      "type": "string",
      "maxLength": 1000,
      "description": "Optional description of the task",
      "nullable": true
    }
  },
  "required": ["user_id", "title"],
  "additionalProperties": false
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier of the created task"
    },
    "user_id": {
      "type": "string",
      "description": "ID of the user who owns the task"
    },
    "title": {
      "type": "string",
      "description": "Title of the task"
    },
    "description": {
      "type": "string",
      "description": "Description of the task",
      "nullable": true
    },
    "completed": {
      "type": "boolean",
      "description": "Whether the task is completed"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the task was created"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the task was last updated"
    }
  },
  "required": ["id", "user_id", "title", "completed", "created_at", "updated_at"],
  "additionalProperties": false
}
```

### Behavior
- Creates a new todo task in the database
- Sets completion status to false by default
- Returns the complete task object after creation
- Validates that user_id exists and corresponds to a valid user

---

## list_tasks Tool Contract

### Input Schema
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID of the user whose tasks to list"
    },
    "status": {
      "type": "string",
      "enum": ["all", "pending", "completed"],
      "default": "all",
      "description": "Filter tasks by completion status"
    }
  },
  "required": ["user_id"],
  "additionalProperties": false
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier of the task"
          },
          "user_id": {
            "type": "string",
            "description": "ID of the user who owns the task"
          },
          "title": {
            "type": "string",
            "description": "Title of the task"
          },
          "description": {
            "type": "string",
            "description": "Description of the task",
            "nullable": true
          },
          "completed": {
            "type": "boolean",
            "description": "Whether the task is completed"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the task was created"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp when the task was last updated"
          }
        },
        "required": ["id", "user_id", "title", "completed", "created_at", "updated_at"]
      }
    }
  },
  "required": ["tasks"],
  "additionalProperties": false
}
```

### Behavior
- Retrieves all tasks for the specified user
- Optionally filters by completion status (all, pending, completed)
- Returns an array of task objects
- Validates that user_id exists and corresponds to a valid user

---

## update_task Tool Contract

### Input Schema
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID of the user who owns the task"
    },
    "task_id": {
      "type": "string",
      "description": "ID of the task to update"
    },
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200,
      "description": "Updated title of the task",
      "nullable": true
    },
    "description": {
      "type": "string",
      "maxLength": 1000,
      "description": "Updated description of the task",
      "nullable": true
    }
  },
  "required": ["user_id", "task_id"],
  "additionalProperties": false
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier of the task"
    },
    "user_id": {
      "type": "string",
      "description": "ID of the user who owns the task"
    },
    "title": {
      "type": "string",
      "description": "Title of the task"
    },
    "description": {
      "type": "string",
      "description": "Description of the task",
      "nullable": true
    },
    "completed": {
      "type": "boolean",
      "description": "Whether the task is completed"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the task was created"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the task was last updated"
    }
  },
  "required": ["id", "user_id", "title", "completed", "created_at", "updated_at"],
  "additionalProperties": false
}
```

### Behavior
- Updates specified fields of the task
- Only updates fields that are provided in the input
- Returns the updated task object
- Validates that user_id and task_id match (user owns the task)

---

## complete_task Tool Contract

### Input Schema
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID of the user who owns the task"
    },
    "task_id": {
      "type": "string",
      "description": "ID of the task to mark as completed"
    }
  },
  "required": ["user_id", "task_id"],
  "additionalProperties": false
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier of the task"
    },
    "user_id": {
      "type": "string",
      "description": "ID of the user who owns the task"
    },
    "title": {
      "type": "string",
      "description": "Title of the task"
    },
    "description": {
      "type": "string",
      "description": "Description of the task",
      "nullable": true
    },
    "completed": {
      "type": "boolean",
      "description": "Whether the task is completed (will be true)"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the task was created"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp when the task was last updated"
    }
  },
  "required": ["id", "user_id", "title", "completed", "created_at", "updated_at"],
  "additionalProperties": false
}
```

### Behavior
- Marks the specified task as completed (sets completed = true)
- Returns the updated task object
- Validates that user_id and task_id match (user owns the task)

---

## delete_task Tool Contract

### Input Schema
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID of the user who owns the task"
    },
    "task_id": {
      "type": "string",
      "description": "ID of the task to delete"
    }
  },
  "required": ["user_id", "task_id"],
  "additionalProperties": false
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the deletion was successful"
    },
    "message": {
      "type": "string",
      "description": "Message describing the result of the operation"
    }
  },
  "required": ["success", "message"],
  "additionalProperties": false
}
```

### Behavior
- Removes the specified task from the database
- Returns success status and confirmation message
- Validates that user_id and task_id match (user owns the task)
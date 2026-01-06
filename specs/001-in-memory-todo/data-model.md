# Data Model: Todo

## Entity: Todo

Represents a single task item within the in-memory Todo application.

### Attributes:

-   **`id`** (Integer): A unique identifier for the todo item. This ID will be automatically generated and must be unique across all active todo items. It is non-reusable.
-   **`title`** (String): The main objective or short description of the task. This attribute is mandatory and cannot be empty.
-   **`description`** (String, Optional): A more detailed explanation or additional notes for the task. This attribute can be empty.
-   **`completed`** (Boolean): Indicates the completion status of the task. `false` for incomplete, `true` for complete. Defaults to `false` when a todo is created.

### Validation Rules:

-   `id`: Must be a unique positive integer.
-   `title`: Must not be empty or null. Max length: 255 characters (assumption).
-   `description`: No specific length constraint, but should be reasonable for a console application. (assumption).
-   `completed`: Must be a boolean value.

### Relationships:

-   None (standalone entity in an in-memory, single-user context).

# CLI API Contract: In-Memory Todo App

This document defines the command-line interface (CLI) commands, their arguments, and expected behavior for the Phase I In-Memory Todo Application.

## Commands:

### 1. `add <title> [--description <description>]`

-   **Description**: Creates a new todo item.
-   **Arguments**:
    -   `<title>` (Required, String): The main objective of the todo. Cannot be empty.
    -   `--description <description>` (Optional, String): A detailed description for the todo.
-   **Behavior**:
    -   Generates a unique ID for the new todo.
    -   Sets the initial status to 'incomplete'.
    -   On success, prints a confirmation message including the new todo's ID and title.
    -   On failure (e.g., missing title), prints an error message and does not create the todo.
-   **Output (Success)**: `Todo '<title>' (ID: <id>) added.`
-   **Output (Failure)**: `Error: Todo title cannot be empty.`

### 2. `list`

-   **Description**: Displays all current todo items.
-   **Arguments**: None.
-   **Behavior**:
    -   Retrieves all todo items from memory.
    -   For each todo, displays its ID, title, description (if present), and completion status.
    -   If no todos exist, prints a message indicating an empty list.
-   **Output (Success)**:
    ```
    ID    Status      Title           Description
    ------------------------------------------------------
    1     [ ]         Buy groceries   Milk, eggs, bread
    2     [x]         Call mom        Wish her happy birthday
    ```
-   **Output (Empty List)**: `No todos found.`

### 3. `update <id> [--title <title>] [--description <description>]`

-   **Description**: Modifies the title and/or description of an existing todo.
-   **Arguments**:
    -   `<id>` (Required, Integer): The unique ID of the todo to update.
    -   `--title <title>` (Optional, String): The new title for the todo. If omitted, the title remains unchanged.
    -   `--description <description>` (Optional, String): The new description for the todo. If omitted, the description remains unchanged. If provided as an empty string, the description will be cleared.
-   **Behavior**:
    -   Locates the todo by ID.
    -   Updates specified fields. At least one of `--title` or `--description` must be provided.
    -   On success, prints a confirmation message.
    -   On failure (e.g., todo not found, no update arguments), prints an error message.
-   **Output (Success)**: `Todo <id> updated.`
-   **Output (Failure)**: `Error: Todo <id> not found.` or `Error: No update arguments provided.`

### 4. `delete <id>`

-   **Description**: Permanently removes a todo item.
-   **Arguments**:
    -   `<id>` (Required, Integer): The unique ID of the todo to delete.
-   **Behavior**:
    -   Locates and removes the todo by ID.
    -   On success, prints a confirmation message.
    -   On failure (e.g., todo not found), prints an error message.
-   **Output (Success)**: `Todo <id> deleted.`
-   **Output (Failure)**: `Error: Todo <id> not found.`

### 5. `mark <id> <status>`

-   **Description**: Changes the completion status of a todo item.
-   **Arguments**:
    -   `<id>` (Required, Integer): The unique ID of the todo to mark.
    -   `<status>` (Required, String): The new status. Accepted values: `complete` or `incomplete`.
-   **Behavior**:
    -   Locates the todo by ID.
    -   Updates the `completed` status based on the provided `<status>`.
    -   On success, prints a confirmation message.
    -   On failure (e.g., todo not found, invalid status), prints an error message.
-   **Output (Success)**: `Todo <id> marked as <status>.`
-   **Output (Failure)**: `Error: Todo <id> not found.` or `Error: Invalid status. Use 'complete' or 'incomplete'.`

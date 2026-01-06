# Evolution of Todo — Phase I: In-Memory Python Console App

This is a basic command-line Todo application that runs locally and stores all data in memory, implemented as Phase I of the "Evolution of Todo" project.

## Setup

1.  **Prerequisites**:
    - Python 3.13+ installed on your system.
    - `uv` (a fast Python package installer and resolver) installed. If you don't have `uv`, you can install it using pip:
      ```bash
      pip install uv
      ```

2.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd Ai_Todo # Or your project root directory
    ```

3.  **Create and activate a virtual environment** using `uv`:
    ```bash
    uv venv
    source .venv/bin/activate  # On macOS/Linux
    .venv\Scripts\activate.ps1 # On Windows PowerShell
    .venv\Scripts\activate.bat # On Windows Command Prompt
    ```

4.  **Install dependencies** (currently none beyond standard Python library):
    ```bash
    uv pip install
    ```

## Running the Application

Navigate to your project root directory and run the `main.py` file with the desired command and arguments:

```bash
python src/main.py <command> [arguments]
```

## Command Examples

Here are examples demonstrating how to use each command:

### 1. Add a Todo

-   **Add with title only**:
    ```bash
    python src/main.py add "Buy groceries"
    ```
    *Expected Output*: `Todo 'Buy groceries' (ID: <uuid>) added.`

-   **Add with title and description**:
    ```bash
    python src/main.py add "Call mom" --description "Wish her happy birthday"
    ```
    *Expected Output*: `Todo 'Call mom' (ID: <uuid>) added.`

### 2. View All Todos

```bash
python src/main.py list
```
*Expected Output (example)*:
```
ID                                    Status      Title           Description
----------------------------------------------------------------------------------
<uuid>                                [ ]         Buy groceries
<uuid>                                [ ]         Call mom        Wish her happy birthday
```

### 3. Update a Todo

-   **Update title and description**:
    ```bash
    python src/main.py update <uuid> --title "Buy organic groceries" --description "Milk, eggs, fresh produce"
    ```
    *Expected Output*: `Todo <uuid> updated.`

-   **Update title only**:
    ```bash
    python src/main.py update <uuid> --title "Phone Mom"
    ```
    *Expected Output*: `Todo <uuid> updated.`

-   **Clear description**:
    ```bash
    python src/main.py update <uuid> --description ""
    ```
    *Expected Output*: `Todo <uuid> updated.`

### 4. Mark a Todo

-   **Mark as complete**:
    ```bash
    python src/main.py mark <uuid> complete
    ```
    *Expected Output*: `Todo <uuid> marked as complete.`

-   **Mark as incomplete**:
    ```bash
    python src/main.py mark <uuid> incomplete
    ```
    *Expected Output*: `Todo <uuid> marked as incomplete.`

### 5. Delete a Todo

```bash
python src/main.py delete <uuid>
```
*Expected Output*: `Todo <uuid> deleted.`

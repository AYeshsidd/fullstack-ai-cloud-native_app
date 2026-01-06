# Quickstart Guide: Evolution of Todo — Phase I (In-Memory Python Console App)

This guide provides instructions for setting up and running the Phase I in-memory Todo console application. It also includes examples for each available command.

## 1. Prerequisites

-   Python 3.13+ installed on your system.
-   `uv` (a fast Python package installer and resolver) installed. If you don't have `uv`, you can install it using pip:
    ```bash
    pip install uv
    ```

## 2. Setup

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository_url>
    cd Ai_Todo # Or your project root directory
    ```

2.  **Create and activate a virtual environment** using `uv`:
    ```bash
    uv venv
    source .venv/bin/activate  # On macOS/Linux
    .venv\Scripts\activate.ps1 # On Windows PowerShell
    .venv\Scripts\activate.bat # On Windows Command Prompt
    ```

3.  **Install dependencies** (if any; for Phase I, there are no external dependencies beyond Python's standard library, but this step is good practice):
    ```bash
    uv pip install
    ```

## 3. Running the Application

Navigate to your project root directory and run the `main.py` file:

```bash
python src/main.py <command> [arguments]
```

## 4. Command Examples

Here are examples demonstrating how to use each command:

### 1. Add a Todo

-   **Add with title only**:
    ```bash
    python src/main.py add "Buy groceries"
    ```
    *Expected Output*: `Todo 'Buy groceries' (ID: 1) added.`

-   **Add with title and description**:
    ```bash
    python src/main.py add "Call mom" --description "Wish her happy birthday"
    ```
    *Expected Output*: `Todo 'Call mom' (ID: 2) added.`

### 2. View All Todos

```bash
python src/main.py list
```
*Expected Output (example)*:
```
ID    Status      Title           Description
------------------------------------------------------
1     [ ]         Buy groceries
2     [ ]         Call mom        Wish her happy birthday
```

### 3. Update a Todo

-   **Update title and description**:
    ```bash
    python src/main.py update 1 --title "Buy organic groceries" --description "Milk, eggs, fresh produce"
    ```
    *Expected Output*: `Todo 1 updated.`

-   **Update title only**:
    ```bash
    python src/main.py update 2 --title "Phone Mom"
    ```
    *Expected Output*: `Todo 2 updated.`

-   **Clear description**:
    ```bash
    python src/main.py update 1 --description ""
    ```
    *Expected Output*: `Todo 1 updated.`

### 4. Mark a Todo

-   **Mark as complete**:
    ```bash
    python src/main.py mark 1 complete
    ```
    *Expected Output*: `Todo 1 marked as complete.`

-   **Mark as incomplete**:
    ```bash
    python src/main.py mark 2 incomplete
    ```
    *Expected Output*: `Todo 2 marked as incomplete.`

### 5. Delete a Todo

```bash
python src/main.py delete 2
```
*Expected Output*: `Todo 2 deleted.`

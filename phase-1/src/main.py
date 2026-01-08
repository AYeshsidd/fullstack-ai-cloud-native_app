import argparse
import sys
from types import SimpleNamespace
from todo_app.cli import add_command, list_command, update_command, delete_command, mark_command

# --- Helper Functions for Interactive Mode ---

def handle_add():
    print("\n--- Add New Todo ---")
    title = input("Enter title: ").strip()
    if not title:
        print("Error: Title cannot be empty. Please try again.")
        return
    description = input("Enter description (optional): ").strip()
    args = SimpleNamespace(title=title, description=description if description else None)
    add_command(args)
    print("--------------------")

def handle_list():
    print("\n--- Your Todo List ---")
    args = SimpleNamespace()
    list_command(args)
    print("----------------------")

def handle_update():
    print("\n--- Update Todo ---")
    try:
        todo_id_str = input("Enter todo ID to update: ").strip()
        todo_id = int(todo_id_str)
        title = input("Enter new title (optional): ").strip()
        description = input("Enter new description (optional): ").strip()

        # Check if at least one update argument is provided
        if not title and not description:
            print("Error: No update arguments provided. Please enter a new title or description.")
            return

        args = SimpleNamespace(id=todo_id, title=title if title else None, description=description if description else None, completed=None)
        update_command(args)
        print("-------------------")
    except ValueError:
        print(f"Error: Invalid ID '{todo_id_str}'. Please enter a number.")
        print("-------------------")

def handle_mark():
    print("\n--- Mark Todo ---")
    try:
        todo_id_str = input("Enter todo ID to mark: ").strip()
        todo_id = int(todo_id_str)
        status = input("Enter status (complete/incomplete): ").strip().lower()
        if status not in ['complete', 'incomplete']:
            print("Error: Invalid status. Please use 'complete' or 'incomplete'.")
            return
        args = SimpleNamespace(id=todo_id, status=status)
        mark_command(args)
        print("---------------")
    except ValueError:
        print(f"Error: Invalid ID '{todo_id_str}'. Please enter a number.")
        print("---------------")

def handle_delete():
    print("\n--- Delete Todo ---")
    try:
        todo_id_str = input("Enter todo ID to delete: ").strip()
        todo_id = int(todo_id_str)
        args = SimpleNamespace(id=todo_id)
        delete_command(args)
        print("-----------------")
    except ValueError:
        print(f"Error: Invalid ID '{todo_id_str}'. Please enter a number.")
        print("-----------------")

# --- Interactive Mode ---

def interactive_mode():
    print("+" * 30)
    print("  Welcome to Interactive Todo!  ")
    print("+" * 30)

    while True:
        print("\n" + "=" * 25)
        print("      MAIN MENU")
        print("=" * 25)
        print("1. Add a new todo")
        print("2. List all todos")
        print("3. Update an existing todo")
        print("4. Mark a todo as complete/incomplete")
        print("5. Delete a todo")
        print("0. Exit")
        print("=" * 25)

        choice = input("Enter your choice (0-5): ").strip()

        if choice == '1':
            handle_add()
        elif choice == '2':
            handle_list()
        elif choice == '3':
            handle_update()
        elif choice == '4':
            handle_mark()
        elif choice == '5':
            handle_delete()
        elif choice == '0':
            print("\n" + "+" * 30)
            print("  Thank you for using Todo!  ")
            print("+" * 30)
            break
        else:
            print("\nError: Invalid choice. Please enter a number between 0 and 5.")

# --- Main Application Entry Point ---

def main():
    if len(sys.argv) > 1:
        # Existing argparse logic for command-line arguments
        parser = argparse.ArgumentParser(description="In-Memory Todo Application")
        subparsers = parser.add_subparsers(dest="command", help="Available commands")

        # Add command
        add_parser = subparsers.add_parser("add", help="Add a new todo")
        add_parser.add_argument("title", type=str, help="Title of the todo")
        add_parser.add_argument("--description", type=str, help="Description of the todo", default=None)
        add_parser.set_defaults(func=add_command)

        # List command
        list_parser = subparsers.add_parser("list", help="List all todos")
        list_parser.set_defaults(func=list_command)

        # Update command
        update_parser = subparsers.add_parser("update", help="Update an existing todo")
        update_parser.add_argument("id", type=int, help="ID of the todo to update")
        update_parser.add_argument("--title", type=str, help="New title for the todo", default=None)
        update_parser.add_argument("--description", type=str, help="New description for the todo", default=None)
        update_parser.add_argument("--completed", type=lambda x: (x.lower() == 'true'), help="Completion status (true/false)", default=None)
        update_parser.set_defaults(func=update_command)

        # Delete command
        delete_parser = subparsers.add_parser("delete", help="Delete a todo")
        delete_parser.add_argument("id", type=int, help="ID of the todo to delete")
        delete_parser.set_defaults(func=delete_command)

        # Mark command
        mark_parser = subparsers.add_parser("mark", help="Mark a todo as complete or incomplete")
        mark_parser.add_argument("id", type=int, help="ID of the todo to mark")
        mark_parser.add_argument("status", type=str, choices=['complete', 'incomplete'], help="Status to set (complete/incomplete)")
        mark_parser.set_defaults(func=mark_command)

        args = parser.parse_args()

        if hasattr(args, 'func'):
            args.func(args)
        else:
            parser.print_help()
    else:
        interactive_mode()

if __name__ == "__main__":
    main()
import argparse
from .services import TodoService

todo_service = TodoService()

def add_command(args):
    try:
        todo = todo_service.add_todo(title=args.title, description=args.description)
        new_id = len(todo_service.get_all_todos())
        print(f"✅ Todo '{todo.title}' added with ID: {new_id}.")
    except ValueError as e:
        print(f"❌ Error: {e}")

def list_command(args):
    todos = todo_service.get_all_todos()
    if not todos:
        print("💡 No todos found. Add some tasks to get started!")
        return

    print("ID  Status     Title          Description")
    print("--------------------------------------------------")
    for i, todo in enumerate(todos, 1):
        status = '[✔]' if todo.completed else '[ ]'
        description = todo.description if todo.description else ''
        print(f"{i:<4}{status:<11}{todo.title:<15}{description}")

def update_command(args):
    try:
        if not any([args.title, args.description, args.completed is not None]):
            print("❌ Error: No update arguments provided.")
            return

        todo = todo_service.update_todo(args.id, args.title, args.description, args.completed)
        if todo:
            print(f"✅ Todo {args.id} updated successfully.")
        else:
            print(f"❌ Error: Todo {args.id} not found.")
    except ValueError as e:
        print(f"❌ Error: {e}")

def delete_command(args):
    if todo_service.delete_todo(args.id):
        print(f"✅ Todo {args.id} deleted.")
    else:
        print(f"❌ Error: Todo {args.id} not found.")

def mark_command(args):
    completed_status = True if args.status == 'complete' else False
    todo = todo_service.mark_todo(args.id, completed_status)
    if todo:
        print(f"✅ Todo {args.id} marked as {args.status}.")
    else:
        print(f"❌ Error: Todo {args.id} not found.")

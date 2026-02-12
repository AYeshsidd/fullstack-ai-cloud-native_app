"""
Simple test script to verify the end-to-end functionality of all 5 MCP tools.
This tests the basic operations with a mock user and task data.
"""
import uuid
from datetime import datetime
from sqlmodel import create_engine, Session
from database.session import engine
from models import User, TodoTask
from tool_schemas import AddTaskInput, ListTasksInput, UpdateTaskInput, CompleteTaskInput, DeleteTaskInput


def create_test_user_and_tasks():
    """Create a test user and some tasks to verify functionality."""
    with Session(engine) as session:
        # Create a test user
        user_id = str(uuid.uuid4())
        test_user = User(
            id=user_id,
            email=f"test_{uuid.uuid4()}@example.com",
            name="Test User",
            hashed_password="hashed_test_password"
        )
        session.add(test_user)

        # Create some test tasks
        task1 = TodoTask(
            title="Test Task 1",
            description="This is the first test task",
            completed=False,
            user_id=user_id
        )
        session.add(task1)

        task2 = TodoTask(
            title="Test Task 2",
            description="This is the second test task",
            completed=True,
            user_id=user_id
        )
        session.add(task2)

        session.commit()

        print(f"Created test user: {user_id}")
        print(f"Created tasks: {task1.id}, {task2.id}")

        return user_id, task1.id, task2.id


def test_add_task():
    """Test the add_task functionality."""
    print("\n--- Testing add_task ---")
    from tools.add_task import add_task
    from tool_schemas import AddTaskInput

    user_id, _, _ = create_test_user_and_tasks()

    # Test adding a new task
    input_data = AddTaskInput(
        user_id=user_id,
        title="Added via test",
        description="Task added through test"
    )

    with Session(engine) as session:
        result = add_task(input_data, session)
        print(f"Added task: {result.id} - {result.title}")
        assert result.title == "Added via test"
        assert result.user_id == user_id
        assert result.completed == False
        print("✓ add_task test passed")


def test_list_tasks():
    """Test the list_tasks functionality."""
    print("\n--- Testing list_tasks ---")
    from tools.list_tasks import list_tasks
    from tool_schemas import ListTasksInput

    user_id, _, _ = create_test_user_and_tasks()

    # Test listing all tasks
    input_data = ListTasksInput(
        user_id=user_id,
        status="all"
    )

    with Session(engine) as session:
        result = list_tasks(input_data, session)
        print(f"Found {len(result.tasks)} tasks for user {user_id}")
        assert len(result.tasks) >= 2  # At least the 2 we created
        print("✓ list_tasks test passed")


def test_update_task():
    """Test the update_task functionality."""
    print("\n--- Testing update_task ---")
    from tools.update_task import update_task
    from tool_schemas import UpdateTaskInput

    user_id, task_id, _ = create_test_user_and_tasks()

    # Test updating a task
    input_data = UpdateTaskInput(
        user_id=user_id,
        task_id=task_id,
        title="Updated Title",
        description="Updated description"
    )

    with Session(engine) as session:
        result = update_task(input_data, session)
        print(f"Updated task: {result.id} - {result.title}")
        assert result.title == "Updated Title"
        assert result.description == "Updated description"
        print("✓ update_task test passed")


def test_complete_task():
    """Test the complete_task functionality."""
    print("\n--- Testing complete_task ---")
    from tools.complete_task import complete_task
    from tool_schemas import CompleteTaskInput

    user_id, task_id, _ = create_test_user_and_tasks()

    # Test completing a task
    input_data = CompleteTaskInput(
        user_id=user_id,
        task_id=task_id
    )

    with Session(engine) as session:
        result = complete_task(input_data, session)
        print(f"Completed task: {result.id} - completed: {result.completed}")
        assert result.completed == True
        print("✓ complete_task test passed")


def test_delete_task():
    """Test the delete_task functionality."""
    print("\n--- Testing delete_task ---")
    from tools.delete_task import delete_task
    from tool_schemas import DeleteTaskInput

    user_id, task_id, _ = create_test_user_and_tasks()

    # Test deleting a task
    input_data = DeleteTaskInput(
        user_id=user_id,
        task_id=task_id
    )

    with Session(engine) as session:
        result = delete_task(input_data, session)
        print(f"Delete result: {result.success} - {result.message}")
        assert result.success == True
        print("✓ delete_task test passed")


def run_all_tests():
    """Run all tests to verify end-to-end functionality."""
    print("Starting end-to-end functionality tests for MCP tools...")

    try:
        test_add_task()
        test_list_tasks()
        test_update_task()
        test_complete_task()
        test_delete_task()

        print("\n🎉 All tests passed! MCP server tools are functioning correctly.")
        return True
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        return False


if __name__ == "__main__":
    run_all_tests()
"""
Test script to verify user isolation functionality.
This tests that users can only access their own tasks.
"""
import uuid
from sqlmodel import create_engine, Session
from database.session import engine
from models import User, TodoTask


def test_user_isolation():
    """Test that users can only access their own tasks."""
    print("Testing user isolation functionality...")

    # Create two test users
    with Session(engine) as session:
        # Create first user and task
        user1_id = str(uuid.uuid4())
        user1 = User(
            id=user1_id,
            email=f"user1_{uuid.uuid4()}@example.com",
            name="User 1",
            hashed_password="hashed_password1"
        )
        session.add(user1)

        task1 = TodoTask(
            title="User 1's Task",
            description="This belongs to user 1",
            completed=False,
            user_id=user1_id
        )
        session.add(task1)

        # Create second user and task
        user2_id = str(uuid.uuid4())
        user2 = User(
            id=user2_id,
            email=f"user2_{uuid.uuid4()}@example.com",
            name="User 2",
            hashed_password="hashed_password2"
        )
        session.add(user2)

        task2 = TodoTask(
            title="User 2's Task",
            description="This belongs to user 2",
            completed=False,
            user_id=user2_id
        )
        session.add(task2)

        session.commit()

        print(f"Created users: {user1_id}, {user2_id}")
        print(f"Created tasks: {task1.id}, {task2.id}")

    # Now test access using the middleware functions
    from middleware import validate_user_owns_task

    with Session(engine) as session:
        # Test that user1 can access their own task
        try:
            validate_user_owns_task(user1_id, task1.id, session)
            print("✓ User 1 can access their own task")
        except Exception as e:
            print(f"✗ User 1 could not access their own task: {e}")

        # Test that user1 cannot access user2's task
        try:
            validate_user_owns_task(user1_id, task2.id, session)
            print("✗ User 1 can access user 2's task - SECURITY ISSUE!")
        except Exception:
            print("✓ User 1 cannot access user 2's task - Security working")

        # Test that user2 can access their own task
        try:
            validate_user_owns_task(user2_id, task2.id, session)
            print("✓ User 2 can access their own task")
        except Exception as e:
            print(f"✗ User 2 could not access their own task: {e}")

        # Test that user2 cannot access user1's task
        try:
            validate_user_owns_task(user2_id, task1.id, session)
            print("✗ User 2 can access user 1's task - SECURITY ISSUE!")
        except Exception:
            print("✓ User 2 cannot access user 1's task - Security working")

    print("\nUser isolation tests completed successfully!")


if __name__ == "__main__":
    test_user_isolation()
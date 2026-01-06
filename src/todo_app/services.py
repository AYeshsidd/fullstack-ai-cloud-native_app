from typing import List, Optional
from .models import Todo

class TodoService:
    def __init__(self):
        self._todos: List[Todo] = []

    def get_all_todos(self) -> List[Todo]:
        return self._todos

    def get_todo_by_id(self, todo_id: int) -> Optional[Todo]:
        if 1 <= todo_id <= len(self._todos):
            return self._todos[todo_id - 1]
        return None

    def add_todo(self, title: str, description: Optional[str] = None) -> Todo:
        if not title:
            raise ValueError("Title cannot be empty")
        todo = Todo(title=title, description=description)
        self._todos.append(todo)
        return todo

    def update_todo(self, todo_id: int, title: Optional[str] = None, description: Optional[str] = None, completed: Optional[bool] = None) -> Optional[Todo]:
        todo = self.get_todo_by_id(todo_id)
        if todo is None:
            return None

        if title is not None:
            if not title:
                raise ValueError("Title cannot be empty")
            todo.title = title
        if description is not None:
            todo.description = description
        if completed is not None:
            todo.completed = completed
        return todo

    def delete_todo(self, todo_id: int) -> bool:
        if 1 <= todo_id <= len(self._todos):
            del self._todos[todo_id - 1]
            return True
        return False

    def mark_todo(self, todo_id: int, completed: bool) -> Optional[Todo]:
        todo = self.get_todo_by_id(todo_id)
        if todo is None:
            return None
        todo.completed = completed
        return todo

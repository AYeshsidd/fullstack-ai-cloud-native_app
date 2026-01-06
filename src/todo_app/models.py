from dataclasses import dataclass
from typing import Optional

@dataclass
class Todo:
    title: str
    description: Optional[str] = None
    completed: bool = False


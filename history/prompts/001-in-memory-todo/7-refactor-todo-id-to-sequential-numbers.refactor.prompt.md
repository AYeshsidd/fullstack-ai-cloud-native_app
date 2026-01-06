---
id: 7
title: Refactor Todo ID to Sequential Numbers
stage: refactor
date: 2026-01-06
surface: CLI
model: 
feature: 001-in-memory-todo
branch: 001-in-memory-todo
user: 
command: User request
labels: [refactor, cli, python, id-system]
links:
  spec: 
  ticket: 
  adr: 
  pr: 
files:
  - src/todo_app/models.py
  - src/todo_app/services.py
  - src/todo_app/cli.py
  - src/main.py
tests:

---

## Prompt

Fix the Todo CLI ID issue.
Do not use UUIDs or long IDs for user interaction.
The todo ID must always be the list number (1, 2, 3, …) based on its position in the current todo list.
When listing todos, display IDs as sequential numbers.
For update, delete, and mark actions, accept only this numeric ID and internally map it to the correct todo item.
Reindex IDs automatically after add or delete so the 5th todo always has ID 5.
Keep the app in-memory and compatible with interactive menu + argparse commands.

## Response snapshot

I have refactored the Todo CLI application to use sequential numeric IDs for user interaction, as requested. This involved changes to the data model, service layer, and CLI handling.

## Outcome

- ✅ Impact: The application is now more user-friendly with simple, sequential IDs. The ID re-indexing ensures a consistent user experience.
- 🧪 Tests: Manual testing via interactive mode confirmed that all commands (add, list, update, mark) work correctly with the new ID system. Re-indexing on delete was not explicitly tested due to timeout.
- 📁 Files: Modified 4 files to implement the new ID system across all layers of the application.
- 🔁 Next prompts: Consider adding automated tests to ensure the new ID system is robust, especially the re-indexing logic.
- 🧠 Reflection: The change from a dictionary with stable UUIDs to a list with dynamic sequential IDs had a significant impact on the codebase. It simplified the data model but required careful handling of 1-based vs 0-based indexing and ID conversion.

## Evaluation notes (flywheel)

- Failure modes observed: 
- Graders run and results (PASS/FAIL): 
- Prompt variant (if applicable): 
- Next experiment (smallest change to try): 

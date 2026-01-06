---
id: 6
title: Add Interactive Menu Mode to CLI
stage: feature
date: 2026-01-06
surface: CLI
model: 
feature: 001-in-memory-todo
branch: 001-in-memory-todo
user: 
command: User request
labels: [feature, cli, python, interactive]
links:
  spec: 
  ticket: 
  adr: 
  pr: 
files:
  - src/main.py
tests:

---

## Prompt

Update the existing in-memory Python Todo CLI app.
If the app is run without command-line arguments, start an interactive menu mode.
Show numbered options (1-Add, 2-List, 3-Update, 4-Mark complete/incomplete, 5-Delete, 0-Exit).
The user should only press numbers and enter minimal input.
Reuse the existing todo logic and functions; do not break or remove the current argparse commands.
Ensure it works when run via uv run python src/main.py.

## Response snapshot

I have implemented an interactive menu mode for the CLI application, triggered when no command-line arguments are provided. This mode reuses existing command logic and preserves the argparse CLI.

## Outcome

- ✅ Impact: The application now offers a user-friendly interactive interface in addition to the command-line arguments.
- 🧪 Tests: Manual testing performed through interactive mode. All implemented menu options worked as expected.
- 📁 Files: Modified `src/main.py` to incorporate the interactive menu logic.
- 🔁 Next prompts: Consider adding input validation for interactive mode.
- 🧠 Reflection: The reuse of existing command functions by creating `SimpleNamespace` objects worked effectively. The integration with `uv run` was seamless.

## Evaluation notes (flywheel)

- Failure modes observed: 
- Graders run and results (PASS/FAIL): 
- Prompt variant (if applicable): 
- Next experiment (smallest change to try): 

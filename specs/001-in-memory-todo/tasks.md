# Tasks: Evolution of Todo — Phase I: In-Memory Python Console App

**Input**: Design documents from `/specs/001-in-memory-todo/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The feature specification for Phase I does not explicitly request automated tests, so test tasks are not included in this plan. Manual in-memory verification will be used.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `src/` directory and `src/todo_app/` module structure `src/todo_app/__init__.py`
- [x] T002 Create `main.py` entry point with basic CLI structure `src/main.py`
- [x] T003 Create `README.md` with initial setup and run instructions `README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `Todo` data model in `src/todo_app/models.py` with `id`, `title`, `description`, `completed` attributes. `src/todo_app/models.py`
- [x] T005 Implement `TodoService` class for in-memory storage and management of `Todo` objects. `src/todo_app/services.py`
- [x] T006 Add `add_todo` method to `TodoService` to create and store new todos. `src/todo_app/services.py`
- [x] T007 Add `list_todos` method to `TodoService` to retrieve all todos. `src/todo_app/services.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add a Todo (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to add new todo items with a title and an optional description so I can keep track of tasks.

**Independent Test**: Can be fully tested by adding a todo and then listing it to confirm its presence and details.

### Implementation for User Story 1

- [x] T008 [US1] Implement `add` CLI command in `src/todo_app/cli.py` to parse title and description. `src/todo_app/cli.py`
- [x] T009 [US1] Integrate `add` command with `TodoService.add_todo` and handle success/error output. `src/todo_app/cli.py`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View All Todos (Priority: P1)

**Goal**: As a user, I want to see a list of all my todos with their titles, descriptions, unique IDs, and completion status so I can review my tasks.

**Independent Test**: Can be fully tested by adding multiple todos and then listing them, verifying all details are displayed correctly.

### Implementation for User Story 2

- [x] T010 [US2] Implement `list` CLI command in `src/todo_app/cli.py`. `src/todo_app/cli.py`
- [x] T011 [US2] Integrate `list` command with `TodoService.list_todos` and format output for readability. `src/todo_app/cli.py`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark a Todo as Complete/Incomplete (Priority: P2)

**Goal**: As a user, I want to mark a todo as complete when I finish it, or incomplete if I need to revisit it, so I can accurately track my progress.

**Independent Test**: Can be fully tested by adding a todo, marking it complete, and then listing it to verify the status change. Similarly for marking it incomplete.

### Implementation for User Story 3

- [x] T012 [US3] Add `mark_todo` method to `TodoService` to update todo completion status. `src/todo_app/services.py`
- [x] T013 [US3] Implement `mark` CLI command in `src/todo_app/cli.py` to parse ID and status. `src/todo_app/cli.py`
- [x] T014 [US3] Integrate `mark` command with `TodoService.mark_todo` and handle success/error output. `src/todo_app/cli.py`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Update a Todo (Priority: P2)

**Goal**: As a user, I want to be able to change the title and/or description of an existing todo so I can refine my task details.

**Independent Test**: Can be fully tested by adding a todo, updating its details, and then listing it to verify the changes.

### Implementation for User Story 4

- [x] T015 [US4] Add `update_todo` method to `TodoService` to modify todo title/description. `src/todo_app/services.py`
- [x] T016 [US4] Implement `update` CLI command in `src/todo_app/cli.py` to parse ID, new title, and new description. `src/todo_app/cli.py`
- [x] T017 [US4] Integrate `update` command with `TodoService.update_todo` and handle success/error output. `src/todo_app/cli.py`

---

## Phase 7: User Story 5 - Delete a Todo (Priority: P3)

**Goal**: As a user, I want to remove a todo by its unique ID so I can clear out completed or irrelevant tasks.

**Independent Test**: Can be fully tested by adding a todo, deleting it, and then attempting to list it to confirm its removal.

### Implementation for User Story 5

- [x] T018 [US5] Add `delete_todo` method to `TodoService` to remove a todo. `src/todo_app/services.py`
- [x] T019 [US5] Implement `delete` CLI command in `src/todo_app/cli.py` to parse ID. `src/todo_app/cli.py`
- [x] T020 [US5] Integrate `delete` command with `TodoService.delete_todo` and handle success/error output. `src/todo_app/cli.py`

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T021 Enhance `main.py` CLI parsing for better argument handling and error reporting. `src/main.py`
- [x] T022 Finalize `README.md` with complete setup, usage instructions, and all command examples. `README.md`
- [x] T023 Run quickstart.md validation to ensure all examples work. `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - Add)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1 - View)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2 - Mark)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2 - Update)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P3 - Delete)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Service methods should be implemented before CLI commands that utilize them.

### Parallel Opportunities

- Within Phase 1, T001 and T002 can potentially be done in parallel (creating directories and files). T003 (README) can be started but finalized later.
- Within Phase 2, T004, T005, T006, T007 are sequential or dependent on the `Todo` model.
- Individual user stories can theoretically be developed in parallel *once the Foundational phase is complete*, but for this initial implementation, a sequential approach following priority is recommended.
- Within a user story, if there are multiple tasks affecting different files with no direct dependencies, they could be run in parallel (e.g., creating a model and a service that uses it, where the service implementation is pending the model).

---

## Parallel Example: User Story 1

```bash
# Not applicable for this simple CLI feature; tasks are more sequential.
# For example, creating the model (T004) and service (T005) are prerequisites.
# Then, implementing the add method in the service (T006)
# and then implementing the CLI command (T008, T009) that uses the service.
# However, if there were separate models/services for *different* user stories,
# those could be implemented in parallel after foundational elements.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Add a Todo)
4. **STOP and VALIDATE**: Test User Story 1 independently.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Add) → Test independently
3. Add User Story 2 (View) → Test independently
4. Add User Story 3 (Mark) → Test independently
5. Add User Story 4 (Update) → Test independently
6. Add User Story 5 (Delete) → Test independently
7. Each story adds value without breaking previous stories.

---

## Notes

- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate story independently.
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence.

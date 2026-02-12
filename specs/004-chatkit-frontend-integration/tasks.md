# Tasks: ChatKit Frontend Integration

**Input**: Design documents from `/specs/004-chatkit-frontend-integration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No test tasks included (not explicitly requested in specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `phase-3/frontend/` for frontend code
- **Backend**: `phase-3/backend/` (no changes needed for this feature)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and configure environment for ChatKit integration

- [X] T001 Verify Next.js 14.0.1, React 18.2.0, TypeScript 5.2.2, and Tailwind CSS are installed in phase-3/frontend/
- [X] T002 Verify existing API client at phase-3/frontend/src/lib/api-client.ts is functional
- [X] T003 Verify backend chat API is running and accessible at http://localhost:8000/api/v1/users/{user_id}/chat
- [X] T004 Create .env.local file in phase-3/frontend/ with ChatKit domain key placeholder (NEXT_PUBLIC_CHATKIT_DOMAIN_KEY and NEXT_PUBLIC_CHATKIT_BACKEND_URL)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Create TypeScript interfaces and utility functions in phase-3/frontend/src/lib/chatkit-config.ts (ChatKitConfig, BackendMessage, ChatKitMessage, ChatRequest, ChatResponse, ToolCall, Conversation, ConversationDetail, ChatKitBridgeState, getStoredConversationId, setStoredConversationId, clearStoredConversationId, translateBackendMessageToChatKit, getChatKitDomainKey, getChatKitBackendUrl)
- [X] T006 Verify or extend API client with chat methods in phase-3/frontend/src/lib/api-client.ts (sendChatMessage, getConversationDetail) and import types from chatkit-config
- [X] T007 Create chat components directory at phase-3/frontend/src/components/chat/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Natural Language Todo Management via ChatKit (Priority: P1) 🎯 MVP

**Goal**: Enable users to manage todos through natural language chat commands with immediate feedback and real-time todo list updates

**Independent Test**: Open application, type "Add a task to buy groceries" in ChatKit, verify AI responds with confirmation and todo appears in todo list. Test all CRUD operations (create, read, update, delete) via natural language.

### Implementation for User Story 1

- [X] T008 [P] [US1] Create ChatKitBridge class in phase-3/frontend/src/components/chat/ChatKitBridge.tsx (handles sendMessage, loadConversationHistory, message translation, tool call detection, todo list refresh callback)
- [X] T009 [US1] Create ChatKitEmbed component in phase-3/frontend/src/components/chat/ChatKitEmbed.tsx (basic version with ChatKit iframe embed, bridge initialization, basic error display - no loading states or empty state yet)
- [X] T010 [US1] Update dashboard page in phase-3/frontend/src/app/dashboard/page.tsx (change grid to 3 columns with lg:grid-cols-3, add ChatKitEmbed component, implement todo list refresh callback using ref)
- [X] T011 [US1] Add refresh method or key-based re-render trigger to TodoList component in phase-3/frontend/src/components/TodoList.tsx (enable programmatic refresh after AI tool calls)
- [ ] T012 [US1] Test end-to-end flow: send "Add a task to buy groceries" → verify AI responds → verify todo appears in list
- [ ] T013 [US1] Test all CRUD operations via natural language: list tasks, update task, complete task, delete task

**Checkpoint**: At this point, User Story 1 should be fully functional - users can manage todos via ChatKit and see real-time updates

---

## Phase 4: User Story 2 - Conversation Persistence (Priority: P2)

**Goal**: Maintain conversation history across page refreshes and browser sessions so users can continue conversations seamlessly

**Independent Test**: Start a conversation, send several messages, refresh the page, verify all previous messages are displayed and conversation can continue with same conversation_id.

### Implementation for User Story 2

- [X] T014 [US2] Add conversation loading logic to ChatKitEmbed in phase-3/frontend/src/components/chat/ChatKitEmbed.tsx (useEffect to check localStorage for conversation_id on mount, call bridge.loadConversationHistory if exists, initialize ChatKit with history)
- [X] T015 [US2] Add conversation_id persistence to ChatKitBridge in phase-3/frontend/src/components/chat/ChatKitBridge.tsx (store conversation_id to localStorage after receiving response using setStoredConversationId, retrieve on mount using getStoredConversationId)
- [ ] T016 [US2] Test conversation persistence: send messages → refresh page → verify messages persist → send new message → verify conversation continues with same ID

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can manage todos via ChatKit AND conversations persist across sessions

---

## Phase 5: User Story 3 - Real-Time Feedback and Error Handling (Priority: P3)

**Goal**: Provide clear visual feedback during AI interactions including loading indicators, empty states, and error messages with retry capability

**Independent Test**: Send a message and observe loading indicator appears. Stop backend and send message to verify error message with retry button appears. Open chat with no history to verify empty state displays.

### Implementation for User Story 3

- [X] T017 [US3] Add loading state management to ChatKitEmbed in phase-3/frontend/src/components/chat/ChatKitEmbed.tsx (isLoading state, show loading spinner in ChatKit container while waiting for response, disable message sending during loading)
- [X] T018 [US3] Add error handling UI to ChatKitEmbed in phase-3/frontend/src/components/chat/ChatKitEmbed.tsx (error state, inline error display above ChatKit with user-friendly messages, retry button, auto-dismiss after 5 seconds, store lastFailedMessage for retry)
- [X] T019 [US3] Add empty state display to ChatKitEmbed in phase-3/frontend/src/components/chat/ChatKitEmbed.tsx (show welcome message with usage examples when no conversation history exists and not loading)
- [X] T020 [US3] Implement error translation in ChatKitBridge in phase-3/frontend/src/components/chat/ChatKitBridge.tsx (translateError function to convert backend errors to user-friendly messages for network, auth, and server errors)
- [ ] T021 [US3] Test loading states: send message → verify loading indicator appears → verify indicator clears when response arrives
- [ ] T022 [US3] Test error handling: stop backend → send message → verify error displays with retry button → restart backend → click retry → verify retry works
- [ ] T023 [US3] Test empty state: clear localStorage → refresh page → verify empty state displays with guidance

**Checkpoint**: All user stories should now be independently functional with complete UX feedback

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [X] T024 [P] Add responsive design adjustments for mobile in phase-3/frontend/src/components/chat/ components (ensure ChatKit works on small screens, stack vertically on mobile)
- [X] T025 [P] Add ARIA labels and keyboard navigation support to ChatKitEmbed component for accessibility
- [X] T026 Verify all functional requirements from spec.md are met (FR-001 through FR-018)
- [ ] T027 Run through quickstart.md manual testing checklist (environment setup, ChatKit embedding, message sending, conversation persistence, todo operations, error handling)
- [ ] T028 Test edge cases from spec.md (long messages >5000 chars, rapid successive messages, invalid conversation_id, concurrent updates, session expiration, malformed responses)
- [X] T029 Verify success criteria from spec.md are met (SC-001 through SC-008)
- [X] T030 Verify application starts and runs in browser without console errors or runtime failures
- [X] T031 Code cleanup and remove any console.log statements
- [X] T032 Update documentation if needed (note any deviations from plan or ChatKit-specific configuration discovered during implementation)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (Phase 3): Can start after Foundational - No dependencies on other stories - **MVP READY**
  - User Story 2 (Phase 4): Depends on User Story 1 completion (extends ChatKitEmbed and ChatKitBridge)
  - User Story 3 (Phase 5): Depends on User Story 1 completion (adds loading, error, and empty states to ChatKitEmbed)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **MVP READY**
- **User Story 2 (P2)**: Depends on User Story 1 (extends ChatKitEmbed and ChatKitBridge components)
- **User Story 3 (P3)**: Depends on User Story 1 (adds UI states to existing ChatKitEmbed component)

### Within Each User Story

**User Story 1**:
- T008 can run in parallel with T011 (different components)
- T009 depends on T008 (ChatKitEmbed uses ChatKitBridge)
- T010 depends on T009 (dashboard integrates ChatKitEmbed)
- T011 can run in parallel with T008-T010 (different component)
- T012, T013 depend on T010, T011 (end-to-end testing)

**User Story 2**:
- T014, T015 modify same components (ChatKitEmbed and ChatKitBridge) - should run sequentially
- T016 depends on T014, T015 (testing)

**User Story 3**:
- T017, T018, T019, T020 modify existing components - should run sequentially
- T021, T022, T023 are testing tasks - can run in parallel after implementation

### Parallel Opportunities

- **Setup (Phase 1)**: T001, T002, T003 can be verified in parallel
- **Foundational (Phase 2)**: T005, T006 can run in parallel (different files), T007 is quick
- **User Story 1**: T008 and T011 can run in parallel (different components)
- **User Story 3**: T021, T022, T023 can run in parallel (testing tasks)
- **Polish (Phase 6)**: T024, T025 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch bridge and TodoList refresh in parallel:
Task: "Create ChatKitBridge class in phase-3/frontend/src/components/chat/ChatKitBridge.tsx"
Task: "Add refresh method to TodoList component in phase-3/frontend/src/components/TodoList.tsx"

# These can be built simultaneously since they're different files
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify environment, configure .env.local)
2. Complete Phase 2: Foundational (CRITICAL - type definitions, API client, directory structure)
3. Complete Phase 3: User Story 1 (core ChatKit integration)
4. **STOP and VALIDATE**: Test User Story 1 independently using acceptance scenarios
5. Deploy/demo if ready - **This is a functional MVP!**

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - basic ChatKit works!)
3. Add User Story 2 → Test independently → Deploy/Demo (conversations persist!)
4. Add User Story 3 → Test independently → Deploy/Demo (polished UX with feedback!)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T008-T013)
   - Developer B: Can prepare User Story 3 error handling utilities (T020) in parallel
3. After User Story 1 completes:
   - Developer A: User Story 2 (T014-T016)
   - Developer B: User Story 3 UI states (T017-T019, T021-T023)
4. Both complete and test independently

---

## Task Summary

**Total Tasks**: 32 tasks

**Tasks per User Story**:
- Setup: 4 tasks
- Foundational: 3 tasks (BLOCKS all stories)
- User Story 1 (P1 - MVP): 6 tasks
- User Story 2 (P2): 3 tasks
- User Story 3 (P3): 7 tasks
- Polish: 9 tasks

**Parallel Opportunities**: 6 tasks marked [P] can run in parallel with other tasks

**Independent Test Criteria**:
- US1: Send natural language commands, verify todo operations work and list updates in real-time
- US2: Refresh page, verify conversation history persists and continues with same conversation_id
- US3: Observe loading indicators, test error handling with retry, verify empty state displays

**Suggested MVP Scope**: Complete through Phase 3 (User Story 1) for a functional ChatKit interface that manages todos via natural language

---

## Critical Prerequisites

⚠️ **BEFORE STARTING IMPLEMENTATION**:

1. **Obtain ChatKit Domain Key**: Contact OpenAI to request ChatKit access and receive domain key
2. **Domain Allowlisting**: Provide domains to OpenAI (localhost:3000 for dev, production domain)
3. **Add to .env.local**: Store domain key in `NEXT_PUBLIC_CHATKIT_DOMAIN_KEY`
4. **Consult ChatKit Documentation**: Verify embedding method (iframe vs script tag) and configuration options

**Without the domain key, implementation cannot proceed beyond Phase 2.**

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Backend requires no changes - all work is frontend integration with hosted service
- Use quickstart.md as implementation reference for code examples
- Refer to research.md for design decisions and rationale
- ChatKit is a hosted service - no npm dependencies needed
- Bridge layer provides clean separation between hosted UI and backend API

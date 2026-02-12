---
id: 002
title: ChatKit Frontend Integration Plan Regeneration
stage: plan
date: 2026-02-10
surface: agent
model: claude-sonnet-4-5
feature: 004-chatkit-frontend-integration
branch: 004-chatkit-frontend-integration
user: user
command: /sp.plan
labels: ["planning", "chatkit", "frontend", "phase-3", "hosted-service", "regeneration"]
links:
  spec: specs/004-chatkit-frontend-integration/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-chatkit-frontend-integration/plan.md
  - specs/004-chatkit-frontend-integration/research.md
  - specs/004-chatkit-frontend-integration/data-model.md
  - specs/004-chatkit-frontend-integration/contracts/chat-endpoint.md
  - specs/004-chatkit-frontend-integration/contracts/get-conversation-endpoint.md
  - specs/004-chatkit-frontend-integration/quickstart.md
  - specs/004-chatkit-frontend-integration/agent-context-update.md
  - specs/004-chatkit-frontend-integration/constitution-check-post-design.md
tests:
  - Manual testing checklist documented in quickstart.md
---

## Prompt

Regenerate the implementation plan for Spec-4: ChatKit Frontend Integration.

Important corrections:
- ChatKit in this project is OpenAI's hosted ChatKit (domain-allowlisted UI),
  NOT an npm or React library.
- Do NOT assume ChatKit components, providers, or adapters.
- Read and Follow the spec
- Frontend work must only configure and integrate the hosted ChatKit
  with the existing Phase-3 backend chat endpoint.
- Include in the plan that the domain key is added in the frontend folder
  (.env.local) for ChatKit configuration.
- The plan must remain fully spec-driven according to Phase-3 documentation.

## Response snapshot

Successfully regenerated implementation plan for Feature 004: ChatKit Frontend Integration with correct understanding of ChatKit as OpenAI's hosted service.

**Critical Correction Made**:
- Previous assumption: ChatKit was an npm library or React component
- Corrected understanding: ChatKit is OpenAI's hosted UI service (domain-allowlisted)
- Requires domain key for access, embedded via iframe or script tag

**Phase 0: Research** - Generated research.md covering:
- OpenAI hosted ChatKit service (domain-allowlisted, requires domain key)
- ChatKit configuration for custom backend (not just OpenAI's API)
- Backend integration and message bridging (adapter pattern)
- Message state management (ChatKit manages UI, app manages conversation_id)
- Error handling (bridge layer with user-friendly messages)
- Todo list integration (detect tool_calls, trigger refresh)
- Dashboard layout (3-column grid with ChatKitEmbed)

**Phase 1: Design & Contracts** - Generated:
- data-model.md: TypeScript interfaces for bridge layer (ChatKitConfig, BackendMessage, ChatKitMessage, ChatRequest, ChatResponse, ToolCall, Conversation, ConversationDetail, ChatKitBridgeState)
- contracts/: Complete API documentation for 2 endpoints (POST /chat, GET /conversations/{id})
- quickstart.md: Step-by-step implementation guide with environment setup, bridge layer, ChatKit embedding, dashboard integration
- agent-context-update.md: Documentation of hosted service patterns
- constitution-check-post-design.md: Verified all gates pass

**Key Design Decisions**:
1. Hosted service integration - embed via iframe with domain key
2. Bridge layer - adapter pattern for message format translation
3. Environment configuration - domain key in .env.local (NEXT_PUBLIC_CHATKIT_DOMAIN_KEY)
4. Backend integration - configure ChatKit to use custom Phase-3 API
5. Message translation - convert tool messages to assistant messages for ChatKit
6. Conversation persistence - localStorage with key 'chatkit-conversation-id'
7. Todo synchronization - detect tool_calls array, trigger refresh callback
8. Layout - 3-column dashboard grid (TodoForm | TodoList | ChatKitEmbed)

**Constitution Compliance**: ✅ All gates passed (pre-design and post-design)
- Includes OpenAI ChatKit requirement compliance (using hosted service as specified)

**Critical Action Required**: Obtain ChatKit domain key from OpenAI before implementation

**Ready for**: /sp.tasks to generate implementation tasks

## Outcome

- ✅ Impact: Complete planning artifacts for ChatKit hosted service integration - all research questions resolved, design decisions documented, API contracts defined, implementation guide created with correct understanding of hosted service architecture
- 🧪 Tests: Manual testing checklist provided in quickstart.md covering environment setup, ChatKit embedding, message sending, conversation persistence, todo operations, and error handling
- 📁 Files: 8 files created/updated (plan.md, research.md, data-model.md, 2 contract files, quickstart.md, agent-context-update.md, constitution-check-post-design.md)
- 🔁 Next prompts: Obtain ChatKit domain key from OpenAI, then run /sp.tasks to generate implementation tasks, implement following quickstart.md guide
- 🧠 Reflection: Planning workflow successfully regenerated after critical clarification that ChatKit is OpenAI's hosted service, not an npm library. Initial research incorrectly assumed ChatKit was a React library, but user correction clarified it's a domain-allowlisted hosted UI. All artifacts regenerated with correct understanding: hosted service embedded via iframe, domain key configuration in .env.local, bridge layer for format translation, no npm dependencies. Design choices reflect hosted service architecture: minimal frontend code (just bridge and embed wrapper), ChatKit handles all UI rendering, bridge translates between ChatKit format and backend API. No backend changes required - frontend-only integration. Constitution compliance verified including OpenAI ChatKit requirement.

## Evaluation notes (flywheel)

- Failure modes observed: Initial misunderstanding of ChatKit as npm library (corrected after user clarification), PowerShell scripts unavailable (mitigated by manual artifact generation)
- Graders run and results (PASS/FAIL): Constitution Check: PASS (all gates including OpenAI ChatKit requirement), Design Quality: PASS (hosted service architecture), Implementation Readiness: PASS (pending domain key acquisition)
- Prompt variant (if applicable): Standard /sp.plan workflow with regeneration after clarification
- Next experiment (smallest change to try): During implementation, verify actual ChatKit embedding method (iframe vs script tag) with OpenAI documentation, confirm message format expectations, test bridge layer translation logic

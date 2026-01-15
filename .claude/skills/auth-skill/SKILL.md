---
name: auth-skill
description: Implement user authentication with Better Auth, JWT tokens, signup, signin, and API protection. Use for full-stack apps.
---

# Authentication Layer

## Instructions

1. **User Signup & Signin**
   - Configure Better Auth on frontend
   - Handle login, logout, and session lifecycle
   - Email + password based authentication

2. **Password Security**
   - Use secure hashing (handled by Better Auth)
   - Never store plain text passwords in backend

3. **JWT Tokens**
   - Enable JWT plugin in Better Auth
   - Issue tokens on login
   - Include JWT in `Authorization: Bearer <token>` header for API calls
   - FastAPI verifies token using shared secret
   - Backend filters all data by authenticated user ID

4. **API Protection**
   - All `/api/*` endpoints require valid JWT
   - Requests without or with invalid token → 401 Unauthorized
   - Users only access their own tasks

## Best Practices
- Keep backend stateless
- Centralize JWT verification logic
- Never trust `user_id` from URL without verification
- Fail fast on invalid/missing tokens
- Log auth failures without exposing secrets

## Example Usage
```text
Implement auth-skill to secure task CRUD APIs
Apply auth-skill to integrate Better Auth frontend with FastAPI backend

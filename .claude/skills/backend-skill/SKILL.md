---
name: backend-skill
description: Build backend using FastAPI to handle routes, requests/responses, authentication, and database integration. Use for full-stack applications.
---

# Backend Layer (FastAPI)

## Instructions

1. **Project Structure**
   - Use FastAPI as backend framework
   - Keep a clear separation of routes, schemas, services, and database logic
   - Use a single entry point (main app file)

2. **API Routes**
   - Create RESTful routes for authentication and todo tasks
   - Support CRUD operations for tasks
   - Secure protected routes using JWT-based authentication

3. **Request & Response Handling**
   - Validate input using Pydantic schemas
   - Return consistent JSON responses
   - Handle errors with proper HTTP status codes

4. **Database Integration**
   - Connect backend to database (SQL or NoSQL)
   - Define models for users and tasks
   - Perform create, read, update, and delete operations via ORM or queries

5. **Auth & Security**
   - Implement login and signup APIs
   - Generate and verify JWT tokens
   - Protect private endpoints using dependencies

## Best Practices
- Keep routes thin and move logic to services
- Use dependency injection
- Handle edge cases and validation errors
- Write readable and maintainable code
- Ensure API consistency for frontend integration

## Example Usage
```text
Apply backend-skill to build FastAPI routes for Todo app
Use backend-skill to handle auth, database operations, and API responses for Phase II

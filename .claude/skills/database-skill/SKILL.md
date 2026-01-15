---
name: database-skill
description: Design and manage database layer using SQLModel and Neon Serverless PostgreSQL. Use for persistent data storage in full-stack apps.
---

# Database Layer

## Instructions

1. **Database Setup**
   - Use Neon Serverless PostgreSQL
   - Connect database via environment-based connection string
   - Ensure backend can connect on startup

2. **Schema Design**
   - Define `tasks` table with user ownership
   - Fields: id, user_id, title, description, completed, created_at, updated_at
   - Use proper data types and defaults

3. **ORM Usage**
   - Use SQLModel for all database models
   - Avoid raw SQL queries
   - Map models directly to API request/response schemas

4. **Data Access Rules**
   - All queries must be filtered by authenticated user ID
   - Ensure task ownership on read, update, and delete
   - Prevent cross-user data access

## Best Practices
- Keep database logic isolated from routes
- Use indexes on `user_id` and `completed`
- Handle migrations carefully
- Fail safely on database connection errors
- Never expose database credentials in code

## Example Usage
```text
Apply database-skill to implement task storage using SQLModel
Use database-skill to enforce user-based data isolation in queries

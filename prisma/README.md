# Prisma Directory

This directory contains the database schema and migration files using Prisma ORM.

## Files

- **schema.prisma**: The main schema file that defines the database models and relationships
- **dev.db**: SQLite database file for local development (not committed to Git)
- **migrations/**: Directory containing database migration files

## Database Models

- **User**: Represents a user of the application with Microsoft 365 authentication
- **Account**: Stores OAuth account information for users
- **Session**: Manages user sessions for authentication
- **Project**: Represents a project idea with title, description, and team size requirements

## Development Workflow

1. Make changes to the `schema.prisma` file
2. Run `npx prisma migrate dev --name <migration-name>` to create a new migration
3. Prisma will automatically apply the migration and update the database

## Production Setup

For production, the application is configured to use PostgreSQL:

1. Update the `schema.prisma` file to use PostgreSQL provider
2. Set the `DATABASE_URL` environment variable to your PostgreSQL connection string
3. Run `npx prisma migrate deploy` to apply migrations to the production database

## Best Practices

- Keep the schema in sync with TypeScript types
- Use descriptive names for models and fields
- Add appropriate indexes for performance
- Use relations to model connections between entities
- Run migrations during deployment to keep the database in sync

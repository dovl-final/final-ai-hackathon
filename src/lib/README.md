# Lib Directory

This directory contains utility functions and shared libraries used throughout the application.

## Files

- **db.ts**: Database client setup using Prisma. Implements connection pooling for better performance.

## Best Practices

- Keep utility functions focused on a single responsibility
- Use TypeScript for type safety
- Add proper error handling
- Write tests for utility functions
- Document complex functions with comments

## Adding New Utilities

When adding new utility functions:

1. Consider if the functionality belongs in an existing file or needs a new one
2. Use descriptive file and function names
3. Export functions as named exports (except for default database client)
4. Add TypeScript types for parameters and return values

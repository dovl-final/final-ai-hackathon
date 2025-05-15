# Types Directory

This directory contains TypeScript type definitions used throughout the application.

## Files

- **index.ts**: Contains shared types for projects, users, and authentication.

## Types Defined

- **ProjectFormData**: Type for project submission form data
- **ProjectWithCreator**: Extended project type that includes creator information
- **SessionUser**: Type for authenticated user session data

## Best Practices

- Keep types focused and specific
- Use interfaces for object shapes that might be extended
- Use type aliases for unions, intersections, or simple object shapes
- Export all types from a central file (index.ts) for easier imports
- Use descriptive names that indicate the purpose of the type

## Adding New Types

When adding new types:

1. Consider if the type belongs in an existing file or needs a new one
2. Use descriptive names in PascalCase
3. Add JSDoc comments for complex types
4. Keep types in sync with database schema when applicable

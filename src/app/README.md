# App Directory

This directory contains the main application pages and API routes using Next.js App Router.

## Structure

- **page.tsx**: The homepage that displays all project ideas
- **layout.tsx**: The root layout that wraps all pages with common elements like authentication
- **api/**: API routes for authentication and project management
- **submit/**: Page for submitting new project ideas
- **edit/[id]/**: Dynamic route for editing existing projects

## App Router

This project uses Next.js App Router, which provides:

- Server Components by default
- Simplified routing based on the file system
- Layouts that persist between route changes
- Loading and error states
- Server-side data fetching

## API Routes

API routes are located in the `api` directory:

- **api/auth/[...nextauth]**: Authentication endpoints using NextAuth.js
- **api/projects**: Endpoints for listing and creating projects
- **api/projects/[id]**: Endpoints for getting, updating, and deleting specific projects

## Best Practices

- Use server components when possible for improved performance
- Keep API routes focused on specific functionality
- Use TypeScript for type safety
- Implement proper error handling and validation

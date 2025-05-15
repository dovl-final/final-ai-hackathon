# Components

This directory contains reusable UI components used throughout the application.

## Component List

- **Navbar.tsx**: The main navigation bar component that appears on all pages. Handles authentication state and provides navigation links.
- **ProjectCard.tsx**: Displays individual project information in a card format. Shows edit/delete buttons for project owners.
- **ProjectForm.tsx**: Form component for creating and editing projects. Handles validation and submission.
- **ProjectList.tsx**: Displays a grid of project cards and handles loading/error states.

## Adding New Components

When adding new components:

1. Create a new file with a descriptive name using PascalCase
2. Export the component as default
3. Add TypeScript props interface
4. Consider adding tests in the `tests/components` directory

## Best Practices

- Keep components focused on a single responsibility
- Use TypeScript for prop typing
- Leverage Tailwind CSS for styling
- For complex state management, consider using React hooks

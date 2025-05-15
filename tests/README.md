# Tests Directory

This directory contains test files for the application using Jest and React Testing Library.

## Structure

- **components/**: Tests for React components
- **jest.config.js**: Jest configuration file
- **jest.setup.js**: Setup file for Jest that includes common mocks and configurations

## Running Tests

- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Run a specific test file: `npm test -- path/to/test.js`

## Testing Strategy

- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test how components work together
- **API Tests**: Test API endpoints for correct behavior

## Best Practices

- Write tests that focus on behavior, not implementation details
- Use descriptive test names that explain what is being tested
- Mock external dependencies like API calls and authentication
- Keep tests independent of each other
- Follow the Arrange-Act-Assert pattern
- Test edge cases and error conditions

## Adding New Tests

When adding new tests:

1. Create a new file with a `.test.tsx` or `.test.ts` extension
2. Import the component or function being tested
3. Use Jest's `describe` and `it` functions to organize tests
4. Use React Testing Library to render and interact with components
5. Use Jest's assertion functions to verify behavior

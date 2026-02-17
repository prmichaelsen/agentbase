# Testing Guide

This project uses Jest for testing with TypeScript support via ts-jest.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests are colocated with source files using the `.test.ts` extension:

```
src/
├── tools/
│   ├── get-profile.ts
│   ├── get-profile.test.ts  ← Test file
│   ├── get-media.ts
│   └── get-media.test.ts    ← Test file
```

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { handleYourTool } from './your-tool.js';
import { InstagramClient } from '../instagram-client.js';

describe('handleYourTool', () => {
  let mockClient: jest.Mocked<InstagramClient>;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should do something', async () => {
    // Arrange
    mockClient.someMethod.mockResolvedValue({ data: 'value' });

    // Act
    const result = await handleYourTool(mockClient, { param: 'value' });

    // Assert
    expect(mockClient.someMethod).toHaveBeenCalledWith('value');
    expect(result).toBe('expected');
  });
});
```

### Mocking Instagram Client

Use the provided mock client factory:

```typescript
const createMockClient = (): jest.Mocked<InstagramClient> => {
  return {
    getUserProfile: jest.fn(),
    getUserMedia: jest.fn(),
    getMediaDetails: jest.fn(),
    getMediaComments: jest.fn(),
    getMediaInsights: jest.fn(),
    getUserInsights: jest.fn(),
    publishMedia: jest.fn(),
    publishMediaContainer: jest.fn(),
    getConversations: jest.fn(),
    getConversationMessages: jest.fn(),
    sendMessage: jest.fn(),
    makeRequest: jest.fn(),
  } as any;
};
```

### Test Patterns

#### Testing Success Cases

```typescript
it('should retrieve data successfully', async () => {
  const mockData = { id: '123', name: 'test' };
  mockClient.getUserProfile.mockResolvedValue(mockData);

  const result = await handleGetProfile(mockClient, { user_id: 'me' });

  expect(mockClient.getUserProfile).toHaveBeenCalledWith('me', undefined);
  expect(JSON.parse(result)).toEqual(mockData);
});
```

#### Testing Error Cases

```typescript
it('should handle API errors gracefully', async () => {
  mockClient.getUserProfile.mockRejectedValue(
    new Error('Invalid token')
  );

  await expect(
    handleGetProfile(mockClient, { user_id: 'me' })
  ).rejects.toThrow('Failed to get profile: Invalid token');
});
```

#### Testing Parameter Handling

```typescript
it('should pass parameters correctly', async () => {
  mockClient.getUserProfile.mockResolvedValue({});

  await handleGetProfile(mockClient, { 
    user_id: '123',
    fields: ['id', 'username']
  });

  expect(mockClient.getUserProfile).toHaveBeenCalledWith(
    '123',
    ['id', 'username']
  );
});
```

## Coverage Goals

- **Minimum**: 50% coverage for all metrics
- **Target**: 80% coverage for critical paths
- **Focus**: Test public APIs (tool handlers)

## Best Practices

1. **Use AAA Pattern**: Arrange, Act, Assert
2. **One assertion per test**: Keep tests focused
3. **Mock external dependencies**: Don't hit real APIs
4. **Test edge cases**: Empty inputs, errors, boundaries
5. **Keep tests fast**: Use mocks, avoid I/O
6. **Descriptive names**: Test names should explain what they test

## Example Test File

See [`src/tools/get-profile.test.ts`](src/tools/get-profile.test.ts) for a complete example.

## Continuous Integration

Tests run automatically on:
- Pre-commit (if git hooks configured)
- Pull requests
- Main branch pushes

## Troubleshooting

### ESM Import Issues

If you see import errors, ensure:
- Files use `.js` extensions in imports
- `jest.config.js` has ESM configuration
- `package.json` has `"type": "module"`

### TypeScript Errors

If TypeScript complains about mocks:
- Use `as any` for complex mock types
- Use `jest.Mocked<T>` for typed mocks
- Ensure `@types/jest` is installed

### Coverage Not Updating

```bash
# Clear Jest cache
npx jest --clearCache

# Run with coverage
npm run test:coverage
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

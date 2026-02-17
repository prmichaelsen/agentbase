# Task 6: Write Tests and Documentation for Comment Moderation

**Milestone**: Milestone 1 - Comment Moderation Features
**Estimated Time**: 4-6 hours
**Dependencies**: Tasks 1-5 (all comment moderation tools)
**Status**: Not Started

---

## Objective

Write comprehensive unit tests and documentation for all comment moderation tools. Ensure code quality, test coverage, and clear usage examples for developers.

## Steps

1. **Write unit tests for reply-to-comment**
   - Test successful reply
   - Test invalid comment ID
   - Test authentication errors
   - Test rate limiting
   - Test character limit validation
   - Mock Instagram API responses

2. **Write unit tests for delete-comment**
   - Test successful deletion
   - Test invalid comment ID
   - Test authentication errors
   - Test rate limiting
   - Mock Instagram API responses

3. **Write unit tests for hide-comment**
   - Test hiding comment
   - Test unhiding comment
   - Test invalid comment ID
   - Test authentication errors
   - Test rate limiting
   - Mock Instagram API responses

4. **Write unit tests for toggle-comments**
   - Test enabling comments
   - Test disabling comments
   - Test invalid media ID
   - Test authentication errors
   - Test rate limiting
   - Mock Instagram API responses

5. **Write unit tests for bulk-moderation**
   - Test bulk delete
   - Test bulk hide
   - Test bulk reply
   - Test partial failures
   - Test rate limit handling
   - Test batching logic
   - Test exponential backoff
   - Mock Instagram API responses

6. **Write integration tests**
   - Test end-to-end moderation workflow
   - Test error recovery
   - Test rate limit handling across tools

7. **Update README.md**
   - Add comment moderation section
   - Document all new tools
   - Add usage examples
   - Document error cases
   - Add best practices

8. **Create usage examples**
   - Example: Automated spam filtering
   - Example: Customer service responses
   - Example: Bulk moderation workflow
   - Example: Error handling

9. **Update type documentation**
   - Add JSDoc comments to all types
   - Document all parameters
   - Document return values
   - Add examples in comments

10. **Run test coverage analysis**
    - Ensure >80% code coverage
    - Identify untested code paths
    - Add missing tests

## Verification

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Test coverage >80%
- [ ] README.md updated with new tools
- [ ] Usage examples are clear and working
- [ ] Type documentation is complete
- [ ] Error cases are documented
- [ ] Best practices are documented

## Example Test

```typescript
describe('replyToComment', () => {
  it('should reply to a comment successfully', async () => {
    const mockClient = createMockClient();
    mockClient.replyToComment.mockResolvedValue({
      id: '17345678901',
      text: 'Thank you!',
      timestamp: '2026-02-17T21:00:00+0000'
    });

    const result = await handleReplyToComment(mockClient, {
      comment_id: '17234567890',
      message: 'Thank you!'
    });

    expect(result.id).toBe('17345678901');
    expect(result.text).toBe('Thank you!');
  });

  it('should handle invalid comment ID', async () => {
    const mockClient = createMockClient();
    mockClient.replyToComment.mockRejectedValue(
      new Error('Comment not found')
    );

    await expect(
      handleReplyToComment(mockClient, {
        comment_id: 'invalid',
        message: 'Test'
      })
    ).rejects.toThrow('Comment not found');
  });
});
```

## Documentation Sections to Add

### README.md Updates

```markdown
## Comment Moderation

### Reply to Comment
Reply to comments on your Instagram posts.

\`\`\`typescript
await client.replyToComment({
  comment_id: '17234567890',
  message: 'Thank you for your feedback!'
});
\`\`\`

### Delete Comment
Delete inappropriate or spam comments.

\`\`\`typescript
await client.deleteComment({
  comment_id: '17234567890'
});
\`\`\`

### Hide/Unhide Comment
Hide comments without deleting them.

\`\`\`typescript
await client.hideComment({
  comment_id: '17234567890',
  hide: true
});
\`\`\`

### Enable/Disable Comments
Control whether comments are allowed on a post.

\`\`\`typescript
await client.toggleComments({
  media_id: '17234567890',
  enabled: false
});
\`\`\`

### Bulk Moderation
Perform moderation actions on multiple comments at once.

\`\`\`typescript
await client.bulkModerateComments({
  comment_ids: ['17234567890', '17234567891'],
  action: 'delete'
});
\`\`\`
```

## Technical Notes

- Use Jest for testing framework
- Use `@types/jest` for TypeScript support
- Mock Instagram API responses using `jest.mock()`
- Test both success and error cases
- Test edge cases (empty strings, null values, etc.)
- Document rate limiting behavior
- Document error codes and messages

---

**Next Task**: None (Milestone 1 complete)

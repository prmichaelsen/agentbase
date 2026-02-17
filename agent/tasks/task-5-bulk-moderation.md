# Task 5: Implement Bulk Comment Moderation Tool

**Milestone**: Milestone 1 - Comment Moderation Features
**Estimated Time**: 6-8 hours
**Dependencies**: Tasks 1-4 (uses individual moderation tools)
**Status**: Not Started

---

## Objective

Implement a tool that allows AI agents to perform bulk moderation operations on multiple comments at once. This enables efficient management of high-volume comment sections and automated spam filtering.

## Steps

1. **Create type definitions**
   - Define `BulkModerateParams` interface
   - Define `BulkModerateResponse` interface
   - Define `ModerationAction` enum (reply, delete, hide, unhide)
   - Add to `src/types/comment-moderation.ts`

2. **Implement Instagram API client method**
   - Add `bulkModerateComments` method to `InstagramClient`
   - Use existing individual moderation methods
   - Implement batching logic to respect rate limits
   - Add progress tracking
   - Add error handling with partial success support

3. **Create MCP tool definition**
   - Define tool schema with input parameters
   - Parameters: `comment_ids[]`, `action`, `message` (optional for replies)
   - Add description and examples
   - Create in `src/tools/moderate-comments.ts`

4. **Implement tool handler**
   - Parse and validate input parameters
   - Batch requests to respect rate limits
   - Call Instagram API client method
   - Track successes and failures
   - Format response for MCP with detailed results
   - Handle errors gracefully

5. **Add rate limiting logic**
   - Implement exponential backoff
   - Queue requests to avoid hitting limits
   - Add configurable batch size
   - Add delay between batches

6. **Add to tool exports**
   - Export tool and handler from `src/tools/index.ts`
   - Register tool in server factory

7. **Write unit tests**
   - Test bulk delete
   - Test bulk hide
   - Test bulk reply
   - Test partial failures
   - Test rate limit handling
   - Test batching logic
   - Mock Instagram API responses

8. **Update documentation**
   - Add tool to README.md
   - Add usage examples
   - Document batching behavior
   - Document error cases

## Verification

- [ ] Can perform bulk operations on multiple comments
- [ ] Respects rate limits with batching
- [ ] Returns detailed results (successes and failures)
- [ ] Handles partial failures gracefully
- [ ] Implements exponential backoff
- [ ] TypeScript types are correct
- [ ] Unit tests pass
- [ ] Documentation is clear

## Example Usage

```typescript
// Bulk delete spam comments
{
  "comment_ids": ["17234567890", "17234567891", "17234567892"],
  "action": "delete"
}

// Bulk hide inappropriate comments
{
  "comment_ids": ["17234567893", "17234567894"],
  "action": "hide"
}

// Bulk reply to customer questions
{
  "comment_ids": ["17234567895", "17234567896"],
  "action": "reply",
  "message": "Thank you for your question! We'll get back to you soon."
}

// Response
{
  "total": 3,
  "successful": 2,
  "failed": 1,
  "results": [
    { "comment_id": "17234567890", "success": true },
    { "comment_id": "17234567891", "success": true },
    { "comment_id": "17234567892", "success": false, "error": "Comment not found" }
  ]
}
```

## Technical Notes

- Uses individual moderation endpoints in batches
- Required permission: `instagram_manage_comments`
- Rate limit: 200 calls/hour (standard), 4,800/hour (advanced)
- Batch size should be configurable (default: 10 comments per batch)
- Implement 1-second delay between batches
- Use exponential backoff on rate limit errors
- Return partial results even if some operations fail
- Consider implementing retry logic for transient errors

---

**Next Task**: Task 6 - Write Tests and Documentation

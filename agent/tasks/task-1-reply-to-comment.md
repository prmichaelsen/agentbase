# Task 1: Implement Reply to Comment Tool

**Milestone**: Milestone 1 - Comment Moderation Features
**Estimated Time**: 4-6 hours
**Dependencies**: None
**Status**: Not Started

---

## Objective

Implement a tool that allows AI agents to reply to comments on Instagram media posts. This enables automated customer service, community engagement, and conversation management.

## Steps

1. **Create type definitions**
   - Define `ReplyToCommentParams` interface
   - Define `ReplyToCommentResponse` interface
   - Add to `src/types/comment-moderation.ts`

2. **Implement Instagram API client method**
   - Add `replyToComment` method to `InstagramClient`
   - Endpoint: `POST /{comment-id}/replies`
   - Handle authentication and headers
   - Add error handling

3. **Create MCP tool definition**
   - Define tool schema with input parameters
   - Parameters: `comment_id`, `message`
   - Add description and examples
   - Create in `src/tools/reply-to-comment.ts`

4. **Implement tool handler**
   - Parse and validate input parameters
   - Call Instagram API client method
   - Format response for MCP
   - Handle errors gracefully

5. **Add to tool exports**
   - Export tool and handler from `src/tools/index.ts`
   - Register tool in server factory

6. **Write unit tests**
   - Test successful reply
   - Test invalid comment ID
   - Test authentication errors
   - Test rate limiting
   - Mock Instagram API responses

7. **Update documentation**
   - Add tool to README.md
   - Add usage examples
   - Document error cases

## Verification

- [ ] Can reply to any comment on owned media
- [ ] Returns comment ID and reply text
- [ ] Handles invalid comment IDs gracefully
- [ ] Respects rate limits
- [ ] TypeScript types are correct
- [ ] Unit tests pass
- [ ] Documentation is clear

## Example Usage

```typescript
// Tool call
{
  "comment_id": "17234567890",
  "message": "Thank you for your feedback!"
}

// Response
{
  "id": "17345678901",
  "text": "Thank you for your feedback!",
  "timestamp": "2026-02-17T21:00:00+0000"
}
```

## Technical Notes

- Endpoint: `POST /{comment-id}/replies`
- Required permission: `instagram_manage_comments`
- Rate limit: 200 calls/hour (standard), 4,800/hour (advanced)
- Can only reply to comments on owned media
- Reply text limited to 2,200 characters

---

**Next Task**: Task 2 - Implement Delete Comment Tool

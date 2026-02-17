# Task 2: Implement Delete Comment Tool

**Milestone**: Milestone 1 - Comment Moderation Features
**Estimated Time**: 3-4 hours
**Dependencies**: None
**Status**: Not Started

---

## Objective

Implement a tool that allows AI agents to delete comments on Instagram media posts. This enables content moderation, spam removal, and community management.

## Steps

1. **Create type definitions**
   - Define `DeleteCommentParams` interface
   - Define `DeleteCommentResponse` interface
   - Add to `src/types/comment-moderation.ts`

2. **Implement Instagram API client method**
   - Add `deleteComment` method to `InstagramClient`
   - Endpoint: `DELETE /{comment-id}`
   - Handle authentication and headers
   - Add error handling

3. **Create MCP tool definition**
   - Define tool schema with input parameters
   - Parameters: `comment_id`
   - Add description and examples
   - Create in `src/tools/delete-comment.ts`

4. **Implement tool handler**
   - Parse and validate input parameters
   - Call Instagram API client method
   - Format response for MCP
   - Handle errors gracefully

5. **Add to tool exports**
   - Export tool and handler from `src/tools/index.ts`
   - Register tool in server factory

6. **Write unit tests**
   - Test successful deletion
   - Test invalid comment ID
   - Test authentication errors
   - Test rate limiting
   - Mock Instagram API responses

7. **Update documentation**
   - Add tool to README.md
   - Add usage examples
   - Document error cases

## Verification

- [ ] Can delete any comment on owned media
- [ ] Returns success confirmation
- [ ] Handles invalid comment IDs gracefully
- [ ] Respects rate limits
- [ ] TypeScript types are correct
- [ ] Unit tests pass
- [ ] Documentation is clear

## Example Usage

```typescript
// Tool call
{
  "comment_id": "17234567890"
}

// Response
{
  "success": true,
  "comment_id": "17234567890"
}
```

## Technical Notes

- Endpoint: `DELETE /{comment-id}`
- Required permission: `instagram_manage_comments`
- Rate limit: 200 calls/hour (standard), 4,800/hour (advanced)
- Can only delete comments on owned media
- Deletion is permanent and cannot be undone
- Deleting a comment also deletes all its replies

---

**Next Task**: Task 3 - Implement Hide/Unhide Comment Tool

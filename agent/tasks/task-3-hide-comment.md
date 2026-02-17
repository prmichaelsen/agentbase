# Task 3: Implement Hide/Unhide Comment Tool

**Milestone**: Milestone 1 - Comment Moderation Features
**Estimated Time**: 4-5 hours
**Dependencies**: None
**Status**: Not Started

---

## Objective

Implement a tool that allows AI agents to hide or unhide comments on Instagram media posts. This enables soft moderation where comments are hidden from public view but not deleted.

## Steps

1. **Create type definitions**
   - Define `HideCommentParams` interface
   - Define `HideCommentResponse` interface
   - Add to `src/types/comment-moderation.ts`

2. **Implement Instagram API client method**
   - Add `hideComment` method to `InstagramClient`
   - Endpoint: `POST /{comment-id}` with `hide` parameter
   - Handle authentication and headers
   - Add error handling

3. **Create MCP tool definition**
   - Define tool schema with input parameters
   - Parameters: `comment_id`, `hide` (boolean)
   - Add description and examples
   - Create in `src/tools/hide-comment.ts`

4. **Implement tool handler**
   - Parse and validate input parameters
   - Call Instagram API client method
   - Format response for MCP
   - Handle errors gracefully

5. **Add to tool exports**
   - Export tool and handler from `src/tools/index.ts`
   - Register tool in server factory

6. **Write unit tests**
   - Test hiding comment
   - Test unhiding comment
   - Test invalid comment ID
   - Test authentication errors
   - Test rate limiting
   - Mock Instagram API responses

7. **Update documentation**
   - Add tool to README.md
   - Add usage examples
   - Document error cases

## Verification

- [ ] Can hide any comment on owned media
- [ ] Can unhide previously hidden comments
- [ ] Returns updated comment status
- [ ] Handles invalid comment IDs gracefully
- [ ] Respects rate limits
- [ ] TypeScript types are correct
- [ ] Unit tests pass
- [ ] Documentation is clear

## Example Usage

```typescript
// Hide comment
{
  "comment_id": "17234567890",
  "hide": true
}

// Unhide comment
{
  "comment_id": "17234567890",
  "hide": false
}

// Response
{
  "success": true,
  "comment_id": "17234567890",
  "hidden": true
}
```

## Technical Notes

- Endpoint: `POST /{comment-id}` with `hide=true` or `hide=false`
- Required permission: `instagram_manage_comments`
- Rate limit: 200 calls/hour (standard), 4,800/hour (advanced)
- Can only hide/unhide comments on owned media
- Hidden comments are not visible to public but visible to comment author
- Hiding is reversible (unlike deletion)

---

**Next Task**: Task 4 - Implement Enable/Disable Comments Tool

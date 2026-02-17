# Task 4: Implement Enable/Disable Comments Tool

**Milestone**: Milestone 1 - Comment Moderation Features
**Estimated Time**: 4-5 hours
**Dependencies**: None
**Status**: Not Started

---

## Objective

Implement a tool that allows AI agents to enable or disable comments on Instagram media posts. This provides post-level comment control for sensitive content or to prevent unwanted interactions.

## Steps

1. **Create type definitions**
   - Define `ToggleCommentsParams` interface
   - Define `ToggleCommentsResponse` interface
   - Add to `src/types/comment-moderation.ts`

2. **Implement Instagram API client method**
   - Add `toggleComments` method to `InstagramClient`
   - Endpoint: `POST /{media-id}` with `comment_enabled` parameter
   - Handle authentication and headers
   - Add error handling

3. **Create MCP tool definition**
   - Define tool schema with input parameters
   - Parameters: `media_id`, `enabled` (boolean)
   - Add description and examples
   - Create in `src/tools/toggle-comments.ts`

4. **Implement tool handler**
   - Parse and validate input parameters
   - Call Instagram API client method
   - Format response for MCP
   - Handle errors gracefully

5. **Add to tool exports**
   - Export tool and handler from `src/tools/index.ts`
   - Register tool in server factory

6. **Write unit tests**
   - Test enabling comments
   - Test disabling comments
   - Test invalid media ID
   - Test authentication errors
   - Test rate limiting
   - Mock Instagram API responses

7. **Update documentation**
   - Add tool to README.md
   - Add usage examples
   - Document error cases

## Verification

- [ ] Can enable comments on any owned media
- [ ] Can disable comments on any owned media
- [ ] Returns updated media status
- [ ] Handles invalid media IDs gracefully
- [ ] Respects rate limits
- [ ] TypeScript types are correct
- [ ] Unit tests pass
- [ ] Documentation is clear

## Example Usage

```typescript
// Disable comments
{
  "media_id": "17234567890",
  "enabled": false
}

// Enable comments
{
  "media_id": "17234567890",
  "enabled": true
}

// Response
{
  "success": true,
  "media_id": "17234567890",
  "comments_enabled": false
}
```

## Technical Notes

- Endpoint: `POST /{media-id}` with `comment_enabled=true` or `comment_enabled=false`
- Required permission: `instagram_manage_comments`
- Rate limit: 200 calls/hour (standard), 4,800/hour (advanced)
- Can only toggle comments on owned media
- Disabling comments prevents new comments but doesn't delete existing ones
- Setting is per-post, not account-wide

---

**Next Task**: Task 5 - Implement Bulk Comment Moderation Tool

# Milestone 2: Hashtag & Discovery Features

**Goal**: Implement hashtag search and business discovery capabilities
**Duration**: 2-3 weeks
**Dependencies**: None (uses existing infrastructure)
**Status**: Not Started

---

## Overview

This milestone adds hashtag search and business discovery features, enabling AI agents to discover content, track campaigns, analyze competitors, and find user-generated content. This is essential for social listening and competitive analysis.

## Deliverables

- Hashtag search tool
- Get recent media by hashtag tool
- Get top media by hashtag tool
- Business discovery tool (competitor analysis)
- Mentions tracking tool
- Hashtag performance analytics
- Discovery tests
- Documentation updates

## Success Criteria

- [ ] Can search for hashtags by name
- [ ] Can retrieve recent media for any hashtag
- [ ] Can retrieve top media for any hashtag
- [ ] Can discover other business/creator accounts
- [ ] Can track mentions of account
- [ ] Can get public metrics for competitors
- [ ] All tools have proper error handling
- [ ] All tools have TypeScript types
- [ ] All tools have unit tests
- [ ] Documentation updated with examples
- [ ] Rate limiting handled correctly

## Key Files to Create

- `src/tools/search-hashtag.ts` - Search hashtags
- `src/tools/get-hashtag-media.ts` - Get hashtagged media
- `src/tools/discover-business.ts` - Business discovery
- `src/tools/get-mentions.ts` - Track mentions
- `src/types/discovery.ts` - Type definitions
- Tests for all new tools

## Technical Considerations

- Instagram API endpoints: `GET /ig_hashtag_search`, `GET /{hashtag-id}/recent_media`, `GET /{user-id}?fields=business_discovery`
- Rate limits: 200 calls/hour (standard), 4,800 calls/hour (advanced)
- Permissions required: `instagram_basic`
- Business discovery only works for public Business/Creator accounts
- Hashtag search requires user context

---

**Next Milestone**: Milestone 3 - Advanced Publishing Features
**Blockers**: None

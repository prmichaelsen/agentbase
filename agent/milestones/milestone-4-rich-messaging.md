# Milestone 4: Rich Messaging Features

**Goal**: Implement advanced Instagram Direct messaging capabilities
**Duration**: 3-4 weeks
**Dependencies**: None (extends existing messaging tools)
**Status**: Not Started

---

## Overview

This milestone adds rich messaging features including media attachments, quick replies, templates, ice breakers, message reactions, and read receipts. These features enable sophisticated chatbot experiences and automated customer service.

## Deliverables

- Media attachment support (images, videos, audio)
- Quick reply buttons tool
- Generic templates tool (structured messages)
- Ice breakers configuration
- Message reactions tool
- Mark messages as read tool
- Persistent menu configuration
- Messaging tests
- Documentation updates

## Success Criteria

- [ ] Can send images in messages
- [ ] Can send videos in messages
- [ ] Can send audio messages
- [ ] Can send quick reply buttons
- [ ] Can send generic templates (cards)
- [ ] Can configure ice breakers
- [ ] Can react to messages with emojis
- [ ] Can mark messages as read
- [ ] Can configure persistent menu
- [ ] All tools have proper error handling
- [ ] All tools have TypeScript types
- [ ] All tools have unit tests
- [ ] Documentation updated with examples
- [ ] Rate limiting handled correctly

## Key Files to Create

- `src/tools/send-media-message.ts` - Send media attachments
- `src/tools/send-quick-replies.ts` - Quick reply buttons
- `src/tools/send-template.ts` - Generic templates
- `src/tools/configure-ice-breakers.ts` - Ice breakers
- `src/tools/react-to-message.ts` - Message reactions
- `src/tools/mark-read.ts` - Mark as read
- `src/tools/configure-menu.ts` - Persistent menu
- `src/types/rich-messaging.ts` - Type definitions
- Tests for all new tools

## Technical Considerations

- Instagram API endpoints: `POST /{user-id}/messages` with attachment payloads
- Message types: text, image, video, audio, quick_reply, generic_template
- 24-hour messaging window after user initiates
- Rate limits: 100 messages/hour, 1,000 messages/day
- Permissions required: `instagram_manage_messages`, `pages_manage_metadata`
- Media attachments must be hosted URLs or uploaded first
- Templates may require approval

---

**Next Milestone**: Milestone 5 - Webhooks & Real-Time Events
**Blockers**: None

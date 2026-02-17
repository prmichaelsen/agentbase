# Milestone 5: Webhooks & Real-Time Events

**Goal**: Implement webhook support for real-time Instagram events
**Duration**: 3-4 weeks
**Dependencies**: Requires HTTP/SSE transport (not stdio)
**Status**: Not Started

---

## Overview

This milestone adds webhook support for receiving real-time notifications from Instagram. This enables event-driven architectures, instant message responses, and proactive monitoring of account activity.

## Deliverables

- Webhook endpoint handler
- Webhook verification logic
- Event subscription management
- Message event handlers
- Comment event handlers
- Mention event handlers
- Webhook signature verification
- Event queue/processing system
- Webhook tests
- Documentation updates

## Success Criteria

- [ ] Can receive webhook events from Instagram
- [ ] Can verify webhook signatures
- [ ] Can subscribe to message events
- [ ] Can subscribe to comment events
- [ ] Can subscribe to mention events
- [ ] Can handle message_reads events
- [ ] Can handle message_deliveries events
- [ ] Can handle messaging_postbacks events
- [ ] Events are queued and processed reliably
- [ ] Duplicate events are handled
- [ ] All handlers have proper error handling
- [ ] All handlers have TypeScript types
- [ ] All handlers have unit tests
- [ ] Documentation updated with setup guide
- [ ] Webhook endpoint is secure (HTTPS, signature verification)

## Key Files to Create

- `src/webhooks/handler.ts` - Main webhook handler
- `src/webhooks/verification.ts` - Signature verification
- `src/webhooks/subscription.ts` - Subscription management
- `src/webhooks/events/messages.ts` - Message event handlers
- `src/webhooks/events/comments.ts` - Comment event handlers
- `src/webhooks/events/mentions.ts` - Mention event handlers
- `src/webhooks/queue.ts` - Event queue system
- `src/types/webhooks.ts` - Type definitions
- Tests for all webhook functionality

## Technical Considerations

- Webhook endpoint must be HTTPS
- Must verify webhook signatures using app secret
- Webhook verification challenge on subscription
- Events: messages, messaging_postbacks, messaging_optins, message_reads, message_deliveries, messaging_referrals
- Must respond to webhook within 20 seconds
- Should queue events for async processing
- Handle duplicate events (idempotency)
- Requires `POST /{page-id}/subscribed_apps` for subscription
- Permissions required: `instagram_manage_messages`, `instagram_manage_comments`

---

**Next Milestone**: Milestone 6 - Advanced Analytics
**Blockers**: Requires HTTP/SSE transport implementation

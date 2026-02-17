# Instagram Business Suite API Features

**Concept**: Comprehensive overview of Instagram Graph API and Messaging API capabilities for business accounts
**Created**: 2026-02-17
**Status**: Design Specification

---

## Overview

The Instagram Business Suite API (officially called Instagram Graph API and Instagram Messaging API) provides programmatic access to Instagram Business and Creator accounts. This document catalogs all available features, endpoints, and capabilities to guide implementation decisions for Instagram integration projects.

## Problem Statement

Businesses need to understand the full scope of Instagram API capabilities to:
- Automate content publishing and management
- Monitor engagement and performance metrics
- Manage customer conversations at scale
- Moderate comments and community interactions
- Analyze audience insights and demographics

## API Components

The Instagram Business Suite API consists of two main components:

1. **Instagram Graph API** - Content, insights, and account management
2. **Instagram Messaging API** - Direct message conversations and automation

---

## Instagram Graph API Features

### 1. Content Publishing

**Capabilities**:
- Publish single images
- Publish videos
- Publish carousel posts (multiple images/videos)
- Add captions and alt text
- Tag locations
- Schedule posts for future publication
- Add product tags (Instagram Shopping)
- Add branded content tags

**Limitations**:
- Stories publishing not supported via API
- Reels publishing limited
- Cannot publish to personal accounts (Business/Creator only)

**Endpoints**:
- `POST /{ig-user-id}/media` - Create media container
- `POST /{ig-user-id}/media_publish` - Publish media container
- `GET /{ig-user-id}/media` - List published media
- `GET /{ig-media-id}` - Get media details

### 2. Media Management

**Capabilities**:
- Retrieve media objects (posts, videos, albums)
- Get media metadata (caption, timestamp, media type, URL)
- Access media permalinks
- Query media by hashtag
- Search for media where account is @mentioned
- Get media children (for carousel posts)

**Fields Available**:
- `id` - Media ID
- `caption` - Post caption
- `media_type` - IMAGE, VIDEO, CAROUSEL_ALBUM
- `media_url` - Media URL
- `permalink` - Instagram permalink
- `timestamp` - Publication timestamp
- `username` - Account username
- `like_count` - Number of likes
- `comments_count` - Number of comments

**Endpoints**:
- `GET /{ig-user-id}/media` - List media
- `GET /{ig-media-id}` - Get media details
- `GET /{ig-media-id}/children` - Get carousel children
- `GET /{ig-hashtag-id}/recent_media` - Get hashtagged media

### 3. Comment Moderation

**Capabilities**:
- Retrieve comments on media
- Reply to comments
- Delete comments
- Hide/unhide comments
- Enable/disable comments on media
- Get comment replies (nested comments)
- Moderate comments in bulk

**Use Cases**:
- Automated comment moderation
- Customer service responses
- Community management
- Spam filtering
- Brand protection

**Endpoints**:
- `GET /{ig-media-id}/comments` - List comments
- `POST /{ig-media-id}/comments` - Reply to media
- `POST /{ig-comment-id}/replies` - Reply to comment
- `DELETE /{ig-comment-id}` - Delete comment
- `POST /{ig-comment-id}` - Hide/unhide comment

### 4. Insights & Analytics

**Account-Level Metrics**:
- Reach - Unique accounts reached
- Impressions - Total views
- Profile views - Profile page visits
- Follower count - Total followers
- Follower demographics (age, gender, location, language)
- Website clicks - Clicks on profile link
- Email contacts - Email button clicks
- Phone call clicks - Call button clicks
- Get directions clicks - Directions button clicks

**Media-Level Metrics**:
- Engagement - Likes, comments, saves, shares
- Reach - Unique accounts reached
- Impressions - Total views
- Saved - Number of saves
- Video views - For video content
- Carousel album engagement - Per-slide metrics

**Time Periods**:
- Day - Last 24 hours
- Week - Last 7 days
- Days 28 - Last 28 days
- Lifetime - Since publication

**Endpoints**:
- `GET /{ig-user-id}/insights` - Account insights
- `GET /{ig-media-id}/insights` - Media insights
- `GET /{ig-user-id}/insights?metric=follower_count,impressions,reach,profile_views`

### 5. Business Discovery

**Capabilities**:
- Discover other Instagram Business/Creator accounts
- Get public profile information
- Retrieve media from other accounts
- Access public metrics (followers, media count)
- Analyze competitor content

**Available Data**:
- Biography
- Profile picture URL
- Username
- Website URL
- Followers count
- Follows count
- Media count
- Recent media posts

**Limitations**:
- Only works for Business/Creator accounts
- Cannot access private accounts
- Limited to public data only

**Endpoints**:
- `GET /{ig-user-id}?fields=business_discovery.username({username}){followers_count,media_count,media}`

### 6. Hashtag Search

**Capabilities**:
- Search for hashtags
- Get hashtag ID
- Get recent media for hashtag
- Get top media for hashtag
- Track hashtag performance

**Use Cases**:
- Campaign tracking
- User-generated content discovery
- Trend monitoring
- Competitive analysis

**Endpoints**:
- `GET /ig_hashtag_search?user_id={user-id}&q={hashtag}` - Search hashtags
- `GET /{ig-hashtag-id}/recent_media` - Recent hashtagged media
- `GET /{ig-hashtag-id}/top_media` - Top hashtagged media

### 7. Mentions

**Capabilities**:
- Find media where account is @mentioned
- Get mention details
- Track brand mentions
- Discover user-generated content

**Endpoints**:
- `GET /{ig-user-id}?fields=mentioned_media` - Get mentions

---

## Instagram Messaging API Features

### 1. Direct Message Management

**Capabilities**:
- Send direct messages to users
- Receive incoming messages
- Send text messages
- Send media messages (images, videos)
- Send quick replies (button templates)
- Send generic templates (structured messages)
- Mark messages as read
- React to messages with emojis

**Message Types**:
- Text messages
- Image attachments
- Video attachments
- Audio messages
- Quick reply buttons
- Generic templates (cards with buttons)
- Ice breakers (conversation starters)

**Endpoints**:
- `POST /{ig-user-id}/messages` - Send message
- `GET /{ig-user-id}/conversations` - List conversations
- `GET /{conversation-id}/messages` - Get conversation messages

### 2. Conversation Management

**Capabilities**:
- List all conversations
- Get conversation details
- Get conversation messages
- Mark conversations as read/unread
- Archive conversations
- Get participant information

**Conversation Fields**:
- `id` - Conversation ID
- `updated_time` - Last update timestamp
- `participants` - Conversation participants
- `messages` - Message list
- `unread_count` - Unread message count

**Endpoints**:
- `GET /{ig-user-id}/conversations` - List conversations
- `GET /{conversation-id}` - Get conversation details
- `GET /{conversation-id}/messages` - Get messages

### 3. Webhooks for Real-Time Events

**Supported Events**:
- `messages` - New incoming messages
- `messaging_postbacks` - Button clicks
- `messaging_optins` - User opt-ins
- `message_reads` - Message read receipts
- `message_deliveries` - Message delivery confirmations
- `messaging_referrals` - Message referrals

**Webhook Payload**:
```json
{
  "object": "instagram",
  "entry": [{
    "id": "instagram-account-id",
    "time": 1234567890,
    "messaging": [{
      "sender": {"id": "sender-id"},
      "recipient": {"id": "recipient-id"},
      "timestamp": 1234567890,
      "message": {
        "mid": "message-id",
        "text": "message text"
      }
    }]
  }]
}
```

**Setup Requirements**:
- Callback URL configuration
- Webhook verification token
- HTTPS endpoint
- Subscription to message events

**Endpoints**:
- `POST /{page-id}/subscribed_apps` - Subscribe to webhooks
- `GET /{page-id}/subscribed_apps` - List subscriptions

### 4. Automated Responses

**Capabilities**:
- Auto-reply to messages
- Send away messages
- Create chatbot flows
- Trigger responses based on keywords
- Send ice breakers (conversation starters)
- Persistent menu configuration

**Use Cases**:
- Customer support automation
- FAQ responses
- Lead qualification
- Appointment booking
- Order status updates

---

## Authentication & Permissions

### Required Permissions

**Instagram Graph API**:
- `instagram_basic` - Basic profile access
- `instagram_content_publish` - Publish content
- `instagram_manage_comments` - Moderate comments
- `instagram_manage_insights` - Access analytics

**Instagram Messaging API**:
- `instagram_manage_messages` - Send/receive messages
- `pages_manage_metadata` - Manage page settings
- `pages_read_engagement` - Read page engagement

### Access Levels

1. **Standard Access** - Basic features, rate limits apply
2. **Advanced Access** - Full features, higher rate limits (requires App Review)

### Authentication Flow

1. User authorizes app via Facebook Login
2. App receives short-lived access token
3. Exchange for long-lived token (60 days)
4. Use token for API requests
5. Refresh token before expiration

---

## Rate Limits

### Instagram Graph API
- **200 calls per hour per user** (Standard Access)
- **4,800 calls per hour per user** (Advanced Access)
- Rate limits reset hourly

### Instagram Messaging API
- **100 messages per hour per user**
- **1,000 messages per day per user**
- Webhooks not counted toward rate limits

---

## Limitations & Constraints

### General Limitations
- Requires Instagram Business or Creator account
- Cannot access personal accounts
- No access to Instagram Stories via API
- Limited Reels support
- Cannot automate follows/unfollows
- Cannot automate likes
- Cannot access private accounts

### Content Publishing Limitations
- Maximum 25 carousel items
- Video size limits (up to 100MB)
- Image size limits (up to 8MB)
- Aspect ratio requirements (4:5 to 1.91:1)
- Caption length limit (2,200 characters)

### Messaging Limitations
- 24-hour messaging window (after user initiates)
- Cannot send promotional messages
- Cannot send unsolicited messages
- Message templates require approval

### Insights Limitations
- Historical data limited to 2 years
- Some metrics only available for recent content
- Follower demographics require minimum follower count
- Real-time data may have delays

---

## Use Cases

### 1. Social Media Management Tools
- Schedule and publish content
- Monitor engagement metrics
- Respond to comments
- Track campaign performance

### 2. Customer Service Platforms
- Manage direct messages
- Automate responses
- Route conversations to agents
- Track response times

### 3. Analytics Dashboards
- Aggregate insights across accounts
- Competitor analysis
- Trend monitoring
- ROI tracking

### 4. E-commerce Integration
- Product tagging
- Shopping features
- Order notifications via DM
- Customer support

### 5. Content Curation
- Discover user-generated content
- Track brand mentions
- Monitor hashtag campaigns
- Aggregate social proof

---

## Implementation Considerations

### Best Practices

1. **Token Management**
   - Store tokens securely
   - Implement token refresh logic
   - Handle token expiration gracefully

2. **Rate Limit Handling**
   - Implement exponential backoff
   - Queue requests during high traffic
   - Monitor rate limit headers

3. **Webhook Reliability**
   - Verify webhook signatures
   - Implement retry logic
   - Handle duplicate events
   - Use HTTPS endpoints

4. **Error Handling**
   - Parse error responses
   - Log errors for debugging
   - Provide user-friendly messages
   - Implement fallback mechanisms

5. **Data Privacy**
   - Comply with GDPR/CCPA
   - Implement data retention policies
   - Secure user data
   - Provide data export/deletion

### Security Considerations

- Never expose access tokens in client-side code
- Use environment variables for secrets
- Implement HTTPS for all API calls
- Validate webhook signatures
- Sanitize user input
- Implement rate limiting on your endpoints

---

## API Evolution & Updates

### Recent Changes (2024-2026)
- Enhanced insights for organic content
- Improved webhook reliability
- New messaging features
- Better error messages
- Increased rate limits for Advanced Access

### Deprecated Features
- Instagram Legacy API (deprecated 2020)
- Public Content API (limited access)
- Platform API (deprecated)

### Future Roadmap
- Enhanced Reels support
- Improved Stories API
- Advanced analytics features
- Better shopping integration

---

## Resources

### Official Documentation
- [Instagram Platform Documentation](https://developers.facebook.com/docs/instagram-platform)
- [Instagram Graph API Reference](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api)
- [Instagram Messaging API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api)

### Tools
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
- [Webhook Tester](https://developers.facebook.com/tools/webhooks/)

---

## Benefits

1. **Automation** - Reduce manual work for content publishing and moderation
2. **Scale** - Manage multiple accounts and high message volumes
3. **Insights** - Data-driven decision making with analytics
4. **Integration** - Connect Instagram with other business tools
5. **Customer Experience** - Faster response times and better service

## Trade-offs

1. **Complexity** - Requires technical implementation and maintenance
2. **Limitations** - Not all Instagram features available via API
3. **Costs** - Development and infrastructure costs
4. **Compliance** - Must follow platform policies and rate limits
5. **Dependencies** - Reliant on Meta's platform stability

---

**Status**: Design Specification
**Recommendation**: Use this document as reference for implementing Instagram integrations. Prioritize features based on business requirements and technical feasibility.

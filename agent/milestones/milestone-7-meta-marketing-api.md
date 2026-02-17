# Milestone 7: Meta Marketing API - Instagram Ads

**Goal**: Implement Instagram advertising capabilities via Meta Marketing API
**Duration**: 3-4 weeks
**Dependencies**: Requires Meta Business Manager, Ad Account, and Marketing API permissions
**Status**: Not Started

---

## Overview

This milestone adds Instagram advertising capabilities through the Meta Marketing API. This enables programmatic creation, management, and optimization of Instagram ad campaigns, ad sets, and ads. Note: This is separate from the Instagram Graph API and requires different authentication and permissions.

## Deliverables

- Campaign management tools (create, update, delete campaigns)
- Ad set management (targeting, budget, schedule)
- Ad creative management (images, videos, carousel ads)
- Instagram placement configuration
- Ad performance insights and reporting
- Audience targeting tools
- Budget and bidding management
- Ad preview and testing tools
- Comprehensive documentation

## Success Criteria

- [ ] Can create Instagram ad campaigns programmatically
- [ ] Can create ad sets with targeting parameters
- [ ] Can create ads with Instagram-specific creatives
- [ ] Can specify Instagram placements (Feed, Stories, Reels, Explore)
- [ ] Can retrieve ad performance metrics
- [ ] Can update campaign budgets and schedules
- [ ] Can pause/resume campaigns
- [ ] All tools have proper error handling
- [ ] All tools have TypeScript types
- [ ] All tools have unit tests
- [ ] Documentation includes setup guide
- [ ] Rate limiting handled correctly

## Key Files to Create

- `src/meta-marketing-client.ts` - Meta Marketing API client
- `src/tools/create-campaign.ts` - Create ad campaigns
- `src/tools/create-ad-set.ts` - Create ad sets with targeting
- `src/tools/create-ad.ts` - Create ads with creatives
- `src/tools/get-ad-insights.ts` - Retrieve ad performance
- `src/tools/update-campaign.ts` - Update campaign settings
- `src/tools/manage-budget.ts` - Budget management
- `src/types/meta-marketing.ts` - Type definitions
- Tests for all new tools

## Technical Considerations

### API Endpoints
- `POST /act_{ad_account_id}/campaigns` - Create campaigns
- `POST /act_{ad_account_id}/adsets` - Create ad sets
- `POST /act_{ad_account_id}/ads` - Create ads
- `POST /act_{ad_account_id}/adcreatives` - Create ad creatives
- `GET /{ad_id}/insights` - Get ad performance
- `POST /{campaign_id}` - Update campaigns

### Authentication
- Requires Facebook/Meta App with Marketing API permissions
- Requires Ad Account access
- Different access token from Instagram Graph API
- Token must have `ads_management` permission

### Instagram-Specific Configuration
- Placement: `instagram_feed`, `instagram_stories`, `instagram_reels`, `instagram_explore`
- Instagram account must be linked to Facebook Page
- Creative specs differ by placement (aspect ratios, dimensions)

### Ad Hierarchy
```
Campaign (objective, budget)
  └─ Ad Set (targeting, schedule, budget)
      └─ Ad (creative, copy)
          └─ Ad Creative (image/video, text)
```

### Permissions Required
- `ads_management` - Create and manage ads
- `ads_read` - Read ad data
- `business_management` - Access Business Manager
- `pages_read_engagement` - Link Instagram account

### Rate Limits
- 200 calls per hour per user (standard)
- 4,800 calls per hour per user (advanced)
- Different limits for ad creation vs. insights

## Implementation Tasks

### Task 1: Meta Marketing API Client Setup (6-8 hours)
- Create MetaMarketingClient class
- Implement authentication flow
- Add request/response handling
- Error handling for Marketing API
- Rate limiting logic

### Task 2: Campaign Management Tools (6-8 hours)
- Create campaign tool
- Update campaign tool
- Delete/pause campaign tool
- List campaigns tool
- Campaign status management

### Task 3: Ad Set Management Tools (8-10 hours)
- Create ad set tool
- Configure targeting (demographics, interests, behaviors)
- Set budget and schedule
- Update ad set tool
- Optimization goals configuration

### Task 4: Ad Creative Management Tools (8-10 hours)
- Create ad creative tool
- Upload images/videos
- Configure Instagram placements
- Carousel ad support
- Preview ad tool

### Task 5: Ad Management Tools (6-8 hours)
- Create ad tool
- Link creative to ad
- Update ad tool
- Pause/resume ad tool
- Ad delivery status

### Task 6: Performance Insights Tools (6-8 hours)
- Get ad insights tool
- Get campaign insights tool
- Get ad set insights tool
- Metrics: impressions, reach, clicks, conversions, spend
- Time range and breakdowns

### Task 7: Audience Targeting Tools (4-6 hours)
- Create custom audience tool
- Create lookalike audience tool
- Saved audience management
- Interest targeting helpers

### Task 8: Budget & Bidding Tools (4-6 hours)
- Budget management tool
- Bid strategy configuration
- Spend tracking
- Budget optimization

### Task 9: Tests & Documentation (6-8 hours)
- Unit tests for all tools
- Integration tests
- Setup guide for Meta Business Manager
- Ad Account configuration guide
- Permission setup guide
- Usage examples

---

## Setup Requirements

### Prerequisites
1. **Meta Business Manager Account**
   - Create at [business.facebook.com](https://business.facebook.com)
   - Add Instagram account to Business Manager

2. **Ad Account**
   - Create or claim ad account in Business Manager
   - Note the Ad Account ID (format: `act_123456789`)

3. **Facebook App**
   - Create app at [developers.facebook.com](https://developers.facebook.com)
   - Add Marketing API product
   - Request `ads_management` permission (requires App Review)

4. **Instagram Account**
   - Must be Business or Creator account
   - Must be linked to Facebook Page
   - Page must be added to Business Manager

5. **Access Token**
   - Generate User Access Token with `ads_management` permission
   - Exchange for long-lived token (60 days)
   - Store securely (different from Instagram Graph API token)

### Configuration
```typescript
const marketingClient = new MetaMarketingClient({
  accessToken: process.env.META_MARKETING_ACCESS_TOKEN,
  adAccountId: process.env.META_AD_ACCOUNT_ID,
  instagramAccountId: process.env.INSTAGRAM_ACCOUNT_ID,
  facebookPageId: process.env.FACEBOOK_PAGE_ID
});
```

---

## Instagram Ad Placements

### Feed Ads
- **Aspect Ratio**: 1:1 (square) or 4:5 (vertical)
- **Resolution**: 1080 x 1080 px minimum
- **Format**: JPG, PNG, MP4, MOV
- **Text**: 125 characters recommended

### Stories Ads
- **Aspect Ratio**: 9:16 (full screen)
- **Resolution**: 1080 x 1920 px
- **Format**: JPG, PNG, MP4, MOV
- **Duration**: 15 seconds max (video)

### Reels Ads
- **Aspect Ratio**: 9:16 (full screen)
- **Resolution**: 1080 x 1920 px
- **Format**: MP4, MOV
- **Duration**: 15-60 seconds

### Explore Ads
- **Aspect Ratio**: 1:1 (square)
- **Resolution**: 1080 x 1080 px
- **Format**: JPG, PNG, MP4, MOV

---

## Campaign Objectives

Available objectives for Instagram ads:
- **OUTCOME_AWARENESS** - Brand awareness
- **OUTCOME_ENGAGEMENT** - Post engagement
- **OUTCOME_TRAFFIC** - Website traffic
- **OUTCOME_APP_PROMOTION** - App installs
- **OUTCOME_LEADS** - Lead generation
- **OUTCOME_SALES** - Conversions/sales

---

## Example Usage

### Create Campaign
```typescript
const campaign = await createCampaign(client, {
  name: 'Summer Sale 2026',
  objective: 'OUTCOME_SALES',
  status: 'PAUSED',
  special_ad_categories: []
});
```

### Create Ad Set
```typescript
const adSet = await createAdSet(client, {
  campaign_id: campaign.id,
  name: 'Instagram Feed - 25-34 Women',
  optimization_goal: 'LINK_CLICKS',
  billing_event: 'IMPRESSIONS',
  bid_amount: 500, // $5.00 CPM
  daily_budget: 5000, // $50.00
  targeting: {
    age_min: 25,
    age_max: 34,
    genders: [2], // Female
    geo_locations: { countries: ['US'] }
  },
  instagram_positions: ['stream'] // Feed
});
```

### Create Ad
```typescript
const ad = await createAd(client, {
  adset_id: adSet.id,
  name: 'Summer Sale Creative 1',
  creative: {
    object_story_spec: {
      instagram_actor_id: instagramAccountId,
      link_data: {
        image_hash: uploadedImageHash,
        link: 'https://example.com/sale',
        message: 'Summer Sale! 50% off everything!',
        call_to_action: {
          type: 'SHOP_NOW'
        }
      }
    }
  },
  status: 'PAUSED'
});
```

---

## Benefits

1. **Programmatic Ad Creation** - Automate ad campaign setup
2. **Scale** - Manage multiple campaigns efficiently
3. **Optimization** - Real-time performance tracking and adjustments
4. **Integration** - Connect ads with content strategy
5. **Testing** - A/B test creatives and targeting at scale

## Trade-offs

1. **Complexity** - More complex than Instagram Graph API
2. **Setup** - Requires Business Manager and Ad Account
3. **Permissions** - Requires App Review for production use
4. **Cost** - Ad spend required to test
5. **Separate Auth** - Different access token from Graph API

---

## Important Notes

- Meta Marketing API handles both Facebook and Instagram ads
- Instagram ads require linked Facebook Page
- All ads must comply with Meta's advertising policies
- Ad Account must have payment method configured
- Test in sandbox mode before production
- Monitor ad spend carefully
- Rate limits are shared across all ad operations

---

**Next Milestone**: Return to M1 (Comment Moderation) or M3 (Advanced Publishing)
**Blockers**: Requires Meta Business Manager setup and App Review approval

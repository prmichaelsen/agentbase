import { InstagramClient } from '../instagram-client.js';

export const getMediaInsightsTool = {
  name: 'instagram_get_media_insights',
  description: 'Get insights (analytics) for a specific Instagram media post. Includes metrics like impressions, reach, engagement, saves, etc. Requires a Business or Creator account.',
  inputSchema: {
    type: 'object',
    properties: {
      media_id: {
        type: 'string',
        description: 'Instagram media ID (required)'
      },
      metrics: {
        type: 'array',
        items: {
          type: 'string',
          enum: [
            'engagement',
            'impressions',
            'reach',
            'saved',
            'video_views',
            'likes',
            'comments',
            'shares'
          ]
        },
        description: 'Metrics to retrieve. Available: engagement, impressions, reach, saved, video_views, likes, comments, shares (required)'
      }
    },
    required: ['media_id', 'metrics']
  }
};

export const getUserInsightsTool = {
  name: 'instagram_get_user_insights',
  description: 'Get insights (analytics) for an Instagram user account. Includes metrics like impressions, reach, profile views, follower demographics, etc. Requires a Business or Creator account.',
  inputSchema: {
    type: 'object',
    properties: {
      user_id: {
        type: 'string',
        description: 'Instagram user ID. Use "me" for the authenticated user (default: "me")',
        default: 'me'
      },
      metrics: {
        type: 'array',
        items: {
          type: 'string',
          enum: [
            'impressions',
            'reach',
            'follower_count',
            'email_contacts',
            'phone_call_clicks',
            'text_message_clicks',
            'get_directions_clicks',
            'website_clicks',
            'profile_views'
          ]
        },
        description: 'Metrics to retrieve. Available: impressions, reach, follower_count, email_contacts, phone_call_clicks, text_message_clicks, get_directions_clicks, website_clicks, profile_views (required)'
      },
      period: {
        type: 'string',
        enum: ['day', 'week', 'days_28'],
        description: 'Time period for the insights (required)',
        default: 'day'
      }
    },
    required: ['metrics', 'period']
  }
};

export async function handleGetMediaInsights(
  client: InstagramClient,
  args: any
): Promise<string> {
  const mediaId = args.media_id;
  const metrics = args.metrics;

  if (!mediaId) {
    throw new Error('media_id is required');
  }

  if (!metrics || metrics.length === 0) {
    throw new Error('metrics array is required and must not be empty');
  }

  try {
    const insights = await client.getMediaInsights(mediaId, metrics);
    return JSON.stringify(insights, null, 2);
  } catch (error) {
    throw new Error(`Failed to get media insights: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function handleGetUserInsights(
  client: InstagramClient,
  args: any
): Promise<string> {
  const userId = args.user_id || 'me';
  const metrics = args.metrics;
  const period = args.period || 'day';

  if (!metrics || metrics.length === 0) {
    throw new Error('metrics array is required and must not be empty');
  }

  try {
    const insights = await client.getUserInsights(userId, metrics, period);
    return JSON.stringify(insights, null, 2);
  } catch (error) {
    throw new Error(`Failed to get user insights: ${error instanceof Error ? error.message : String(error)}`);
  }
}
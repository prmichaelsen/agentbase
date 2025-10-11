import { InstagramClient } from '../instagram-client.js';

export const getMediaTool = {
  name: 'instagram_get_media',
  description: 'Get a list of media posts from an Instagram user. Returns posts with details like caption, media type, URL, and timestamp.',
  inputSchema: {
    type: 'object',
    properties: {
      user_id: {
        type: 'string',
        description: 'Instagram user ID. Use "me" for the authenticated user (default: "me")',
        default: 'me'
      },
      limit: {
        type: 'number',
        description: 'Number of media items to retrieve (1-100, default: 25)',
        default: 25,
        minimum: 1,
        maximum: 100
      },
      fields: {
        type: 'array',
        items: {
          type: 'string'
        },
        description: 'Fields to retrieve. Available: id, caption, media_type, media_url, permalink, thumbnail_url, timestamp, like_count, comments_count. If not provided, returns basic fields.'
      },
      after: {
        type: 'string',
        description: 'Pagination cursor for fetching the next page of results. Use the value from paging.cursors.after in the previous response.'
      }
    }
  }
};

export async function handleGetMedia(
  client: InstagramClient,
  args: any
): Promise<string> {
  const userId = args.user_id || 'me';
  const limit = args.limit || 25;
  const fields = args.fields;
  const after = args.after;

  try {
    const media = await client.getUserMedia(userId, fields, limit, after);
    return JSON.stringify(media, null, 2);
  } catch (error) {
    throw new Error(`Failed to get media: ${error instanceof Error ? error.message : String(error)}`);
  }
}
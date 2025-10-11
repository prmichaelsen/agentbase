import { InstagramClient } from '../instagram-client.js';

export const getMediaDetailsTool = {
  name: 'instagram_get_media_details',
  description: 'Get detailed information about a specific Instagram media post by its ID, including likes, comments count, and other engagement metrics.',
  inputSchema: {
    type: 'object',
    properties: {
      media_id: {
        type: 'string',
        description: 'Instagram media ID (required)'
      },
      fields: {
        type: 'array',
        items: {
          type: 'string'
        },
        description: 'Fields to retrieve. Available: id, caption, media_type, media_url, permalink, thumbnail_url, timestamp, like_count, comments_count, owner. If not provided, returns comprehensive fields.'
      }
    },
    required: ['media_id']
  }
};

export async function handleGetMediaDetails(
  client: InstagramClient,
  args: any
): Promise<string> {
  const mediaId = args.media_id;
  const fields = args.fields;

  if (!mediaId) {
    throw new Error('media_id is required');
  }

  try {
    const details = await client.getMediaDetails(mediaId, fields);
    return JSON.stringify(details, null, 2);
  } catch (error) {
    throw new Error(`Failed to get media details: ${error instanceof Error ? error.message : String(error)}`);
  }
}
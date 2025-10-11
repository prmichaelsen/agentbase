import { InstagramClient } from '../instagram-client.js';

export const getCommentsTool = {
  name: 'instagram_get_comments',
  description: 'Get comments on a specific Instagram media post. Returns a list of comments with text, username, and timestamp.',
  inputSchema: {
    type: 'object',
    properties: {
      media_id: {
        type: 'string',
        description: 'Instagram media ID (required)'
      },
      limit: {
        type: 'number',
        description: 'Number of comments to retrieve (1-100, default: 25)',
        default: 25,
        minimum: 1,
        maximum: 100
      },
      fields: {
        type: 'array',
        items: {
          type: 'string'
        },
        description: 'Fields to retrieve. Available: id, text, username, timestamp, from, replies. If not provided, returns basic fields.'
      }
    },
    required: ['media_id']
  }
};

export async function handleGetComments(
  client: InstagramClient,
  args: any
): Promise<string> {
  const mediaId = args.media_id;
  const limit = args.limit || 25;
  const fields = args.fields;

  if (!mediaId) {
    throw new Error('media_id is required');
  }

  try {
    const comments = await client.getMediaComments(mediaId, fields, limit);
    return JSON.stringify(comments, null, 2);
  } catch (error) {
    throw new Error(`Failed to get comments: ${error instanceof Error ? error.message : String(error)}`);
  }
}
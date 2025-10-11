import { InstagramClient } from '../instagram-client.js';

export const getProfileTool = {
  name: 'instagram_get_profile',
  description: 'Get Instagram user profile information including username, account type, media count, followers, etc.',
  inputSchema: {
    type: 'object',
    properties: {
      user_id: {
        type: 'string',
        description: 'Instagram user ID. Use "me" for the authenticated user (default: "me")',
        default: 'me'
      },
      fields: {
        type: 'array',
        items: {
          type: 'string'
        },
        description: 'Fields to retrieve. Available: id, username, account_type, media_count, followers_count, follows_count. If not provided, returns basic fields.'
      }
    }
  }
};

export async function handleGetProfile(
  client: InstagramClient,
  args: any
): Promise<string> {
  const userId = args.user_id || 'me';
  const fields = args.fields;

  try {
    const profile = await client.getUserProfile(userId, fields);
    return JSON.stringify(profile, null, 2);
  } catch (error) {
    throw new Error(`Failed to get profile: ${error instanceof Error ? error.message : String(error)}`);
  }
}
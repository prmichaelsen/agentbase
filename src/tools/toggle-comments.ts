import { InstagramClient } from '../instagram-client.js';
import type { ToggleCommentsParams, ToggleCommentsResponse } from '../types/comment-moderation.js';

export const toggleCommentsTool = {
  name: 'instagram_toggle_comments',
  description: 'Enable or disable comments on an Instagram post. Provides post-level comment control for sensitive content or to prevent unwanted interactions. Disabling comments prevents new comments but does not delete existing ones.',
  inputSchema: {
    type: 'object',
    properties: {
      media_id: {
        type: 'string',
        description: 'The ID of the media post to enable/disable comments on'
      },
      enabled: {
        type: 'boolean',
        description: 'true to enable comments, false to disable comments'
      }
    },
    required: ['media_id', 'enabled']
  }
};

export async function handleToggleComments(
  client: InstagramClient,
  args: ToggleCommentsParams
): Promise<string> {
  const { media_id, enabled } = args;

  if (!media_id || !media_id.trim()) {
    throw new Error('Media ID is required');
  }

  if (typeof enabled !== 'boolean') {
    throw new Error('Enabled parameter must be a boolean (true or false)');
  }

  try {
    await client.toggleComments(media_id, enabled);

    return JSON.stringify({
      success: true,
      media_id: media_id,
      comments_enabled: enabled,
      action: enabled ? 'enabled' : 'disabled',
      timestamp: new Date().toISOString(),
      note: enabled 
        ? 'Comments are now enabled on this post. Users can add new comments.'
        : 'Comments are now disabled on this post. Existing comments remain visible but new comments cannot be added.'
    }, null, 2);
  } catch (error) {
    throw new Error(
      `Failed to ${enabled ? 'enable' : 'disable'} comments: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

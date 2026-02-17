import { InstagramClient } from '../instagram-client.js';
import type { HideCommentParams, HideCommentResponse } from '../types/comment-moderation.js';

export const hideCommentTool = {
  name: 'instagram_hide_comment',
  description: 'Hide or unhide a comment on an Instagram post. Hidden comments are not visible to the public but remain visible to the comment author. This enables soft moderation without permanent deletion.',
  inputSchema: {
    type: 'object',
    properties: {
      comment_id: {
        type: 'string',
        description: 'The ID of the comment to hide or unhide'
      },
      hide: {
        type: 'boolean',
        description: 'true to hide the comment, false to unhide it'
      }
    },
    required: ['comment_id', 'hide']
  }
};

export async function handleHideComment(
  client: InstagramClient,
  args: HideCommentParams
): Promise<string> {
  const { comment_id, hide } = args;

  if (!comment_id || !comment_id.trim()) {
    throw new Error('Comment ID is required');
  }

  if (typeof hide !== 'boolean') {
    throw new Error('Hide parameter must be a boolean (true or false)');
  }

  try {
    await client.hideComment(comment_id, hide);

    return JSON.stringify({
      success: true,
      comment_id: comment_id,
      hidden: hide,
      action: hide ? 'hidden' : 'unhidden',
      timestamp: new Date().toISOString(),
      note: hide 
        ? 'Comment is now hidden from public view but visible to author'
        : 'Comment is now visible to public'
    }, null, 2);
  } catch (error) {
    throw new Error(
      `Failed to ${hide ? 'hide' : 'unhide'} comment: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

import { InstagramClient } from '../instagram-client.js';
import type { ReplyToCommentParams, ReplyToCommentResponse } from '../types/comment-moderation.js';

export const replyToCommentTool = {
  name: 'instagram_reply_to_comment',
  description: 'Reply to a comment on an Instagram post. Enables automated customer service and community engagement.',
  inputSchema: {
    type: 'object',
    properties: {
      comment_id: {
        type: 'string',
        description: 'The ID of the comment to reply to'
      },
      message: {
        type: 'string',
        description: 'The reply message text (max 2,200 characters)',
        maxLength: 2200
      }
    },
    required: ['comment_id', 'message']
  }
};

export async function handleReplyToComment(
  client: InstagramClient,
  args: ReplyToCommentParams
): Promise<string> {
  const { comment_id, message } = args;

  // Validate message length
  if (message.length > 2200) {
    throw new Error('Reply message must be 2,200 characters or less');
  }

  if (!message.trim()) {
    throw new Error('Reply message cannot be empty');
  }

  try {
    const response: ReplyToCommentResponse = await client.replyToComment(
      comment_id,
      message
    );

    return JSON.stringify({
      success: true,
      reply_id: response.id,
      message: message,
      comment_id: comment_id,
      timestamp: response.timestamp || new Date().toISOString()
    }, null, 2);
  } catch (error) {
    throw new Error(
      `Failed to reply to comment: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

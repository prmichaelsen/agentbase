import { InstagramClient } from '../instagram-client.js';
import type { BulkModerateParams, BulkModerateResponse } from '../types/comment-moderation.js';

export const moderateCommentsTool = {
  name: 'instagram_moderate_comments_bulk',
  description: 'Perform bulk moderation operations on multiple comments at once. Supports reply, delete, hide, and unhide actions. Automatically batches requests to respect rate limits.',
  inputSchema: {
    type: 'object',
    properties: {
      comment_ids: {
        type: 'array',
        items: {
          type: 'string'
        },
        description: 'Array of comment IDs to moderate',
        minItems: 1
      },
      action: {
        type: 'string',
        enum: ['reply', 'delete', 'hide', 'unhide'],
        description: 'The moderation action to perform on all comments'
      },
      message: {
        type: 'string',
        description: 'Reply message text (required for "reply" action, max 2,200 characters)',
        maxLength: 2200
      },
      batch_size: {
        type: 'number',
        description: 'Number of comments to process per batch (default: 10)',
        default: 10,
        minimum: 1,
        maximum: 50
      },
      delay_ms: {
        type: 'number',
        description: 'Delay in milliseconds between batches (default: 1000)',
        default: 1000,
        minimum: 0
      }
    },
    required: ['comment_ids', 'action']
  }
};

export async function handleModerateComments(
  client: InstagramClient,
  args: BulkModerateParams & { batch_size?: number; delay_ms?: number }
): Promise<string> {
  const { comment_ids, action, message, batch_size = 10, delay_ms = 1000 } = args;

  // Validation
  if (!comment_ids || comment_ids.length === 0) {
    throw new Error('At least one comment ID is required');
  }

  if (!['reply', 'delete', 'hide', 'unhide'].includes(action)) {
    throw new Error('Action must be one of: reply, delete, hide, unhide');
  }

  if (action === 'reply' && !message) {
    throw new Error('Message is required for reply action');
  }

  if (action === 'reply' && message && message.length > 2200) {
    throw new Error('Reply message must be 2,200 characters or less');
  }

  if (batch_size < 1 || batch_size > 50) {
    throw new Error('Batch size must be between 1 and 50');
  }

  try {
    const results = await client.bulkModerateComments(
      comment_ids,
      action,
      message,
      batch_size,
      delay_ms
    );

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    const response: BulkModerateResponse = {
      total: comment_ids.length,
      successful,
      failed,
      results: results.map(r => ({
        comment_id: r.comment_id,
        success: r.success,
        error: r.error
      }))
    };

    return JSON.stringify({
      ...response,
      action,
      batch_size,
      timestamp: new Date().toISOString(),
      note: `Processed ${comment_ids.length} comments in ${Math.ceil(comment_ids.length / batch_size)} batches`
    }, null, 2);
  } catch (error) {
    throw new Error(
      `Failed to moderate comments: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

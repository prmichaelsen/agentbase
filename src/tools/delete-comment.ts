import { InstagramClient } from '../instagram-client.js';
import type { DeleteCommentParams, DeleteCommentResponse } from '../types/comment-moderation.js';

export const deleteCommentTool = {
  name: 'instagram_delete_comment',
  description: 'Delete a comment on an Instagram post. Enables content moderation and spam removal. WARNING: Deletion is permanent and also deletes all replies to the comment.',
  inputSchema: {
    type: 'object',
    properties: {
      comment_id: {
        type: 'string',
        description: 'The ID of the comment to delete'
      }
    },
    required: ['comment_id']
  }
};

export async function handleDeleteComment(
  client: InstagramClient,
  args: DeleteCommentParams
): Promise<string> {
  const { comment_id } = args;

  if (!comment_id || !comment_id.trim()) {
    throw new Error('Comment ID is required');
  }

  try {
    await client.deleteComment(comment_id);

    return JSON.stringify({
      success: true,
      comment_id: comment_id,
      deleted_at: new Date().toISOString(),
      note: 'Comment and all its replies have been permanently deleted'
    }, null, 2);
  } catch (error) {
    throw new Error(
      `Failed to delete comment: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

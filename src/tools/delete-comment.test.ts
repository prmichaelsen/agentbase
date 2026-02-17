import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { handleDeleteComment } from './delete-comment.js';
import { InstagramClient } from '../instagram-client.js';
import type { DeleteCommentParams } from '../types/comment-moderation.js';

// Mock Instagram client
const createMockClient = (): jest.Mocked<InstagramClient> => {
  return {
    getUserProfile: jest.fn(),
    getUserMedia: jest.fn(),
    getMediaDetails: jest.fn(),
    getMediaComments: jest.fn(),
    getMediaInsights: jest.fn(),
    getUserInsights: jest.fn(),
    publishMedia: jest.fn(),
    publishMediaContainer: jest.fn(),
    getConversations: jest.fn(),
    getConversationMessages: jest.fn(),
    sendMessage: jest.fn(),
    replyToComment: jest.fn(),
    deleteComment: jest.fn(),
    makeRequest: jest.fn(),
  } as any;
};

describe('handleDeleteComment', () => {
  let mockClient: jest.Mocked<InstagramClient>;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should delete a comment successfully', async () => {
    // Arrange
    const params: DeleteCommentParams = {
      comment_id: '17234567890'
    };

    mockClient.deleteComment.mockResolvedValue({ success: true });

    // Act
    const result = await handleDeleteComment(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(mockClient.deleteComment).toHaveBeenCalledWith('17234567890');
    expect(parsed.success).toBe(true);
    expect(parsed.comment_id).toBe('17234567890');
    expect(parsed.deleted_at).toBeDefined();
    expect(parsed.note).toContain('permanently deleted');
  });

  it('should handle API errors gracefully', async () => {
    // Arrange
    const params: DeleteCommentParams = {
      comment_id: '17234567890'
    };

    mockClient.deleteComment.mockRejectedValue(
      new Error('Comment not found')
    );

    // Act & Assert
    await expect(
      handleDeleteComment(mockClient, params)
    ).rejects.toThrow('Failed to delete comment: Comment not found');
  });

  it('should reject empty comment ID', async () => {
    // Arrange
    const params: DeleteCommentParams = {
      comment_id: '   '
    };

    // Act & Assert
    await expect(
      handleDeleteComment(mockClient, params)
    ).rejects.toThrow('Comment ID is required');

    expect(mockClient.deleteComment).not.toHaveBeenCalled();
  });

  it('should reject missing comment ID', async () => {
    // Arrange
    const params: DeleteCommentParams = {
      comment_id: ''
    };

    // Act & Assert
    await expect(
      handleDeleteComment(mockClient, params)
    ).rejects.toThrow('Comment ID is required');

    expect(mockClient.deleteComment).not.toHaveBeenCalled();
  });

  it('should include timestamp in response', async () => {
    // Arrange
    const params: DeleteCommentParams = {
      comment_id: '17234567890'
    };

    mockClient.deleteComment.mockResolvedValue({ success: true });

    // Act
    const result = await handleDeleteComment(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(parsed.deleted_at).toBeDefined();
    const timestamp = new Date(parsed.deleted_at);
    expect(timestamp.getTime()).toBeGreaterThan(Date.now() - 5000); // Within last 5 seconds
  });

  it('should handle authentication errors', async () => {
    // Arrange
    const params: DeleteCommentParams = {
      comment_id: '17234567890'
    };

    mockClient.deleteComment.mockRejectedValue(
      new Error('Invalid OAuth access token')
    );

    // Act & Assert
    await expect(
      handleDeleteComment(mockClient, params)
    ).rejects.toThrow('Failed to delete comment: Invalid OAuth access token');
  });

  it('should handle permission errors', async () => {
    // Arrange
    const params: DeleteCommentParams = {
      comment_id: '17234567890'
    };

    mockClient.deleteComment.mockRejectedValue(
      new Error('Insufficient permissions')
    );

    // Act & Assert
    await expect(
      handleDeleteComment(mockClient, params)
    ).rejects.toThrow('Failed to delete comment: Insufficient permissions');
  });

  it('should return formatted JSON string', async () => {
    // Arrange
    const params: DeleteCommentParams = {
      comment_id: '17234567890'
    };

    mockClient.deleteComment.mockResolvedValue({ success: true });

    // Act
    const result = await handleDeleteComment(mockClient, params);

    // Assert
    expect(typeof result).toBe('string');
    const parsed = JSON.parse(result);
    expect(parsed).toHaveProperty('success');
    expect(parsed).toHaveProperty('comment_id');
    expect(parsed).toHaveProperty('deleted_at');
    expect(parsed).toHaveProperty('note');
  });
});

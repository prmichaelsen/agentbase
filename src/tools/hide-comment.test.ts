import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { handleHideComment } from './hide-comment.js';
import { InstagramClient } from '../instagram-client.js';
import type { HideCommentParams } from '../types/comment-moderation.js';

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
    hideComment: jest.fn(),
    makeRequest: jest.fn(),
  } as any;
};

describe('handleHideComment', () => {
  let mockClient: jest.Mocked<InstagramClient>;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should hide a comment successfully', async () => {
    // Arrange
    const params: HideCommentParams = {
      comment_id: '17234567890',
      hide: true
    };

    mockClient.hideComment.mockResolvedValue({ success: true });

    // Act
    const result = await handleHideComment(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(mockClient.hideComment).toHaveBeenCalledWith('17234567890', true);
    expect(parsed.success).toBe(true);
    expect(parsed.comment_id).toBe('17234567890');
    expect(parsed.hidden).toBe(true);
    expect(parsed.action).toBe('hidden');
    expect(parsed.note).toContain('hidden from public view');
  });

  it('should unhide a comment successfully', async () => {
    // Arrange
    const params: HideCommentParams = {
      comment_id: '17234567890',
      hide: false
    };

    mockClient.hideComment.mockResolvedValue({ success: true });

    // Act
    const result = await handleHideComment(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(mockClient.hideComment).toHaveBeenCalledWith('17234567890', false);
    expect(parsed.success).toBe(true);
    expect(parsed.hidden).toBe(false);
    expect(parsed.action).toBe('unhidden');
    expect(parsed.note).toContain('visible to public');
  });

  it('should handle API errors gracefully', async () => {
    // Arrange
    const params: HideCommentParams = {
      comment_id: '17234567890',
      hide: true
    };

    mockClient.hideComment.mockRejectedValue(
      new Error('Comment not found')
    );

    // Act & Assert
    await expect(
      handleHideComment(mockClient, params)
    ).rejects.toThrow('Failed to hide comment: Comment not found');
  });

  it('should reject empty comment ID', async () => {
    // Arrange
    const params: HideCommentParams = {
      comment_id: '   ',
      hide: true
    };

    // Act & Assert
    await expect(
      handleHideComment(mockClient, params)
    ).rejects.toThrow('Comment ID is required');

    expect(mockClient.hideComment).not.toHaveBeenCalled();
  });

  it('should reject non-boolean hide parameter', async () => {
    // Arrange
    const params: any = {
      comment_id: '17234567890',
      hide: 'yes' // Invalid: should be boolean
    };

    // Act & Assert
    await expect(
      handleHideComment(mockClient, params)
    ).rejects.toThrow('Hide parameter must be a boolean');

    expect(mockClient.hideComment).not.toHaveBeenCalled();
  });

  it('should include timestamp in response', async () => {
    // Arrange
    const params: HideCommentParams = {
      comment_id: '17234567890',
      hide: true
    };

    mockClient.hideComment.mockResolvedValue({ success: true });

    // Act
    const result = await handleHideComment(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(parsed.timestamp).toBeDefined();
    const timestamp = new Date(parsed.timestamp);
    expect(timestamp.getTime()).toBeGreaterThan(Date.now() - 5000);
  });

  it('should handle authentication errors', async () => {
    // Arrange
    const params: HideCommentParams = {
      comment_id: '17234567890',
      hide: true
    };

    mockClient.hideComment.mockRejectedValue(
      new Error('Invalid OAuth access token')
    );

    // Act & Assert
    await expect(
      handleHideComment(mockClient, params)
    ).rejects.toThrow('Failed to hide comment: Invalid OAuth access token');
  });

  it('should differentiate error messages for hide vs unhide', async () => {
    // Arrange - hide error
    const hideParams: HideCommentParams = {
      comment_id: '17234567890',
      hide: true
    };

    mockClient.hideComment.mockRejectedValue(new Error('Test error'));

    // Act & Assert - hide
    await expect(
      handleHideComment(mockClient, hideParams)
    ).rejects.toThrow('Failed to hide comment: Test error');

    // Arrange - unhide error
    const unhideParams: HideCommentParams = {
      comment_id: '17234567890',
      hide: false
    };

    // Act & Assert - unhide
    await expect(
      handleHideComment(mockClient, unhideParams)
    ).rejects.toThrow('Failed to unhide comment: Test error');
  });

  it('should return formatted JSON string', async () => {
    // Arrange
    const params: HideCommentParams = {
      comment_id: '17234567890',
      hide: true
    };

    mockClient.hideComment.mockResolvedValue({ success: true });

    // Act
    const result = await handleHideComment(mockClient, params);

    // Assert
    expect(typeof result).toBe('string');
    const parsed = JSON.parse(result);
    expect(parsed).toHaveProperty('success');
    expect(parsed).toHaveProperty('comment_id');
    expect(parsed).toHaveProperty('hidden');
    expect(parsed).toHaveProperty('action');
    expect(parsed).toHaveProperty('timestamp');
    expect(parsed).toHaveProperty('note');
  });
});

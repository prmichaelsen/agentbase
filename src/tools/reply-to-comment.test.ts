import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { handleReplyToComment } from './reply-to-comment.js';
import { InstagramClient } from '../instagram-client.js';
import type { ReplyToCommentParams } from '../types/comment-moderation.js';

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
    makeRequest: jest.fn(),
  } as any;
};

describe('handleReplyToComment', () => {
  let mockClient: jest.Mocked<InstagramClient>;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should reply to a comment successfully', async () => {
    // Arrange
    const params: ReplyToCommentParams = {
      comment_id: '17234567890',
      message: 'Thank you for your feedback!'
    };

    const mockResponse = {
      id: '17345678901',
      timestamp: '2026-02-17T21:00:00+0000'
    };

    mockClient.replyToComment.mockResolvedValue(mockResponse);

    // Act
    const result = await handleReplyToComment(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(mockClient.replyToComment).toHaveBeenCalledWith(
      '17234567890',
      'Thank you for your feedback!'
    );
    expect(parsed.success).toBe(true);
    expect(parsed.reply_id).toBe('17345678901');
    expect(parsed.message).toBe('Thank you for your feedback!');
    expect(parsed.comment_id).toBe('17234567890');
  });

  it('should handle API errors gracefully', async () => {
    // Arrange
    const params: ReplyToCommentParams = {
      comment_id: '17234567890',
      message: 'Test reply'
    };

    mockClient.replyToComment.mockRejectedValue(
      new Error('Comment not found')
    );

    // Act & Assert
    await expect(
      handleReplyToComment(mockClient, params)
    ).rejects.toThrow('Failed to reply to comment: Comment not found');
  });

  it('should reject messages longer than 2,200 characters', async () => {
    // Arrange
    const longMessage = 'a'.repeat(2201);
    const params: ReplyToCommentParams = {
      comment_id: '17234567890',
      message: longMessage
    };

    // Act & Assert
    await expect(
      handleReplyToComment(mockClient, params)
    ).rejects.toThrow('Reply message must be 2,200 characters or less');

    expect(mockClient.replyToComment).not.toHaveBeenCalled();
  });

  it('should reject empty messages', async () => {
    // Arrange
    const params: ReplyToCommentParams = {
      comment_id: '17234567890',
      message: '   '
    };

    // Act & Assert
    await expect(
      handleReplyToComment(mockClient, params)
    ).rejects.toThrow('Reply message cannot be empty');

    expect(mockClient.replyToComment).not.toHaveBeenCalled();
  });

  it('should handle messages at the character limit', async () => {
    // Arrange
    const maxMessage = 'a'.repeat(2200);
    const params: ReplyToCommentParams = {
      comment_id: '17234567890',
      message: maxMessage
    };

    const mockResponse = {
      id: '17345678901'
    };

    mockClient.replyToComment.mockResolvedValue(mockResponse);

    // Act
    const result = await handleReplyToComment(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(mockClient.replyToComment).toHaveBeenCalledWith(
      '17234567890',
      maxMessage
    );
    expect(parsed.success).toBe(true);
  });

  it('should include timestamp in response', async () => {
    // Arrange
    const params: ReplyToCommentParams = {
      comment_id: '17234567890',
      message: 'Test reply'
    };

    const mockResponse = {
      id: '17345678901',
      timestamp: '2026-02-17T21:00:00+0000'
    };

    mockClient.replyToComment.mockResolvedValue(mockResponse);

    // Act
    const result = await handleReplyToComment(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(parsed.timestamp).toBe('2026-02-17T21:00:00+0000');
  });

  it('should generate timestamp if not provided by API', async () => {
    // Arrange
    const params: ReplyToCommentParams = {
      comment_id: '17234567890',
      message: 'Test reply'
    };

    const mockResponse = {
      id: '17345678901'
      // No timestamp
    };

    mockClient.replyToComment.mockResolvedValue(mockResponse);

    // Act
    const result = await handleReplyToComment(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(parsed.timestamp).toBeDefined();
    expect(typeof parsed.timestamp).toBe('string');
  });

  it('should handle special characters in message', async () => {
    // Arrange
    const params: ReplyToCommentParams = {
      comment_id: '17234567890',
      message: 'Thanks! 😊 Check out our website: https://example.com'
    };

    const mockResponse = {
      id: '17345678901'
    };

    mockClient.replyToComment.mockResolvedValue(mockResponse);

    // Act
    const result = await handleReplyToComment(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(mockClient.replyToComment).toHaveBeenCalledWith(
      '17234567890',
      'Thanks! 😊 Check out our website: https://example.com'
    );
    expect(parsed.success).toBe(true);
  });
});

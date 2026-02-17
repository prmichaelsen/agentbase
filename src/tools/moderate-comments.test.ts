import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { handleModerateComments } from './moderate-comments.js';
import { InstagramClient } from '../instagram-client.js';
import type { BulkModerateParams } from '../types/comment-moderation.js';

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
    toggleComments: jest.fn(),
    bulkModerateComments: jest.fn(),
    makeRequest: jest.fn(),
  } as any;
};

describe('handleModerateComments', () => {
  let mockClient: jest.Mocked<InstagramClient>;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should bulk delete comments successfully', async () => {
    // Arrange
    const params: BulkModerateParams = {
      comment_ids: ['123', '456', '789'],
      action: 'delete'
    };

    const mockResults = [
      { comment_id: '123', success: true },
      { comment_id: '456', success: true },
      { comment_id: '789', success: true }
    ];

    mockClient.bulkModerateComments.mockResolvedValue(mockResults);

    // Act
    const result = await handleModerateComments(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(mockClient.bulkModerateComments).toHaveBeenCalledWith(
      ['123', '456', '789'],
      'delete',
      undefined,
      10,
      1000
    );
    expect(parsed.total).toBe(3);
    expect(parsed.successful).toBe(3);
    expect(parsed.failed).toBe(0);
  });

  it('should bulk hide comments successfully', async () => {
    // Arrange
    const params: BulkModerateParams = {
      comment_ids: ['123', '456'],
      action: 'hide'
    };

    const mockResults = [
      { comment_id: '123', success: true },
      { comment_id: '456', success: true }
    ];

    mockClient.bulkModerateComments.mockResolvedValue(mockResults);

    // Act
    const result = await handleModerateComments(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(parsed.total).toBe(2);
    expect(parsed.successful).toBe(2);
    expect(parsed.action).toBe('hide');
  });

  it('should bulk reply to comments successfully', async () => {
    // Arrange
    const params: BulkModerateParams = {
      comment_ids: ['123', '456'],
      action: 'reply',
      message: 'Thank you!'
    };

    const mockResults = [
      { comment_id: '123', success: true },
      { comment_id: '456', success: true }
    ];

    mockClient.bulkModerateComments.mockResolvedValue(mockResults);

    // Act
    const result = await handleModerateComments(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(mockClient.bulkModerateComments).toHaveBeenCalledWith(
      ['123', '456'],
      'reply',
      'Thank you!',
      10,
      1000
    );
    expect(parsed.successful).toBe(2);
  });

  it('should handle partial failures', async () => {
    // Arrange
    const params: BulkModerateParams = {
      comment_ids: ['123', '456', '789'],
      action: 'delete'
    };

    const mockResults = [
      { comment_id: '123', success: true },
      { comment_id: '456', success: false, error: 'Comment not found' },
      { comment_id: '789', success: true }
    ];

    mockClient.bulkModerateComments.mockResolvedValue(mockResults);

    // Act
    const result = await handleModerateComments(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(parsed.total).toBe(3);
    expect(parsed.successful).toBe(2);
    expect(parsed.failed).toBe(1);
    expect(parsed.results[1].error).toBe('Comment not found');
  });

  it('should reject empty comment_ids array', async () => {
    // Arrange
    const params: BulkModerateParams = {
      comment_ids: [],
      action: 'delete'
    };

    // Act & Assert
    await expect(
      handleModerateComments(mockClient, params)
    ).rejects.toThrow('At least one comment ID is required');

    expect(mockClient.bulkModerateComments).not.toHaveBeenCalled();
  });

  it('should reject invalid action', async () => {
    // Arrange
    const params: any = {
      comment_ids: ['123'],
      action: 'invalid_action'
    };

    // Act & Assert
    await expect(
      handleModerateComments(mockClient, params)
    ).rejects.toThrow('Action must be one of: reply, delete, hide, unhide');

    expect(mockClient.bulkModerateComments).not.toHaveBeenCalled();
  });

  it('should require message for reply action', async () => {
    // Arrange
    const params: BulkModerateParams = {
      comment_ids: ['123'],
      action: 'reply'
      // Missing message
    };

    // Act & Assert
    await expect(
      handleModerateComments(mockClient, params)
    ).rejects.toThrow('Message is required for reply action');

    expect(mockClient.bulkModerateComments).not.toHaveBeenCalled();
  });

  it('should reject messages longer than 2,200 characters for reply', async () => {
    // Arrange
    const longMessage = 'a'.repeat(2201);
    const params: BulkModerateParams = {
      comment_ids: ['123'],
      action: 'reply',
      message: longMessage
    };

    // Act & Assert
    await expect(
      handleModerateComments(mockClient, params)
    ).rejects.toThrow('Reply message must be 2,200 characters or less');

    expect(mockClient.bulkModerateComments).not.toHaveBeenCalled();
  });

  it('should use custom batch size', async () => {
    // Arrange
    const params: any = {
      comment_ids: ['123', '456'],
      action: 'delete',
      batch_size: 5
    };

    mockClient.bulkModerateComments.mockResolvedValue([
      { comment_id: '123', success: true },
      { comment_id: '456', success: true }
    ]);

    // Act
    await handleModerateComments(mockClient, params);

    // Assert
    expect(mockClient.bulkModerateComments).toHaveBeenCalledWith(
      ['123', '456'],
      'delete',
      undefined,
      5,
      1000
    );
  });

  it('should use custom delay', async () => {
    // Arrange
    const params: any = {
      comment_ids: ['123'],
      action: 'delete',
      delay_ms: 2000
    };

    mockClient.bulkModerateComments.mockResolvedValue([
      { comment_id: '123', success: true }
    ]);

    // Act
    await handleModerateComments(mockClient, params);

    // Assert
    expect(mockClient.bulkModerateComments).toHaveBeenCalledWith(
      ['123'],
      'delete',
      undefined,
      10,
      2000
    );
  });

  it('should reject invalid batch size', async () => {
    // Arrange
    const params: any = {
      comment_ids: ['123'],
      action: 'delete',
      batch_size: 100 // Too large
    };

    // Act & Assert
    await expect(
      handleModerateComments(mockClient, params)
    ).rejects.toThrow('Batch size must be between 1 and 50');
  });

  it('should include batch information in response', async () => {
    // Arrange
    const params: BulkModerateParams = {
      comment_ids: ['123', '456', '789'],
      action: 'delete'
    };

    mockClient.bulkModerateComments.mockResolvedValue([
      { comment_id: '123', success: true },
      { comment_id: '456', success: true },
      { comment_id: '789', success: true }
    ]);

    // Act
    const result = await handleModerateComments(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(parsed.note).toContain('3 comments');
    expect(parsed.note).toContain('batches');
    expect(parsed.batch_size).toBe(10);
  });

  it('should return formatted JSON with all required fields', async () => {
    // Arrange
    const params: BulkModerateParams = {
      comment_ids: ['123'],
      action: 'delete'
    };

    mockClient.bulkModerateComments.mockResolvedValue([
      { comment_id: '123', success: true }
    ]);

    // Act
    const result = await handleModerateComments(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(parsed).toHaveProperty('total');
    expect(parsed).toHaveProperty('successful');
    expect(parsed).toHaveProperty('failed');
    expect(parsed).toHaveProperty('results');
    expect(parsed).toHaveProperty('action');
    expect(parsed).toHaveProperty('batch_size');
    expect(parsed).toHaveProperty('timestamp');
    expect(parsed).toHaveProperty('note');
  });
});

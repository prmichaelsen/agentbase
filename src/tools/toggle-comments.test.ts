import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { handleToggleComments } from './toggle-comments.js';
import { InstagramClient } from '../instagram-client.js';
import type { ToggleCommentsParams } from '../types/comment-moderation.js';

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
    makeRequest: jest.fn(),
  } as any;
};

describe('handleToggleComments', () => {
  let mockClient: jest.Mocked<InstagramClient>;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should disable comments on a post successfully', async () => {
    // Arrange
    const params: ToggleCommentsParams = {
      media_id: '17234567890',
      enabled: false
    };

    mockClient.toggleComments.mockResolvedValue({ success: true });

    // Act
    const result = await handleToggleComments(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(mockClient.toggleComments).toHaveBeenCalledWith('17234567890', false);
    expect(parsed.success).toBe(true);
    expect(parsed.media_id).toBe('17234567890');
    expect(parsed.comments_enabled).toBe(false);
    expect(parsed.action).toBe('disabled');
    expect(parsed.note).toContain('disabled');
  });

  it('should enable comments on a post successfully', async () => {
    // Arrange
    const params: ToggleCommentsParams = {
      media_id: '17234567890',
      enabled: true
    };

    mockClient.toggleComments.mockResolvedValue({ success: true });

    // Act
    const result = await handleToggleComments(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(mockClient.toggleComments).toHaveBeenCalledWith('17234567890', true);
    expect(parsed.success).toBe(true);
    expect(parsed.comments_enabled).toBe(true);
    expect(parsed.action).toBe('enabled');
    expect(parsed.note).toContain('enabled');
  });

  it('should handle API errors gracefully', async () => {
    // Arrange
    const params: ToggleCommentsParams = {
      media_id: '17234567890',
      enabled: false
    };

    mockClient.toggleComments.mockRejectedValue(
      new Error('Media not found')
    );

    // Act & Assert
    await expect(
      handleToggleComments(mockClient, params)
    ).rejects.toThrow('Failed to disable comments: Media not found');
  });

  it('should reject empty media ID', async () => {
    // Arrange
    const params: ToggleCommentsParams = {
      media_id: '   ',
      enabled: false
    };

    // Act & Assert
    await expect(
      handleToggleComments(mockClient, params)
    ).rejects.toThrow('Media ID is required');

    expect(mockClient.toggleComments).not.toHaveBeenCalled();
  });

  it('should reject non-boolean enabled parameter', async () => {
    // Arrange
    const params: any = {
      media_id: '17234567890',
      enabled: 'yes' // Invalid: should be boolean
    };

    // Act & Assert
    await expect(
      handleToggleComments(mockClient, params)
    ).rejects.toThrow('Enabled parameter must be a boolean');

    expect(mockClient.toggleComments).not.toHaveBeenCalled();
  });

  it('should include timestamp in response', async () => {
    // Arrange
    const params: ToggleCommentsParams = {
      media_id: '17234567890',
      enabled: false
    };

    mockClient.toggleComments.mockResolvedValue({ success: true });

    // Act
    const result = await handleToggleComments(mockClient, params);
    const parsed = JSON.parse(result);

    // Assert
    expect(parsed.timestamp).toBeDefined();
    const timestamp = new Date(parsed.timestamp);
    expect(timestamp.getTime()).toBeGreaterThan(Date.now() - 5000);
  });

  it('should handle authentication errors', async () => {
    // Arrange
    const params: ToggleCommentsParams = {
      media_id: '17234567890',
      enabled: true
    };

    mockClient.toggleComments.mockRejectedValue(
      new Error('Invalid OAuth access token')
    );

    // Act & Assert
    await expect(
      handleToggleComments(mockClient, params)
    ).rejects.toThrow('Failed to enable comments: Invalid OAuth access token');
  });

  it('should differentiate error messages for enable vs disable', async () => {
    // Arrange - disable error
    const disableParams: ToggleCommentsParams = {
      media_id: '17234567890',
      enabled: false
    };

    mockClient.toggleComments.mockRejectedValue(new Error('Test error'));

    // Act & Assert - disable
    await expect(
      handleToggleComments(mockClient, disableParams)
    ).rejects.toThrow('Failed to disable comments: Test error');

    // Arrange - enable error
    const enableParams: ToggleCommentsParams = {
      media_id: '17234567890',
      enabled: true
    };

    // Act & Assert - enable
    await expect(
      handleToggleComments(mockClient, enableParams)
    ).rejects.toThrow('Failed to enable comments: Test error');
  });

  it('should return formatted JSON string', async () => {
    // Arrange
    const params: ToggleCommentsParams = {
      media_id: '17234567890',
      enabled: false
    };

    mockClient.toggleComments.mockResolvedValue({ success: true });

    // Act
    const result = await handleToggleComments(mockClient, params);

    // Assert
    expect(typeof result).toBe('string');
    const parsed = JSON.parse(result);
    expect(parsed).toHaveProperty('success');
    expect(parsed).toHaveProperty('media_id');
    expect(parsed).toHaveProperty('comments_enabled');
    expect(parsed).toHaveProperty('action');
    expect(parsed).toHaveProperty('timestamp');
    expect(parsed).toHaveProperty('note');
  });
});

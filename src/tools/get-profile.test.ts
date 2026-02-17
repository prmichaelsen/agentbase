import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { handleGetProfile } from './get-profile.js';
import { InstagramClient } from '../instagram-client.js';

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
    makeRequest: jest.fn(),
  } as any;
};

describe('handleGetProfile', () => {
  let mockClient: jest.Mocked<InstagramClient>;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should retrieve user profile successfully', async () => {
    // Arrange
    const mockProfile = {
      id: '123456789',
      username: 'testuser',
      account_type: 'BUSINESS',
      media_count: 42,
    };

    mockClient.getUserProfile.mockResolvedValue(mockProfile);

    // Act
    const result = await handleGetProfile(mockClient, { user_id: 'me' });

    // Assert
    expect(mockClient.getUserProfile).toHaveBeenCalledWith('me', undefined);
    expect(result).toBe(JSON.stringify(mockProfile, null, 2));
  });

  it('should handle API errors gracefully', async () => {
    // Arrange
    const errorMessage = 'Invalid OAuth access token';
    mockClient.getUserProfile.mockRejectedValue(new Error(errorMessage));

    // Act & Assert
    await expect(
      handleGetProfile(mockClient, { user_id: 'me' })
    ).rejects.toThrow(`Failed to get profile: ${errorMessage}`);
  });

  it('should pass user_id parameter correctly', async () => {
    // Arrange
    const userId = '987654321';
    mockClient.getUserProfile.mockResolvedValue({
      id: userId,
      username: 'anotheruser',
    });

    // Act
    await handleGetProfile(mockClient, { user_id: userId });

    // Assert
    expect(mockClient.getUserProfile).toHaveBeenCalledWith(userId, undefined);
  });

  it('should default to "me" when user_id is not provided', async () => {
    // Arrange
    mockClient.getUserProfile.mockResolvedValue({
      id: '123',
      username: 'currentuser',
    });

    // Act
    await handleGetProfile(mockClient, {});

    // Assert
    expect(mockClient.getUserProfile).toHaveBeenCalledWith('me', undefined);
  });

  it('should pass custom fields parameter', async () => {
    // Arrange
    const customFields = ['id', 'username', 'followers_count', 'follows_count'];
    mockClient.getUserProfile.mockResolvedValue({
      id: '123',
      username: 'testuser',
      followers_count: 1000,
      follows_count: 500,
    });

    // Act
    await handleGetProfile(mockClient, { 
      user_id: 'me',
      fields: customFields 
    });

    // Assert
    expect(mockClient.getUserProfile).toHaveBeenCalledWith('me', customFields);
  });

  it('should return formatted JSON string', async () => {
    // Arrange
    const mockProfile = {
      id: '123456789',
      username: 'testuser',
      account_type: 'BUSINESS',
    };

    mockClient.getUserProfile.mockResolvedValue(mockProfile);

    // Act
    const result = await handleGetProfile(mockClient, { user_id: 'me' });

    // Assert
    expect(typeof result).toBe('string');
    expect(JSON.parse(result)).toEqual(mockProfile);
  });

  it('should handle complete profile with all fields', async () => {
    // Arrange
    const completeProfile = {
      id: '123456789',
      username: 'testuser',
      account_type: 'BUSINESS',
      media_count: 42,
      followers_count: 1000,
      follows_count: 500,
      name: 'Test User',
      biography: 'Test bio',
      website: 'https://example.com',
      profile_picture_url: 'https://example.com/pic.jpg',
    };

    mockClient.getUserProfile.mockResolvedValue(completeProfile);

    // Act
    const result = await handleGetProfile(mockClient, { user_id: 'me' });
    const parsed = JSON.parse(result);

    // Assert
    expect(parsed).toEqual(completeProfile);
    expect(parsed).toHaveProperty('username');
    expect(parsed).toHaveProperty('account_type');
    expect(parsed).toHaveProperty('media_count');
    expect(parsed).toHaveProperty('followers_count');
  });
});

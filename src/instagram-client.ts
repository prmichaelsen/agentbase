import { GraphAPIError } from './types.js';

const API_BASE_URL = 'https://graph.instagram.com/v21.0';

export class InstagramClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async makeRequest<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append('access_token', this.accessToken);
    
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      const error = data.error as GraphAPIError;
      throw new Error(
        `Instagram API Error: ${error.message} (Code: ${error.code})`
      );
    }

    return data as T;
  }

  async getUserProfile(userId: string = 'me', fields?: string[]): Promise<any> {
    const defaultFields = ['id', 'username', 'account_type', 'media_count'];
    const fieldsParam = fields?.join(',') || defaultFields.join(',');
    
    return this.makeRequest(`/${userId}`, { fields: fieldsParam });
  }

  async getUserMedia(
    userId: string = 'me',
    fields?: string[],
    limit: number = 25
  ): Promise<any> {
    const defaultFields = [
      'id',
      'caption',
      'media_type',
      'media_url',
      'permalink',
      'thumbnail_url',
      'timestamp'
    ];
    const fieldsParam = fields?.join(',') || defaultFields.join(',');
    
    return this.makeRequest(`/${userId}/media`, {
      fields: fieldsParam,
      limit: limit.toString()
    });
  }

  async getMediaDetails(mediaId: string, fields?: string[]): Promise<any> {
    const defaultFields = [
      'id',
      'caption',
      'media_type',
      'media_url',
      'permalink',
      'thumbnail_url',
      'timestamp',
      'like_count',
      'comments_count'
    ];
    const fieldsParam = fields?.join(',') || defaultFields.join(',');
    
    return this.makeRequest(`/${mediaId}`, { fields: fieldsParam });
  }

  async getMediaInsights(
    mediaId: string,
    metrics: string[]
  ): Promise<any> {
    return this.makeRequest(`/${mediaId}/insights`, {
      metric: metrics.join(',')
    });
  }

  async getUserInsights(
    userId: string = 'me',
    metrics: string[],
    period: 'day' | 'week' | 'days_28'
  ): Promise<any> {
    return this.makeRequest(`/${userId}/insights`, {
      metric: metrics.join(','),
      period
    });
  }

  async getMediaComments(
    mediaId: string,
    fields?: string[],
    limit: number = 25
  ): Promise<any> {
    const defaultFields = ['id', 'text', 'username', 'timestamp'];
    const fieldsParam = fields?.join(',') || defaultFields.join(',');
    
    return this.makeRequest(`/${mediaId}/comments`, {
      fields: fieldsParam,
      limit: limit.toString()
    });
  }

  async publishMedia(
    userId: string = 'me',
    imageUrl: string,
    caption?: string
  ): Promise<any> {
    const params: Record<string, string> = {
      image_url: imageUrl
    };
    
    if (caption) {
      params.caption = caption;
    }

    return this.makeRequest(`/${userId}/media`, params);
  }

  async publishMediaContainer(
    userId: string = 'me',
    creationId: string
  ): Promise<any> {
    return this.makeRequest(`/${userId}/media_publish`, {
      creation_id: creationId
    });
  }
}
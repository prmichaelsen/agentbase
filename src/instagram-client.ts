import { GraphAPIError } from './types.js';

const API_BASE_URL = 'https://graph.instagram.com/v21.0';

export class InstagramClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async makeRequest<T>(
    endpoint: string,
    params: Record<string, string> = {},
    method: 'GET' | 'POST' | 'DELETE' = 'GET'
  ): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    let fetchOptions: RequestInit = {
      method
    };

    if (method === 'GET') {
      url.searchParams.append('access_token', this.accessToken);
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value);
      }
    } else if (method === 'POST' || method === 'DELETE') {
      const formData = new URLSearchParams();
      formData.append('access_token', this.accessToken);
      for (const [key, value] of Object.entries(params)) {
        formData.append(key, value);
      }
      fetchOptions.body = formData;
      fetchOptions.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
    }

    const response = await fetch(url.toString(), fetchOptions);
    const data = await response.json() as any;

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
    limit: number = 25,
    after?: string
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
    
    const params: Record<string, string> = {
      fields: fieldsParam,
      limit: limit.toString()
    };
    
    if (after) {
      params.after = after;
    }
    
    return this.makeRequest(`/${userId}/media`, params);
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

    return this.makeRequest(`/${userId}/media`, params, 'POST');
  }

  async publishMediaContainer(
    userId: string = 'me',
    creationId: string
  ): Promise<any> {
    return this.makeRequest(`/${userId}/media_publish`, {
      creation_id: creationId
    }, 'POST');
  }

  async getConversations(
    userId: string = 'me',
    platform?: string,
    userIdFilter?: string,
    fields?: string[]
  ): Promise<any> {
    const defaultFields = ['id', 'updated_time', 'participants'];
    const fieldsParam = fields?.join(',') || defaultFields.join(',');
    
    const params: Record<string, string> = {
      platform: platform || 'instagram',
      fields: fieldsParam
    };
    
    if (userIdFilter) {
      params.user_id = userIdFilter;
    }

    return this.makeRequest(`/${userId}/conversations`, params);
  }

  async getConversationMessages(
    conversationId: string,
    fields?: string[],
    limit: number = 25
  ): Promise<any> {
    // Instagram API requires messages as a nested field query
    const defaultMessageFields = ['id', 'created_time', 'from', 'to', 'message'];
    const messageFieldsParam = fields?.join(',') || defaultMessageFields.join(',');
    
    // Query the conversation with messages as a nested field
    return this.makeRequest(`/${conversationId}`, {
      fields: `messages.limit(${limit}){${messageFieldsParam}}`
    });
  }

  async sendMessage(
    userId: string = 'me',
    recipientId: string,
    message: string
  ): Promise<any> {
    const params: Record<string, string> = {
      recipient: JSON.stringify({ id: recipientId }),
      message: JSON.stringify({ text: message })
    };

    return this.makeRequest(`/${userId}/messages`, params, 'POST');
  }

  async replyToComment(
    commentId: string,
    message: string
  ): Promise<any> {
    const params: Record<string, string> = {
      message
    };

    return this.makeRequest(`/${commentId}/replies`, params, 'POST');
  }

  async deleteComment(
    commentId: string
  ): Promise<any> {
    return this.makeRequest(`/${commentId}`, {}, 'DELETE');
  }

  async hideComment(
    commentId: string,
    hide: boolean
  ): Promise<any> {
    const params: Record<string, string> = {
      hide: hide.toString()
    };

    return this.makeRequest(`/${commentId}`, params, 'POST');
  }
}

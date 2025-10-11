export interface InstagramConfig {
  accessToken: string;
  apiVersion?: string;
}

export interface InstagramMediaField {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  permalink?: string;
  thumbnail_url?: string;
  timestamp?: string;
  username?: string;
}

export interface InstagramProfile {
  id: string;
  username: string;
  account_type?: string;
  media_count?: number;
  followers_count?: number;
  follows_count?: number;
}

export interface InstagramInsight {
  name: string;
  period: string;
  values: Array<{
    value: number;
    end_time: string;
  }>;
  title?: string;
  description?: string;
}

export interface InstagramComment {
  id: string;
  text: string;
  username?: string;
  timestamp?: string;
  from?: {
    id: string;
    username: string;
  };
}

export interface GraphAPIError {
  message: string;
  type: string;
  code: number;
  error_subcode?: number;
  fbtrace_id?: string;
}
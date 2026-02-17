// Type definitions for comment moderation features

export interface ReplyToCommentParams {
  comment_id: string;
  message: string;
}

export interface ReplyToCommentResponse {
  id: string;
  text?: string;
  timestamp?: string;
}

export interface DeleteCommentParams {
  comment_id: string;
}

export interface DeleteCommentResponse {
  success: boolean;
  comment_id: string;
}

export interface HideCommentParams {
  comment_id: string;
  hide: boolean;
}

export interface HideCommentResponse {
  success: boolean;
  comment_id: string;
  hidden: boolean;
}

export interface ToggleCommentsParams {
  media_id: string;
  enabled: boolean;
}

export interface ToggleCommentsResponse {
  success: boolean;
  media_id: string;
  comments_enabled: boolean;
}

export interface BulkModerateParams {
  comment_ids: string[];
  action: 'reply' | 'delete' | 'hide' | 'unhide';
  message?: string; // Required for 'reply' action
}

export interface BulkModerateResult {
  comment_id: string;
  success: boolean;
  error?: string;
}

export interface BulkModerateResponse {
  total: number;
  successful: number;
  failed: number;
  results: BulkModerateResult[];
}

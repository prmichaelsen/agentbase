/**
 * Authentication Provider Interface
 * 
 * This allows agentbase to be auth-agnostic. The consuming application
 * provides an implementation that handles authentication and token resolution.
 */

/**
 * Context provided to the auth provider for each request
 */
export interface AuthContext {
  /** Raw request headers (for HTTP/SSE transport) */
  headers?: Record<string, string | string[] | undefined>;
  
  /** Request metadata */
  metadata?: Record<string, unknown>;
  
  /** Transport type being used */
  transport: 'stdio' | 'sse' | 'http';
}

/**
 * Result of authentication
 */
export interface AuthResult {
  /** Whether authentication was successful */
  authenticated: boolean;
  
  /** Unique user/tenant identifier */
  userId?: string;
  
  /** Instagram access token for this user */
  instagramAccessToken?: string;
  
  /** Optional error message if authentication failed */
  error?: string;
  
  /** Additional metadata about the user/tenant */
  metadata?: Record<string, unknown>;
}

/**
 * Authentication Provider Interface
 * 
 * Implement this interface to provide custom authentication logic.
 * The provider is responsible for:
 * 1. Validating the request (JWT, API key, OAuth token, etc.)
 * 2. Resolving the user/tenant ID
 * 3. Retrieving the Instagram access token for that user
 */
export interface AuthProvider {
  /**
   * Authenticate a request and resolve the Instagram access token
   * 
   * @param context - Request context including headers and metadata
   * @returns Authentication result with user ID and Instagram token
   */
  authenticate(context: AuthContext): Promise<AuthResult>;
  
  /**
   * Optional: Initialize the provider (e.g., connect to database)
   */
  initialize?(): Promise<void>;
  
  /**
   * Optional: Cleanup resources (e.g., close database connections)
   */
  cleanup?(): Promise<void>;
  
  /**
   * Optional: Refresh an expired Instagram token
   * 
   * @param userId - User identifier
   * @returns New Instagram access token
   */
  refreshToken?(userId: string): Promise<string | null>;
}

/**
 * Configuration for the MCP server
 */
export interface ServerConfig {
  /** Server name */
  name?: string;
  
  /** Server version */
  version?: string;
  
  /** Authentication provider */
  authProvider: AuthProvider;
  
  /** Transport configuration */
  transport: {
    type: 'stdio' | 'sse' | 'http';
    
    /** Port for HTTP/SSE transport */
    port?: number;
    
    /** Host for HTTP/SSE transport */
    host?: string;
    
    /** Base path for SSE endpoint */
    basePath?: string;
  };
  
  /** Optional rate limiting configuration */
  rateLimit?: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
  };
  
  /** Optional logging configuration */
  logging?: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
  };
}

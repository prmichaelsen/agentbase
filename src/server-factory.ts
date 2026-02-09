import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { InstagramClient } from './instagram-client.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

// Import all tool definitions and handlers
import { getProfileTool, handleGetProfile } from './tools/get-profile.js';
import { getMediaTool, handleGetMedia } from './tools/get-media.js';
import { getMediaDetailsTool, handleGetMediaDetails } from './tools/get-media-details.js';
import { getCommentsTool, handleGetComments } from './tools/get-comments.js';
import {
  getMediaInsightsTool,
  getUserInsightsTool,
  handleGetMediaInsights,
  handleGetUserInsights
} from './tools/get-insights.js';
import { createMediaContainerTool, handleCreateMediaContainer } from './tools/create-media-container.js';
import { publishMediaContainerTool, handlePublishMediaContainer } from './tools/publish-media-container.js';
import {
  getConversationsTool,
  getConversationMessagesTool,
  handleGetConversations,
  handleGetConversationMessages
} from './tools/get-conversations.js';
import { sendMessageTool, handleSendMessage } from './tools/send-message.js';
import { callEndpointTool, handleCallEndpoint } from './tools/call-endpoint.js';

export interface ServerOptions {
  name?: string;
  version?: string;
}

/**
 * Create an Instagram MCP server instance
 * 
 * This factory function creates a configured MCP server with all Instagram tools.
 * Each server instance uses a specific Instagram access token, enabling multi-tenant usage.
 * 
 * @param accessToken - Instagram Graph API access token
 * @param userId - User identifier (for logging/tracking)
 * @param options - Optional server configuration
 * @returns Configured MCP Server instance
 * 
 * @example
 * ```typescript
 * import { createInstagramServer } from '@prmichaelsen/agentbase/factory';
 * 
 * const server = createInstagramServer(
 *   'user-instagram-token',
 *   'user-123'
 * );
 * 
 * await server.connect(transport);
 * ```
 */
export function createInstagramServer(
  accessToken: string,
  userId: string,
  options: ServerOptions = {}
): Server {
  if (!accessToken) {
    throw new Error('accessToken is required');
  }
  
  if (!userId) {
    throw new Error('userId is required');
  }
  
  // Initialize Instagram client with user's token
  const instagramClient = new InstagramClient(accessToken);
  
  // Create MCP server
  const server = new Server(
    {
      name: options.name || 'agentbase',
      version: options.version || '1.0.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );
  
  // Register list_tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        getProfileTool,
        getMediaTool,
        getMediaDetailsTool,
        getCommentsTool,
        getMediaInsightsTool,
        getUserInsightsTool,
        createMediaContainerTool,
        publishMediaContainerTool,
        getConversationsTool,
        getConversationMessagesTool,
        sendMessageTool,
        callEndpointTool,
      ]
    };
  });
  
  // Register call_tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      let result: string;
      
      switch (name) {
        case 'instagram_get_profile':
          result = await handleGetProfile(instagramClient, args);
          break;
        
        case 'instagram_get_media':
          result = await handleGetMedia(instagramClient, args);
          break;
        
        case 'instagram_get_media_details':
          result = await handleGetMediaDetails(instagramClient, args);
          break;
        
        case 'instagram_get_comments':
          result = await handleGetComments(instagramClient, args);
          break;
        
        case 'instagram_get_media_insights':
          result = await handleGetMediaInsights(instagramClient, args);
          break;
        
        case 'instagram_get_user_insights':
          result = await handleGetUserInsights(instagramClient, args);
          break;
        
        case 'instagram_create_media_container':
          result = await handleCreateMediaContainer(instagramClient, args);
          break;
        
        case 'instagram_publish_media_container':
          result = await handlePublishMediaContainer(instagramClient, args);
          break;
        
        case 'instagram_get_conversations':
          result = await handleGetConversations(instagramClient, args);
          break;
        
        case 'instagram_get_conversation_messages':
          result = await handleGetConversationMessages(instagramClient, args);
          break;
        
        case 'instagram_send_message':
          result = await handleSendMessage(instagramClient, args);
          break;
        
        case 'instagram_call_endpoint':
          result = await handleCallEndpoint(instagramClient, args);
          break;
        
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
      }
      
      return {
        content: [
          {
            type: 'text',
            text: result
          }
        ]
      };
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      
      throw new McpError(
        ErrorCode.InternalError,
        `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });
  
  return server;
}

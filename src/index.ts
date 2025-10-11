#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

import { InstagramClient } from './instagram-client.js';

// Import tool definitions and handlers
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

// Environment variable for access token
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('Error: INSTAGRAM_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

// Initialize Instagram client
const instagramClient = new InstagramClient(ACCESS_TOKEN);

// Create MCP server
const server = new Server(
  {
    name: 'agentbase',
    version: '1.0.0'
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
      getConversationMessagesTool
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

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Instagram MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
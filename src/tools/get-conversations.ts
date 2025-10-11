import { InstagramClient } from '../instagram-client.js';

export const getConversationsTool = {
  name: 'instagram_get_conversations',
  description: 'Get a list of conversations (DMs) for an Instagram professional account. Returns conversation metadata including IDs and participants.',
  inputSchema: {
    type: 'object',
    properties: {
      user_id: {
        type: 'string',
        description: 'Instagram user ID. Use "me" for the authenticated user (default: "me")',
        default: 'me'
      },
      platform: {
        type: 'string',
        description: 'Platform to filter conversations (default: "instagram")',
        default: 'instagram'
      },
      user_id_filter: {
        type: 'string',
        description: 'Filter conversations by a specific Instagram user ID (optional)'
      },
      fields: {
        type: 'array',
        items: {
          type: 'string'
        },
        description: 'Fields to retrieve. Available: id, updated_time, participants. If not provided, returns all default fields including participants.'
      }
    }
  }
};

export const getConversationMessagesTool = {
  name: 'instagram_get_conversation_messages',
  description: 'Get messages from a specific conversation. Returns message details including sender, recipient, content, and timestamps.',
  inputSchema: {
    type: 'object',
    properties: {
      conversation_id: {
        type: 'string',
        description: 'Conversation ID from instagram_get_conversations (required)'
      },
      limit: {
        type: 'number',
        description: 'Number of messages to retrieve (1-100, default: 25)',
        default: 25,
        minimum: 1,
        maximum: 100
      },
      fields: {
        type: 'array',
        items: {
          type: 'string'
        },
        description: 'Fields to retrieve. Available: id, created_time, from, to, message. If not provided, returns all fields.'
      }
    },
    required: ['conversation_id']
  }
};

export async function handleGetConversations(
  client: InstagramClient,
  args: any
): Promise<string> {
  const userId = args.user_id || 'me';
  const platform = args.platform || 'instagram';
  const userIdFilter = args.user_id_filter;
  const fields = args.fields;

  try {
    const conversations = await client.getConversations(userId, platform, userIdFilter, fields);
    return JSON.stringify(conversations, null, 2);
  } catch (error) {
    throw new Error(`Failed to get conversations: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function handleGetConversationMessages(
  client: InstagramClient,
  args: any
): Promise<string> {
  const conversationId = args.conversation_id;
  const fields = args.fields;
  const limit = args.limit || 25;

  if (!conversationId) {
    throw new Error('conversation_id is required');
  }

  try {
    const messages = await client.getConversationMessages(conversationId, fields, limit);
    return JSON.stringify(messages, null, 2);
  } catch (error) {
    throw new Error(`Failed to get conversation messages: ${error instanceof Error ? error.message : String(error)}`);
  }
}
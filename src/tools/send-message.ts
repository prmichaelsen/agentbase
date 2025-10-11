import { InstagramClient } from '../instagram-client.js';

export const sendMessageTool = {
  name: 'instagram_send_message',
  description: 'Send a message to an Instagram user in an existing conversation. Can only reply to conversations initiated by users (cannot initiate new conversations). You have 24 hours to respond after receiving a message.',
  inputSchema: {
    type: 'object',
    properties: {
      recipient_id: {
        type: 'string',
        description: 'Instagram-scoped user ID of the message recipient (required). Get this from conversation messages.'
      },
      message: {
        type: 'string',
        description: 'Text message to send (required). Maximum length varies by message type.'
      },
      user_id: {
        type: 'string',
        description: 'Instagram user ID sending the message. Use "me" for the authenticated user (default: "me")',
        default: 'me'
      }
    },
    required: ['recipient_id', 'message']
  }
};

export async function handleSendMessage(
  client: InstagramClient,
  args: any
): Promise<string> {
  const recipientId = args.recipient_id;
  const message = args.message;
  const userId = args.user_id || 'me';

  if (!recipientId) {
    throw new Error('recipient_id is required');
  }

  if (!message) {
    throw new Error('message is required');
  }

  try {
    const response = await client.sendMessage(userId, recipientId, message);
    return JSON.stringify({
      success: true,
      message_id: response.message_id || response.id,
      recipient_id: recipientId,
      message: 'Message sent successfully'
    }, null, 2);
  } catch (error) {
    throw new Error(`Failed to send message: ${error instanceof Error ? error.message : String(error)}`);
  }
}
import { InstagramClient } from '../instagram-client.js';

export const callEndpointTool = {
  name: 'instagram_call_endpoint',
  description: 'Call an arbitrary Instagram Graph API endpoint with custom parameters. Useful for experimentation and accessing endpoints without dedicated tools.',
  inputSchema: {
    type: 'object',
    properties: {
      endpoint: {
        type: 'string',
        description: 'API endpoint path (e.g., "/me", "/me/media", "/{conversation-id}"). Relative to the API base URL.'
      },
      method: {
        type: 'string',
        enum: ['GET', 'POST'],
        default: 'GET',
        description: 'HTTP method to use (default: GET)'
      },
      params: {
        type: 'object',
        description: 'Query parameters or POST data as key-value pairs (optional)',
        additionalProperties: {
          type: 'string'
        }
      }
    },
    required: ['endpoint']
  }
};

export async function handleCallEndpoint(
  client: InstagramClient,
  args: any
): Promise<string> {
  const endpoint = args.endpoint;
  const method = args.method || 'GET';
  const params = args.params || {};

  if (!endpoint) {
    throw new Error('endpoint is required');
  }

  try {
    const result = await client.makeRequest(endpoint, params, method);
    return JSON.stringify(result, null, 2);
  } catch (error) {
    throw new Error(`Failed to call endpoint: ${error instanceof Error ? error.message : String(error)}`);
  }
}
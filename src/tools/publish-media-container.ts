import { InstagramClient } from '../instagram-client.js';

export const publishMediaContainerTool = {
  name: 'instagram_publish_media_container',
  description: 'Publish a media container to Instagram. This is step 2 of the publishing process. Use the container_id returned from instagram_create_media_container.',
  inputSchema: {
    type: 'object',
    properties: {
      container_id: {
        type: 'string',
        description: 'Media container ID from instagram_create_media_container (required)'
      },
      user_id: {
        type: 'string',
        description: 'Instagram user ID. Use "me" for the authenticated user (default: "me")',
        default: 'me'
      }
    },
    required: ['container_id']
  }
};

export async function handlePublishMediaContainer(
  client: InstagramClient,
  args: any
): Promise<string> {
  const containerId = args.container_id;
  const userId = args.user_id || 'me';

  if (!containerId) {
    throw new Error('container_id is required');
  }

  try {
    const publishResponse = await client.publishMediaContainer(userId, containerId);

    return JSON.stringify({
      success: true,
      media_id: publishResponse.id,
      container_id: containerId,
      message: 'Media published successfully to Instagram'
    }, null, 2);
  } catch (error) {
    throw new Error(`Failed to publish media container: ${error instanceof Error ? error.message : String(error)}`);
  }
}
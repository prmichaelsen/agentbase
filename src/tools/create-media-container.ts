import { InstagramClient } from '../instagram-client.js';

export const createMediaContainerTool = {
  name: 'instagram_create_media_container',
  description: 'Create a media container for an Instagram post. This is step 1 of the publishing process. Returns a container ID that can be used with instagram_publish_media_container to publish the post.',
  inputSchema: {
    type: 'object',
    properties: {
      image_url: {
        type: 'string',
        description: 'Publicly accessible URL of the image (required). Must be JPEG format on an external server (not Instagram CDN).'
      },
      caption: {
        type: 'string',
        description: 'Caption text for the post (optional). Maximum 2,200 characters.'
      },
      user_id: {
        type: 'string',
        description: 'Instagram user ID. Use "me" for the authenticated user (default: "me")',
        default: 'me'
      }
    },
    required: ['image_url']
  }
};

export async function handleCreateMediaContainer(
  client: InstagramClient,
  args: any
): Promise<string> {
  const imageUrl = args.image_url;
  const caption = args.caption;
  const userId = args.user_id || 'me';

  if (!imageUrl) {
    throw new Error('image_url is required');
  }

  try {
    const containerResponse = await client.publishMedia(userId, imageUrl, caption);
    
    if (!containerResponse.id) {
      throw new Error('Failed to create media container: No container ID returned');
    }

    return JSON.stringify({
      success: true,
      container_id: containerResponse.id,
      message: 'Media container created successfully. Use instagram_publish_media_container to publish it.'
    }, null, 2);
  } catch (error) {
    throw new Error(`Failed to create media container: ${error instanceof Error ? error.message : String(error)}`);
  }
}
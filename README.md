# Agentbase - Instagram MCP Server

An MCP (Model Context Protocol) server that provides tools to interact with the Instagram Graph API v21.0. Built with TypeScript and uses esbuild for bundling.

## Features

This MCP server provides the following Instagram API tools:

- **Get Profile** - Retrieve user profile information
- **Get Media** - List media posts from a user
- **Get Media Details** - Get detailed information about specific posts
- **Get Comments** - Retrieve comments on media posts
- **Get Media Insights** - Access analytics for individual posts
- **Get User Insights** - Access account-level analytics

## Prerequisites

- Node.js 18 or higher
- An Instagram Business or Creator account
- An Instagram Access Token with appropriate permissions

## Getting an Access Token

To use this MCP server, you'll need an Instagram Access Token:

1. Create a Facebook App at [Meta for Developers](https://developers.facebook.com/)
2. Add Instagram Basic Display or Instagram Graph API product
3. Configure your app and get your access token
4. For insights, you need a Business or Creator account

For detailed instructions, visit: https://developers.facebook.com/docs/instagram-api/getting-started

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Running the Server

The server requires an Instagram access token via environment variable:

```bash
INSTAGRAM_ACCESS_TOKEN="your_token_here" node build/index.js
```

### Using with MCP Clients

Add this server to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "agentbase": {
      "command": "node",
      "args": ["/path/to/agentbase/build/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Available Tools

### 1. instagram_get_profile

Get Instagram user profile information.

**Parameters:**
- `user_id` (optional): Instagram user ID or "me" for authenticated user (default: "me")
- `fields` (optional): Array of fields to retrieve

**Example fields:** `id`, `username`, `account_type`, `media_count`, `followers_count`, `follows_count`

### 2. instagram_get_media

Get a list of media posts from an Instagram user.

**Parameters:**
- `user_id` (optional): Instagram user ID or "me" (default: "me")
- `limit` (optional): Number of posts to retrieve (1-100, default: 25)
- `fields` (optional): Array of fields to retrieve

**Example fields:** `id`, `caption`, `media_type`, `media_url`, `permalink`, `thumbnail_url`, `timestamp`

### 3. instagram_get_media_details

Get detailed information about a specific media post.

**Parameters:**
- `media_id` (required): Instagram media ID
- `fields` (optional): Array of fields to retrieve

**Example fields:** `id`, `caption`, `media_type`, `media_url`, `like_count`, `comments_count`

### 4. instagram_get_comments

Get comments on a specific media post.

**Parameters:**
- `media_id` (required): Instagram media ID
- `limit` (optional): Number of comments to retrieve (1-100, default: 25)
- `fields` (optional): Array of fields to retrieve

**Example fields:** `id`, `text`, `username`, `timestamp`

### 5. instagram_get_media_insights

Get analytics for a specific media post (requires Business/Creator account).

**Parameters:**
- `media_id` (required): Instagram media ID
- `metrics` (required): Array of metrics to retrieve

**Available metrics:** `engagement`, `impressions`, `reach`, `saved`, `video_views`, `likes`, `comments`, `shares`

### 6. instagram_get_user_insights

Get account-level analytics (requires Business/Creator account).

**Parameters:**
- `user_id` (optional): Instagram user ID or "me" (default: "me")
- `metrics` (required): Array of metrics to retrieve
- `period` (required): Time period - "day", "week", or "days_28"

**Available metrics:** `impressions`, `reach`, `follower_count`, `email_contacts`, `phone_call_clicks`, `website_clicks`, `profile_views`

## Project Structure

```
agentbase/
├── src/
│   ├── index.ts                 # Main MCP server
│   ├── types.ts                 # TypeScript type definitions
│   ├── instagram-client.ts      # Instagram API client
│   └── tools/
│       ├── get-profile.ts       # Profile tool
│       ├── get-media.ts         # Media listing tool
│       ├── get-media-details.ts # Media details tool
│       ├── get-comments.ts      # Comments tool
│       └── get-insights.ts      # Insights tools
├── build/                       # Compiled output
├── esbuild.build.js            # Build script
├── esbuild.watch.js            # Watch mode script
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

## API Rate Limits

Be aware of Instagram Graph API rate limits:
- 200 calls per hour per user
- Additional limits may apply based on your app's usage tier

## Error Handling

The server includes comprehensive error handling for:
- Missing or invalid access tokens
- API errors (invalid parameters, rate limits, etc.)
- Network failures
- Invalid tool calls

Errors are returned with descriptive messages to help debug issues.

## Security Notes

- Never commit your access token to version control
- Use environment variables for sensitive data
- Regularly rotate your access tokens
- Follow Instagram's Platform Policy and Terms of Service

## API Documentation

For more information about the Instagram Graph API:
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [API Reference](https://developers.facebook.com/docs/instagram-api/reference)

## License

MIT

## Support

For issues and questions:
- Instagram Graph API: [Meta for Developers](https://developers.facebook.com/support/)
- MCP Protocol: [Model Context Protocol](https://github.com/modelcontextprotocol)
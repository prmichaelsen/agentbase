#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createInstagramServer } from './server-factory.js';

// Environment variable for access token
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('Error: INSTAGRAM_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

// Create server using factory (backward compatible)
const server = createInstagramServer(ACCESS_TOKEN, 'default-user');

// Start the server on stdio
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Instagram MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

# Agentbase - Instagram MCP Server

An MCP (Model Context Protocol) server that provides tools to interact with the Instagram Graph API v21.0. Built with TypeScript and uses esbuild for bundling.

## Value Proposition

**Agentbase** is a production-ready, multi-tenant MCP server that enables AI agents to interact with Instagram's Graph API through a clean, type-safe interface. It bridges the gap between AI assistants and Instagram's business capabilities, allowing agents to manage content, analyze performance, and engage with audiences programmatically.

### Key Capabilities

#### 📊 **Profile & Analytics**
- Retrieve user profile information (username, account type, follower counts)
- Access detailed media and user insights (impressions, reach, engagement, saves)
- Track performance metrics across multiple time periods (day, week, 28 days)
- Monitor profile views, website clicks, and contact actions

#### 📸 **Content Management**
- Fetch media posts with full metadata (captions, URLs, timestamps)
- Get detailed media information (type, dimensions, engagement)
- Create and publish media containers for scheduled posting
- Manage comments and replies on posts

#### 💬 **Messaging & Engagement**
- Access Instagram Direct conversations
- Send and receive messages programmatically
- Retrieve conversation history and message threads
- Engage with followers through automated responses

#### 🔧 **Flexible Architecture**
- **Pluggable Authentication**: Support for JWT, OAuth 2.0, API Keys, or custom auth providers
- **Multi-Tenant Ready**: Isolate user data and credentials per tenant
- **Transport Agnostic**: Works with stdio (local), HTTP, or SSE (remote)
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Modular Design**: Import only what you need (client, tools, factory, types)

#### 🚀 **Direct API Access**
- Generic `call_endpoint` tool for accessing any Instagram Graph API endpoint
- Future-proof design that adapts to API changes
- Full control over request parameters and response handling

### Use Cases

#### 🤖 **AI-Powered Social Media Management**
Enable AI agents to manage Instagram accounts autonomously:
- Schedule and publish content based on optimal engagement times
- Respond to comments and DMs with context-aware replies
- Generate performance reports and insights summaries
- Automate routine engagement tasks

#### 📈 **Analytics & Reporting**
Build intelligent analytics dashboards:
- Track KPIs across multiple accounts (multi-tenant)
- Generate automated performance reports
- Identify trending content and engagement patterns
- Compare metrics across time periods

#### 🏢 **Agency & Enterprise Solutions**
Manage multiple client accounts from a single platform:
- Multi-tenant architecture with isolated credentials
- Centralized authentication and access control
- Per-tenant rate limiting and usage tracking
- Scalable deployment on cloud infrastructure

#### 🔌 **Integration Platform**
Connect Instagram to other services:
- Sync content across multiple social platforms
- Trigger workflows based on Instagram events
- Aggregate data from multiple sources
- Build custom automation pipelines

#### 🛠️ **Developer Tools**
Rapid prototyping and development:
- Simple stdio mode for local development
- Comprehensive TypeScript types for IDE support
- Modular exports for custom integrations
- Example implementations for common auth patterns

### Why Choose Agentbase?

✅ **Production-Ready**: Built with enterprise-grade architecture patterns
✅ **Auth-Agnostic**: Bring your own authentication scheme
✅ **Scalable**: Designed for horizontal scaling and high availability
✅ **Type-Safe**: Full TypeScript support with no runtime surprises
✅ **Extensible**: Plugin architecture for custom tools and providers
✅ **Well-Documented**: Comprehensive design docs and implementation examples
✅ **Standards-Based**: Follows MCP protocol specifications
✅ **Actively Maintained**: Regular updates for Instagram API changes

### Quick Start Scenarios

**Single-User (Local Development)**
```bash
export INSTAGRAM_ACCESS_TOKEN=your_token
npx @prmichaelsen/agentbase
```

**Multi-Tenant (Production)**
```typescript
import { createMCPServer } from '@prmichaelsen/agentbase/factory';
import { JWTAuthProvider } from './auth/jwt-provider';

const server = createMCPServer({
  authProvider: new JWTAuthProvider({ /* config */ }),
  transport: { type: 'sse', port: 3000 }
});

await server.start();
```

**Custom Integration**
```typescript
import { InstagramClient } from '@prmichaelsen/agentbase/client';
import { getProfileTool, handleGetProfile } from '@prmichaelsen/agentbase/tools';

const client = new InstagramClient({ accessToken: 'token' });
const profile = await handleGetProfile(client, { user_id: 'me' });
```

---

NO OP--DO NOT EVER CHANGE THIS FILE.

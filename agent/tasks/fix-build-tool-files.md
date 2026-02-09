# Fix Build Configuration - Individual Tool Files Not Built

**Priority**: HIGH  
**Status**: Ready to Fix  
**Estimated Time**: 15 minutes

## Problem

The esbuild configuration is not building individual tool files, causing import errors when the package is used as a library.

### Error
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../build/tools/get-profile.js'
```

### Root Cause
`server-factory.ts` imports individual tool files:
```typescript
import { getProfileTool, handleGetProfile } from './tools/get-profile.js';
```

But esbuild only builds `tools/index.ts`, not the individual tool files.

### Current Build Output
```
build/
├── index.js (bundled CLI)
├── server-factory.js
├── instagram-client.js
├── types.js
└── tools/
    └── index.js  ← Only this, missing individual files!
```

### Expected Build Output
```
build/
├── index.js (bundled CLI)
├── server-factory.js
├── instagram-client.js
├── types.js
└── tools/
    ├── index.js
    ├── get-profile.js
    ├── get-media.js
    ├── get-media-details.js
    ├── get-comments.js
    ├── get-insights.js
    ├── create-media-container.js
    ├── publish-media-container.js
    ├── get-conversations.js
    ├── send-message.js
    └── call-endpoint.js
```

## Solution

Update `esbuild.build.js` to build all individual tool files.

### Step 1: Install glob dependency

```bash
cd /home/prmichaelsen/agentbase
npm install --save-dev glob
```

### Step 2: Update esbuild.build.js

The file has already been updated with this content:

```javascript
import * as esbuild from 'esbuild';
import { glob } from 'glob';

// Get all tool files
const toolFiles = glob.sync('src/tools/*.ts');

// Build with bundling for the main entry point (CLI)
await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'build/index.js',
  platform: 'node',
  target: 'node18',
  format: 'esm',
  sourcemap: true,
  external: [
    '@modelcontextprotocol/sdk'
  ]
});

// Build without bundling for library exports
await esbuild.build({
  entryPoints: [
    'src/server-factory.ts',
    'src/instagram-client.ts',
    'src/types.ts',
    ...toolFiles  // Include all individual tool files
  ],
  outdir: 'build',
  outbase: 'src',  // Preserve directory structure
  platform: 'node',
  target: 'node18',
  format: 'esm',
  sourcemap: true
});

console.log('Build complete!');
```

**Key changes**:
- Import `glob` to find all tool files
- Add `...toolFiles` to entry points
- Add `outbase: 'src'` to preserve directory structure

### Step 3: Rebuild

```bash
npm run build
```

### Step 4: Verify

```bash
ls -la build/tools/
# Should show all individual tool files
```

### Step 5: Test import

```bash
node -e "import('@prmichaelsen/agentbase/factory').then(m => console.log('Success!'))"
```

## Testing

After fixing, test that the package works:

```javascript
import { createInstagramServer } from '@prmichaelsen/agentbase/factory';

const server = createInstagramServer('test-token', 'test-user');
console.log('Server created successfully');
```

## Acceptance Criteria

- ✅ `npm run build` completes without errors
- ✅ All individual tool files exist in `build/tools/`
- ✅ `server-factory.js` can import tool files
- ✅ Package can be imported without errors
- ✅ No breaking changes to existing functionality

## Impact

**Blocks**: agentbase-mcp-server implementation (can't use the factory)

**Once Fixed**: agentbase-mcp-server can proceed with implementation

## Notes

This is a build configuration issue only - no code changes needed to source files. The esbuild.build.js file has already been updated, just needs to be run.

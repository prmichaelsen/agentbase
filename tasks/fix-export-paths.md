# Fix agentbase Package - Export Path Issues

**Priority**: HIGH  
**Status**: Blocking  
**Estimated Time**: 15 minutes

## Problem

TypeScript cannot resolve the `/factory` export path even though the package.json declares it correctly.

### Error
```
Cannot find module '@prmichaelsen/agentbase/factory' or its corresponding type declarations.
There are types at '.../build/server-factory.d.ts', but this result could not be resolved 
under your current 'moduleResolution' setting.
```

### Root Cause

The package.json exports configuration may not be compatible with all TypeScript moduleResolution settings.

## Current package.json exports

```json
"exports": {
  ".": {
    "types": "./build/index.d.ts",
    "import": "./build/index.js"
  },
  "./factory": {
    "types": "./build/server-factory.d.ts",
    "import": "./build/server-factory.js"
  }
}
```

## Solution Options

### Option 1: Add .js Extension to Export Paths
```json
"exports": {
  "./factory": {
    "types": "./build/server-factory.d.ts",
    "import": "./build/server-factory.js",
    "default": "./build/server-factory.js"
  }
}
```

### Option 2: Use Simpler Export Format
```json
"exports": {
  ".": "./build/index.js",
  "./factory": "./build/server-factory.js",
  "./client": "./build/instagram-client.js",
  "./tools": "./build/tools/index.js"
},
"typesVersions": {
  "*": {
    "factory": ["build/server-factory.d.ts"],
    "client": ["build/instagram-client.d.ts"],
    "tools": ["build/tools/index.d.ts"]
  }
}
```

### Option 3: Direct Import (Workaround)
In consumer code, use direct path:
```typescript
import { createInstagramServer } from '@prmichaelsen/agentbase/build/server-factory.js';
```

## Testing

```bash
cd /home/prmichaelsen/agentbase
# Update package.json
npm run build
npm version patch
npm publish

cd /home/prmichaelsen/agentbase-mcp-server
npm install @prmichaelsen/agentbase@latest
npm run build
```

## Acceptance Criteria

- ✅ TypeScript can resolve `@prmichaelsen/agentbase/factory`
- ✅ Types are available
- ✅ No build errors

## Impact

**Blocks**: agentbase-mcp-server TypeScript compilation

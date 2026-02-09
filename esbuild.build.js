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

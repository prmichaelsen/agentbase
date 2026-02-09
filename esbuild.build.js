import * as esbuild from 'esbuild';

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
    'src/tools/index.ts',
    'src/types.ts'
  ],
  outdir: 'build',
  platform: 'node',
  target: 'node18',
  format: 'esm',
  sourcemap: true
});

console.log('Build complete!');

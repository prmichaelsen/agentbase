import * as esbuild from 'esbuild';

const ctx = await esbuild.context({
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

await ctx.watch();
console.log('Watching for changes...');
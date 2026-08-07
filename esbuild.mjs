import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { tsconfigPathsPlugin } from 'esbuild-plugin-tsconfig-paths';

esbuild.build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/src/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  sourcemap: true,
  plugins: [
    nodeExternalsPlugin(),
    tsconfigPathsPlugin(),
  ],
}).catch(() => process.exit(1));

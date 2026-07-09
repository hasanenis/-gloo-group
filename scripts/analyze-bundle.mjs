import { spawn } from 'node:child_process';
import path from 'node:path';

const viteEntry = path.resolve('node_modules', 'vite', 'bin', 'vite.js');

const child = spawn(process.execPath, [viteEntry, 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    BUNDLE_ANALYZE: 'true',
  },
  shell: false,
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});

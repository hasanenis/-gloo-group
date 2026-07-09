import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const apiProcess = spawn(process.execPath, [path.join(rootDir, 'scripts', 'design-studio-server.mjs')], {
  cwd: rootDir,
  stdio: 'inherit',
});

const viteBinary = process.platform === 'win32'
  ? path.join(rootDir, 'node_modules', '.bin', 'vite.cmd')
  : path.join(rootDir, 'node_modules', '.bin', 'vite');

const viteProcess = spawn(viteBinary, ['--port=3000', '--host=0.0.0.0'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

const shutdown = () => {
  apiProcess.kill();
  viteProcess.kill();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

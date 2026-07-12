import { spawnSync } from 'node:child_process';

const npmBinary = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function runLinguiCommand(args: string[]) {
  const result = spawnSync(npmBinary, ['exec', '--', 'lingui', ...args], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runLinguiCommand(['extract']);
runLinguiCommand(['compile']);

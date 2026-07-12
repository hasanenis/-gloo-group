import { spawn } from 'node:child_process';
import path from 'node:path';

type Options = {
  script: string;
  chunk: number;
  start: number;
  model: string;
  passthrough: string[];
};

function parseArgs(argv: string[]): Options {
  const doubleDash = argv.indexOf('--');
  const ownArgs = doubleDash >= 0 ? argv.slice(0, doubleDash) : argv;
  const passthrough = doubleDash >= 0 ? argv.slice(doubleDash + 1) : [];

  const getValue = (flag: string) => {
    const index = ownArgs.indexOf(flag);
    return index >= 0 ? ownArgs[index + 1] : undefined;
  };

  const script = getValue('--script');
  if (!script) {
    throw new Error('Missing required --script argument.');
  }

  return {
    script,
    chunk: Number(getValue('--chunk') ?? '12'),
    start: Number(getValue('--start') ?? '0'),
    model: getValue('--model') ?? process.env.GEMINI_POLISH_MODEL ?? 'gemini-2.5-flash',
    passthrough,
  };
}

function runTzx(scriptArgs: string[], extraEnv: Record<string, string>) {
  return new Promise<{ code: number; stdout: string }>((resolve, reject) => {
    const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const child = spawn(command, ['tsx', ...scriptArgs], {
      cwd: process.cwd(),
      env: { ...process.env, ...extraEnv },
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });

    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}: npx tsx ${scriptArgs.join(' ')}\n${stderr}`));
        return;
      }
      resolve({ code: code ?? 0, stdout });
    });
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!Number.isFinite(options.chunk) || options.chunk <= 0) {
    throw new Error(`Invalid --chunk value: ${options.chunk}`);
  }
  if (!Number.isFinite(options.start) || options.start < 0) {
    throw new Error(`Invalid --start value: ${options.start}`);
  }

  const resolvedScript = path.normalize(options.script);
  const env = { GEMINI_POLISH_MODEL: options.model };

  const countResult = await runTzx([resolvedScript, '--count', ...options.passthrough], env);
  const countMatch = countResult.stdout.match(/(\d+)\s*$/m);
  if (!countMatch) {
    throw new Error(`Could not parse --count output for ${resolvedScript}`);
  }

  const total = Number(countMatch[1]);
  if (options.start >= total) {
    process.stdout.write(`Nothing to do. Start ${options.start} is already beyond total ${total}.\n`);
    return;
  }

  process.stdout.write(
    `Running ${resolvedScript} in chunks of ${options.chunk} with model ${options.model} (start ${options.start}, total ${total}).\n`,
  );

  for (let offset = options.start; offset < total; offset += options.chunk) {
    const limit = Math.min(options.chunk, total - offset);
    process.stdout.write(`\n=== Batch ${offset}-${offset + limit} / ${total} ===\n`);
    await runTzx([resolvedScript, '--apply', '--start', String(offset), '--limit', String(limit), ...options.passthrough], env);
  }

  process.stdout.write(`Completed ${resolvedScript}.\n`);
}

await main();

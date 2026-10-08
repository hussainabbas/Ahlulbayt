#!/usr/bin/env node
/**
 * Runs react-native run-android with a stable Gradle home on Windows.
 * Avoids MAX_PATH failures when Gradle cache lives under a long sandbox temp path.
 */
import { spawnSync } from 'child_process';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.join(__dirname, '..');
const args = ['run-android', '--main-activity', '.MainActivity', ...process.argv.slice(2)];

const env = { ...process.env };
if (process.platform === 'win32' && !env.GRADLE_USER_HOME) {
  env.GRADLE_USER_HOME = path.join(os.homedir(), '.gradle');
}

const result = spawnSync('npx', ['react-native', ...args], {
  cwd: mobileRoot,
  env,
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);

#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { registerInit } from './commands/init.js';
import { registerDoctor } from './commands/doctor.js';
import { registerUpdate } from './commands/update.js';
import { registerSkill } from './commands/skill.js';
import { registerPhase } from './commands/phase.js';
import { registerDashboard } from './commands/dashboard.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8')) as {
  version: string;
  description: string;
};

const program = new Command();

program
  .name('genesis')
  .description(pkg.description)
  .version(pkg.version, '-v, --version', 'mostra a versão do CLI');

registerInit(program);
registerUpdate(program);
registerSkill(program);
registerPhase(program);
registerDashboard(program);
registerDoctor(program);

program.on('--help', () => {
  console.log('');
  console.log('Plano: https://github.com/AndersonGuilherme/genesis#readme');
  console.log('Issues: https://github.com/AndersonGuilherme/genesis/issues');
});

program.parseAsync().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(pc.red(`erro: ${message}`));
  process.exit(1);
});

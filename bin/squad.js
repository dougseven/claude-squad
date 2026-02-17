#!/usr/bin/env node

/**
 * claude-squad CLI
 * 
 * Usage:
 *   squad init              — Bootstrap Squad in the current project
 *   squad status            — Show team dashboard (same as /squad-status)
 *   squad hire [role]       — Add an agent (same as /squad-hire)
 *   squad fire [role]       — Retire an agent (same as /squad-fire)
 *   squad version           — Print version
 *
 * Most commands are designed to be run inside Claude Code as /squad-*
 * slash commands. The CLI provides scaffolding and utilities.
 */

import { readFileSync, existsSync, mkdirSync, copyFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const [, , command, ...args] = process.argv;

function help() {
  console.log(`
claude-squad v${pkg.version}
AI agent teams for Claude Code

Usage:
  squad <command> [options]

Commands:
  init              Bootstrap Squad in the current project
  status            Show team status (active agents, decision count)
  hire [role]       Print instructions for adding an agent
  version           Print version
  help              Show this help

Most orchestration happens inside Claude Code via /squad-* commands.
Run \`squad init\` first, then open Claude Code in your project.

Examples:
  squad init
  squad status
  squad hire backend

Docs: https://github.com/dougseven/claude-squad
`);
}

function version() {
  console.log(`claude-squad v${pkg.version}`);
}

function init() {
  const cwd = process.cwd();
  const templatesDir = join(__dirname, '../templates');

  console.log('\n🤝 Initializing claude-squad...\n');

  // Create directory structure
  const dirs = [
    '.ai-team/agents/_alumni',
    '.ai-team/memory',
    '.claude/commands',
  ];

  for (const dir of dirs) {
    const full = join(cwd, dir);
    if (!existsSync(full)) {
      mkdirSync(full, { recursive: true });
      console.log(`  ✓ Created ${dir}/`);
    } else {
      console.log(`  · ${dir}/ already exists`);
    }
  }

  // Copy SQUAD.md
  const squadSrc = join(__dirname, '../.ai-team/SQUAD.md');
  const squadDest = join(cwd, '.ai-team/SQUAD.md');
  if (!existsSync(squadDest)) {
    copyFileSync(squadSrc, squadDest);
    console.log('  ✓ Created .ai-team/SQUAD.md');
  }

  // Copy decisions.md
  const decisionsSrc = join(__dirname, '../.ai-team/decisions.md');
  const decisionsDest = join(cwd, '.ai-team/decisions.md');
  if (!existsSync(decisionsDest)) {
    copyFileSync(decisionsSrc, decisionsDest);
    console.log('  ✓ Created .ai-team/decisions.md');
  }

  // Copy default agents
  const defaultAgents = ['lead.md', 'tester.md'];
  for (const agent of defaultAgents) {
    const src = join(__dirname, '../.ai-team/agents', agent);
    const dest = join(cwd, '.ai-team/agents', agent);
    if (!existsSync(dest) && existsSync(src)) {
      copyFileSync(src, dest);
      console.log(`  ✓ Created .ai-team/agents/${agent}`);
    }
  }

  // Create memory stubs for default agents
  for (const agent of ['lead', 'tester']) {
    const memDest = join(cwd, '.ai-team/memory', `${agent}.log.md`);
    if (!existsSync(memDest)) {
      writeFileSync(memDest, `# ${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent Memory Log\n\n<!-- Coordinator writes entries here after each task -->\n`);
      console.log(`  ✓ Created .ai-team/memory/${agent}.log.md`);
    }
  }

  // Copy slash commands
  const commands = [
    'squad-hire.md',
    'squad-fire.md',
    'squad-run.md',
    'squad-delegate.md',
    'squad-status.md',
    'squad-review.md',
    'squad-prune.md',
  ];

  for (const cmd of commands) {
    const src = join(__dirname, '../.claude/commands', cmd);
    const dest = join(cwd, '.claude/commands', cmd);
    if (!existsSync(dest) && existsSync(src)) {
      copyFileSync(src, dest);
      console.log(`  ✓ Created .claude/commands/${cmd}`);
    }
  }

  // Create or update CLAUDE.md
  const claudeMd = join(cwd, 'CLAUDE.md');
  if (!existsSync(claudeMd)) {
    copyFileSync(join(templatesDir, 'CLAUDE.md'), claudeMd);
    console.log('  ✓ Created CLAUDE.md');
  } else {
    // Check if SQUAD.md is already included
    const existing = readFileSync(claudeMd, 'utf8');
    if (!existing.includes('!.ai-team/SQUAD.md')) {
      writeFileSync(claudeMd, `!.ai-team/SQUAD.md\n\n${existing}`);
      console.log('  ✓ Updated CLAUDE.md to include SQUAD.md');
    } else {
      console.log('  · CLAUDE.md already includes SQUAD.md');
    }
  }

  console.log(`
✅ Squad initialized!

Your team:
  · Lead    — Architecture and cross-cutting concerns  
  · Tester  — Quality gates and test coverage

Next steps:
  1. Open Claude Code:        claude
  2. Check team status:       /squad-status
  3. Add more agents:         /squad-hire backend
  4. Assign your first task:  /squad-delegate "describe your task"

Docs: https://github.com/dougseven/claude-squad
`);
}

function status() {
  const cwd = process.cwd();
  const agentsDir = join(cwd, '.ai-team/agents');
  
  if (!existsSync(agentsDir)) {
    console.log('\nNo Squad found in this project. Run: squad init\n');
    return;
  }

  const agents = readdirSync(agentsDir)
    .filter(f => f.endsWith('.md') && f !== '_alumni');
  
  const alumniDir = join(agentsDir, '_alumni');
  const alumniCount = existsSync(alumniDir) 
    ? readdirSync(alumniDir).filter(f => f.endsWith('.md')).length 
    : 0;

  const decisionsFile = join(cwd, '.ai-team/decisions.md');
  const decisionsContent = existsSync(decisionsFile) ? readFileSync(decisionsFile, 'utf8') : '';
  const decisionCount = (decisionsContent.match(/^## \[/gm) || []).length;

  console.log(`
● SQUAD STATUS
  ─────────────────────────────────────────
  Active agents:  ${agents.length}
  ${agents.map(a => `  · ${a.replace('.md', '')}`).join('\n')}
  
  Alumni:         ${alumniCount} (knowledge preserved)
  Decisions:      ${decisionCount} in decisions.md
  ─────────────────────────────────────────
  Run \`claude\` and use /squad-* commands for full orchestration.
`);
}

switch (command) {
  case 'init':
    init();
    break;
  case 'status':
    status();
    break;
  case 'version':
  case '--version':
  case '-v':
    version();
    break;
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    help();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error('Run `squad help` for usage.');
    process.exit(1);
}

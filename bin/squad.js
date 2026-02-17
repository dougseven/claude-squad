#!/usr/bin/env node

/**
 * claude-squad CLI
 *
 * Usage:
 *   squad init              — Bootstrap Squad in the current project
 *   squad update            — Update framework files (safe: never touches team state)
 *   squad status            — Show team dashboard
 *   squad version           — Print version
 *
 * Most commands are designed to be run inside Claude Code as /squad-*
 * slash commands. The CLI provides scaffolding and utilities.
 */

import { readFileSync, existsSync, mkdirSync, copyFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const [, , command, ...args] = process.argv;

// Files owned by the framework — safe to overwrite on update.
// Never includes agent charters, decisions.md, memory logs, or CLAUDE.md.
const FRAMEWORK_COMMANDS = [
  'squad-hire.md',
  'squad-fire.md',
  'squad-run.md',
  'squad-delegate.md',
  'squad-status.md',
  'squad-review.md',
  'squad-prune.md',
  'squad-brief.md',
];

function help() {
  console.log(`
claude-squad v${pkg.version}
AI agent teams for Claude Code

Usage:
  squad <command> [options]

Commands:
  init              Bootstrap Squad in the current project
  update            Update framework files without touching team state
  status            Show team status (active agents, decision count)
  version           Print version
  help              Show this help

Inside Claude Code, use slash commands:
  /squad-delegate   Auto-route a task to the best agent
  /squad-run        Dispatch to a specific agent
  /squad-hire       Add a new agent
  /squad-fire       Retire an agent
  /squad-status     Show team dashboard
  /squad-review     Route work to a reviewer
  /squad-prune      Compress agent histories
  /squad-brief      Give the team a high-level mission

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

  // Copy SQUAD.md (framework-owned — but skip on init if exists; update handles refresh)
  const squadSrc = join(__dirname, '../.ai-team/SQUAD.md');
  const squadDest = join(cwd, '.ai-team/SQUAD.md');
  if (!existsSync(squadDest)) {
    copyFileSync(squadSrc, squadDest);
    console.log('  ✓ Created .ai-team/SQUAD.md');
  } else {
    console.log('  · .ai-team/SQUAD.md already exists (run `squad update` to refresh)');
  }

  // Copy decisions.md (team-owned — only create, never overwrite)
  const decisionsSrc = join(__dirname, '../.ai-team/decisions.md');
  const decisionsDest = join(cwd, '.ai-team/decisions.md');
  if (!existsSync(decisionsDest)) {
    copyFileSync(decisionsSrc, decisionsDest);
    console.log('  ✓ Created .ai-team/decisions.md');
  }

  // Copy default agents (team-owned — only create, never overwrite)
  const defaultAgents = ['lead.md', 'tester.md'];
  for (const agent of defaultAgents) {
    const src = join(__dirname, '../.ai-team/agents', agent);
    const dest = join(cwd, '.ai-team/agents', agent);
    if (!existsSync(dest) && existsSync(src)) {
      copyFileSync(src, dest);
      console.log(`  ✓ Created .ai-team/agents/${agent}`);
    }
  }

  // Create memory stubs for default agents (team-owned — only create, never overwrite)
  for (const agent of ['lead', 'tester']) {
    const memDest = join(cwd, '.ai-team/memory', `${agent}.log.md`);
    if (!existsSync(memDest)) {
      writeFileSync(memDest, `# ${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent Memory Log\n\n<!-- Coordinator writes entries here after each task -->\n`);
      console.log(`  ✓ Created .ai-team/memory/${agent}.log.md`);
    }
  }

  // Copy slash commands (framework-owned — skip if exists; update handles refresh)
  for (const cmd of FRAMEWORK_COMMANDS) {
    const src = join(__dirname, '../.claude/commands', cmd);
    const dest = join(cwd, '.claude/commands', cmd);
    if (!existsSync(dest) && existsSync(src)) {
      copyFileSync(src, dest);
      console.log(`  ✓ Created .claude/commands/${cmd}`);
    }
  }

  // Create or update CLAUDE.md (team-owned — only prepend include if missing)
  const claudeMd = join(cwd, 'CLAUDE.md');
  if (!existsSync(claudeMd)) {
    copyFileSync(join(templatesDir, 'CLAUDE.md'), claudeMd);
    console.log('  ✓ Created CLAUDE.md');
  } else {
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

function update() {
  const cwd = process.cwd();

  if (!existsSync(join(cwd, '.ai-team'))) {
    console.error('\nNo Squad found in this project. Run: squad init\n');
    process.exit(1);
  }

  console.log('\n🔄 Updating claude-squad framework files...\n');
  console.log('  Team state (agents, decisions, memory) will not be touched.\n');

  let updated = 0;

  // Overwrite SQUAD.md — framework-owned
  const squadSrc = join(__dirname, '../.ai-team/SQUAD.md');
  const squadDest = join(cwd, '.ai-team/SQUAD.md');
  copyFileSync(squadSrc, squadDest);
  console.log('  ✓ Updated .ai-team/SQUAD.md');
  updated++;

  // Overwrite all slash commands — framework-owned
  for (const cmd of FRAMEWORK_COMMANDS) {
    const src = join(__dirname, '../.claude/commands', cmd);
    const dest = join(cwd, '.claude/commands', cmd);
    if (existsSync(src)) {
      mkdirSync(join(cwd, '.claude/commands'), { recursive: true });
      copyFileSync(src, dest);
      console.log(`  ✓ Updated .claude/commands/${cmd}`);
      updated++;
    }
  }

  // Never touched by update:
  //   .ai-team/agents/*.md       — your team's charters
  //   .ai-team/decisions.md      — your team's decisions
  //   .ai-team/memory/           — your team's memory logs
  //   CLAUDE.md                  — your project's Claude context

  console.log(`
✅ Update complete! ${updated} framework files refreshed.

Restart Claude Code to pick up the new slash commands:
  exit → claude

Your team state is untouched.
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
    .filter(f => f.endsWith('.md'));

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
${agents.map(a => `    · ${a.replace('.md', '')}`).join('\n')}

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
  case 'update':
    update();
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
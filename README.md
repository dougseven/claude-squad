# claude-squad 🤝

**AI agent teams for Claude Code.** Inspired by [@bradygaster](https://github.com/bradygaster/squad)'s Squad for GitHub Copilot — rebuilt natively for Claude Code using slash commands, the Task tool, and persistent markdown memory.

> Think of it like hiring a specialized team. The Coordinator is the project manager who never writes code — they brief specialists, route work, enforce decisions, and make sure the tester can't review their own rejected work.

---

## What It Does

claude-squad gives your Claude Code session a **persistent team of specialized AI agents**:

- Each agent has a **charter** — a scoped domain they own and decisions they make
- A **Coordinator** (you, via Claude Code) orchestrates the team using the Task tool to spawn subagents
- **Shared memory** accumulates across sessions so agents get smarter over time
- **Decisions** are codified in a central log — no agent can override them without Coordinator approval
- **Review authority** is enforced — rejected work gets reassigned, never self-reviewed

---

## Quick Start

```bash
# Install
npx github:dougseven/claude-squad

# Or clone and run directly
git clone https://github.com/dougseven/claude-squad
cd your-project
node /path/to/claude-squad/bin/squad.js init
```

Then open Claude Code in your project:

```bash
claude
```

Claude will automatically load `CLAUDE.md`, which includes the Squad Coordinator. Your team is ready.

---

## Commands

All commands are available as `/project:` slash commands inside Claude Code.

| Command | Description |
|---|---|
| `/project:squad-init` | Bootstrap Squad in a new project |
| `/project:squad-hire [role]` | Create a new agent with a scoped charter |
| `/project:squad-fire [role]` | Retire an agent (moves to alumni, knowledge preserved) |
| `/project:squad-run [role] "[task]"` | Dispatch a task to a specific agent |
| `/project:squad-delegate "[task]"` | Auto-route a task to the best-fit agent |
| `/project:squad-status` | Show team dashboard — agents, memory, decisions |
| `/project:squad-review [role] "[artifact]"` | Route work to a reviewer (Lead or Tester) |
| `/project:squad-prune` | Compress agent histories to reduce context bloat |

---

## Project Structure

```
your-project/
├── CLAUDE.md                        ← Includes Squad Coordinator context
├── .ai-team/
│   ├── SQUAD.md                     ← Coordinator instructions
│   ├── decisions.md                 ← Shared team decision log
│   ├── agents/
│   │   ├── lead.md                  ← Lead agent charter + history
│   │   ├── tester.md
│   │   ├── frontend.md
│   │   └── _alumni/                 ← Retired agents (nothing deleted)
│   └── memory/
│       ├── lead.log.md              ← Per-agent persistent memory
│       └── tester.log.md
└── .claude/
    └── commands/
        ├── squad-hire.md
        ├── squad-fire.md
        ├── squad-run.md
        ├── squad-delegate.md
        ├── squad-status.md
        ├── squad-review.md
        └── squad-prune.md
```

---

## How It Works

### The Task Tool is the Engine

When you run `/project:squad-run backend "add rate limiting to the API"`, the Coordinator spawns a Claude Code **Task tool** subagent seeded with:
1. The backend agent's charter (their domain, constraints, past decisions)
2. The current `decisions.md` (the team's constitution)
3. The specific task

The subagent works in its own context window — focused, uncluttered by unrelated history — then reports back. Results and learnings get written back to memory.

### Memory Survives Sessions

Every agent has a `memory/{role}.log.md` that persists across Claude Code sessions. Key learnings, architectural decisions, and patterns accumulate. The first session is the least capable; the team improves over time.

### Review Rules are Enforced

Tester and Lead agents have rejection authority. When work is rejected:
- The Coordinator **reassigns to a different agent** — never the original author
- The rejection reason and reassignment are logged in the agent's history
- This prevents the "I'll just approve my own work" failure mode

---

## Agent Roles

claude-squad ships with templates for common roles:

| Role | Domain | Authority |
|---|---|---|
| **Lead** | Architecture, cross-cutting concerns | Can reject any work |
| **Tester** | Test coverage, quality gates | Can reject and block merges |
| **Frontend** | UI components, CSS, accessibility | Owns frontend decisions |
| **Backend** | API design, data models, services | Owns backend decisions |
| **Docs** | Documentation, changelogs, READMEs | Owns docs standards |
| **Security** | Auth, secrets, vulnerabilities | Can veto security risks |

---

## vs. Brady's Squad (GitHub Copilot)

| | Brady's Squad | claude-squad |
|---|---|---|
| Platform | GitHub Copilot CLI + VS Code | Claude Code CLI |
| Coordinator trigger | `squad.agent.md` | `SQUAD.md` via `CLAUDE.md` |
| Agent spawning | `task` tool + `/delegate` | Claude Code Task tool |
| Slash commands | `/delegate`, `/hire`, `/fire` | `/project:squad-*` |
| GitHub integration | `gh` CLI required | Optional |
| Notifications | MCP (Teams, iMessage, Discord) | MCP (bring your own) |

---

## Contributing

Experimental — v0.1.0-dev. Issues and PRs welcome.

```bash
git clone https://github.com/dougseven/claude-squad
cd claude-squad
npm install
npm test
```

---

## Credits

Architecture inspired by [@bradygaster](https://github.com/bradygaster)'s [Squad](https://github.com/bradygaster/squad) for GitHub Copilot. Same ideas, different runtime.

## License

MIT

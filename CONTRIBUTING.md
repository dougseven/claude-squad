# Contributing to claude-squad

Thanks for your interest! This project is experimental and contributions are very welcome.

## Development Setup

```bash
git clone https://github.com/dougseven/claude-squad
cd claude-squad
npm install
```

## Key Files

- `bin/squad.js` — CLI entry point (`squad init`, `squad status`)
- `.claude/commands/*.md` — Slash command prompts for Claude Code
- `.ai-team/` — Default agent charters and Coordinator prompt
- `templates/` — Files copied to user projects during `squad init`

## Areas That Need Work

- **More agent templates** — Security, DevOps, Docs, Design
- **More casting universes** (personas for agents)
- **MCP notification integration** — Same as Brady's Squad
- **GitHub Issues integration** — Optional `gh` CLI hooks
- **Tests** — The `tests/` directory is empty
- **VS Code tasks** — Complement to the CLI

## Slash Command Philosophy

The `.claude/commands/` prompts are the core of the product. They should:
- Be clear and explicit — Claude Code executes them literally
- Include error handling (e.g., "if the agent doesn't exist, say so")
- Always update the right memory/decision files after work completes
- Enforce the review/reassignment rules without exception

## Opening Issues

Use the issue tracker for bugs, feature requests, and questions.
Tag issues: `bug`, `enhancement`, `agent-template`, `docs`, `discussion`

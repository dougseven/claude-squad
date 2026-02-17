# /project:squad-status

Show a dashboard of the current Squad team.

## Instructions

Read the following files and compile a status report:

1. All files in `.ai-team/agents/` (active agents)
2. All files in `.ai-team/agents/_alumni/` (count only)
3. `.ai-team/decisions.md` (count active decisions)
4. All files in `.ai-team/memory/` (count entries per agent)

## Output Format

```
● SQUAD STATUS ──────────────────────────────────────────
  Project: {current directory name}
  
  ACTIVE AGENTS ({count})
  ────────────────────────────────────────────────────────
  Agent        Domain                  Memory    Last Task
  ──────────   ──────────────────────  ────────  ─────────
  lead         Architecture, x-cut     X entries {date or "none"}
  tester       Quality, test coverage  X entries {date or "none"}
  frontend     UI, components, a11y    X entries {date or "none"}
  backend      API, data, services     X entries {date or "none"}
  ────────────────────────────────────────────────────────
  
  TEAM KNOWLEDGE
  decisions.md:  {N} active decisions
  Alumni agents: {N} (knowledge preserved in decisions.md)
  
  QUICK ACTIONS
  Assign work:  /project:squad-delegate "[task]"
  Add agent:    /project:squad-hire [role]
  View agent:   read .ai-team/agents/{role}.md
──────────────────────────────────────────────────────────
```

If `.ai-team/` doesn't exist yet, output:
```
No Squad found in this project. 
Run: /project:squad-hire lead  (to add your first agent)
```

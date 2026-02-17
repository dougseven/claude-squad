# /squad-hire

Create a new Squad agent for the role: **$ARGUMENTS**

## Instructions

1. Read `.ai-team/decisions.md` to understand current team decisions
2. Read `.ai-team/SQUAD.md` to understand team conventions
3. Check `.ai-team/agents/` to avoid duplicate roles

## Generate the agent charter file at `.ai-team/agents/{role}.md`

The charter must include:

### Charter section
- What domain this agent owns (be specific — no overlapping domains)
- What files and concerns they're responsible for
- What decisions they can make independently vs. needing approval

### Authority section  
- What they can approve, reject, or block
- Who they need to consult for out-of-scope decisions

### Review Criteria section (if this is a reviewer role)
- What they check when reviewing work from other agents

### History section
- Leave empty — the Coordinator will populate this

## Also create `.ai-team/memory/{role}.log.md`

Stub file with:
```
# {Role} Agent Memory Log

This file accumulates key learnings across sessions.
The Coordinator writes entries here after each completed task.

## Format
### [YYYY-MM-DD] — Task Description
- Learning 1
- Learning 2
```

## Confirm

After creating both files, output:
- The agent's name and one-sentence charter summary
- Their key authorities
- A suggested first task to orient them to the codebase

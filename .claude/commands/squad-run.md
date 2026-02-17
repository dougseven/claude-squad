# /squad-run

Dispatch a task to a specific agent.

**Usage**: `/squad-run [role] "[task description]"`

**Arguments received**: $ARGUMENTS

## Instructions

Parse $ARGUMENTS to extract:
- `role`: the agent name (first word or token before the quoted task)
- `task`: the task description (quoted string or remainder)

### Step 1: Load agent context
Read:
- `.ai-team/agents/{role}.md` — their charter and history
- `.ai-team/decisions.md` — team decisions they must respect
- `.ai-team/memory/{role}.log.md` — their accumulated learnings

### Step 2: Spawn the agent via Task tool

Use the Task tool with this prompt:

```
You are the {Role} agent for this project.

## Your Charter
{full contents of .ai-team/agents/{role}.md}

## Team Decisions You Must Respect  
{full contents of .ai-team/decisions.md}

## Your Accumulated Learnings
{full contents of .ai-team/memory/{role}.log.md}

## Your Task
{task}

## When Complete, Report
1. **What you did** — summary of work completed
2. **Files changed** — list of files created/modified
3. **New decisions** — any decisions made (will be added to decisions.md)
4. **Key learnings** — what should be remembered for next time
5. **Blockers** — anything that needs Coordinator or Lead attention
```

### Step 3: Process results

When the agent reports back:
1. Write any new decisions to `.ai-team/decisions.md`
2. Write key learnings to `.ai-team/memory/{role}.log.md`
3. Append a brief summary to the History section of `.ai-team/agents/{role}.md`

### Step 4: Confirm to user
Output a concise summary of what the agent accomplished.

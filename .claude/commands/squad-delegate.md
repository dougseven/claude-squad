# /squad-delegate

Auto-route a task to the best-fit agent (or agents).

**Task**: $ARGUMENTS

## Instructions

### Step 1: Assess the task
Read the task and identify:
- What domain does this touch? (frontend, backend, testing, docs, etc.)
- Is this decomposable into parallel subtasks?
- Does it require multiple agents working in sequence?

### Step 2: Read the roster
Scan all files in `.ai-team/agents/` (excluding `_alumni/`). For each agent, 
note their domain and authorities.

### Step 3: Routing decision

**Single-agent task**: Identify the best fit and use the Task tool to spawn 
them (same as `/squad-run`).

**Multi-agent parallel**: If the task decomposes cleanly (e.g., frontend work 
and backend work with no dependency between them), spawn multiple Task agents 
concurrently. Each gets their own charter + the shared decisions.md.

**Sequential pipeline**: If work must happen in order (e.g., backend API first, 
then frontend consuming it), explain the plan, confirm with user if >2 steps, 
then execute in sequence.

**Ambiguous ownership**: If no single agent clearly owns the domain, route to 
Lead for a scoping decision first.

### Step 4: Show your reasoning
Before spawning, output:
```
Routing to: {agent(s)}
Reason: {one sentence why}
Approach: {single / parallel / sequential}
```

Then proceed.

### Step 5: Collect and synthesize results
When agents complete, synthesize their reports into a single summary. Update 
memory and decisions as in `/squad-run`.

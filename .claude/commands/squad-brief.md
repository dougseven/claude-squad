# /squad-brief

Give the team a high-level mission and build an execution plan before dispatching work.

**Mission**: $ARGUMENTS

Use this when you have a document, goal, or directive that needs to be decomposed
into phased work and assigned across the team — rather than a single task ready
to delegate.

## Instructions

### Step 1: Read the mission

$ARGUMENTS may be:
- A file path (e.g. `resources/Technical_Implementation_Guide.md`) — read it
- A quoted goal (e.g. `"add full-text search to the API"`) — use as-is
- A combination — read any referenced files, then apply the goal

### Step 2: Read the roster

Scan all files in `.ai-team/agents/` (excluding `_alumni/`). For each agent note:
- Their domain and charter
- Their current authorities
- Any relevant history

Also read `.ai-team/decisions.md` to understand existing team constraints.

### Step 3: Build a phased execution plan

Decompose the mission into phases. Each phase must specify:

```
Phase N: {name}
  Agents:      {role(s)}
  Approach:    {parallel | sequential | single}
  Deliverable: {what "done" looks like}
  Depends on:  {Phase X, or "none"}
```

Rules:
- Phases that share no dependencies can run in parallel — prefer this
- Route to Lead first if the mission requires architectural decisions before
  implementation can begin
- Tester phases should follow any implementation phase that produces testable output
- Flag any work that has no clear agent owner — propose a new hire or route to Lead

### Step 4: Present the plan and confirm

Output the full phased plan, then ask:

```
Ready to execute? (yes / adjust / cancel)
```

Do not proceed until the user confirms. If they ask for adjustments, revise the
plan and confirm again.

### Step 5: Execute phase by phase

For each phase in order (respecting dependencies):

1. Announce: `Executing Phase N: {name}`
2. Spawn agents via the Task tool (parallel agents in one message, sequential agents one at a time)
3. Seed each agent with: their charter + decisions.md + phase deliverable + any prior phase output they need
4. Collect results before starting the next dependent phase

### Step 6: Synthesize and wrap up

When all phases complete:
1. Write any new decisions to `.ai-team/decisions.md`
2. Write key learnings to each agent's memory log
3. Output a mission summary:

```
Mission complete: {mission title}
  Phases executed: N
  Agents involved: {list}
  Decisions added: {count}
  Key outcomes:
  - {outcome 1}
  - {outcome 2}
```

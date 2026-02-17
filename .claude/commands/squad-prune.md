# /project:squad-prune

Compress agent histories and decisions to reduce context bloat.

## Why This Matters

Agent charter files and decisions.md grow over time. When they get too large, 
they consume context window budget that agents need for actual work. This 
command compresses without losing information.

## Instructions

### Step 1: Audit current sizes
Read all files in `.ai-team/` and report token estimates:
- Each agent charter in `agents/`
- `decisions.md`
- Each memory log in `memory/`

Flag any file over 1500 tokens as needing pruning.

### Step 2: Prune agent charter History sections

For each agent with a bloated History section:
- Read their full history
- Compress it to **key milestones only** — what they built, what they decided, 
  major patterns they established
- Remove implementation details (those live in code, not in memory)
- Keep the 3 most recent task summaries in full; compress older ones

### Step 3: Prune decisions.md

- Remove decisions that have been **superseded** by newer decisions (note the 
  supersession, don't just delete)
- Compress verbose decision rationales to 1-2 sentences
- Group related decisions under shared headers

### Step 4: Prune memory logs

For each `memory/{role}.log.md` over 500 tokens:
- Keep the 5 most recent entries verbatim
- Compress older entries into a "Key learnings before {date}" summary block

### Step 5: Report savings

```
Pruning complete:
  decisions.md:    {before} → {after} (estimated tokens)
  lead.md:         {before} → {after}
  tester.md:       {before} → {after}
  ...
  Total saved:     ~{N} tokens
```

> No information is destroyed — it's compressed. If you need the full history, 
> it's in git.

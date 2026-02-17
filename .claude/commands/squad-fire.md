# /project:squad-fire

Retire the Squad agent: **$ARGUMENTS**

## Instructions

This is a graceful retirement — nothing is deleted, all knowledge is preserved.

### Step 1: Read the agent's file
Read `.ai-team/agents/{role}.md` fully.

### Step 2: Extract lasting knowledge
From the agent's History section, extract any decisions or learnings that 
should survive them. Add these to `.ai-team/decisions.md` under a new section:

```
## [YYYY-MM-DD] Inherited from {Role} Agent (retired)
{extracted decisions}
```

### Step 3: Write a retirement summary
At the top of the agent's file, add:

```
---
**RETIRED**: [YYYY-MM-DD]  
**Reason**: {reason if provided, otherwise "Role no longer needed"}  
**Knowledge transferred to**: decisions.md  
---
```

### Step 4: Move to alumni
Move `.ai-team/agents/{role}.md` to `.ai-team/agents/_alumni/{role}.md`

### Step 5: Confirm
Output:
- Agent retired
- Number of decisions extracted to decisions.md
- Note that their full history lives in `_alumni/{role}.md`

> Alumni agents are never truly gone. If you need them back, use 
> `/project:squad-hire {role}` — their history in decisions.md means they'll 
> hit the ground running.

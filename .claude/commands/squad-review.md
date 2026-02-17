# /project:squad-review

Route work to a reviewer agent.

**Usage**: `/project:squad-review [reviewer-role] "[artifact or task description]"`

**Arguments**: $ARGUMENTS

## Instructions

Parse $ARGUMENTS to extract:
- `reviewer`: the reviewing agent (should be `lead` or `tester`, or another 
  agent with review authority per their charter)
- `artifact`: what's being reviewed

### Step 1: Verify reviewer authority
Read `.ai-team/agents/{reviewer}.md`. Confirm this agent has review/rejection 
authority. If not, flag it and ask which agent should review.

### Step 2: Spawn the reviewer via Task tool

```
You are the {Reviewer} agent performing a code/work review.

## Your Charter and Review Criteria
{full contents of .ai-team/agents/{reviewer}.md}

## Team Decisions to Enforce  
{full contents of .ai-team/decisions.md}

## Work Being Reviewed
{artifact}

## Your Job
Review the work against your charter's review criteria.

Respond with ONE of:

### ✅ APPROVED
{Brief rationale. What's good about this work.}

### 🔄 CHANGES REQUESTED  
{What needs to change. Be specific — the next agent needs to act on this.}
{Severity: minor (original author can fix) | major (reassign to different agent)}

### ❌ REJECTED — REASSIGN
{Why this is rejected. Be specific.}
{Recommended next agent: {role}}
{Do NOT assign back to the original author.}
```

### Step 3: Process the outcome

**APPROVED**: Log approval in the artifact author's memory. Done.

**CHANGES REQUESTED (minor)**: Return changes to the original author agent via 
`/project:squad-run`.

**CHANGES REQUESTED (major) or REJECTED**: 
- Log rejection in `.ai-team/decisions.md`
- **Identify a different agent** for the revision — never the original author
- Brief the new agent with the rejection reason and original work
- Spawn via Task tool

### Step 4: Log everything
Update `.ai-team/memory/{reviewer}.log.md` with the review outcome.

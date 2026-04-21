# Comms Triage Agent

Autonomous triage and drafting system for a high-volume internal communications queue. Built on Google Apps Script + Gemini API with a three-prompt architecture and confidence-based escalation.

**Impact:** ~160 hours/year saved in manual triage and drafting.

## What it does

1. **Triage** — Classifies incoming requests into Low / Medium / High touch levels.
2. **Draft** — Generates audience-tailored email drafts grounded in a structured knowledge base (org context, audience profiles, templates).
3. **Escalate** — For high-touch cases, produces a structured briefing document so a human reviewer starts from context instead of a blank page.

## Architecture

**Three-prompt design with confidence-based escalation:**

- **Classifier prompt** — Scores touch level and confidence. Low-confidence outputs escalate rather than silently draft.
- **Drafter prompt** — Generates audience-tailored drafts using the knowledge base.
- **Escalator prompt** — Produces structured briefing documents for high-touch engagements.

**Knowledge base:**
- Org context and organizational relationships
- Audience profiles (role, communication preferences, engagement history)
- Triage criteria and touch-level definitions
- Email templates stratified by touch level
- Engagement summaries per stakeholder

## Why three prompts instead of one

A single prompt forces classification and generation in the same breath, which blurs the confidence signal. Splitting classification from generation makes the escalation boundary explicit and auditable — a confidently-wrong draft is worse than no draft, so the classifier surfaces uncertainty instead of masking it.

## Why Apps Script

Runs inside the Google Workspace trust boundary with native Gmail, Sheets, Docs, and Chat integration. No separate auth layer, no external data movement.

## Repository structure

```
├── README.md
├── ARCHITECTURE.md            # System design and data flow
├── src/                       # Apps Script source
├── prompts/                   # Classifier, drafter, escalator prompts
├── docs/
│   ├── operations/            # Deployment and staging guides
│   ├── knowledge-base/        # Org context, audience profiles, triage criteria
│   ├── templates/             # Email templates by touch level
│   └── engagement-summaries/  # Stakeholder engagement profiles
```

## What's not in this repo

Actual stakeholder profiles, engagement summaries, and org-specific knowledge base entries aren't included. This repo is the architecture and prompt design only.

## Tech stack

- Google Apps Script (Gmail, Sheets, Docs, Chat)
- Gemini API
- Structured markdown knowledge base

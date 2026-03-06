# Comms Triage Agent

Automated communications triage and drafting system for internal strategic operations. Classifies incoming requests by complexity, generates context-aware email drafts, and escalates high-touch engagements.

## Overview

This agent automates the intake-to-delivery pipeline for internal communications requests:

1. **Triage** — Classifies requests into Low / Medium / High touch levels
2. **Draft** — Generates audience-tailored email drafts using organizational context
3. **Escalate** — Routes complex requests with structured briefing documents

## Repository Structure

```
├── README.md                  # This file
├── ARCHITECTURE.md            # System design and data flow
├── src/                       # Source code (Apps Script)
├── prompts/                   # LLM prompt templates
├── docs/
│   ├── operations/            # Ops guides, deployment, staging
│   ├── knowledge-base/        # Org context, audience profiles, triage criteria
│   ├── templates/             # Email templates by touch level
│   └── engagement-summaries/  # Client/stakeholder engagement profiles
```

## Quick Start

See `docs/operations/` for deployment and staging guides.
See `prompts/` for the classification, drafting, and escalation prompts.

## Tech Stack

- Google Apps Script (Gmail, Sheets, Docs integration)
- Gemini API (LLM-powered triage and drafting)
- Google Chat (notifications and approvals)

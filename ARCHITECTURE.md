# Architecture — Comms Triage Agent

## System Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Intake Form │────▸│  Triage      │────▸│  Draft / Escalate│
│  (Google     │     │  Classifier  │     │  Generator       │
│   Form)      │     │              │     │                  │
└──────────────┘     └──────┬───────┘     └────────┬─────────┘
                            │                      │
                     ┌──────▼───────┐       ┌──────▼──────┐
                     │  Knowledge   │       │  Output     │
                     │  Base (KB)   │       │  (Email /   │
                     │              │       │   Chat)     │
                     └──────────────┘       └─────────────┘
```

## Components

### 1. Intake & Classification
- Google Form captures request details
- Triage prompt classifies touch level (Low / Medium / High)
- See `prompts/01-classification-prompt.md`

### 2. Knowledge Base
- `docs/knowledge-base/` contains org context, audience profiles, and triage criteria
- Loaded dynamically based on request type and audience

### 3. Draft Generation
- Low Touch: auto-generated email via `prompts/02-low-touch-handling-prompt.md`
- Medium/High Touch: escalation briefing via `prompts/03-escalation-briefing-prompt.md`

### 4. Delivery
- Email drafts sent via Apps Script (Gmail API)
- Escalations posted to Google Chat with structured briefing
- Engagement summaries in `docs/engagement-summaries/`

## Data Flow

1. Request submitted via Google Form → lands in Google Sheet
2. Apps Script trigger fires → reads request row
3. Triage classifier determines touch level
4. KB documents loaded based on audience and request type
5. LLM generates draft or escalation briefing
6. Output delivered via email and/or Chat notification

## Key Files

| File | Purpose |
|------|---------|
| `src/comms_agent.gs` | Main Apps Script source |
| `prompts/` | All LLM prompt templates |
| `docs/knowledge-base/` | Organizational context documents |
| `docs/templates/` | Email templates by touch level |

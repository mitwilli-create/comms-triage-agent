# Comms Triage Agent

Autonomous communications triage system built with Google Apps Script and Gemini API. Three-prompt architecture with confidence-based escalation. Replaces manual intake for a high-volume communications function serving a large senior technical community.

**Built in:** ~40 hours  
**Result:** ~160 hours/year recaptured. Zero coverage gaps during medical leave.

## The problem

A communications function supporting 1,000+ senior engineers generates constant inbound — drafting requests, routing questions, review asks. Manually triaging all of it creates a bottleneck and pulls time away from work that actually needs human judgment.

The hard part isn't handling the routine stuff. It's knowing what's routine.

## How it works

**Three prompts, one pipeline:**

**1. Classify**
Determines touch level (low vs. high) and produces a confidence score. Touch level alone isn't enough — a low-confidence classification on a sensitive request is still a high-touch situation.

**2. Handle (low-touch)**
Generates a complete response draft for routine requests using structured templates and KB context. Only fires when confidence is high enough to trust the output.

**3. Brief (escalation)**
For anything that needs human review: produces a structured brief with context, recommended approach, key risks, and suggested next action. Turns "needs human review" into "here's what I'd do, confirm or redirect."

**Confidence-based routing:**

| Classification | Confidence | Action |
|---|---|---|
| Low-touch | High | Autonomous response |
| Low-touch | Low | Escalate with brief |
| High-touch | Any | Escalate with brief |
| Ambiguous | Any | Escalate with brief |

When in doubt, it escalates. It never ships uncertain outputs.

## Knowledge base structure

Three tiers, loaded contextually:

- **Core KB** — always loaded. Communication standards, tone guidelines, escalation criteria.
- **Living Docs** — loaded on keyword match. Current priorities, active context.
- **Engagement Summaries** — loaded on audience match. History for specific stakeholder relationships.

## Key design decisions

**Why three prompts instead of one?**
Classification and generation have different failure modes. Separating them means each prompt does one thing well instead of both things adequately.

**Why confidence scoring?**
Models are often confidently wrong. Surfacing uncertainty as a first-class signal catches the cases where the classification looks right but isn't. The failure mode this prevents: a low-confidence borderline request handled autonomously and sent to the wrong person.

**Why structured escalation briefs?**
Raw escalation creates work. Structured briefs create leverage. The reviewer spends 2 minutes confirming a recommendation instead of 20 minutes reconstructing context from scratch.

## Tech stack

- Google Apps Script
- Gemini API
- Google Workspace (Sheets, Gmail, Drive)

## How this maps to comms automation at scale

This agent is one implementation of a broader pattern: using LLMs to automate communications workflows that don't scale with headcount. The same architecture — classify, handle, escalate — applies to:

| Communications workflow | What the agent would do | Status |
|---|---|---|
| **Rapid-response monitoring** | Monitor inbound signals, classify urgency, alert the right person with a structured brief | ✅ Built (this repo) |
| **Press clips digest** | Ingest coverage from multiple sources, classify by topic/sentiment, deliver formatted daily briefing | Planned |
| **Briefing generation** | Synthesize background materials + recent coverage into spokesperson prep docs | Pattern exists (escalation briefs use the same synthesize → structure → deliver flow) |
| **Message pull-through tracking** | Analyze earned coverage against key narratives to measure message accuracy | Planned |
| **Internal comms workflow** | Streamline drafting, review, and distribution of all-hands content and leadership messages | Pattern exists (low-touch draft generation applies directly) |
| **Comms automation playbook** | Document tools, workflows, and outcomes so other teams can replicate | This repo is the playbook for this system |

The core insight: most comms workflows share the same bottleneck — a human manually classifying what needs attention and what doesn't. Confidence-based triage with structured escalation solves that bottleneck regardless of the specific workflow.

## What's not here

Production KB content, stakeholder profiles, and communication templates are internal and not included. This repo is the architecture and design rationale — not the content layer.

## Source code

Full production source is in [`src/comms_agent.gs`](src/comms_agent.gs) — 4,700+ lines of Apps Script with Gemini API integration. All internal identifiers, names, and credentials have been replaced with placeholders. See [`src/README.md`](src/README.md) for setup instructions and a section-by-section breakdown.

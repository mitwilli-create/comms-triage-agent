# Communications Triage Agent

An autonomous communications triage system built with Google Apps Script and Gemini API. Three-prompt architecture with confidence-based escalation that replaces manual intake for a high-volume communications function.

**Built in:** ~40 hours  
**Saves:** ~160 hours/year  
**Status:** Shipped, production

---

## Problem

A senior communications function supporting a large technical community generates constant inbound requests — drafting, routing, review, and guidance. Manually triaging every request creates a bottleneck, delays responses, and consumes time needed for high-stakes external communications.

The core challenge: not all requests are equal. Some can be handled autonomously with high confidence. Others require human judgment, strategic oversight, or stakeholder sensitivity. A triage system needs to know the difference — and be honest when it doesn't.

## Architecture

### Three-Prompt Design

**Prompt 1: Classification**
Classifies inbound request across two dimensions:
- **Touch level:** Low-touch (internal, routine, templatable) vs. High-touch (external, senior stakeholder, cross-org, strategic)
- **Confidence score:** How certain is the model about this classification?

**Prompt 2: Low-Touch Handling**
For requests classified as low-touch with sufficient confidence: generates a complete response draft using structured templates and KB context.

**Prompt 3: Escalation Briefing**
For requests that require human review: generates a structured escalation brief — context, recommended approach, key considerations, and suggested next action — rather than a blank handoff.

### Confidence-Based Escalation

The system doesn't just route on classification — it routes on confidence:

| Classification | Confidence | Action |
|---------------|------------|--------|
| Low-touch | High | Autonomous handling |
| Low-touch | Low | Escalate with brief |
| High-touch | Any | Escalate with brief |
| Ambiguous | Any | Escalate with brief |

This prevents the failure mode where a model is confidently wrong. When confidence is low, the system escalates — it never ships uncertain outputs.

### Knowledge Base Structure

Three-tier KB loaded contextually:

- **Core KB** (always loaded) — communication standards, tone guidelines, audience profiles, escalation criteria
- **Living Docs** (loaded on keyword trigger) — current priorities, active projects, recent context
- **Engagement Summaries** (loaded on audience match) — historical context for specific stakeholder relationships

### Escalation Brief Format

When a request escalates to human review, the brief includes:
- Request summary and classification rationale
- Relevant context from KB
- Recommended response approach
- Key sensitivities or risks
- Suggested next action

This transforms escalation from "here's a problem" to "here's a problem with a recommended path forward."

## Key Design Decisions

**Why Apps Script + Gemini API over a dedicated platform?**
Build velocity. The goal was to ship a working system quickly against a real operational need. Apps Script integrates natively with the existing workflow tooling, requires no infrastructure management, and allowed the system to be built, tested, and deployed in a single sprint.

**Why three prompts instead of one?**
Separation of concerns. Classification and generation are distinct tasks with different failure modes. A single prompt trying to do both produces lower-quality outputs on each. Three focused prompts — classify, handle, brief — each do one thing well.

**Why confidence scoring on classification?**
Models are often confidently wrong. By requiring the system to surface its own uncertainty, you create a forcing function that catches edge cases before they ship. A low-confidence high-touch request handled autonomously is the failure mode this prevents.

**Why structured escalation briefs instead of raw escalation?**
Raw escalation ("this needs human review") creates work. Structured briefs ("here's the context, recommendation, and next step") create leverage. The human reviewer spends 2 minutes confirming a recommendation rather than 20 minutes reconstructing context.

## Outcomes

- ~160 hours/year recaptured from manual triage
- Zero coverage gaps during planned leave periods — system handled intake autonomously
- Escalation rate decreased over time as classification accuracy improved with KB refinement

## Tech Stack

- Google Apps Script
- Gemini API
- Google Workspace (Sheets, Gmail, Drive for KB)

## What's Not In This Repo

The production system contains organization-specific KB content, stakeholder profiles, and communication templates that are internal and confidential. This repo documents the architecture, design decisions, and system design — not the production content layer.

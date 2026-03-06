# xGE Comms Triage Agent

## Agent Building Workshop — Knowledge & Process Documentation

Mitchell Williams  ·  xGE Program Manager & Comms Lead  ·  March 2026

---

## 1. Workshop Overview

The Agent Building Workshop is a self-directed Claude Project environment used to design, build, test, and iterate on AI agents that automate Google Workspace workflows. In the context of the Comms Triage Agent, the workshop served as the primary development partner — combining a persistent knowledge base of xGE communications standards with iterative prompt engineering, live code development, and QA cycles.

The workshop was structured around a rolling context of reference documents including intake form design rationale, audience profiles for L8+ ICs and VPs, triage classification logic, and output quality standards. Each session advanced a discrete phase of the agent: scoping, architecture, code generation, optimization, and handoff.

**Goal**

Automate the intake, triage, and draft generation workflow for xGE internal communications requests — reducing response latency and freeing senior comms capacity for high-touch work.

## 2. Collaborative Process

Development followed a human-in-the-loop methodology with clear decision ownership. Mitchell retained final authority on all design choices; the workshop served as a technical and strategic sounding board. The collaboration pattern consisted of three recurring loops:

- **Scoping loops** — open-ended prompts exploring trade-offs in feature design, triage logic thresholds, and output format decisions.
- **Code generation loops** — precise, context-heavy prompts producing Google Apps Script code with rationale for each implementation choice.
- **Validation loops** — test runs against form submissions with QA checks on triage accuracy, email output quality, and escalation behavior.

A strict no-hallucination constraint governed all sessions: any unknown field was marked [PLACEHOLDER] rather than inferred. This ensured every code push was auditable before deployment to production.

## 3. Key Contributions

**Mitchell Williams — Product Owner & Builder**

- Defined all business requirements, triage rules, and audience profiles from lived xGE context.
- Wrote and deployed all Google Apps Script code generated in sessions.
- Managed all Google Workspace integrations (Forms, Sheets, Drive, Gmail, Chat).
- Made all final decisions on escalation logic, output format, and edge case handling.

**Agent Building Workshop (Claude Project)**

- Maintained persistent context across all sessions via knowledge base files and system prompt.
- Generated production-ready Apps Script code across all agent phases.
- Proposed and refined the triage criteria framework, escalation doc structure, and [VP_NAME]-trigger logic.
- Surfaced edge cases and failure modes proactively during design review.

## 4. Technical Specifications

**Platform**

Google Apps Script (V8 runtime) with Gemini 2.5 Flash API for AI classification and draft generation.

**Core Architecture**

| Component | Description |
|---|---|
| Intake Layer | 11-field Google Form → Google Sheet (ID: [REDACTED_SHEET_ID]) |
| Classification Engine | Gemini API evaluates request context against TRIAGE_CRITERIA.md logic to assign Low, Medium, or High Touch designation |
| Output Layer | Google Drive folder (ID: [REDACTED_DRIVE_ID]) for all generated documents |
| Notification Layer | Gmail for requester communications; Google Chat webhook for escalation pings |

**Touch Level Behavior**

| Touch Level | Behavior |
|---|---|
| Low Touch | Agent creates Email Draft Doc in output folder, emails requester. Silent completion — no Chat ping. |
| Medium/High Touch | Agent creates Escalation Starter Doc, pings Chat Space webhook, emails requester with 'escalated' notice, and directly emails [ESCALATION_OWNER] (PM cover). |
| [VP_NAME] Trigger | Any mention of '[VP_NAME]' anywhere in the form is an automatic High Touch override — absolute, non-negotiable. |

**Triggers**

- `onFormSubmit` — fires on every new intake form submission
- `sendFridayDigest` — weekly digest trigger (bypass mode paused as of v1 launch)

**Design Rule**

The agent determines touch level — users never self-classify. This prevents gaming and ensures consistent standards application.

## 5. Integration with Other Systems

| Integration | Role in Agent | Why Chosen |
|---|---|---|
| Google Forms | Intake collection — 11 structured fields | Native GWS; no auth friction for internal users |
| Google Sheets | Persistent data store + trigger source | onFormSubmit trigger; readable audit trail |
| Google Drive | Output document storage | Native sharing model; easy reviewer access |
| Gmail (Apps Script) | Requester notification emails | Sent as 'xGE Communications' — users don't see AI |
| Google Chat Webhook | Real-time escalation ping to team space | Low-friction alert; no additional auth needed |
| Gemini 2.5 Flash API | Classification engine + draft generation | Google-native; fastest Flash tier for latency SLA |

## 6. Challenges and Resolutions

**Challenge: Triage accuracy on ambiguous requests**

Early versions struggled to correctly classify requests that used vague language or mixed signals (e.g., a routine announcement mentioning an exec). Resolution: Introduced TRIAGE_CRITERIA.md as an injected knowledge base rather than inline prompt rules, giving Gemini structured, versioned criteria to evaluate against. [VP_NAME] auto-escalation added as an absolute override layer.

**Challenge: Over-formatting in Email Draft Docs**

Generated docs were bolding nearly everything, reducing readability. Resolution: Added explicit Smart Brevity formatting rules directly into the draft generation prompt, with heading style constraints and a prohibition on excessive bold usage.

**Challenge: Surgery deadline / incomplete features**

A medical leave created a hard cutoff before all optimizations were complete. Resolution: A phased completion plan was established with [ESCALATION_OWNER] (PM cover) taking over live monitoring. The agent was deployed in a tested-but-incomplete state with a clear Phase 2 backlog documented for post-recovery work.

**Challenge: Corporate machine restrictions**

The inability to upload files directly to Claude on a corp machine required a workaround. Resolution: All knowledge base content was pre-loaded into the Claude Project system prompt, eliminating the need for per-session uploads.

## 7. Lessons Learned

- **Inject, don't inline** — Moving classification logic, audience profiles, and output standards into discrete knowledge base files (rather than prompt text) improved reliability and made updates trivial.
- **Absolute overrides beat probabilistic logic** — The [VP_NAME] trigger taught a key lesson: for high-stakes edge cases, a deterministic rule outperforms any model judgment. Name-match = escalate, full stop.
- **Silence is a feature** — Designing Low Touch as a 'silent' completion (no Chat ping) reduced notification fatigue significantly. Teams don't need to know about routine completions.
- **Persona separation matters** — Sending emails from 'xGE Communications' rather than a personal address improved trust and response rates, while keeping the AI layer invisible to end users.
- **Build to the deadline** — Scoping for a hard surgery cutoff forced ruthless prioritization. The Phase 1 / Phase 2 separation was more valuable than a perfect v1.

## 8. Future Development Goals

**Phase 2 Backlog (Post-Recovery)**

- **[VP_NAME] Gem integration** — When a request involves [VP_NAME], auto-inject a copy-paste prompt for the '[VP_NAME] Exec Comms Gem' configuration into the Escalation Starter Doc.
- **Full knowledge base injection** — Inject complete SMART_BREVITY_RULES into revision prompt and full AUDIENCE_PROFILES into escalation prompt dynamically per request.
- **Friday Digest activation** — Resume sendFridayDigest trigger with a curated weekly summary of all completed requests.
- **Medium Touch refinement** — Develop distinct Medium Touch handling that sits between silent Low and full escalation.

**Longer-Term Vision**

- Migrate from Apps Script to a more scalable backend (Cloud Functions or Cloud Run) as request volume grows.
- Explore internal Google Workspace APIs ([INTERNAL_DOCS], [INTERNAL_KB], calendar events) for richer context in escalation docs.
- Build a self-service status dashboard for requesters to track their submission through the pipeline.

## 9. Documentation and Resources

| Document | Purpose |
|---|---|
| Agent_Build_Quick_Reference.md | Build methodology and session startup guide |
| Agent_Building_Research_Digest.md | Best practices aggregated from agent design research |
| TRIAGE_CRITERIA.md | Authoritative classification logic for Low / Medium / High Touch |
| AUDIENCE_PROFILES_Technical_Leadership.md | L8+ IC and VP communication preferences for draft generation |
| Internal_Comms_Agent_Scope.md | Original scope document; source of truth for feature boundaries |
| Engagement_Summary_Reference_and_Quality_Standards.md | Output format standards for all agent-generated documents |
| Intake_Form_Optimization_Recommendations.md | Form design rationale and field-by-field annotation |

All files are maintained in the Agent Building Workshop Claude Project and should be updated whenever triage logic, audience profiles, or output standards change. The Project system prompt serves as the single source of truth for agent behavior.

---

xGE Office of [CROSS_ORG_ENGINEERING]  ·  Internal Document

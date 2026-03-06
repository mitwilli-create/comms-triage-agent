Agent Scope Document: Internal Comms Triage Agent
Status: ✅ Scoping Complete (Phase 0 Done) Ready for: Phase 1 — Knowledge Base Construction Deadline: Tuesday AM demo Build time remaining: ~10-12 hours across Sat-Sun


Overview
Problem: [Comms Lead] needs an agent to triage and handle internal communications requests while he recovers from surgery (Feb 5+), ensuring low-touch requests are handled autonomously while medium/high-touch requests are appropriately escalated.

User: [TEAM_NAME] teams submitting communications requests via intake form. These teams are:

	•	Not comms experts (need significant revision help)
	•	AI-skeptical (require rationale for every change)
	•	Critical consumers (must verify agent understanding before action)

Platform:

	•	Build architecture: LLM (portable)
	•	Deploy: Gemini API + Apps Script + Sheets/Forms/Chat

Deadline: Demo-ready Tuesday morning. Surgery Thursday 5:30 AM.


Inputs
Trigger: intake form submission → Apps Script ping to Chat

Data received:

	•	Requester name/contact
	•	Request type (email draft, announcement, newsletter, slide deck, event description, etc.)
	•	Target audience
	•	Timeline/urgency
	•	Attached materials (raw content to be revised)
	•	Project context


Processing
Triage Logic (Touch-Level Determination)
Agent classifies requests into three levels based on:

Factor
Low Touch
Medium Touch
High Touch
Scope
Internal to [TEAM_NAME]
Cross-org
Org-wide or external
Audience
Small/targeted
Medium
Large/VP+
Timeline
Flexible
Moderate urgency
Urgent/high-stakes
ROI
Low-moderate
Moderate
High
Cost of failure
Minimal
Moderate
Significant
OKR alignment
Tangential
Supportive
Direct

Classification output: Low / Medium / High + confidence score + reasoning
Execution Paths
Touch Level
Agent Action
Low
Handle autonomously: Review materials, apply revisions, provide rationale, deliver output
Medium
Escalate to [ESCALATION_OWNER] with summary, classification reasoning, and recommended approach
High
Escalate to [ESCALATION_OWNER] with summary, classification reasoning, and recommended approach
Revision Rules (Low-Touch Execution)
The agent applies these transformation patterns:

	•	Tighten language — Remove corporate fluff, unnecessary words
	•	Smart brevity — Apply Axios-style principles
	•	Add TL;DR — Surface key message upfront
	•	Improve scannability — Break walls of text, use structure
	•	Surface CTA — Find buried asks and make them prominent
	•	Audience calibration — Optimize for engineering or VP-level readers
	•	Trim and restructure — Cut 30-50% of typical submissions

Critical: Every revision must include rationale explaining WHY the change was made.


Outputs
For Low-Touch (Autonomous Handling)
Format:

	•	Confirmation of understanding (verify before acting)
	•	Revised materials (document or inline)
	•	Revision rationale (every change explained)
	•	Delivery via email to requester

Delivery mechanism:

	•	Primary: Document in Chat interaction
	•	Backup: Email with attachment + rationale
For Medium/High-Touch (Escalation)
Format:

	•	Touch-level classification + confidence
	•	Classification reasoning (which factors drove the decision)
	•	Request summary
	•	Recommended next steps for [ESCALATION_OWNER]
	•	Notification to requester that escalation occurred

Delivery: Notification to [ESCALATION_OWNER] via Chat/Email


Confirmation Protocol
Critical requirement: Agent must verify understanding before taking action.

Before executing revisions:

	•	Summarize understanding of the request
	•	Confirm target audience
	•	Confirm desired outcome
	•	Ask: "Is my understanding correct? Reply YES to proceed."

Only execute after explicit confirmation.


Success Criteria
	•	Correctly classifies touch level 90%+ of the time
	•	Low-touch revisions improve readability (measurable: word count reduction, structure addition)
	•	Every revision includes clear rationale
	•	No execution without confirmation
	•	Medium/high escalations reach [ESCALATION_OWNER] with actionable context
	•	Requesters trust the agent (no complaints about AI-generated nonsense)


Risks & Mitigations
Risk
Mitigation
Misclassifies high-touch as low
Conservative triage: when uncertain, escalate up
Revisions miss context
Confirmation protocol forces understanding check
AI-skeptical users reject output
Rationale requirement builds trust through transparency
Agent hallucinates org context
Knowledge base includes real org context; agent acknowledges limits
Edge cases not covered
Explicit "I'm not sure — escalating to human" fallback


Knowledge Base Requirements (Phase 1 Deliverables)
To Build on Personal (Portable):
	•	Triage Logic Document

	•	Decision criteria with weights
	•	Classification examples
	•	Uncertainty handling

	•	Revision Rules Document

	•	Smart brevity principles
	•	Editing patterns (before/after frameworks)
	•	Rationale templates

	•	Confirmation Workflow Document

	•	Verification questions
	•	Response parsing
	•	Proceed/clarify decision tree

	•	Audience Guide Document

	•	Engineering audience characteristics
	•	VP-level audience characteristics
	•	Tone/style differences

	•	Output Templates

	•	Low-touch revision delivery format
	•	Escalation notification format
	•	Rationale explanation format
To Plug In on Corp (Platform-Specific):
	•	[TEAM_NAME] style guides
	•	Org OKRs and mission
	•	Past revision examples (before/after)
	•	Client engagement summaries
	•	Real audience profiles


Build Sequence
Session
Focus
Hours
Sat AM
Knowledge base docs 1-3 (Triage, Revision, Confirmation)
3-4
Sat PM
Knowledge base docs 4-5 (Audience, Templates) + Prompt architecture
3-4
Sun AM
Port to Gemini, plug in corp docs, wire Apps Script
3-4
Sun PM
End-to-end testing, edge cases, refinement
2-3
Mon
Buffer for fixes, demo prep
As needed


Next Step
Phase 1, Deliverable 1: Build TRIAGE_LOGIC.md

Start with: "Let's build the triage logic document"


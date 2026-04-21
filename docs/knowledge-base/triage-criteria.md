Triage Criteria — Internal Comms Agent
Purpose: Classify incoming requests into Low, Medium, or High touch levels Owner: [OWNER_NAME], Communications Lead, [TEAM_NAME] Agent Behavior: Assess factors, assign level + confidence score, route accordingly


Touch Level Definitions
Low Touch
What it is: Async revision work with rationale. No meeting required.

Agent action: Handle autonomously — review materials, apply revisions, provide rationale for every change, deliver via email/doc.

Typical requests:

	•	Email draft review
	•	Announcement copy edit
	•	Newsletter optimization
	•	Bug template communication
	•	Quick formatting/structure fixes

Turnaround: Same-day or next-day


Medium Touch
What it is: Strategic guidance requiring research and playbook creation. Consultation recommended.

Agent action: Escalate to [ESCALATION_OWNER] with summary, classification reasoning, and recommended approach.

Typical deliverables:

	•	Comms strategy document
	•	Step-by-step playbook with rationale for each step
	•	Templates for initiate/sustain/close phases
	•	Consultation meeting to walk through approach

Turnaround: 3-5 business days


High Touch
What it is: Full partnership through execution. Multiple touchpoints, comprehensive support.

Agent action: Escalate to [ESCALATION_OWNER] with summary, classification reasoning, and recommended approach.

Typical deliverables:

	•	In-depth discovery conversation
	•	Full comms strategy and execution plan
	•	All materials created and refined
	•	Support through execution (not just handoff)
	•	Metrics tracking throughout
	•	Post-project hero story draft

Turnaround: 1-4 weeks depending on scope


Classification Factors
Assess each factor. More factors pointing toward High = Higher touch level.

Factor
Low Touch
Medium Touch
High Touch
Scope
Internal to [TEAM_NAME] only
Cross-org (multiple teams)
Org-wide or external-facing
Audience Size
Small/targeted (<50)
Medium (50-500)
Large (500+) or VP+ visibility
Audience Type
Peers, immediate team
Cross-functional partners
Senior leadership, external stakeholders
Timeline
Flexible (1+ weeks)
Moderate (3-7 days)
Urgent (<3 days) or high-stakes deadline
ROI
Low-moderate impact
Moderate business impact
High strategic value
Cost of Failure
Minimal (can recover easily)
Moderate (visible mistake)
Significant (reputation, relationships, OKRs)
OKR Alignment
Tangential or nice-to-have
Supports key objectives
Directly tied to org OKRs/mission


Classification Logic
Step 1: Count Factor Indicators
For each factor, mark whether it indicates L (Low), M (Medium), or H (High).
Step 2: Apply Weighted Decision
Result
Classification
Majority L, no H indicators
Low Touch
Mix of L and M, no H indicators
Low Touch (default down)
Majority M, or any single H indicator
Medium Touch
2+ H indicators, or any "org-wide/external" scope
High Touch
Step 3: Confidence Scoring
Confidence
Meaning
90-100%
Clear classification, factors align
70-89%
Likely correct, 1-2 ambiguous factors
50-69%
Uncertain, recommend human review
<50%
Cannot classify, escalate immediately

Rule: When confidence is <70%, escalate regardless of classification.


Classification Examples
Example 1: Low Touch
Request: "Can you review this email announcing our team's new office hours?"

Factor Assessment:

	•	Scope: Internal to [TEAM_NAME] → L
	•	Audience: Immediate team (~30 people) → L
	•	Timeline: Flexible, next week → L
	•	ROI: Low (informational) → L
	•	Cost of failure: Minimal → L
	•	OKR alignment: Tangential → L

Classification: Low Touch Confidence: 95% Action: Agent handles autonomously


Example 2: Medium Touch
Request: "We're launching a new mentorship program and need help with the comms rollout strategy."

Factor Assessment:

	•	Scope: Cross-org (multiple [TEAM_NAME] teams) → M
	•	Audience: ~200 engineers → M
	•	Timeline: 2 weeks → M
	•	ROI: Moderate (program success depends on participation) → M
	•	Cost of failure: Moderate (low signup = program failure) → M
	•	OKR alignment: Supports career development OKR → M

Classification: Medium Touch Confidence: 90% Action: Escalate to [ESCALATION_OWNER] with playbook recommendation


Example 3: High Touch
Request: "We need to announce the org restructure to all of [TEAM_NAME] and communicate changes to partner teams."

Factor Assessment:

	•	Scope: Org-wide + external partners → H
	•	Audience: 1,000+ engineers + external → H
	•	Timeline: Sensitive, must coordinate timing → H
	•	ROI: High (affects morale, clarity, productivity) → H
	•	Cost of failure: Significant (confusion, attrition risk) → H
	•	OKR alignment: Directly tied to org health → H

Classification: High Touch Confidence: 98% Action: Escalate to [ESCALATION_OWNER] immediately


Example 4: Edge Case (Escalate for Clarity)
Request: "I need help with an email to a VP about our project status."

Factor Assessment:

	•	Scope: Internal → L
	•	Audience: Single VP → Could be L (one person) or H (VP visibility)
	•	Timeline: Not specified → Unknown
	•	ROI: Unknown
	•	Cost of failure: Potentially high (VP impression) → M or H
	•	OKR alignment: Unknown

Classification: Medium Touch (default up due to VP audience) Confidence: 65% Action: Escalate to [ESCALATION_OWNER]; agent should ask clarifying questions first


Edge Cases and Special Rules
Always Escalate to Medium or Higher
	•	Any request involving VP+ audience
	•	Any request with external-facing component
	•	Any request tied to sensitive topics (reorgs, layoffs, performance)
	•	Any request where requester explicitly asks for strategy help
Always Classify as Low (Unless Other Factors Override)
	•	Routine announcements to standing audiences
	•	Template-based requests (bug comms, status updates)
	•	Revisions to existing materials (not net-new strategy)
When Uncertain
	•	Ask clarifying questions about scope and audience
	•	If still uncertain, default UP one level
	•	If confidence <70%, escalate regardless


Agent Verification Prompt
Before classifying, the agent should confirm understanding:

I've reviewed your request. Here's my understanding:

- **Request type:** [what they're asking for]
- **Target audience:** [who will receive this]
- **Scope:** [internal/cross-org/external]
- **Timeline:** [when they need it]

Based on this, I'm classifying this as [LEVEL] touch.

Is my understanding correct? If anything is different, please let me know and I'll re-assess.


Escalation Format
When escalating Medium or High touch requests to [ESCALATION_OWNER]:

**New Request — [LEVEL] Touch**

**Requester:** [Name, team]
**Request:** [One-sentence summary]

**Classification Reasoning:**
- Scope: [assessment]
- Audience: [assessment]
- Timeline: [assessment]  
- Key factors: [what drove the classification]

**Confidence:** [X]%

**Recommended Approach:** [Brief suggestion for how to handle]

**Requester notified:** [Yes/No — that escalation occurred]


Refinement Notes
To validate on Sunday against corp docs:

	•	Confirm audience size thresholds match org norms
	•	Add real past examples from intake form
	•	Verify OKR alignment criteria against current OKRs
	•	Check if any request types always fall into specific buckets


Version History
Date
Change
Jan 31, 2026
Initial draft from memory
[Sunday]
Validated against corp docs


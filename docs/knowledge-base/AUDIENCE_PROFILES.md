Audience Profiles — Internal Comms Agent Knowledge Base
Source: Grok research synthesis (X, Reddit, HN, GitHub, staffeng.com) Audience: [TEAM_NAME] (L8+ Principal Engineers, Distinguished Engineers, [CORP_NAME] Fellows) Purpose: Guide revision style based on who will READ the communication


Part 0: Audience Detection (Agent Logic)
How to Identify Audience from Form Data
The agent receives a "Target Audience" field from the intake form. Use these signals:

Form Input Contains...
Classify As
Apply Profile
"VP", "Director", "leadership", "exec", "SVP", "C-level"
VP/Director
Part 2 rules
"L8", "Principal", "Staff", "Distinguished", "Fellow", "DE", "senior IC"
Senior IC
Part 1 rules
"team", "engineers", "ICs", "org", "all-hands"
Mixed/General
Universal rules
"cross-org", "cross-functional", "other teams", "partner teams"
Cross-Org
Part 1 + extra context
"external", "partners", "vendors", "customers"
External
ESCALATE — do not revise autonomously
Triage Impact by Audience
Audience affects touch-level classification:

Audience
Touch Level Modifier
VP+ / Director
+1 level (Low → Medium, Medium → High)
External / Public
Automatic High (escalate to [ESCALATION_OWNER])
Cross-org
+1 level if scope is large
Internal team only
No modifier

Example: A "Low touch" email draft becomes "Medium touch" if the target audience is VP+.


Part 1: Senior IC Preferences (Staff+/Principal/Distinguished)
How They Want to Receive Information
Preference
Details
Format
Written docs (documents, design docs, strategy docs) — "documents is my IDE"
Length
Dense but focused; comprehensive for review but not verbose
Detail
Technical depth appreciated, but with clear "so what"
Frequency
Frequent simple updates > big occasional announcements
Autonomy
"I don't assign tasks, I assign missions" — high-level goals, not prescriptive steps
What Makes Them Engage
	•	High signal-to-noise ratio — Dense information, zero fluff
	•	Long-term systemic impact — They care about 5+ year horizons
	•	Technical precision — Accuracy matters; they'll spot errors
	•	Direct feedback loops — No intermediaries diluting the signal
	•	Clear ownership — Who decides what, and when
	•	Knowledge sharing — Updates that teach, not just inform
What Makes Them Ignore/Delete
	•	Corporate speak — "Learnings," "alignments," "ideations," "synergies"
	•	Buried asks — CTA in paragraph 4 of a wall of text
	•	Intermediary dilution — "Adding a PM in the middle causes loss in translation"
	•	Spotlight-chasing — Updates that exist for visibility, not value
	•	Over-explanation demands — Assuming they need everything spelled out
	•	Performative closers — "Let me know if you have any questions!"
Pet Peeves (Direct Quotes from Research)
"Distinguished engineers know less than you think." — They don't need to deeply engage every query

"Information density (signal to noise)" — Concise, dense, flowing narrative

"The (lack of) knowledge sharing bit is my ultimate workplace pet peeve." — Share insights, don't hoard

"Annoying obligatory, performative ending questions or offers of further assistance" — Skip the fluff


Part 2: VP/Director Preferences (Engineering Leadership)
The BLUF Imperative
BLUF = Bottom Line Up Front

VPs don't read chronologically. They read:

	•	What's the decision/recommendation?
	•	What are the risks?
	•	What do you need from me?

...then MAYBE the supporting details.
BLUF Email Template
BLUF: [One-sentence recommendation/ask + deadline if applicable]

Context: [2-3 sentences on why this matters now]

Options:
1. [Option A] — [tradeoff]
2. [Option B] — [tradeoff]  
3. [Option C] — [tradeoff]

Recommendation: [Your pick and why]

Decision needed: [What you need from them, by when]
Example BLUF Email
Before (gets skipped):

"Hi, I wanted to reach out about something that's been on my mind. As you may know, our customer has been using our hardware for two generations now. They recently expressed interest in some ABC features that aren't currently available unless we update the XYZ driver. I was wondering if your team might have some bandwidth in the next sprint to support this work, since we risk losing them to competition..."

After (gets read):

"BLUF: Requesting resources to update XYZ driver in the next sprint, or we risk losing [Customer] to competition.

Our customer is interested in ABC features requiring this update. They've been our hardware partner for two generations. Can your team support a 2-week sprint starting [date]?"
Decision-Framing Structure (5 Parts)
	•	Context — What's happening, what triggered this, who's affected
	•	Risks — Technical, customer, operational, timeline (naming risks shows depth)
	•	Options — At least 3 (avoid "just ship it" single-path)
	•	Recommendation — Your pick for system stability, not single feature
	•	Decision Needed — Who decides, what call, by when
What VPs Read vs. Skip
They Read
They Skip
First sentence of each section
Chronological narratives
Bullet summaries
Walls of text
Risk/impact statements
Background you assume they need
Clear asks with deadlines
Vague "thoughts?" requests
Numbers/metrics
Qualitative fluff
Options with tradeoffs
Single recommendations without alternatives


Part 3: Anti-Patterns (What to NEVER Do)
Corporate Speak Decoder (Instant Delete Triggers)
They See
They Think
Replace With
"Let's circle back"
"We'll never speak of this again"
"Let's revisit on [date]"
"Per my last email"
"Try reading, for once"
[Just restate the point]
"Challenging landscape"
"We're failing"
"We're behind on X"
"Digital transformation"
"Buzzword bingo"
[Specific initiative name]
"Low hanging fruit"
"Easy win I want credit for"
"Quick win" or "Easy fix"
"Learnings"
Pretentious nominalization
"Lessons"
"Asks"
Pretentious nominalization
"Requests"
"Ideations"
Pretentious nominalization
"Ideas"
"Alignments"
Pretentious nominalization
"Agreements"
Apple Pie Positions (Non-Committal Waste of Time)
Statements that sound agreeable but add zero value:

	•	"We need to define the success metrics"
	•	"Do you have data to back that up?" (when data is impossible)
	•	"We need more scalable team processes"
	•	"We have too many meetings"
	•	"We need better internal documentation!"
	•	"We need an offsite to align"
	•	"Let's post-mortem this" (should have pre-mortemed)

Why they fail: Safe statements that elevate the speaker while burying real decisions.
Wall of Text Failure Mode
Bad technical announcement pattern:

	•	Dense paragraph of technical details
	•	Mixed with excuses
	•	Incomplete explanations
	•	Abrupt shift to unrelated future vision
	•	No clear CTA or accountability

Why it fails: Buries accountability in jargon without actionable next steps.


Part 4: Frameworks That Work
The "Communicate Immediately" Framework
Assume you'll be interrupted. Structure everything so the reader gets value even if they stop after:

	•	One line — Title/subject as complete sentence ("Technique X improves Metric Y by 3%")
	•	One paragraph — First para = full core message, conclusion first
	•	Fractal organization — Condensed → detail, can stop at any level
The 5-15 Update Format
For regular status updates to leadership:

	•	5 minutes to read
	•	15 minutes or less to write
	•	Cover: priorities, concerns, alignment signals
	•	Scannable, no fluff
	•	Weekly cadence maintains visibility without meetings
RFC/Proposal Structure
For substantial changes or proposals:

# [Title]

## Summary
[One sentence: what and why]

## Motivation  
[Problem, user impact, why now]

## Guide-Level Explanation
[High-level approach for non-experts]

## Detailed Design
[Spec, data models, API changes]

## Tradeoffs & Alternatives
[What you considered, why this approach]

## Rollout & Testing
[How you'll validate and deploy]

## Open Questions
[What you're still figuring out]


Part 5: [CORP_NAME]-Specific Context (L7+ / [TEAM_NAME])
What Works at the organization Scale
"At a company of our scale, Staff also means a lot of coordination (read: meetings, docs, and emails)."

"documents is my IDE" — For strategy, values, design docs, advocacy

"Written communication scales your own impact" — Invest in writing skills
L7+ Reality
	•	Shift from coding to comms — "What got you here won't get you there"
	•	5+ year horizons — They think in systems, not sprints
	•	Doc-heavy environment — Writing skill = career skill
	•	Cross-org coordination — They connect teams that don't know they should connect
	•	Frequent simple > occasional big — For visibility and alignment
What Gets Ignored at the organization
	•	Email overload — Volume makes filtering brutal
	•	Duplicate announcements — Multiple teams saying similar things
	•	External/mismatched formats — Stick to internal tool norms
	•	Low-clarity writing — Ambiguity = delete


Part 6: Revision Rules for the Agent
When Revising for Senior ICs (L8+ Engineers)
DO:

	•	Increase information density (more signal per sentence)
	•	Add TL;DR at top if missing
	•	Surface technical accuracy concerns
	•	Include "so what" / implications
	•	Respect their expertise (don't over-explain basics)
	•	Enable async consumption (scannable structure)

DON'T:

	•	Add corporate speak
	•	Pad with unnecessary context
	•	Bury the key information
	•	Use performative closers
	•	Assume they need hand-holding
When Revising for VPs/Directors
DO:

	•	Apply BLUF (recommendation + risk + ask first)
	•	Structure as options with tradeoffs
	•	Include clear decision needed + deadline
	•	Use numbers/metrics where possible
	•	Keep to one page or less

DON'T:

	•	Tell the story chronologically
	•	Include details they don't need to decide
	•	Hedge without recommendation
	•	Use passive voice for accountability
	•	Send without clear CTA
Universal Revisions (All Audiences)
ALWAYS:

	•	Cut corporate speak ("learnings" → "lessons", "asks" → "requests")
	•	Surface buried CTAs to the top
	•	Break walls of text into scannable chunks
	•	Remove performative closers
	•	Ensure every paragraph earns its place

NEVER:

	•	Add fluff for length
	•	Use nominalized verbs (ideation, solutioning, alignment)
	•	Leave ambiguous ownership
	•	Assume context they don't have
	•	Send without clear next step


Part 7: Audience-Specific Rationale Templates
When explaining edits, reference the audience explicitly:
For Senior IC Audiences
Edit Type
Rationale Template
Increased density
"Condensed to increase signal-to-noise ratio — senior ICs prefer dense, scannable content."
Removed over-explanation
"Cut background your L8+ audience already knows."
Added TL;DR
"Added summary at top for async reading — engineers can stop when they have enough."
Cut corporate speak
"Replaced '[jargon]' with '[plain term]' — senior ICs delete emails with corporate buzzwords."
Removed performative closer
"Cut 'Let me know if you have questions' — senior engineers find this performative."
Added 'so what'
"Added implications section — L8+ readers want to know systemic impact."
For VP/Director Audiences
Edit Type
Rationale Template
Applied BLUF
"Moved recommendation to first line — VPs read bottom-line first, details second."
Added options
"Restructured as options with tradeoffs — leadership prefers choices over single recommendations."
Added deadline
"Made the ask explicit with a deadline — VPs skip vague requests."
Cut chronological setup
"Removed backstory — VP audiences want the decision point, not the journey."
Added metrics
"Added specific numbers — leadership trusts quantified impact over qualitative claims."
Shortened to one page
"Compressed to one page — VP attention budget is ~60 seconds per email."
For Mixed/Cross-Org Audiences
Edit Type
Rationale Template
Added context
"Added brief context since cross-org readers may not share your team's background."
Clarified ownership
"Made team responsibilities explicit — cross-functional readers need to know who owns what."
Removed jargon
"Replaced team-specific terms with plain language for broader audience."
Added layered structure
"Organized with headers so different readers can find their relevant section."


Quick Reference: Audience Decision Matrix
If Audience Is...
Lead With...
Format As...
Avoid...
L8+ IC (Principal/DE)
Impact + technical substance
Dense doc, TL;DR top
Over-explanation, corporate speak
VP/Director
BLUF + decision needed
Options + recommendation
Chronological narrative, hedging
Mixed/Unknown
TL;DR + layered detail
Scannable with headers
Jargon without explanation
Cross-org
Context + "so what"
Clear ownership per team
Assuming shared context
External
ESCALATE
—
Autonomous revision


Quick Reference: Triage Modifiers
Audience Signal
Triage Adjustment
VP+ mentioned
Bump up one level
External/public
Automatic High touch
Large cross-org
Bump up one level
Single internal team
No change


Sources
	•	staffeng.com ([PERSON_NAME], Principal Engineer)
	•	Staff+ engineer posts (Jaana Dogan, Thiago Ghisi, Simon Smith)
	•	Communication guides (Craig Atkinson, Hasnain Lakhani, Chelsea Troy)
	•	GitHub: how-engineering-communicates, [ORG]/styleguide, RFC templates
	•	Hacker News threads on corporate speak and communication failures
	•	X threads on executive communication patterns


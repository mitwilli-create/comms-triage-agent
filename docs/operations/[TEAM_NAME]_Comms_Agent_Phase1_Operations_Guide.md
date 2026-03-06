# [TEAM_NAME] Comms Agent — Phase 1 Operations Guide

**For:** [ESCALATION_OWNER] (Primary), [BACKUP_OPERATOR] (Backup)  
**Coverage Period:** February 5 – March 5, 2026 ([OWNER_NAME]'s Medical Leave)  
**Version:** 1.3  
**Last Updated:** February 1, 2026

---

## Quick Reference Card

| Situation | Action |
|-----------|--------|
| 🔴 HIGH TOUCH email arrives | Open Starter Doc → Follow checklist → Run engagement summary if needed |
| 🔶 MEDIUM TOUCH email arrives | Open Starter Doc → Assess complexity → Execute or delegate |
| ✅ LOW TOUCH (auto-handled) | No action needed — agent completed it |
| 🚨 Agent error ping in Chat | Check logs → Restart if needed → Escalate to Anton if persistent |
| ❓ Requester replies with questions | Reply from [TEAM_NAME]-stratops@ as normal |
| 📊 Friday digest arrives | Review for patterns → No action needed |

---

## 1. What the Agent Does Automatically

### Low Touch Requests (55% of volume)
The agent handles these **without human intervention**:

1. **Receives** form submission
2. **Classifies** as Low Touch
3. **Retrieves** draft content from linked document
4. **Revises** applying Smart Brevity rules
5. **Creates** Email Draft Doc with rationale
6. **Emails** requester with link to their draft
7. **Logs** to tracking sheet
8. **Records** engagement summary

**You'll see:** Nothing (unless there's an error)

**Requester sees:** Email with link to their revised draft

### What Triggers Auto-Escalation

Even if a request looks simple, the agent escalates to you when:

| Trigger | Classification | Why |
|---------|---------------|-----|
| "[VP_NAME]" anywhere in request | HIGH TOUCH | [VP_NAME] Rule — always human review |
| VP or Director is audience | HIGH TOUCH | Executive comms need human judgment |
| "website", "site", "g3doc" mentioned | MEDIUM TOUCH | IA/structural decisions need human review |
| Can't access linked draft | MEDIUM TOUCH | Permission or link issue — needs follow-up |
| No content provided | MEDIUM TOUCH | Discovery needed |
| Confidence < 70% | MEDIUM TOUCH | Agent is uncertain |

---

## 2. What You Handle

### When Escalation Arrives

You'll receive:
1. **Email** from "[TEAM_NAME] Communications" with 🔴 or 🔶 prefix
2. **Chat Space ping** in [TEAM_NAME] Comms space
3. **Escalation Starter Doc** (link in email)

### Your Workflow

```
1. Open Escalation Starter Doc
   ↓
2. Review request context and classification reasoning
   ↓
3. If audience is unfamiliar L8+ → Run engagement summary (see Section 3)
   ↓
4. Draft content using outline provided
   ↓
5. Apply audience-specific guidance from Starter Doc
   ↓
6. Send draft to requester for feedback
   ↓
7. Iterate and deliver
   ↓
8. Update tracking sheet: Status → "Completed"
```

### Escalation Starter Doc Contents

Every Medium/High Touch escalation creates a doc containing:

| Section | Purpose |
|---------|---------|
| Request Overview | All form data in one place |
| Classification Reasoning | Why it was escalated |
| Original Request | Requester's exact words |
| Audience Profile | Communication preferences for this audience type |
| Recommended Approach | Step-by-step suggested workflow |
| Draft Outline | Starting structure for content |
| [VP_NAME] Gem Prompt | (If [VP_NAME] involved) Copy-paste prompt for [VP_NAME] Gem |
| Engagement Summary Check | Instructions to run engagement summary |
| Next Steps Checklist | Clickable checklist to track progress |

---

## 3. Running Engagement Summaries (Manual)

### When to Run One

Run an engagement summary when:
- Target audience is a specific L8+ individual you haven't worked with
- Request involves sensitive communication to leadership
- Requester mentions needing to "land the message" with someone specific
- Starter Doc flags "Engagement summary recommended: true"

### How to Run (Using LLM Extension)

**For an Individual team member:**

1. Install [INTERNAL_LINK] (Chrome extension) if not already
2. Navigate to the person's **[INTERNAL_DIRECTORY] profiles** ([INTERNAL_LINK]/[[EMPLOYEE_ID]])
3. Click the LLM Extension icon → **Pin this page**
4. Open a new LLM Extension chat
5. Paste this prompt:

```
Analyze this team member for a communications engagement strategy.

Search across their [INTERNAL_DIRECTORY] profiles, recent docs, presentations, and any visible org announcements. Focus on:

1. **Role & Strategic Position**: Title, team, what they're accountable for
2. **Communication Preferences**: How do they write? Async vs sync? Detail level?
3. **Current Priorities**: What are they working on now? What do they care about?
4. **Strategic Hooks**: What framing would resonate given their priorities?
5. **Tactical Do's and Don'ts**: Based on their style, what works/doesn't?

Output format:
- Header: Name, Role, Level
- Executive Engagement Strategy (2-3 sentences)
- Strategic Hooks (bullet list)
- Communication Intelligence (preferences, style)
- Tactical Do's and Don'ts (table format)

Exclude any artifacts older than January 2023.
```

6. Review the output → Use insights when drafting communication

**For a Group/Alias:**

1. Navigate to the **distribution list page** for the alias
2. Pin the page in LLM Extension
3. Paste this prompt:

```
Analyze this distribution list for a communications engagement strategy.

Search the group membership, recent threads, and any visible documentation about the group's purpose. Focus on:

1. **Group Mandate**: What is this group for? Who are the key stakeholders?
2. **Collective Priorities**: What topics dominate recent discussions?
3. **Communication Norms**: Formal vs informal? Pre-reads expected? How do decisions happen?
4. **Key Personas**: Who are the vocal/influential members?
5. **Strategic Do's and Don'ts**: What works for this group?

Output format:
- Header: Group Name, Mandate
- Group Engagement Strategy (2-3 sentences)  
- Key Stakeholder Personas (3-5 archetypes)
- Communication Intelligence
- Strategic Do's and Don'ts (table format)

Exclude artifacts older than 18 months.
```

6. Review the output → Apply to your communication strategy

### Where to Save Engagement Summaries

If you run an engagement summary, save it to:
```
[OUTPUT_FOLDER] / Client Engagement Summaries / [email_or_group].md
```

The agent checks this folder and will use it for future interactions.

---

## 4. [VP_NAME] Communications (HIGH TOUCH)

All [VP_NAME]-involved requests are HIGH TOUCH. The Starter Doc includes a **[VP_NAME] Gem Prompt**.

### Workflow for [VP_NAME] Comms

1. Open Starter Doc
2. Scroll to "🎯 [VP_NAME] Gem Prompt" section
3. Copy the entire prompt (background is highlighted)
4. Open the **[VP_NAME] Exec Comms Gem** ([INTERNAL_LINK] or your saved Gem)
5. Paste the prompt
6. Review Gem output against recent [VP_NAME] communications for voice consistency
7. **Before sending to [VP_NAME]:** Review with [COMMS_REVIEWER]
8. Iterate based on [VP_NAME]'s feedback
9. Coordinate timing and distribution

### [VP_NAME]'s Voice (Quick Reference)

- Direct but warm
- Data-driven with human context
- Strategic framing connecting to bigger picture
- Acknowledges complexity without hedging
- Celebrates wins without being boastful
- Forward-looking and action-oriented

---

## 5. Common Scenarios

### Scenario A: Draft Access Error

**You receive:** Email saying agent couldn't access requester's draft

**What happened:** Requester linked a doc the agent ([TEAM_NAME]-stratops@) can't open

**Action:**
1. Requester already received email explaining the issue
2. Wait for them to fix sharing and resubmit, OR
3. Ask them to copy/paste content directly to you

### Scenario B: Site/Website Request

**You receive:** MEDIUM TOUCH escalation for website content

**What happened:** Agent detected site-related keywords and escalated (can't make IA decisions)

**Action:**
1. Review Starter Doc for site-specific outline
2. Assess where content fits in existing site structure
3. Draft content following site style guide
4. Coordinate with relevant site owner before publishing

### Scenario C: Unclear Request

**You receive:** MEDIUM TOUCH with "Confidence: 65%"

**What happened:** Agent wasn't sure how to classify

**Action:**
1. Review Starter Doc for what confused the agent
2. Reply to requester asking clarifying questions
3. Once clear, proceed with appropriate workflow

### Scenario D: Request Bypasses Form

**You receive:** Chat ping saying someone emailed [TEAM_NAME]-stratops@ directly

**Action:**
1. Reply to sender: "Thanks for reaching out! To help us triage effectively, please submit via [INTERNAL_LINK]"
2. If urgent, process manually and encourage form use next time

---

## 6. Tracking Sheet Management

### Sheet Location
`[TRACKING_SHEET_ID]` — Tab: "Requests"

### Key Columns

| Column | What It Contains |
|--------|------------------|
| Touch Level | LOW / MEDIUM / HIGH (set by agent) |
| Status | "Completed", "Escalated - Medium", "Escalated - High" |
| Doc Link | Link to Email Draft Doc or Escalation Starter Doc |
| Processed | Timestamp when agent processed |

### Your Updates

When you complete an escalated request:
1. Change Status to "Completed"
2. Add final doc link if different from Starter Doc
3. Add notes in Additional Notes column if needed

---

## 7. Error Handling

### Agent Error Ping

**You receive:** 🚨 AGENT ERROR in Chat Space

**Action:**
1. Note the timestamp
2. Go to Apps Script project → View → Executions
3. Find the failed execution → View logs
4. Common fixes:
   - **Gemini API error**: Usually rate limit — will self-resolve
   - **Sheet error**: Check if columns shifted
   - **Permission error**: Check folder/sheet sharing
5. If unclear, note the error and escalate to Anton

### Manual Reprocessing

If agent missed a submission:
1. Find the row in tracking sheet
2. Note the form data
3. Process manually using the same workflow

---

## 8. Contact Escalation

| Issue | Contact |
|-------|---------|
| Agent technical issues | [BACKUP_OPERATOR] |
| Process questions | Check this guide first, then Anton |
| Capacity overflow | [COMMS_REVIEWER] (can redistribute) |
| Emergency (agent down) | Anton → then IT if needed |
| Post-leave feedback | [OWNER_NAME] (returns ~March 5) |

---

## 9. Quick Links

| Resource | Link |
|----------|------|
| Intake Form | [INTERNAL_LINK] |
| Tracking Sheet | [TRACKING_SHEET_ID] |
| Output Folder | [OUTPUT_FOLDER_ID] |
| LLM Extension | [INTERNAL_LINK] |
| [VP_NAME] Gem | [INTERNAL_LINK] |
| [TEAM_NAME] Approvals Guide | [INTERNAL_LINK] |
| Smart Brevity Reference | [Link to SMART_BREVITY_RULES.md] |

---

## 10. Weekly Rhythm

| Day | What Happens |
|-----|--------------|
| Monday–Thursday | Process escalations as they arrive |
| Friday 9-10 AM | Weekly digest arrives in Chat (automated) |
| Friday PM | Review digest, note any patterns |

---

## 11. Metrics to Review (For [OWNER_NAME]'s Return)

When [OWNER_NAME] returns from leave, these metrics will help assess agent performance and identify improvements.

### Key Metrics to Track

| Metric | Where to Find | Target |
|--------|---------------|--------|
| **Total requests** | Count rows in tracking sheet | Baseline data |
| **% Low Touch (auto-handled)** | COUNT(Touch Level = "LOW") / Total | 55%+ |
| **% Medium Touch** | COUNT(Touch Level = "MEDIUM") / Total | ~30% |
| **% High Touch** | COUNT(Touch Level = "HIGH") / Total | ~15% |
| **Escalation reasons** | Classification reasoning column | Pattern analysis |

### Weekly Digest Data

The Friday digest (automated) includes:
- Volume breakdown by touch level
- Completion vs. escalation counts
- Automation rate percentage

**Action:** Screenshot or save each Friday digest for [OWNER_NAME]'s review.

### Quality Signals to Note

During the leave period, keep a brief log of:

| Signal | What to Capture |
|--------|-----------------|
| **Misclassifications** | Requests routed incorrectly (should have been Low but escalated, or vice versa) |
| **Requester complaints** | Any feedback about revisions or process |
| **Edge cases** | Requests that didn't fit existing patterns |
| **Common request types** | Emerging patterns not in original triage criteria |

### How to Capture

Option A (Simple): Add notes to the tracking sheet's "Additional Notes" column

Option B (Better): Create a quick doc "[TEAM_NAME] Comms Agent — Leave Period Notes" with:
- Date
- Issue/observation
- How you handled it
- Recommendation for agent improvement

### What [OWNER_NAME] Will Do With This

1. **Tune triage criteria** — Adjust classification rules based on misclassifications
2. **Expand knowledge base** — Add new patterns, examples, audience profiles
3. **Optimize automation rate** — Identify requests that could be Low Touch with better prompting
4. **ROI calculation** — Compare time saved vs. manual processing

---

## Appendix: Agent Test Functions

If you need to verify agent is working:

1. Open Apps Script project
2. Run `testGeminiConnection()` — Should log "Success"
3. Run `testChatSpaceWebhook()` — Should ping Chat Space

If tests fail, check Script Properties are still configured.

---

**Questions during [OWNER_NAME]'s leave?**  
This guide should cover 95% of scenarios. For edge cases, use your judgment — you know [TEAM_NAME] comms better than the agent does.

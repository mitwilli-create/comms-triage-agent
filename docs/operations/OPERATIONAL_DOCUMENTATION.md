# [TEAM_NAME] Internal Comms Agent — Operational Documentation

**Version:** 1.0  
**Last Updated:** January 31, 2026  
**Coverage Period:** Feb 5 - Mar 5, 2026 ([OWNER_NAME]'s medical leave)

---

## PART 1: USER JOURNEY

### What Users Experience

Users interact with the intake form and receive emails from "[TEAM_NAME] Communications" — they don't know an AI agent is involved.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY                                   │
└─────────────────────────────────────────────────────────────────────────┘

STEP 1: USER SUBMITS REQUEST
┌─────────────────────────────────────────────────────────────────────────┐
│  User goes to [INTERNAL_LINK]                                       │
│  Fills out form:                                                         │
│  • Type of request                                                       │
│  • Subject/title                                                         │
│  • Summary (what, why, action needed)                                    │
│  • Target audience                                                       │
│  • Urgency/timeline                                                      │
│  • Link to draft (if any)                                               │
│  • Additional notes                                                      │
│                                                                          │
│  Clicks SUBMIT                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │     AGENT PROCESSING          │
                    │     (invisible to user)       │
                    │                               │
                    │  • Triage classification      │
                    │  • Route to Low/Med/High      │
                    │  • Execute or escalate        │
                    └───────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
        ┌───────────────────┐       ┌───────────────────┐
        │ routing =         │       │ routing =         │
        │ "revision_agent"  │       │ "escalation_agent"│
        └───────────────────┘       └───────────────────┘
                    │                           │
                    ▼                           ▼
        ┌───────────────────┐       ┌───────────────────┐
        │ handleLowTouch()  │       │ handleEscalation()│
        │ ├── Get content   │       │ ├── Format msg    │
        │ ├── Call Gemini   │       │ ├── Ping Chat     │
        │ ├── Create Doc    │       │ ├── Email user    │
        │ ├── Email user    │       │ └── Update sheet  │
        │ └── Update sheet  │       └───────────────────┘
        └───────────────────┘
                    │                           │
                    ▼                           ▼
        ┌───────────────────┐       ┌───────────────────┐
        │ USER RECEIVES:    │       │ [ESCALATION_OWNER] RECEIVES:  │
        │ Email with doc    │       │ Chat Space ping   │
        │ link from         │       │                   │
        │ "[TEAM_NAME] Comms"       │       │ USER RECEIVES:    │
        │                   │       │ "Routed for       │
        │ SHEET:            │       │ review" email     │
        │ Status=Completed  │       │                   │
        │ (no Chat ping)    │       │ SHEET:            │
        │                   │       │ Status=Escalated  │
        └───────────────────┘       └───────────────────┘
```

### What Users See at Each Step

**Form submission:** Standard intake form experience

**Low Touch email:**
```
From: [TEAM_NAME] Communications <[TEAM_EMAIL]>
Subject: Your revised draft is ready

Your revised email draft is ready.

📄 View and personalize: [LINK TO [CORP_NAME] DOC]

Summary: Tightened your Q1 update — key message now up front, 
reduced from 189 to 52 words. Add your greeting, sign-off, 
and recipients, then send.

Questions? Reply to this email.

───────────────────────────────────────
✅ READY TO SEND
Confidence: High | Audience: Matched | Revisions: Complete
```

**Medium/High Touch email:**
```
From: [TEAM_NAME] Communications <[TEAM_EMAIL]>
Subject: Your [TEAM_NAME] Comms request has been received

Thanks for your request, [NAME].

Status: Routed for review

Why: [Brief explanation without mentioning AI]

What's next: You'll hear back within 1-2 business days.

Reply to this email if you have additional context to add.

───────────────────────────────────────
🔴 ESCALATED TO [ESCALATION_OWNER]
Reason: [Brief reason]
```

---

## PART 2: [ESCALATION_OWNER]/STRATOPS EXPERIENCE GUIDE

### What [ESCALATION_OWNER] Sees

[ESCALATION_OWNER] monitors the "[TEAM_NAME] Comms Agent Notifications" Chat Space for pings.

**He does NOT get pinged for:**
- Low Touch completions (these happen silently)

**He DOES get pinged for:**
- Medium Touch escalations (🔶)
- High Touch escalations (🔴)
- Low confidence requests (⚠️)
- Errors (🚨)
- Bypass alerts (🚨)
- Friday digest (📊)

### Chat Space Message Examples

**Medium Touch:**
```
🔶 MEDIUM TOUCH — Needs [ESCALATION_OWNER]

Requester: Jane Smith
Request: Create comms plan for mentorship program launch
Why escalating: Strategy consultation + net-new content creation
Engagement summary: Not requested (broad internal audience)

Recommended approach: Schedule 30-min consultation to scope, 
then deliver framework/playbook.

📎 Sheet row: 42

───────────────────────────────────────
🔴 ESCALATED TO [ESCALATION_OWNER]
Reason: Medium Touch — strategy consultation
```

**High Touch:**
```
🔴 HIGH TOUCH — Priority for [ESCALATION_OWNER]

Requester: [COMMS_REVIEWER]
Request: Draft talking points for [VP_NAME]'s Q4 presentation
Why escalating: [VP_NAME] as speaker — automatic High Touch
Urgency: Dec 5
Engagement summary: Not requested (internal [TEAM_NAME] audience)

Key context:
- Executive comms — [VP_NAME] presenting to all of [TEAM_NAME]
- Need to gather Q4 wins to highlight

Recommended approach: Full partnership — gather wins, draft in 
[VP_NAME]'s voice, iterate with Kealan before [VP_NAME] review.

📎 Sheet row: 43

───────────────────────────────────────
🔴 ESCALATED TO [ESCALATION_OWNER]
Reason: High Touch — [VP_NAME] is speaker
```

### [ESCALATION_OWNER]'s Action Checklist

When he sees a ping:

1. **Check sheet row** — Click to see full request details
2. **Review recommended approach** — Use as starting point
3. **Contact requester** — Reply to their email or reach out directly
4. **Handle the request** — Execute based on touch level
5. **Update sheet status** — Change from "Escalated" to "In Progress" then "Completed"

### Sheet Status Values

| Status | Meaning |
|--------|---------|
| Pending | Just received, not yet processed |
| Completed | Low Touch — handled by agent |
| Escalated - Medium | Waiting for [ESCALATION_OWNER] action |
| Escalated - High | Priority — waiting for [ESCALATION_OWNER] action |
| Escalated - Low Confidence | Needs clarification |
| Flagged - Bypass | Intake was bypassed, needs redirect |
| In Progress | [ESCALATION_OWNER] is working on it |
| Done | [ESCALATION_OWNER] completed the request |

---

## PART 3: FRIDAY DIGEST FORMAT

Every Friday at 9am, the agent posts a weekly summary to Chat Space:

```
📊 [TEAM_NAME] Comms Agent — Weekly Digest
Week ending [DATE]

Volume:
- Total requests: 15
- Low Touch (auto-handled): 9
- Medium Touch (escalated): 4
- High Touch (escalated): 2

Outcomes:
- ✅ Completed: 9
- 🔶 Escalated (Medium): 4
- 🔴 Escalated (High): 2
- ⏳ Pending: 0

Automation rate: 60% handled without escalation

📎 Full details: [LINK TO SHEET]
```

---

## PART 4: CONFIGURATION CHECKLIST

### Script Properties Required

Set in: **File → Project Settings → Script Properties**

| Property | Value | How to Get |
|----------|-------|------------|
| `GEMINI_API_KEY` | Your API key | [[AI_PLATFORM]](https://[AI_PLATFORM_URL]) → Get API Key |
| `TRACKING_SHEET_ID` | Sheet ID | From URL: `[DOCS_URL]/spreadsheets/d/[THIS_PART]/edit` |
| `CHAT_SPACE_WEBHOOK` | Webhook URL | Chat Space → Manage webhooks → Create |
| `OUTPUT_FOLDER_ID` | Folder ID | From URL: `[DRIVE_URL]/drive/folders/[THIS_PART]` |

### Triggers to Set Up

| Trigger | Function | Type | Schedule |
|---------|----------|------|----------|
| Form submit | `onFormSubmit` | From form | On form submit |
| Friday digest | `sendFridayDigest` | Time-driven | Weekly, Friday, 9am |
| Bypass monitor | `checkForBypassEmails` | Time-driven | Hourly |

### Sheet Structure

Create a sheet tab called "Requests" with these columns:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Email | Team | Type | Subject | Summary | Audience | Urgency | Touch Level | Status | Doc Link | Processed |

### Form Field Mapping

Update `parseFormResponse()` in the Apps Script to match your exact form question titles:

```javascript
// Example — update these strings to match YOUR form
'Email Address'                    // → requester_email
'Your Name'                        // → requester_name
'Your Team/[TEAM_NAME] Workstream'         // → team
'Type of Request'                  // → request_type
'Subject/Title'                    // → subject
'Summary (What, Why, Action)'      // → summary
'Target Audience'                  // → target_audience
'Urgency/Timeline'                 // → urgency
'Who will send/distribute?'        // → sender
'Link to draft (if any)'           // → draft_link
'Additional notes'                 // → additional_notes
```

---

## PART 5: TESTING CHECKLIST

Before going live, run these tests:

### 1. API Connection Test
```
Run: testGeminiConnection()
Expected: Log shows "Gemini test successful"
```

### 2. Chat Space Test
```
Run: testChatSpaceWebhook()
Expected: Test message appears in Chat Space
```

### 3. Full Flow Test (Low Touch)
```
Run: testFormSubmission()
Expected: 
- Row added to sheet
- Touch level = LOW
- document created
- Status = Completed
- (Would send email in real run)
```

### 4. Manual Form Test (Low Touch)
```
Submit form with:
- Type: "Quick Review — Edit my existing draft"
- Subject: "Test Q1 Update"
- Summary: "Review my team update email"
- Audience: "[TEAM_NAME] team"
- Urgency: "Within 1 week"
- Notes: Include sample email text

Expected:
- Classified as Low Touch
- Email Draft Doc created
- Email received with doc link
- Sheet status = Completed
- NO Chat Space ping
```

### 5. Manual Form Test (High Touch — [VP_NAME])
```
Submit form with:
- Type: "Email Draft Review"
- Subject: "Survey Email"
- Summary: "Review before [VP_NAME] sends to DEs"
- Audience: "Distinguished Engineers"

Expected:
- Classified as High Touch ([VP_NAME] trigger)
- Chat Space ping received
- Email received saying "routed for review"
- Sheet status = Escalated - High
```

### 6. Friday Digest Test
```
Run: sendFridayDigest()
Expected: Digest message appears in Chat Space
```

---

## PART 6: TROUBLESHOOTING

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| "GEMINI_API_KEY not set" | Script property missing | Add to File → Project Settings → Script Properties |
| "Error accessing draft" | Doc permissions | Ensure agent has access or doc is shared |
| Form trigger not firing | Trigger not set up | Add trigger: Triggers → onFormSubmit → From form |
| Emails not sending | Gmail quotas | Check Apps Script quotas; reduce volume |
| Chat Space not receiving | Webhook invalid | Regenerate webhook in Chat Space settings |

### Logs

View logs at: **View → Logs** or **Executions** in Apps Script

Each run logs:
- Form data received
- Triage result (JSON)
- Touch level classification
- Doc URL (for Low Touch)
- Any errors

### Emergency Override

If the agent is misbehaving:
1. **Disable triggers** — Triggers → Delete all triggers
2. **Process manually** — Check sheet for pending requests
3. **Re-enable after fix** — Re-add triggers

---

## PART 7: POST-MVP IMPROVEMENTS

Ideas for future iterations:

1. **Structured audience field** — Dropdown instead of free text to enable To/CC pre-fill
2. **Engagement summary integration** — Auto-pull from engagement summary database
3. **Feedback loop** — Track requester satisfaction with revisions
4. **Metrics dashboard** — Visualize automation rate, response times
5. **Template library** — Pre-built Email Draft Docs for common request types
6. **Smart routing** — Learn from [ESCALATION_OWNER]'s corrections to improve triage

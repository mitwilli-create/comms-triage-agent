# Deployment Guide — xGE Internal Comms Triage Agent

**Version:** 1.0  
**Last Updated:** February 2026  
**Maintainer:** Communications Lead, xGE  
**Platform:** Google Apps Script + Gemini API + Google Workspace

---

## Overview

This guide covers deploying the xGE Internal Comms Triage Agent in a Google Workspace environment. The agent runs as a Google Apps Script project, triggered by Google Form submissions, and uses the Gemini API for AI-powered triage, revision, and escalation decisions.

**Architecture summary:**

```
Google Form → Apps Script Trigger → Gemini API (3-prompt chain) → Google Sheets Log → Gmail/Chat Delivery
```

---

## Prerequisites

### Access Requirements

| Resource | Required Permission | Purpose |
|----------|-------------------|---------|
| Google Apps Script | Editor on script project | Deploy and manage the agent |
| Google Forms | Owner of intake form | Receive form submissions |
| Google Sheets | Owner of response/log sheet | Read intake data, write status |
| Gmail | Send-as permission for alias | Deliver outputs to requesters |
| Google Chat | Bot/webhook permission | Post escalation notifications |
| Gemini API | Valid API key with quota | Power triage and revision prompts |

### Technical Requirements

- Google Workspace account (Business Standard or above recommended)
- Gemini API key (obtain via [Google AI Studio](https://aistudio.google.com))
- Basic familiarity with Google Apps Script editor
- Estimated quota: ~50–100 Gemini API calls/week for typical xGE volume

> **ES5 Compatibility Note:** Google Apps Script runs on the V8 engine but has quirks with certain modern JS syntax. This codebase is written to be fully ES5-compatible. Do not introduce arrow functions, `let`/`const` in loops, or template literals without testing.

---

## Environment Setup

### Step 1: Clone the Script Project

1. Open the Apps Script editor at [script.google.com](https://script.google.com)
2. Create a new project: **File → New Project**
3. Name it: `xGE Comms Triage Agent`
4. Copy all `.gs` files from this repository into the project:
   - `Code.gs` — Main trigger and orchestration logic
   - `Triage.gs` — Touch-level classification prompts
   - `Revision.gs` — Low-touch editing logic
   - `Escalation.gs` — Medium/High-touch routing logic
   - `Utils.gs` — Shared helper functions
   - `Config.gs` — Environment variables (see Step 3)

### Step 2: Link Google Workspace Resources

In `Config.gs`, set the following IDs. You can find Sheet and Form IDs in their respective URLs.

```javascript
var CONFIG = {
  INTAKE_FORM_ID:       'YOUR_FORM_ID_HERE',
  RESPONSE_SHEET_ID:    'YOUR_SHEET_ID_HERE',
  LOG_SHEET_TAB:        'Agent Log',
  ESCALATION_EMAIL:     'your-escalation-owner@domain.com',
  SENDER_ALIAS:         'xge-comms@domain.com',
  CHAT_WEBHOOK_URL:     'YOUR_GOOGLE_CHAT_WEBHOOK_URL',
  GEMINI_MODEL:         'gemini-1.5-pro',
  MAX_RETRIES:          3,
  RETRY_DELAY_MS:       2000
};
```

### Step 3: Store the Gemini API Key

**Never hardcode API keys in source files.** Use Script Properties:

1. In the Apps Script editor: **Project Settings → Script Properties**
2. Add a new property:
   - Key: `GEMINI_API_KEY`
   - Value: `[your API key]`
3. The codebase reads this via:

```javascript
var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
```

### Step 4: Set Up the Log Sheet

The agent writes a status record to Google Sheets for every request processed. Create a sheet tab named `Agent Log` with these column headers in row 1:

| Column | Header |
|--------|--------|
| A | Timestamp |
| B | Requester |
| C | Request Type |
| D | Touch Level |
| E | Confidence Score |
| F | Agent Action |
| G | Status |
| H | Notes |

---

## Deployment Steps

### Step 5: Install the Form Trigger

The agent fires when a new Form response is submitted. To install:

1. In the Apps Script editor, open `Code.gs`
2. Run the `installTrigger()` function manually once:
   - Click the function name in the toolbar
   - Click **Run**
3. Grant the required OAuth permissions when prompted
4. Verify in **Triggers** (clock icon in left sidebar) that a trigger appears:
   - Event source: **From form**
   - Event type: **On form submit**

> **Important:** Only one trigger should be active at a time. Check for duplicate triggers after re-deployment and delete extras.

### Step 6: Test with a Dry Run

Before going live, run the `testDryRun()` function in `Code.gs`. This simulates a form submission with a sample payload and logs output to the Apps Script console without sending any emails.

Expected dry run output:

```
[TRIAGE] Request classified: Low Touch (confidence: 92%)
[REVISION] Draft revised. Word count: 187 → 112.
[OUTPUT] Email composed. Ready to send.
[DRY RUN] No emails sent. Check revision output above.
```

### Step 7: Activate Live Mode

When dry run results look correct:

1. In `Config.gs`, set:

```javascript
var DRY_RUN = false;
```

2. Submit a real test request through the intake form
3. Confirm the agent:
   - Logs the row in the Agent Log sheet
   - Sends a revision email (for Low Touch) or escalation notification (for Medium/High)
   - Posts to the Chat escalation space (if configured)

---

## Configuration Reference

### Touch Level Thresholds

Triage confidence thresholds are configurable in `Triage.gs`:

```javascript
var CONFIDENCE_THRESHOLDS = {
  AUTO_HANDLE:  90,   // >= 90%: agent acts autonomously
  REVIEW:       70,   // 70–89%: flag for human review
  ESCALATE:     0     // < 70%: always escalate regardless of classification
};
```

### Megan Kacholia Hard Rule

The agent contains a hard-coded escalation rule for any request mentioning specific leadership names. This rule is evaluated **before** the AI scoring chain and cannot be overridden by confidence scores:

```javascript
function checkHardEscalationRules(formData) {
  var triggers = ['Megan', 'Kacholia'];
  for (var i = 0; i < triggers.length; i++) {
    if (formData.summary.indexOf(triggers[i]) !== -1 ||
        formData.audience.indexOf(triggers[i]) !== -1) {
      return 'HIGH';  // Hard escalation — skip AI triage
    }
  }
  return null;  // No hard rule triggered
}
```

> **Design principle:** Hard rules for high-stakes routing outperform probabilistic scoring. Do not remove or weaken these rules.

---

## Post-Deployment Verification Checklist

Run through this checklist after every deployment:

- [ ] Trigger is installed and appears in the Triggers panel
- [ ] `DRY_RUN` is set to `false`
- [ ] API key is stored in Script Properties (not in code)
- [ ] Config IDs point to the correct production Form, Sheet, and webhook
- [ ] Log sheet has correct column headers
- [ ] Test Low Touch request → revision email received
- [ ] Test Medium Touch request → escalation notification received in Chat
- [ ] Agent Log sheet shows correct status entries
- [ ] No duplicate triggers running

---

## Rollback Procedure

If the deployment causes errors:

1. **Disable the trigger immediately:**
   - Triggers panel → click the three-dot menu → **Delete**
2. **Restore previous version:**
   - Apps Script editor → **Project History** (clock icon in toolbar)
   - Select the last known-good version → **Restore**
3. **Re-install the trigger** on the restored version using `installTrigger()`
4. **Document the failure** in the Agent Log sheet manually, noting:
   - What went wrong
   - What was rolled back
   - When normal operation resumed

---

## Ongoing Maintenance

| Task | Frequency | Owner |
|------|-----------|-------|
| Review Agent Log for anomalies | Weekly | Comms Lead |
| Check Gemini API quota usage | Monthly | Comms Lead |
| Validate triage accuracy on sample | Quarterly | Comms Lead |
| Update hard escalation name list | As needed | Comms Lead |
| Rotate API key | Annually or on personnel change | Comms Lead |

---

## Troubleshooting

### Agent fires but sends no email
- Check `DRY_RUN` flag in `Config.gs` — may still be `true`
- Check Gmail send quota (500/day limit for standard Workspace)
- Review Apps Script execution log for errors

### Gemini API returns 429 (rate limit)
- The agent implements exponential backoff automatically (3 retries, 2s delay)
- If errors persist, check your API quota in Google AI Studio
- Temporarily increase `RETRY_DELAY_MS` in `Config.gs`

### Trigger fires multiple times per submission
- Duplicate triggers installed — check Triggers panel and delete extras
- Re-run `installTrigger()` after clearing duplicates

### Triage misclassifies a request
- Log the case in the Agent Log with notes
- Review the triage prompt in `Triage.gs` against the `TRIAGE_CRITERIA.md` knowledge base
- Add the case as a new example in the examples library and redeploy

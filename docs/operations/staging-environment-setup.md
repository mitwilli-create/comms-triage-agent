# [TEAM_NAME] Comms Agent — Staging Environment Setup Guide

**Purpose:** Set up a safe testing environment before deploying v1.3 to production  
**Time Required:** 30-45 minutes  
**Prerequisites:** enterprise account with Drive, Forms, Sheets, Apps Script access  
**Last Updated:** February 1, 2026

---

## Overview

This guide creates a **complete staging environment** that mirrors production without touching real data. Use it to:

- Test new code changes before deployment
- Validate form-to-agent flow works correctly
- Train [ESCALATION_OWNER] on the system safely
- Debug issues without impacting real users

---

## Step 1: Create Staging Folder Structure

### 1.1 Create Root Folder

1. Go to cloud storage
2. Create folder: `[TEAM_NAME] Comms Agent - STAGING`
3. Note the folder ID (from URL: `[DRIVE_URL]/drive/folders/[FOLDER_ID]`)

### 1.2 Create Subfolders

Inside the staging folder, create:
- `Email Draft Docs` — Where Low Touch outputs go
- `Escalation Starter Docs` — Where Medium/High Touch docs go
- `Client Engagement Summaries` — Engagement tracking
- `Test Outputs` — For test runs

---

## Step 2: Create Staging Spreadsheet

### 2.1 Create Sheet

1. In the staging folder, create: `[TEAM_NAME] Comms Agent Tracking - STAGING`
2. Rename first tab to: `Requests`

### 2.2 Set Up Columns

Add these headers in Row 1:

| Col | Header |
|-----|--------|
| A | Timestamp |
| B | Email Address |
| C | Team |
| D | Type of Request |
| E | Content Status |
| F | Subject |
| G | Summary |
| H | Target Audience |
| I | [VP_NAME] Involved |
| J | Urgency |
| K | Sender |
| L | Draft Link |
| M | Additional Notes |
| N | Touch Level |
| O | Status |
| P | Doc Link |
| Q | Processed |

### 2.3 Note Sheet ID

From URL: `[DOCS_URL]/spreadsheets/d/[SHEET_ID]/edit`

---

## Step 3: Create Staging Form

### 3.1 Create Form

1. Go to [FORMS_URL]
2. Create: `[TEAM_NAME] Comms Intake - STAGING`

### 3.2 Add Questions

**Important:** Question titles must match EXACTLY what the code expects.

| # | Question Title | Type | Options/Notes |
|---|---------------|------|---------------|
| 1 | Email Address | Short answer | Collect email addresses (Settings) |
| 2 | Your Team/[TEAM_NAME] Workstream: | Dropdown | Domains, ICM, PMO, StratOps, Training, Other |
| 3 | Type of Request: | Dropdown | Quick Review, Website Update, Newsletter, New Content Creation, Event Comms, Mandate/Governance, Executive Comms, Strategy Consultation, General Inquiry |
| 4 | Content Status | Dropdown | I have a draft, Outline only, Nothing yet |
| 5 | Subject or Title of Communication | Short answer | |
| 6 | What are you communicating, and what should the audience do? | Paragraph | |
| 7 | Primary Audience | Short answer | |
| 8 | Is [VP_NAME] involved? | Dropdown | No, Yes — this is from/to [VP_NAME], Yes — [VP_NAME] will be CC'd |
| 9 | Urgency | Dropdown | Flexible, Within 2 weeks, Within 1 week, Within 2-3 days, Urgent (<48 hours) |
| 10 | Who will send/distribute this communication? | Short answer | |
| 11 | Link(s) to draft content, supporting docs, or images | Short answer | |
| 12 | Anything else? | Paragraph | |

### 3.3 Link Form to Sheet

1. In Form, click Responses tab
2. Click spreadsheet icon → "Select existing spreadsheet"
3. Choose your staging tracking sheet
4. Verify responses go to a new tab (rename if needed, or adjust code)

**Note:** Form responses may create a new tab. Either:
- Update code to point to that tab name, OR
- Manually move responses to "Requests" tab for testing

---

## Step 4: Create Staging Apps Script Project

### 4.1 Create Project

1. Go to [AUTOMATION_PLATFORM_URL]
2. Click "New Project"
3. Name: `[TEAM_NAME] Comms Agent - STAGING`

### 4.2 Paste Code

1. Delete default `Code.gs` content
2. Paste entire contents of `[TEAM_NAME]_Comms_Agent_v1.3_OPTIMIZED.gs`
3. Save (Ctrl+S)

### 4.3 Configure Script Properties

1. Click gear icon (Project Settings)
2. Scroll to "Script Properties"
3. Add these properties:

| Property | Value |
|----------|-------|
| `GEMINI_API_KEY` | Your Gemini API key |
| `TRACKING_SHEET_ID` | [Your staging sheet ID] |
| `OUTPUT_FOLDER_ID` | [Your staging folder ID] |
| `CHAT_SPACE_WEBHOOK` | [Optional — staging webhook or leave blank] |
| `ESCALATION_EMAIL` | [Your email for testing] |

### 4.4 Authorize

1. Run `testGeminiConnection()` function
2. Click through authorization prompts
3. Grant all requested permissions

---

## Step 5: Set Up Form Trigger

### 5.1 Create Trigger

1. In Apps Script, click clock icon (Triggers)
2. Click "Add Trigger"
3. Configure:
   - Function: `onFormSubmit`
   - Event source: `From spreadsheet`
   - Event type: `On form submit`
   - Spreadsheet: [Your staging sheet]
4. Save

### 5.2 Verify Trigger

1. Submit a test form response
2. Check Executions (View → Executions) for successful run
3. Verify output in staging folder

---

## Step 6: Create Test Chat Space (Optional)

If you want Chat Space notifications during testing:

### 6.1 Create Space

1. Open enterprise chat
2. Create new space: `[TEAM_NAME] Comms Agent Testing`
3. Add [ESCALATION_OWNER] and Anton if desired

### 6.2 Create Webhook

1. In the space, click dropdown arrow → "Apps & Integrations"
2. Click "Add webhooks"
3. Name: `Agent Notifications`
4. Copy webhook URL
5. Add to Script Properties as `CHAT_SPACE_WEBHOOK`

---

## Step 7: Run Validation Tests

### 7.1 Test Gemini Connection

```javascript
// Run this in Apps Script
testGeminiConnection()
```

**Expected:** Log shows "Gemini Connection Success"

### 7.2 Test Chat Webhook (if configured)

```javascript
// Run this in Apps Script
testChatSpaceWebhook()
```

**Expected:** Test message appears in Chat Space

### 7.3 Test Low Touch Path

```javascript
// Run this in Apps Script
testLowTouchPath()
```

**Expected:**
- Email sent to test@[ORG_DOMAIN] (won't deliver, but logged)
- Email Draft Doc created in staging folder
- Sheet updated with status "Completed"

### 7.4 Test Medium Touch Path

```javascript
// Run this in Apps Script
testMediumTouchPath()
```

**Expected:**
- Chat Space notified (if configured)
- Escalation email sent to ESCALATION_EMAIL
- Escalation Starter Doc created
- Sheet updated with "Escalated - Medium"

### 7.5 Test [VP_NAME] High Touch Path

```javascript
// Run this in Apps Script
test[VP_NAME]HighTouchPath()
```

**Expected:**
- Immediate escalation ([VP_NAME] Rule triggered)
- Starter Doc includes [VP_NAME] Gem Prompt section
- Sheet updated with "Escalated - High"

### 7.6 Test Site-Related Escalation (v1.3)

```javascript
// Run this in Apps Script
testSiteRelatedEscalation()
```

**Expected:**
- Escalates to MEDIUM TOUCH
- Reason includes "Site-Related Content Rule"

### 7.7 Test Draft Access Error (v1.3)

```javascript
// Run this in Apps Script
testDraftAccessError()
```

**Expected:**
- Escalates with clear error message
- Requester notification sent about access issue

---

## Step 8: End-to-End Test via Form

### 8.1 Submit Test Request

1. Open staging form
2. Fill out completely:
   - Email: your-email@[ORG_DOMAIN]
   - Team: Test Team
   - Type: Quick Review
   - Content Status: I have a draft
   - Subject: Test Email
   - Summary: "Hi team, I hope this email finds you well. I wanted to share some updates. As you know, we have been working hard. Please let me know if you have any questions. Thanks!"
   - Audience: [TEAM_NAME] team
   - [VP_NAME]: No
   - Urgency: Flexible
   - Sender: Me
   - Draft Link: [leave blank or provide test doc]
   - Notes: [blank]

3. Submit

### 8.2 Verify Flow

Check within 1-2 minutes:
- [ ] Sheet has new row with form data
- [ ] Touch Level column shows "LOW"
- [ ] Status shows "Completed"
- [ ] Doc Link contains URL to Email Draft Doc
- [ ] Email received (if using real email)
- [ ] Email Draft Doc exists in staging folder
- [ ] Doc contains revised content + rationale

### 8.3 Test Escalation via Form

Submit another request with:
- [VP_NAME] Involved: "Yes — this is from/to [VP_NAME]"

Verify:
- [ ] Touch Level shows "HIGH"
- [ ] Status shows "Escalated - High"
- [ ] Escalation Starter Doc created
- [ ] Starter Doc contains [VP_NAME] Gem Prompt section
- [ ] Escalation email received

---

## Step 9: Prepare for Production Deployment

### 9.1 Production Checklist

Before deploying v1.3 to production:

- [ ] All 7 test functions pass
- [ ] End-to-end form test works
- [ ] Escalation email goes to correct address
- [ ] Chat Space notifications appear (if used)
- [ ] [ESCALATION_OWNER] has reviewed Starter Doc format
- [ ] Form question titles match production form

### 9.2 Production Deployment Steps

1. Open production Apps Script project
2. Create backup: File → Make a copy → Name with date
3. Replace code with v1.3
4. Verify Script Properties are still correct
5. Run `testGeminiConnection()` to confirm
6. Submit one test request through production form
7. Verify successful processing
8. Monitor first few real requests

### 9.3 Rollback Plan

If issues occur:
1. Open Apps Script project
2. File → Version history → See version history
3. Restore previous version
4. OR: Open your backup copy and deploy from there

---

## Staging vs Production Reference

| Setting | Staging | Production |
|---------|---------|------------|
| Sheet | `[TEAM_NAME] Comms Agent Tracking - STAGING` | `[TEAM_NAME] Comms Agent Tracking` |
| Folder | `[TEAM_NAME] Comms Agent - STAGING` | `[TEAM_NAME] Comms Agent Outputs` |
| Form | `[TEAM_NAME] Comms Intake - STAGING` | `[INTERNAL_LINK]` |
| Escalation Email | Your email | [ESCALATION_OWNER]'s email |
| Chat Space | Testing space (optional) | [TEAM_NAME] Comms space |

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Form submit doesn't trigger | Trigger not set up | Check Triggers in Apps Script |
| "Gemini API error" | Bad API key or rate limit | Verify key in Script Properties; wait and retry |
| "Sheet not found" | Wrong TRACKING_SHEET_ID | Verify ID matches staging sheet |
| "Folder not found" | Wrong OUTPUT_FOLDER_ID | Verify ID matches staging folder |
| No email received | Using test@[ORG_DOMAIN] | Use real email for full test |
| Columns don't match | Sheet structure differs | Verify column order matches code config |
| Form responses go to wrong tab | Form created new tab | Update REQUESTS_TAB in code or move data |

---

## Clean Up (After Testing)

To reset staging environment:

1. Delete all rows in staging sheet (except headers)
2. Delete all docs in staging output folders
3. Clear execution history: View → Executions → select all → delete

To delete staging environment entirely:

1. Delete Apps Script project
2. Delete staging folder (and all contents)
3. Delete staging form
4. Delete staging Chat Space (if created)

---

*Staging environment allows safe testing without affecting real users or data.*

# [TEAM_NAME] Internal Comms Agent — Final Package Index

**Version:** 1.0  
**Created:** January 31, 2026  
**Status:** Deployment Ready (pending configuration)

---

## PACKAGE CONTENTS

### Core Prompts (Paste into Apps Script)

| File | Purpose | Location |
|------|---------|----------|
| `TRIAGE_PROMPT_FINAL.md` | Classify requests into Low/Medium/High touch | `/prompts/` |
| `REVISION_PROMPT_FINAL.md` | Execute Low Touch revisions, produce Email Draft Doc | `/prompts/` |
| `ESCALATION_PROMPT_FINAL.md` | Format Medium/High Touch handoffs to [ESCALATION_OWNER] | `/prompts/` |

### Apps Script

| File | Purpose | Location |
|------|---------|----------|
| `[TEAM_NAME]_Comms_Agent_FINAL.gs` | Complete implementation with embedded prompts | `/apps-script/` |

### Operational Documentation

| File | Purpose | Location |
|------|---------|----------|
| `OPERATIONAL_DOCUMENTATION.md` | User journey, [ESCALATION_OWNER] guide, config checklist, testing checklist | `/docs/` |

---

## WHAT'S INCLUDED vs. WHAT YOU PROVIDE

### Included (Ready to Use)

✅ Complete TRIAGE_PROMPT with absolute [VP_NAME] rule  
✅ Complete REVISION_PROMPT with Email Draft Doc format  
✅ Complete ESCALATION_PROMPT with Chat Space formats  
✅ Apps Script with all functions  
✅ User journey documentation  
✅ [ESCALATION_OWNER] experience guide  
✅ Friday digest format  
✅ Testing checklist  
✅ Configuration checklist  
✅ Troubleshooting guide  

### You Must Provide (Blocking)

| Item | Where It Goes | How to Get |
|------|---------------|------------|
| Gemini API Key | Script Properties: `GEMINI_API_KEY` | [[AI_PLATFORM]](https://[AI_PLATFORM_URL]) |
| Tracking Sheet ID | Script Properties: `TRACKING_SHEET_ID` | Create sheet, copy ID from URL |
| Chat Space Webhook | Script Properties: `CHAT_SPACE_WEBHOOK` | Chat Space → Manage webhooks |
| Output Folder ID | Script Properties: `OUTPUT_FOLDER_ID` | Create Drive folder, copy ID from URL |
| Form Question Titles | `parseFormResponse()` function | Match your exact form questions |

### Optional Enhancements (Post-MVP)

- Engagement Summary integration  
- Structured audience dropdown  
- Metrics dashboard  
- User feedback loop  

---

## DECISIONS LOCKED IN

All decisions from the build session are reflected in the final documents:

| # | Decision | Status |
|---|----------|--------|
| 1 | "[VP_NAME]" = automatic High Touch, no exceptions | ✅ |
| 2 | No confirmation step for MVP — execute immediately | ✅ |
| 3 | Email Draft Doc output with salutation/closing placeholders | ✅ |
| 4 | User doesn't know it's AI — emails from "[TEAM_NAME] Communications" | ✅ |
| 5 | To/CC/BCC left blank for user to fill | ✅ |
| 6 | No Chat Space ping for Low Touch completions | ✅ |
| 7 | Chat Space ping for Medium/High Touch only | ✅ |
| 8 | The organization uses enterprise chat/Gmail, NOT Slack | ✅ |
| 9 | Never hallucinate institutional details — use [PLACEHOLDERS] | ✅ |
| 10 | No methodology mentions ("Smart Brevity") to users | ✅ |
| 11 | Target Audience = free text (no form change for MVP) | ✅ |
| 12 | Friday digest time-triggered | ✅ |
| 13 | Bypass monitoring via [TEAM_NAME]-stratops@ inbox | ✅ |

---

## DEPLOYMENT SEQUENCE

### Step 1: Create Infrastructure (10 min)
- [ ] Create [CORP_NAME] Sheet with "Requests" tab and 13 columns
- [ ] Create cloud storage folder for Email Draft Docs
- [ ] Create Chat Space "[TEAM_NAME] Comms Agent Notifications"
- [ ] Get Chat Space webhook URL

### Step 2: Configure Apps Script (15 min)
- [ ] Create new Apps Script project
- [ ] Paste `[TEAM_NAME]_Comms_Agent_FINAL.gs` content
- [ ] Add Script Properties (API key, Sheet ID, Webhook, Folder ID)
- [ ] Update `parseFormResponse()` to match your form question titles

### Step 3: Set Up Triggers (5 min)
- [ ] Add trigger: `onFormSubmit` → From form → On form submit
- [ ] Add trigger: `sendFridayDigest` → Time-driven → Weekly Friday 9am
- [ ] Add trigger: `checkForBypassEmails` → Time-driven → Hourly

### Step 4: Test (15 min)
- [ ] Run `testGeminiConnection()` — verify API works
- [ ] Run `testChatSpaceWebhook()` — verify webhook works
- [ ] Run `testFormSubmission()` — verify full flow
- [ ] Submit real test form — verify end-to-end

### Step 5: Go Live
- [ ] Announce to team that agent is active
- [ ] Monitor first few requests closely
- [ ] Adjust as needed

---

## SUPPORT DURING LEAVE

**Primary contact:** [ESCALATION_OWNER] (via Chat Space pings)

**If agent breaks:**
1. Disable triggers (Triggers → Delete all)
2. Process requests manually from sheet
3. Re-enable after fix

**If Gemini API issues:**
1. Check quotas in Cloud Console
2. Regenerate API key if needed
3. Update Script Property

---

## FILES IN THIS PACKAGE

```
final-package-v2/
├── PACKAGE_INDEX.md (this file)
├── prompts/
│   ├── TRIAGE_PROMPT_FINAL.md
│   ├── REVISION_PROMPT_FINAL.md
│   └── ESCALATION_PROMPT_FINAL.md
├── apps-script/
│   └── [TEAM_NAME]_Comms_Agent_FINAL.gs
└── docs/
    └── OPERATIONAL_DOCUMENTATION.md
```

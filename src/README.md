# Source Code

Production Google Apps Script source for the Comms Triage Agent. All internal identifiers, names, URLs, and credentials have been replaced with placeholders.

## File

This is a single-file Apps Script project. All logic lives in one file for ease of deployment into the Apps Script editor.

| File | Purpose |
|---|---|
| `comms_agent.gs` | Complete agent source -- configuration, knowledge base, prompts, triage logic, revision handler, escalation handler, template population, notifications, metrics, and test functions |

### Key sections within `comms_agent.gs`

| Section | Description |
|---|---|
| Configuration | `getConfig()`, `getEscalationConfig()`, folder helpers |
| Dynamic Knowledge Base | Core KB loader, Living Docs (conditional), Engagement Summaries (name-matched) |
| KB Constants | Smart Brevity rules, Audience Profiles, Revision Examples (embedded) |
| Prompts | `TRIAGE_PROMPT`, `REVISION_PROMPT`, `ESCALATION_PROMPT` -- the three-prompt architecture |
| Main Entry Point | `onFormSubmit()` -- form handler, Megan/site pre-checks, triage routing |
| Form Parsing | `parseFormResponse()` -- maps Google Form fields to data object |
| Gemini API | `callGemini()`, `callGeminiForTriage()`, `callGeminiForRevision()`, `callGeminiForEscalation()` |
| Low Touch Handler | Autonomous revision flow: draft access, Gemini revision, doc creation, email notification |
| Escalation Handler | Medium/High touch flow: starter doc creation, Chat Space ping, email to escalation owner |
| Template System | Template-based starter docs for Medium, High, and High+VP escalation paths |
| Megan Helpers | Prompt detection, medium config, communication type detection |
| Escalation Email | BLUF-format HTML emails (Medium, High, High+VP variants) |
| Notifications | Gmail sending, Google Chat Space webhooks, bypass monitoring |
| Friday Digest | Weekly summary stats posted to Chat Space |
| Metrics Tab | Auto-generated spreadsheet tab with summary stats, trends, resolution times, time savings |
| Test Functions | End-to-end test paths for Low, Medium, High, VP-involved, site-related, and draft-error scenarios |

## Setup

To run this in your own Google Workspace environment:

1. Create a new Apps Script project at script.google.com
2. Paste the contents of `comms_agent.gs`
3. Configure the following Script Properties (File > Project Settings > Script Properties):

### Required Script Properties

| Property | Description |
|---|---|
| `GEMINI_API_KEY` | Gemini API key |
| `TRACKING_SHEET_ID` | Google Sheet ID linked to your intake form |
| `OUTPUT_FOLDER_ID` | Google Drive folder for output documents |
| `CHAT_SPACE_WEBHOOK` | Google Chat space webhook URL |
| `ESCALATION_EMAIL` | Email address for escalation routing |
| `EMAIL_TEMPLATE_ID` | Google Doc template ID for Low Touch email drafts |
| `CORE_KB_FOLDER_ID` | Folder containing core knowledge base documents |
| `ES_FOLDER_ID` | Folder containing engagement summaries |

### Optional Script Properties (Living Documents)

| Property | Description |
|---|---|
| `DOC_XGE_COMMS_GUIDE` | Comms guide document ID (always loaded) |
| `DOC_XGE_HOW_WE_WORK` | How We Work document ID (always loaded) |
| `DOC_ICM_STRATEGY` | Loaded on change management triggers |
| `DOC_ICM_COMMS_STRATEGY` | Loaded on change management triggers |
| `DOC_TRR_PLAYBOOK` | Loaded on technical recommendation triggers |
| `DOC_APPROVALS_USER_GUIDE` | Loaded on mandate/governance triggers |
| `DOC_CMP_STRATEGY` | Loaded on program-specific triggers |
| `DOC_STACKS_POR` | Loaded on program-specific triggers |
| `DOC_STACKS_ARCHITECTURE` | Loaded on program-specific triggers |
| `DOC_ROI_CHARTER` | Loaded on program-specific triggers |
| `DOC_DEPENDENCY_PRD` | Loaded on program-specific triggers |
| `DOC_SITE_STYLE_GUIDE` | Loaded on website/site triggers |
| `DOC_ONBOARDING` | Loaded on onboarding triggers |

### Escalation Template Properties

| Property | Description |
|---|---|
| `MEDIUM_TOUCH_TEMPLATE_ID` | Google Doc template for medium-touch starter docs |
| `HIGH_TOUCH_TEMPLATE_ID` | Google Doc template for high-touch starter docs |
| `HIGH_TOUCH_MEGAN_TEMPLATE_ID` | Google Doc template for VP-involved starter docs |

4. Set up triggers:
   - `onFormSubmit` -- Triggers > Add Trigger > From spreadsheet > On form submit
   - `sendFridayDigest` -- Triggers > Add Trigger > Time-driven > Week timer > Every Friday
   - `checkForBypassEmails` -- Triggers > Add Trigger > Time-driven > Hour timer

## Placeholders

All sensitive values have been replaced with bracketed placeholders:

| Placeholder | What it replaces |
|---|---|
| `[OWNER_NAME]` | Communications lead / script owner name |
| `[ESCALATION_OWNER]` | Escalation recipient name |
| `[VP_NAME]` | Senior executive name (auto-escalation trigger) |
| `[VP_NAME_LAST]` | Senior executive last name |
| `[EXEC_NAME]` | Executive name |
| `[EXEC_NAME_2]` | Second executive name |
| `[TEAM_EMAIL]` | Team email address |
| `[EMAIL_ADDRESS]` | Individual internal email addresses |
| `[ORG_NAME]` | Organization name |
| `[CROSS_ORG_ENGINEERING]` | Cross-organization engineering group name |
| `[INTERNAL_DOCS]` | Internal documentation platform name |
| `[INTERNAL_URL]` | Internal go/ links and URLs |
| `[INTERNAL_PROGRAM_1]` | Internal program name (change management) |
| `[INTERNAL_PROGRAM_2]` | Internal program name (technical recommendations) |
| `[INTERNAL_PROGRAM_3]` | Internal program name (platform strategy) |
| `[INTERNAL_PROGRAM_4]` | Internal program name (infrastructure products) |

## OAuth Scopes Required

- `https://www.googleapis.com/auth/spreadsheets` -- Read/write form responses and metrics
- `https://www.googleapis.com/auth/drive` -- Create and organize output documents
- `https://www.googleapis.com/auth/documents` -- Read knowledge base docs, create starter docs
- `https://www.googleapis.com/auth/gmail.send` -- Send notification and escalation emails
- `https://www.googleapis.com/auth/script.external_request` -- Call Gemini API

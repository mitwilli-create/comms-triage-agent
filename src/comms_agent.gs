/**
 * ═══════════════════════════════════════════════════════════════════════════
 * [ORG_NAME] INTERNAL COMMS AGENT v1.4 — Apps Script Implementation
 * ═══════════════════════════════════════════════════════════════════════════
// PURPOSE: Automated triage and revision of internal communications requests
// OWNER: [OWNER_NAME], Communications Lead, [ORG_NAME]
// BACKUP: [ESCALATION_OWNER] (during [OWNER_NAME]'s medical leave Feb 5 - Mar 5, 2026)
// LAST UPDATED: February 2, 2026
//
// ═══════════════════════════════════════════════════════════════════════════
// VERSION HISTORY
// ═══════════════════════════════════════════════════════════════════════════
//
// v1.5 (Feb 2, 2026) — Quick Fixes & Prompt Refinement
//   FUNCTION FIXES:
//   - callGeminiForRevision: Now uses minimal KB (embedded only) for faster Low Touch
//   - callGeminiForEscalation: Now loads full dynamic KB for [ESCALATION_OWNER] briefings
//
//   REVISION_PROMPT FIXES:
//   - Added "Edit Not Reinvent" philosophy — preserves user voice, doesn't over-engineer
//   - Added "Go deeper" and other phrases to forbidden list
//   - Added TL;DR rule — auto-adds summary for emails >100 words
//   - Added explicit CTA rule — every email gets visible call to action
//
// v1.4 (Feb 2, 2026) — KB Architecture & Output Quality
//   ARCHITECTURE:
//   - Implemented 3-tier Dynamic KB: Core KB (always), Living Docs (conditional), 
//     Engagement Summaries (name-matched)
//   - Tiered KB loading: Low Touch = minimal KB (SMART_BREVITY + AUDIENCE_PROFILES only)
//   - Medium/High Touch = full KB for [ESCALATION_OWNER]'s consultation prep
//   - Engagement summaries load for [ESCALATION_OWNER] only, not requesters
//   - 14 new Script Properties for living document IDs
//
//   TRIAGE FIXES:
//   - [ORG_NAME] Leadership = INTERNAL (does NOT trigger escalation)
//   - Removed "L8+ by name" inference — trusts form's audience field
//   - VP/Director rule scoped to EXTERNAL only
//   - Only [VP_NAME] triggers automatic HIGH TOUCH escalation
//
//   OUTPUT QUALITY:
//   - Chat notifications shortened to 5 lines max
//   - Clickable hyperlink to sheet row in Chat
//   - Single * for bold in Google Chat (not **)
//   - Word count statistics removed entirely
//   - "Edit not reinvent" philosophy for Low Touch
//   - Forbidden phrases enforced (no "Smart Brevity", "Go deeper", etc.)
//   - Rationale format: "1. **Category** — What. Why."
//   - Audience analysis duplication fixed
//
//   BUG FIXES:
//   - Field mapping: "Type of Request: " (trailing space) now captured
//   - Engagement summary matching: prefers individual over group matches
//   - HTML stripping from Google Doc body
//   - Email notification spacing tightened
//
// v1.3 (Jan 31, 2026) — Template System & Error Handling
//   - Template-based document generation (EMAIL_TEMPLATE_ID)
//   - Enhanced draft access error handling
//   - Site-related requests auto-escalate to MEDIUM TOUCH
//   - [VP_NAME] rule hardcoded bypass (100% confidence, immediate escalation)
//   - Escalation starter docs for [ESCALATION_OWNER]
//
// v1.2 (Jan 30, 2026) — Core Functionality
//   - Gemini API integration
//   - Form parsing and triage logic
//   - Low/Medium/High touch routing
//   - Chat Space notifications
//   - Sheet status updates
//
// v1.1 (Jan 29, 2026) — Initial Build
//   - Basic form submission handling
//   - Proof of concept triage
//
// ═══════════════════════════════════════════════════════════════════════════
// SCRIPT PROPERTIES REQUIRED
// ═══════════════════════════════════════════════════════════════════════════
//
// CORE:
//    - GEMINI_API_KEY: Gemini API access key
//    - TRACKING_SHEET_ID: Google Sheet for request tracking
//    - CHAT_SPACE_WEBHOOK: Webhook URL for Chat Space notifications
//    - OUTPUT_FOLDER_ID: Drive folder for output documents
//    - ARCHIVE_FOLDER_ID: Drive folder for quarterly archives
//    - ESCALATION_EMAIL: Email for escalations ([ESCALATION_OWNER] for prod)
//    - EMAIL_TEMPLATE_ID: Google Doc template for Low Touch outputs
//
// KNOWLEDGE BASE:
//    - CORE_KB_FOLDER_ID: Folder containing core KB docs (12 docs)
//    - ES_FOLDER_ID: Folder containing engagement summaries
//
// LIVING DOCUMENTS (loaded conditionally):
//    - DOC_XGE_COMMS_GUIDE: Always loaded
//    - DOC_XGE_HOW_WE_WORK: Always loaded
//    - DOC_ICM_STRATEGY: [INTERNAL_PROGRAM_1] triggers
//    - DOC_ICM_COMMS_STRATEGY: [INTERNAL_PROGRAM_1] triggers
//    - DOC_TRR_PLAYBOOK: [INTERNAL_PROGRAM_2] triggers
//    - DOC_APPROVALS_USER_GUIDE: Mandate/governance triggers
//    - DOC_CMP_STRATEGY: [INTERNAL_PROGRAM_3]/ROI/[INTERNAL_PROGRAM_4] triggers
//    - DOC_STACKS_POR: [INTERNAL_PROGRAM_3]/ROI/[INTERNAL_PROGRAM_4] triggers
//    - DOC_STACKS_ARCHITECTURE: [INTERNAL_PROGRAM_3]/ROI/[INTERNAL_PROGRAM_4] triggers
//    - DOC_ROI_CHARTER: [INTERNAL_PROGRAM_3]/ROI/[INTERNAL_PROGRAM_4] triggers
//    - DOC_DEPENDENCY_PRD: [INTERNAL_PROGRAM_3]/ROI/[INTERNAL_PROGRAM_4] triggers
//    - DOC_SITE_STYLE_GUIDE: Website triggers
//    - DOC_ONBOARDING: Onboarding triggers
//
// METRICS (v1.4+):
//    - FEEDBACK_FORM_ID: Satisfaction feedback form
//    - ENTRY_HELPFUL: Form entry ID for helpful field
//    - ENTRY_COMMENTS: Form entry ID for comments field
//    - ENTRY_REQUEST_ID: Form entry ID for request ID field
//
// ═══════════════════════════════════════════════════════════════════════════
// TOUCH LEVEL ROUTING
// ═══════════════════════════════════════════════════════════════════════════
//
// LOW TOUCH (revision_agent):
//   - Quick Review requests with draft provided
//   - Audience internal to [ORG_NAME] (including [ORG_NAME] Leadership)
//   - No [VP_NAME] involvement
//   - Flexible timeline
//   - NOT site/website/[INTERNAL_DOCS] content
//   → Agent handles autonomously, minimal KB loaded
//
// MEDIUM TOUCH (escalation_agent):
//   - New content creation
//   - Strategy/consultation requests
//   - Website/[INTERNAL_DOCS] content
//   - Mandate/governance communications
//   → Escalates to [ESCALATION_OWNER] with full KB briefing
//
// HIGH TOUCH (escalation_agent):
//   - [VP_NAME] involved (ABSOLUTE RULE)
//   - External audiences (outside [ORG_NAME])
//   - Sensitive topics
//   → Priority escalation to [ESCALATION_OWNER]
//
// ═══════════════════════════════════════════════════════════════════════════
// FORBIDDEN IN USER-FACING OUTPUT
// ═══════════════════════════════════════════════════════════════════════════
//
// - "Smart Brevity", "framework", "methodology", "best practices"
// - "Go deeper" (use explicit CTAs instead)
// - Word count statistics
// - Double ** for bold in Chat (use single *)
// - "Audience Analysis: Audience Analysis:" (no duplicate labels)
//
// ═══════════════════════════════════════════════════════════════════════════
 *
 * SETUP INSTRUCTIONS:
 * 1. Create new Apps Script project: script.google.com
 * 2. Paste this entire file
 * 3. Configure SCRIPT PROPERTIES (File → Project Settings → Script Properties):
 *    - GEMINI_API_KEY: Your Gemini API key
 *    - TRACKING_SHEET_ID: ID of your tracking spreadsheet
 *    - CHAT_SPACE_WEBHOOK: Webhook URL for Chat Space notifications
 *    - OUTPUT_FOLDER_ID: Google Drive folder ID for Email Draft Docs
 *    - ESCALATION_EMAIL: Email for escalation notifications (your email for testing, [ESCALATION_OWNER]'s for production)
 * 4. Ensure parseFormResponse() matches YOUR form question titles EXACTLY
 * 5. Ensure sheet column indices in getConfig() match your sheet structure
 * 6. Set up triggers:
 *    - onFormSubmit: Triggers → Add Trigger → onFormSubmit → From spreadsheet → On form submit
 *    - sendFridayDigest: Triggers → Add Trigger → Time-driven → Week timer → Every Friday → 9am to 10am
 *    - checkForBypassEmails: Triggers → Add Trigger → Time-driven → Hour timer → Every hour
 * 7. Run test functions to verify each component
 *
 * ARCHITECTURE:
 * Form Submit → Triage → Route → Execute → Notify → Log → Record Engagement
 */


// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    GEMINI_API_KEY: props.getProperty('GEMINI_API_KEY'),
    TRACKING_SHEET_ID: props.getProperty('TRACKING_SHEET_ID'),
    CHAT_SPACE_WEBHOOK: props.getProperty('CHAT_SPACE_WEBHOOK'),
    OUTPUT_FOLDER_ID: props.getProperty('OUTPUT_FOLDER_ID'),

    // Sheet configuration
    REQUESTS_TAB: 'Requests',

    // Column indices (1-indexed) - UPDATE IF YOUR SHEET DIFFERS
    COL_TIMESTAMP: 1,
    COL_EMAIL: 2,
    COL_TEAM: 3,
    COL_TYPE: 4,
    COL_CONTENT_STATUS: 5,
    COL_SUBJECT: 6,
    COL_SUMMARY: 7,
    COL_AUDIENCE: 8,
    COL_MEGAN: 9,
    COL_URGENCY: 10,
    COL_SENDER: 11,
    COL_DRAFT_LINK: 12,
    COL_ADDITIONAL_NOTES: 13,
    COL_TOUCH_LEVEL: 14,
    COL_STATUS: 15,
    COL_DOC_LINK: 16,
    COL_PROCESSED: 17,

    // Email settings
    SENDER_NAME: '[ORG_NAME] Communications',
    REPLY_TO: '[TEAM_EMAIL]'
  };
}

/**
 * Gets escalation-specific configuration.
 * Extends base config with escalation email recipient.
 */
function getEscalationConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    // Email recipient for escalations
    // TESTING: Use your email
    // PRODUCTION: Change to [ESCALATION_OWNER]'s email
    ESCALATION_EMAIL: props.getProperty('ESCALATION_EMAIL') || ''
  };
}
/**
 * Gets or creates a subfolder within the output folder.
 * @param {string} subfolderName - Name of subfolder (e.g., "Completed", "Needs Review")
 * @param {Object} config - Configuration object
 * @returns {Folder} The subfolder
 */
function getOrCreateSubfolder(subfolderName, config) {
  const parentFolder = DriveApp.getFolderById(config.OUTPUT_FOLDER_ID);
  const subfolders = parentFolder.getFoldersByName(subfolderName);
  
  if (subfolders.hasNext()) {
    return subfolders.next();
  } else {
    return parentFolder.createFolder(subfolderName);
  }
}

/**
 * Archives completed files to the archive folder.
 * Run quarterly via time-driven trigger.
 */
function archiveCompletedFiles() {
  const config = getConfig();
  const archiveFolderId = PropertiesService.getScriptProperties().getProperty('ARCHIVE_FOLDER_ID');
  
  if (!archiveFolderId) {
    Logger.log('ERROR: ARCHIVE_FOLDER_ID not set');
    return;
  }
  
  const archiveFolder = DriveApp.getFolderById(archiveFolderId);
  const completedFolder = getOrCreateSubfolder('Completed', config);
  const files = completedFolder.getFiles();
  
  let count = 0;
  while (files.hasNext()) {
    const file = files.next();
    file.moveTo(archiveFolder);
    count++;
  }
  
  Logger.log(`Archived ${count} completed files.`);
  
  // Optional: Ping Chat Space to confirm
  if (count > 0 && config.CHAT_SPACE_WEBHOOK) {
    pingChatSpace(`📦 Quarterly archive complete: ${count} files moved to archive.`, config);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DYNAMIC KNOWLEDGE BASE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gets living doc configuration with IDs from Script Properties
 * @returns {Object} Living docs config organized by trigger category
 */
function getLivingDocsConfig() {
  const props = PropertiesService.getScriptProperties();
  
  return {
    // Always load
    always: [
      { name: '[ORG_NAME] Comms Guide', id: props.getProperty('DOC_XGE_COMMS_GUIDE') },
      { name: '[ORG_NAME] Team: How We Work', id: props.getProperty('DOC_XGE_HOW_WE_WORK') }
    ],
    
    // [INTERNAL_PROGRAM_1] triggers: "[INTERNAL_PROGRAM_1]", "change management", "mandate"
    icm: [
      { name: '[INTERNAL_PROGRAM_1] Strategy and Principles', id: props.getProperty('DOC_ICM_STRATEGY') },
      { name: '[ORG_NAME] [INTERNAL_PROGRAM_1] Communication Strategy', id: props.getProperty('DOC_ICM_COMMS_STRATEGY') }
    ],
    
    // [INTERNAL_PROGRAM_2] triggers: "[INTERNAL_PROGRAM_2]", "technical recommendation"
    trr: [
      { name: '[ORG_NAME] [INTERNAL_PROGRAM_2] Playbook v2', id: props.getProperty('DOC_TRR_PLAYBOOK') },
      { name: '[INTERNAL_PROGRAM_2] Principles', id: props.getProperty('DOC_TRR_PRINCIPLES') }
    ],
    
    // Mandate triggers: request_type = "Mandate/Governance" OR "approval"
    mandate: [
      { name: '[ORG_NAME] Approvals - User Guide', id: props.getProperty('DOC_APPROVALS_USER_GUIDE') }
    ],
    
    // [INTERNAL_PROGRAM_3]/ROI/[INTERNAL_PROGRAM_4]/Dependency triggers
    cmpRoiStacks: [
      { name: '[INTERNAL_PROGRAM_3] Product Strategy and Narrative', id: props.getProperty('DOC_CMP_STRATEGY') },
      { name: '[INTERNAL_PROGRAM_4] POR v2', id: props.getProperty('DOC_STACKS_POR') },
      { name: '[INTERNAL_PROGRAM_4] Architecture Overview', id: props.getProperty('DOC_STACKS_ARCHITECTURE') },
      { name: 'Unified ROI Framework - Charter', id: props.getProperty('DOC_ROI_CHARTER') },
      { name: 'Unified ROI Framework', id: props.getProperty('DOC_UNIFIED_ROI') },
      { name: 'Dependency Analysis V1 + PRD', id: props.getProperty('DOC_DEPENDENCY_PRD') },
      { name: 'Dependency Analysis', id: props.getProperty('DOC_DEPENDENCY_ANALYSIS') }
    ],
    
    // Website triggers: request_type = "Website Update" OR "site", "[INTERNAL_DOCS]"
    website: [
      { name: '[ORG_NAME] Site Style Guide', id: props.getProperty('DOC_SITE_STYLE_GUIDE') }
    ],
    
    // Onboarding triggers: "onboarding", "new hire"
    onboarding: [
      { name: '[ORG_NAME] Onboarding', id: props.getProperty('DOC_ONBOARDING') }
    ]
  };
}

/**
 * Reads a Google Doc by ID and returns its content
 * @param {string} docId - The document ID
 * @param {string} docName - The document name for logging
 * @returns {string} Document content or empty string on error
 */
function readDocById(docId, docName) {
  if (!docId) {
    Logger.log('No ID configured for: ' + docName);
    return '';
  }
  
  try {
    const doc = DocumentApp.openById(docId);
    const content = doc.getBody().getText();
    Logger.log('Loaded: ' + docName);
    return content;
  } catch (e) {
    Logger.log('Error reading ' + docName + ': ' + e.message);
    return '';
  }
}

/**
 * Reads all docs from Core KB folder (always loaded)
 * @returns {string} Formatted KB content
 */
function getCoreKB() {
  const folderId = PropertiesService.getScriptProperties().getProperty('CORE_KB_FOLDER_ID');
  
  if (!folderId) {
    Logger.log('CORE_KB_FOLDER_ID not configured');
    return '';
  }
  
  try {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFilesByType(MimeType.GOOGLE_DOCS);
    
    let result = '\n\n## CORE KNOWLEDGE BASE\n\n';
    
    while (files.hasNext()) {
      const file = files.next();
      const fileName = file.getName();
      const doc = DocumentApp.openById(file.getId());
      const content = doc.getBody().getText();
      
      result += `### ${fileName}\n${content}\n\n---\n\n`;
      Logger.log('Loaded core KB: ' + fileName);
    }
    
    return result;
    
  } catch (e) {
    Logger.log('Error reading Core KB: ' + e.message);
    return '';
  }
}

/**
 * Reads living docs based on request triggers
 * @param {Object} formData - The parsed form data
 * @returns {string} Formatted living docs content
 */
function getLivingDocs(formData) {
  const LIVING_DOCS = getLivingDocsConfig();
  
  // Build searchable text from all form fields
  const searchText = [
    formData.request_type || '',
    formData.requester_name || '',
    formData.target_audience || '',
    formData.summary || '',
    formData.subject || '',
    formData.additional_notes || ''
  ].join(' ').toLowerCase();
  
  const requestType = (formData.request_type || '').toLowerCase();
  
  let docsToLoad = [];
  
  // Always load
  docsToLoad = docsToLoad.concat(LIVING_DOCS.always);
  
  // [INTERNAL_PROGRAM_1] triggers
  if (searchText.includes('icm') || 
      searchText.includes('change management') || 
      searchText.includes('mandate')) {
    docsToLoad = docsToLoad.concat(LIVING_DOCS.icm);
    Logger.log('Triggered: [INTERNAL_PROGRAM_1] docs');
  }
  
  // [INTERNAL_PROGRAM_2] triggers
  if (searchText.includes('trr') || 
      searchText.includes('technical recommendation')) {
    docsToLoad = docsToLoad.concat(LIVING_DOCS.trr);
    Logger.log('Triggered: [INTERNAL_PROGRAM_2] docs');
  }
  
  // Mandate triggers
  if (requestType.includes('mandate') || 
      requestType.includes('governance') ||
      searchText.includes('approval')) {
    docsToLoad = docsToLoad.concat(LIVING_DOCS.mandate);
    Logger.log('Triggered: Mandate docs');
  }
  
  // [INTERNAL_PROGRAM_3]/ROI/[INTERNAL_PROGRAM_4]/Dependency triggers
  if (searchText.includes('cmp') || 
      searchText.includes('roi') || 
      searchText.includes('stacks') ||
      searchText.includes('dependency')) {
    docsToLoad = docsToLoad.concat(LIVING_DOCS.cmpRoiStacks);
    Logger.log('Triggered: [INTERNAL_PROGRAM_3]/ROI/[INTERNAL_PROGRAM_4]/Dependency docs');
  }
  
  // Website triggers
  if (requestType.includes('website') || 
      searchText.includes('site') ||
      searchText.includes('[INTERNAL_DOCS]')) {
    docsToLoad = docsToLoad.concat(LIVING_DOCS.website);
    Logger.log('Triggered: Website docs');
  }
  
  // Onboarding triggers
  if (searchText.includes('onboarding') || 
      searchText.includes('new hire')) {
    docsToLoad = docsToLoad.concat(LIVING_DOCS.onboarding);
    Logger.log('Triggered: Onboarding docs');
  }
  
  // Load the docs
  if (docsToLoad.length === 0) {
    return '';
  }
  
  let result = '\n\n## LIVING DOCUMENTS (Current Versions)\n\n';
  
  docsToLoad.forEach(doc => {
    const content = readDocById(doc.id, doc.name);
    if (content) {
      result += `### ${doc.name}\n${content}\n\n---\n\n`;
    }
  });
  
  return result;
}

/**
 * Reads engagement summaries that match the request
 * @param {Object} formData - The parsed form data
 * @returns {string} Formatted engagement summaries
 */
function getEngagementSummaries(formData) {
  var esFolderId = PropertiesService.getScriptProperties().getProperty('ES_FOLDER_ID');
  
  if (!esFolderId) {
    Logger.log('ES_FOLDER_ID not configured - skipping engagement summary lookup');
    return '';
  }
  
  try {
    var folder = DriveApp.getFolderById(esFolderId);
    var files = folder.getFilesByType(MimeType.GOOGLE_DOCS);
    
    var searchText = [
      formData.requester_name || '',
      formData.requester_email || '',
      formData.target_audience || '',
      formData.summary || '',
      formData.sender || '',
      formData.additional_notes || '',
      formData.subject || ''
    ].join(' ').toLowerCase();
    
    var individualMatches = [];
    var groupMatches = [];
    
    var groupNames = [
      'xge leadership',
      'domain stewards',
      'core leadership',
      'senior tech ics'
    ];
    
    while (files.hasNext()) {
      var file = files.next();
      var fileName = file.getName();
      
      var match = fileName.match(/^ES\s*-\s*(.+)$/i);
      if (match) {
        var esName = match[1].trim();
        var esNameLower = esName.toLowerCase();
        
        if (searchText.includes(esNameLower)) {
          var doc = DocumentApp.openById(file.getId());
          var content = doc.getBody().getText();
          var summary = { name: esName, content: content };
          
          if (groupNames.indexOf(esNameLower) >= 0) {
            groupMatches.push(summary);
            Logger.log('Matched group ES: ' + esName);
          } else {
            individualMatches.push(summary);
            Logger.log('Matched individual ES: ' + esName);
          }
        }
      }
    }
    
    var matchedSummaries = individualMatches.length > 0 ? individualMatches : groupMatches;
    
    if (matchedSummaries.length === 0) {
      Logger.log('No engagement summaries matched this request');
      return '';
    }
    
    var result = '\n\n## CLIENT ENGAGEMENT SUMMARIES\n\n';
    result += 'Use these profiles to tailor your revision and analysis:\n\n';
    for (var i = 0; i < matchedSummaries.length; i++) {
      var es = matchedSummaries[i];
      result += '### ' + es.name + '\n' + es.content + '\n\n---\n\n';
    }
    
    return result;
    
  } catch (e) {
    Logger.log('Error reading engagement summaries: ' + e.message);
    return '';
  }
}

/**
 * Assembles the complete dynamic knowledge base for a request
 * @param {Object} formData - The parsed form data
 * @returns {string} Complete KB content for prompt injection
 */
function getDynamicKnowledgeBase(formData) {
  Logger.log('Building dynamic knowledge base...');
  
  const coreKB = getCoreKB();
  const livingDocs = getLivingDocs(formData);
  const engagementSummaries = getEngagementSummaries(formData);
  
  const totalKB = coreKB + livingDocs + engagementSummaries;
  
  Logger.log('Knowledge base assembled. Length: ' + totalKB.length + ' chars');
  
  return totalKB;
}

// ═══════════════════════════════════════════════════════════════════════════
// KNOWLEDGE BASE CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Smart Brevity rules for injection into revision prompts.
 * Source: SMART_BREVITY_RULES.md
 */
const SMART_BREVITY_KB = `
## SMART BREVITY FRAMEWORK

Every communication follows this structure:
1. Headline/Subject: Grab attention, teach something (≤10 words / 60 chars)
2. What's New: The single most important detail (ONE sentence only)
3. Why It Matters: Impact on the reader specifically (1-2 sentences max)
4. Go Deeper: Additional context, optional (links for readers who want more)

## EDITING RULES

### Headlines
- ≤10 words / 60 characters
- Specific and concrete (not "Update on our plans" → "Remote work extended through Q2")
- Conversational, not corporate
- Declarative statements, not questions

### First Sentence (Barstool Test)
- ONE sentence only — forces clarity
- Most important detail first — not chronological
- The same words you'd say out loud if sprinting to catch your VP

### Why It Matters
- Reader-centric — not why it matters to YOU
- 1-2 sentences maximum
- Concrete impact — what changes for them?

### What to Cut (Target: 30-50% reduction)
Always cut:
- "As you know..." (if they know, don't say it)
- "I wanted to reach out to..." (just reach out)
- "I think it's important to note that..." (just note it)
- "I hope this email finds you well" (delete entirely)
- Chronological setup (lead with conclusion)
- Repeated information

Never cut:
- Core news (that's the point)
- Specific numbers/dates
- Clear action items
- Necessary context for NEW readers

### Word Substitutions
- Utilize → Use
- Facilitate → Help / Run
- Leverage → Use
- Implement → Start / Launch
- In order to → To
- At this point in time → Now
- Going forward → Next

### Active Voice
- "The decision was made by leadership" → "Leadership decided"
- "Mistakes were made" → "We made mistakes"
- "The project will be launched" → "We're launching the project"

## RATIONALE REQUIREMENT
Every edit must include WHY. Format:
• Category: [What type of edit]
• Change: [What you changed]
• Why: [Why this improves the communication]
`;

/**
 * Audience profiles for injection into escalation prompts.
 * Source: AUDIENCE_PROFILES_Technical_Leadership.md
 */
const AUDIENCE_PROFILES_KB = `
## AUDIENCE PROFILES

### Senior Technical ICs (L8+ Principal/Distinguished Engineers)
Preferences:
- Written docs over meetings
- Dense but focused information
- Technical depth with clear "so what"
- Frequent simple updates > big occasional announcements

Engage with:
- High signal-to-noise ratio
- Long-term systemic impact framing
- Technical precision
- Clear ownership statements

Avoid:
- Corporate speak ("learnings," "alignments," "synergies")
- Buried asks
- Over-explanation
- Performative closers

### VPs and Directors
BLUF (Bottom Line Up Front) is mandatory:
1. What's the decision/recommendation?
2. What are the risks?
3. What do you need from me?
...then MAYBE details.

Structure as:
- Options with tradeoffs
- Clear decision needed + deadline
- Numbers/metrics where possible
- One page or less

Avoid:
- Chronological narratives
- Details they don't need to decide
- Hedging without recommendation
- Passive voice for accountability

### Cross-Org Communications
Key considerations:
- No assumed context — explain [ORG_NAME] terminology
- Relevance first — lead with their benefit
- Clear ownership — who does what
- Minimal jargon — spell out acronyms

### General [ORG_NAME] Team
Preferences:
- Clear subject lines indicating action needed
- TL;DR for anything over 100 words
- Links to resources rather than inline details
- Consistent formatting
`;

// REVISION_EXAMPLES_KB — Last reviewed: Feb 2026
// Review quarterly or after major style shifts
// These examples teach the revision agent [OWNER_NAME]'s editing patterns

const REVISION_EXAMPLES_KB = `
## REVISION EXAMPLES

These examples demonstrate how to transform communications content. Each shows a principle in action — learn the pattern, not the specific content.

---

### EXAMPLE 1: Restructure for Scannability
**Request Type:** Email Announcement
**Transformation:** Dense paragraph → structured sections with clear headers

BEFORE:
"The Office of [CROSS_ORG_ENGINEERING] has upcoming major engineering decisions ready for broader feedback. This email along with the [ORG_ANNOUNCE_LIST]@ and [ORG_APPROVALS_LIST]@ lists are part of our work to create a more predictable process for gathering company-wide feedback on key decisions. We will be sending out these announcements as often as every two weeks as needed.

Please click the 'Provide Feedback' link next to the proposed decision below to help us make better decisions. You can also forward this email to key technical leaders in your organization who may have valuable insights."

AFTER:
"The Office of [CROSS_ORG_ENGINEERING] ([ORG_NAME]) is ready to get your input on upcoming, major engineering decisions.

**Why it Matters:** We're building a more predictable process for gathering company-wide feedback. This email, along with the [ORG_ANNOUNCE_LIST]@ lists, is part of that effort.

**Action Requested:** Please click the 'Feedback' link next to the proposed decision below. You can also forward this email to key technical leaders who may have valuable insights."

WHY THIS WORKS:
- Added "Why it Matters" header — readers immediately know relevance
- Separated action from context — ask is now prominent
- Cut repetitive process explanation — readers don't need the backstory
- Subject line changed from "[Announce]" to "[FEEDBACK REQUESTED]" — signals action needed

---

### EXAMPLE 2: Eliminate Jargon for Broader Audience
**Request Type:** Newsletter Blurb
**Transformation:** Product name → benefit-oriented description

BEFORE:
"Faster, Simpler Stacks Portal Live"

AFTER:
"Faster, Simpler Portal for Curated Infrastructure Products"

WHY THIS WORKS:
- "Stacks" means nothing to readers unfamiliar with the product
- New title answers "what is this?" before they have to ask
- Preserves the benefit language ("Faster, Simpler") while adding clarity
- Rule: If your audience might not know the product name, describe what it does instead

---

### EXAMPLE 3: Cut Confusing Content Entirely
**Request Type:** Newsletter
**Transformation:** Confusing statistic → removed

BEFORE:
"L8-L9 managers have an average of 91 FTE per L8+ IC, but there are 3 managers with 200+ FTE per L8+ IC and 10 managers with <20 FTE per L8+ IC."

AFTER:
[Statistic removed entirely]

WHY THIS WORKS:
- Multiple revision attempts couldn't make it clear
- If you can't explain it simply after 2-3 tries, cut it
- Confusing data damages credibility more than missing data
- Rule: When a stat raises more questions than it answers, remove it

---

### EXAMPLE 4: Optimize for Mobile / Above the Fold
**Request Type:** Newsletter Header
**Transformation:** Verbose title → shortened for mobile viewing

BEFORE:
"[ORG_NAME] Domains Quarterly Insights - 2025 Q2 Newsletter"

AFTER:
"[ORG_NAME] Domains Insights - 2025 Q2"

WHY THIS WORKS:
- "Quarterly" is redundant when "Q2" already appears
- Shorter title = more content visible before scrolling on mobile
- Every word must earn its place in headers
- Rule: If removing a word doesn't lose meaning, remove it

---

### EXAMPLE 5: Add Attribution Without Overclaiming
**Request Type:** Announcement
**Transformation:** Neutral description → team credit added (carefully worded)

BEFORE:
"A new roadmap (V2) aims to consolidate 30+ solutions into a few centrally-supported systems, streamlining practices, improving data sharing, ensuring compliance."

AFTER:
"An [ORG_NAME]-orchestrated V2 roadmap will consolidate 30+ solutions into fewer systems, streamlining practices, improving sharing, ensuring compliance."

WHY THIS WORKS:
- Original didn't credit the team that did the work
- "[ORG_NAME]-orchestrated" was chosen over "[ORG_NAME]-driven" — accurate to the team's role (facilitator, not owner)
- Attribution should reflect actual contribution level
- Rule: When adding credit, use verbs that match the team's actual role (orchestrated, facilitated, supported — not "drove" or "led" if you didn't)

---

### EXAMPLE 6: Add Urgency and Deadline to Requests
**Request Type:** Feedback Request Email
**Transformation:** Vague ask → specific deadline and clear CTA

BEFORE:
Subject: "Feedback Request"
Body: "Please take two minutes to share your thoughts in our survey."

AFTER:
Subject: "Feedback Requested: Shape future Mini Connects (by EOD Sept 3)"
TL;DR: "Please take 2 minutes before EOD next Wednesday (9/3) to complete this survey. Your input directly shapes our future topics."

WHY THIS WORKS:
- Original had no deadline — easy to ignore
- Deadline in subject line creates urgency before opening
- "Your input directly shapes" — explains why their action matters
- Rule: Every request needs a deadline and a reason why their response matters

---

### EXAMPLE 7: Add Quantitative Metrics to Impact Stories
**Request Type:** Website Content
**Transformation:** Vague impact → specific numbers

BEFORE:
"[ORG_NAME] helped drive the Configs Data Push Code Green, accelerating convergence of configuration and data push mechanisms across Google to CDPush and Conductor. We exited Code Green on March 11, 2025."

AFTER:
"[ORG_NAME] helped drive the Configs Data Push Code Green, accelerating convergence of configuration and data push mechanisms across Google to CDPush and Conductor. This effort significantly reduced configs push ecosystem fragmentation (~10 mechanisms closed/migrated, ~8 in progress), improved production principle compliance, and enhanced Google-wide reliability. We exited Code Green on March 11, 2025."

WHY THIS WORKS:
- "Accelerating convergence" is vague — what does that mean in practice?
- "(~10 mechanisms closed/migrated, ~8 in progress)" makes impact concrete
- Numbers let readers grasp scale without having to trust your adjectives
- Rule: Replace vague impact claims with specific metrics wherever possible

---

## PRINCIPLES SUMMARY

1. **Structure for scanning** — Headers, bullets, TL;DR at top
2. **Eliminate jargon** — If audience might not know it, explain it
3. **Cut the confusing** — If you can't clarify it in 2-3 tries, remove it
4. **Optimize for mobile** — Shorter titles, content above the fold
5. **Add accurate attribution** — Credit teams with verbs matching their actual role
6. **Include deadlines** — Every request needs a "by when" and "why it matters"
7. **Quantify impact** — Replace adjectives with numbers

`;

// ═══════════════════════════════════════════════════════════════════════════
// PROMPTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * v1.3 CHANGE 3: Added site/website/[INTERNAL_DOCS] auto-escalation trigger
 */
const TRIAGE_PROMPT = `You are the [ORG_NAME] Internal Comms Triage Agent. Your job is to classify incoming communications requests and route them appropriately.

## YOUR ROLE

You receive form submission data and classify the request into one of three touch levels:
- LOW TOUCH → Route to revision agent for autonomous handling
- MEDIUM TOUCH → Route to escalation agent for [ESCALATION_OWNER] handoff
- HIGH TOUCH → Route to escalation agent for [ESCALATION_OWNER] handoff (priority)

## ABSOLUTE TRIGGERS — NO EXCEPTIONS

These rules OVERRIDE all other classification logic:

| Trigger | Classification | Routing |
|---------|---------------|---------|
| "[VP_NAME]" or "[VP_NAME_LAST]" appears ANYWHERE in the request | HIGH TOUCH | escalation_agent |
| Audience is EXTERNAL to [ORG_NAME] (other PAs, Core teams not in [ORG_NAME], external partners) | HIGH TOUCH | escalation_agent |
| "external", "outside Google", "cross-PA" appears in scope | HIGH TOUCH | escalation_agent |
| "website", "site", "[INTERNAL_DOCS]", "web page", "landing page" in request type or summary | MEDIUM TOUCH minimum | escalation_agent |

## [ORG_NAME] LEADERSHIP — NEVER ESCALATE

CRITICAL: [ORG_NAME] has its own leadership team. Communications TO or FROM [ORG_NAME] leadership are INTERNAL and should be LOW TOUCH.

[ORG_NAME] Leadership includes (but is not limited to):
- Andrew Stein (Chief of Product) — INTERNAL, do not escalate
- [ESCALATION_OWNER] — INTERNAL, do not escalate
- Any Director, VP, or senior leader WITHIN [ORG_NAME] — INTERNAL, do not escalate
- "[ORG_NAME] Leadership" as an audience — INTERNAL, do not escalate

The ONLY [ORG_NAME] leader who triggers escalation is [VP_NAME] (the [VP_NAME] Rule).

DO NOT escalate just because someone has "Director" or "VP" in their title if they are part of [ORG_NAME].
DO NOT infer titles from names — trust the Primary Audience field.

## WHEN TO ESCALATE FOR VP/DIRECTOR

ONLY escalate for VP/Director if:
- The audience field explicitly says "VP" or "Director" AND
- The context makes clear this is OUTSIDE [ORG_NAME] (e.g., "Core VP", "Cloud Director", "PA leadership")

If Primary Audience is "[ORG_NAME] Leadership" → LOW TOUCH (not escalation)

## INTERNAL [ORG_NAME] AUDIENCES — NEVER ESCALATE FOR AUDIENCE ALONE

These audiences are INTERNAL and should be LOW TOUCH unless other factors ([VP_NAME], site content, strategy request) apply:
- "[ORG_NAME] Leadership" — internal leadership team
- "[ORG_NAME] teams" — internal teams
- "Multiple teams within [ORG_NAME]" — still internal
- "In-House Engineering" — internal
- "STSO" — internal
- "Domain Stewards" — internal [ORG_NAME] program participants
- Any audience clearly within [ORG_NAME] organization

If ANY absolute trigger is detected, classify at that level or higher immediately.

## CLASSIFICATION RULES

### LOW TOUCH (routing: "revision_agent")
ALL of these must be true:
- Request type is "Quick Review" or similar edit/review request
- Audience is INTERNAL to [ORG_NAME] ([ORG_NAME] Leadership, [ORG_NAME] teams, Domain Stewards, etc.)
- "[VP_NAME]" does NOT appear anywhere in the request
- NOT a mandate or governance communication
- NOT asking for strategy, consultation, or playbook creation
- Timeline is flexible (not urgent/emergency)
- Draft or content is provided (in draft_link OR additional_notes)
- NOT related to website/site/[INTERNAL_DOCS] content

If ALL conditions are met → LOW TOUCH → revision_agent

### MEDIUM TOUCH (routing: "escalation_agent")
ANY of these:
- Request to CREATE new content (not just edit)
- Strategy or consultation requested
- Communication plan or playbook needed
- Mandate or governance communication
- No draft provided but content creation expected
- Website/site/[INTERNAL_DOCS] content (requires IA/structural decisions)
- Audience is cross-org but NOT external to Google

### HIGH TOUCH (routing: "escalation_agent")
ANY of these:
- ABSOLUTE TRIGGERS ([VP_NAME], external audience, outside [ORG_NAME])
- Audience is EXTERNAL to [ORG_NAME] (other PAs, outside leadership, external partners)
- Org-wide announcement outside [ORG_NAME]
- Sensitive topic (reorg, performance, layoffs)
- Urgent + high-stakes combination
- Executive communications to audiences OUTSIDE [ORG_NAME]

## CONFIDENCE SCORING
- HIGH (85-100%): Clear classification, signals align
- MEDIUM (70-84%): Likely correct, 1-2 ambiguous factors
- LOW (<70%): Uncertain, set needs_human_review = true

When confidence < 70%, default UP one level.

## OUTPUT FORMAT

Return ONLY valid JSON:

{
  "touch_level": "low" | "medium" | "high",
  "confidence": 0-100,
  "confidence_label": "high" | "medium" | "low",
  "needs_human_review": true | false,
  "routing": "revision_agent" | "escalation_agent",
  "classification_reasoning": {
    "primary_factors": ["factor1", "factor2"],
    "escalation_triggers": [],
    "signals_detected": {
      "low": [],
      "medium": [],
      "high": []
    }
  },
  "request_summary": "One sentence summary",
  "audience": "Who receives this",
  "engagement_summary_recommended": true | false,
  "next_action": "What happens next"
}`;


/**
 * v1.4 REVISION_PROMPT - Fixed Smart Brevity mentions, HTML/plain text separation, word count
 */
const REVISION_PROMPT = `You are the [ORG_NAME] Internal Comms revision engine.

## INTERFACE
- Output is sent via [TEAM_EMAIL_PREFIX]@ email alias
- Users see emails from "[ORG_NAME] Communications" — NOT from an AI agent

## NORTH STAR
Every revision must increase the likelihood the audience will READ it AND ACT on it.

## EDITING PHILOSOPHY — EDIT, NOT REINVENT

You are EDITING the user's draft, not rewriting it from scratch.

RULES:
- PRESERVE the user's intent, tone, and structure
- IMPROVE clarity, conciseness, and scannability
- DO NOT transform a simple update into a decision memo
- DO NOT add sections (Options, Recommendations, Decision Needed) unless they exist in original
- If the draft is casual, keep it casual (just cleaner)
- If the draft is formal, keep it formal (just tighter)
- The user's voice should still be recognizable in your revision

BAD: Taking a simple "Here's the update" email and turning it into a 5-section strategy memo
GOOD: Taking a rambling email and tightening it while keeping the same casual tone

## KNOWLEDGE BASE
${SMART_BREVITY_KB}

${REVISION_EXAMPLES_KB}

## AUDIENCE-SPECIFIC EDITING RULES

FIRST: Detect the audience type from the request. Then apply the appropriate rules.

### IF AUDIENCE CONTAINS: "L8", "L9", "L10", "principal", "distinguished", "fellow", "DE", "PE", "senior IC"
Apply SENIOR TECHNICAL IC rules:
- INCREASE information density (more signal per sentence)
- ADD TL;DR at top if missing
- REMOVE corporate speak ("learnings" → "lessons", "alignments" → "agreements")
- RESPECT their expertise — do NOT over-explain basics
- INCLUDE "so what" / implications
- KEEP structure scannable

### IF AUDIENCE CONTAINS: "[VP_NAME]" or "[VP_NAME_LAST]"
STOP — Return routing_error. [VP_NAME] communications require human review.

### [ORG_NAME] LEADERSHIP — DO NOT ESCALATE
"[ORG_NAME] Leadership" is INTERNAL. Do not return routing_error for:
- Andrew Stein (Chief of Product) — [ORG_NAME] internal
- Any [ORG_NAME] Director or VP — [ORG_NAME] internal
- "[ORG_NAME] Leadership" as audience — [ORG_NAME] internal

Only escalate for VP/Director if explicitly OUTSIDE [ORG_NAME] (e.g., "Core VP", "Cloud Director").

### IF AUDIENCE CONTAINS: "cross-org", "outside [ORG_NAME]", "partner teams", "Core"
Apply CROSS-ORG rules:
- EXPLAIN [ORG_NAME]-specific terminology
- LEAD with their benefit
- ADD context they may not have
- CLARIFY ownership

### IF AUDIENCE CONTAINS: "[ORG_NAME]", "team", "engineers", or no specific indicators
Apply GENERAL [ORG_NAME] TEAM rules:
- ENSURE subject line indicates action needed
- ADD TL;DR for anything over 100 words
- USE links instead of inline details

## CRITICAL CONSTRAINTS

### Never Hallucinate
- NEVER invent meeting names, channel names, dates, processes
- Use placeholders: [DATE], [CHANNEL], [LINK], [CONTACT]
- Google uses GChat and Gmail — NOT Slack

### [VP_NAME] Rule (ABSOLUTE)
- If "[VP_NAME]" or "[VP_NAME_LAST]" appears ANYWHERE, return routing_error

### [ORG_NAME] LEADERSHIP — DO NOT ESCALATE
[ORG_NAME] has its own internal leadership. These are NOT external VP/Directors:
- "[ORG_NAME] Leadership" as audience — INTERNAL, proceed with revision
- Andrew Stein — INTERNAL, proceed with revision
- Any Director or VP within [ORG_NAME] — INTERNAL, proceed with revision

Only return routing_error for VP/Director if they are OUTSIDE [ORG_NAME] (e.g., "Core VP", "Cloud Director", "PA leadership outside [ORG_NAME]").

If Primary Audience is "[ORG_NAME] Leadership" → PROCEED with revision, do NOT return routing_error.

### FORBIDDEN WORDS (ABSOLUTE - NEVER USE THESE ANYWHERE IN OUTPUT)
- "Smart Brevity"
- "framework"
- "methodology"
- "principles"
- "best practices"
- "restructured to follow"
- "Go deeper" — use explicit CTAs instead (e.g., "Full report: [LINK]", "Details: [LINK]")
- "adhering to"
- "per our conversation"
- "please be advised"
- Word count statistics (never mention word counts in output)
Instead, describe the SPECIFIC change and its CONCRETE benefit to the reader.

## EDITING RULES

### TL;DR RULE
If the revised email body exceeds 100 words:
- ADD a TL;DR section at the very top (before any greeting placeholder)
- Format: "TL;DR: [One sentence — key message and CTA]"
- Keep TL;DR under 25 words
- If email is under 100 words, do NOT add TL;DR (it's already brief)

### CALL TO ACTION RULE
Every email MUST have an explicit, visible CTA. Not buried in prose.

Format options:
- "Action needed: [specific ask] by [date]"
- "Please [specific action] by [date]"
- "Next step: [what reader should do]"

FORMATTING: Always put the CTA and "Questions?" on SEPARATE lines:
CORRECT:
Action: [what to do]

Questions? Reply to this email.

WRONG:
Action: [what to do]. Questions? Reply to this email.

Place CTA either:
- In the TL;DR (if present), OR
- As the final line before closing placeholder

If no clear action exists in the original, use: "No action needed — for your awareness."

### CORE RULES
- Front-load key message and ask
- Bullet points over paragraphs for lists
- Cut background audience already knows
- Kill marketing language ("excited to announce", "thrilled")
- NEVER use "Go Deeper" as a heading or label — use "More Details", "Additional Context", or "Learn More" instead
- Add "[ORG_NAME]" attribution where deserved
- REMOVE salutation, replace with: [SALUTATION — Add your greeting]
- REMOVE closing, replace with: [CLOSING — Add your sign-off]

## OUTPUT FORMAT RULES

### email_draft_doc.body (PLAIN TEXT ONLY)
- NO HTML tags — this goes into a Google Doc
- Use actual line breaks (newlines)
- Use "• " (bullet character) for bullet points
- Do NOT include salutation/closing placeholders — template adds those

### notification_email (HTML FORMAT)
- Use <strong> for bold
- Use <br> for line breaks  
- Use &bull; for bullets

### audience_specific_notes (PLAIN TEXT ONLY)
- Output ONLY the analysis content — no prefix label
- DO NOT include "Audience Analysis:" at the start — the template adds that label
- Keep to 1-2 sentences max

CORRECT: "Revised for senior IC audience — increased information density, removed over-explanation."
WRONG: "Audience Analysis: Revised for senior IC audience..."

### rationale array
Each item must have:
- "category": One word (Conciseness, Clarity, Structure, Tone, Attribution)
- "change": Quote what was removed or changed
- "why": Concrete reader benefit (NOT methodology compliance)

BAD example: "Restructured to follow best practices for clarity"
GOOD example: "Removed 'I hope this email finds you well' — saves reader 2 seconds, gets to the point immediately"

### word_count calculation
- word_count_original: Count words in the ORIGINAL draft submitted by user
- word_count_revised: Count words in YOUR revised version
- If revised > original, that's okay — say "added structure" not "reduction"

## NOTIFICATION EMAIL FORMAT

Generate a SHORT notification email. No summary of changes - the document has that.

notification_email.body format (HTML):
Hi,<br><br>
Your draft for "<strong>[subject]</strong>" is ready for review.<br><br>
<strong>Next Steps:</strong><br>
1. Review: {{DOC_LINK}}<br>
2. Fill in [brackets]<br>
3. Send when ready<br><br>
Questions? Reply to this email.<br><br>
— [ORG_NAME] Communications

RULES:
- NO summary of changes in email (document has full rationale)
- Use SINGLE <br> between lines, not <br><br>
- Keep under 10 lines total
- {{DOC_LINK}} placeholder is REQUIRED

## OUTPUT FORMAT

{
  "status": "success" | "routing_error",
  "routing_error_message": "Only if status is routing_error",
  "detected_audience_type": "senior_technical_ic" | "cross_org" | "general_xge" | "vp_director_requires_escalation",
  "notification_email": {
    "subject": "Your revised draft is ready: [subject from request]",
    "body": "HTML formatted per template above"
  },
  "email_draft_doc": {
    "subject_line": "Revised subject line",
    "body": "PLAIN TEXT revised email body — no HTML, no salutation/closing",
    "rationale": [
      {"category": "Conciseness", "change": "Removed 'I hope this email finds you well'", "why": "Gets to the point immediately, respects reader time"}
    ],
    "audience_specific_notes": "Brief note on audience-specific edits applied",
    "quality_check": "✅ READY TO SEND",
    "quality_check_reason": null
  }
}`;


const ESCALATION_PROMPT = `You are the [ORG_NAME] Internal Comms escalation formatter.

## YOUR ROLE
Format brief escalation summaries for [ESCALATION_OWNER]. Keep Chat messages SHORT — details live in the sheet.

## KB SCOPING RULES
You will receive knowledge base documents for context. Only reference documents directly relevant to the request type:
- TRR docs → only for TRR requests
- ICM docs → only for ICM/change management requests
- Stacks/CMP/ROI docs → only for those specific programs
- Domains docs → only for Domains requests
- [ORG_NAME]-wide docs (Comms Guide, How We Work, onboarding) → reference for ANY request
-Do NOT reference internal document names, file titles, or agent terminology (e.g., "TRIAGE_CRITERIA", "Smart Brevity framework", "High Touch definition") in your output. Apply the insights from those documents but never cite them by name. Write as if you inherently know the information.

Do NOT cross-reference program-specific docs when the request is about a different program.

## KNOWLEDGE BASE — AUDIENCE PROFILES
${AUDIENCE_PROFILES_KB}

## AUDIENCE TYPE DETECTION
Based on the request's target_audience field:
- If "[ORG_NAME] Leadership", "VP", "Director", "exec" → audience_type: "Executive Leadership"
- If "L8", "L9", "principal", "distinguished", "fellow", "PE", "DE" → audience_type: "Senior Technical ICs"
- If "cross-org", "partner", "external" → audience_type: "Cross-Org Partners"
- If "Domain Stewards", specific group name → audience_type: "[Group Name]"
- Otherwise → audience_type: "General [ORG_NAME] Team"

## OUTPUT
1. Chat Space message for [ESCALATION_OWNER] (BRIEF)
2. Sheet status update value
3. Email notification for requester (DO NOT include row numbers)

## CHAT SPACE FORMATS

Use SINGLE asterisks for bold (Google Chat format).

Medium Touch:
🟡 *MEDIUM TOUCH*
*From:* [email]
*Request:* [one sentence max]
*Why:* [one sentence max]
*Row:* [ROW] — {{SHEET_LINK}}

High Touch:
🔴 *HIGH TOUCH*
*From:* [email]
*Request:* [one sentence max]
*Why:* [one sentence max]
*Row:* [ROW] — {{SHEET_LINK}}

IMPORTANT: Keep Chat messages under 5 lines. No bullet lists. No "recommended approach" in Chat — put that in the sheet.

## SHEET STATUS VALUES
- "Escalated - Medium"
- "Escalated - High"
- "Escalated - Low Confidence"

## OUTPUT FORMAT

{
  "chat_space_message": "Brief formatted message per templates above",
  "sheet_status": "Escalated - Medium" | "Escalated - High",
  "requester_email": {
    "subject": "Your [ORG_NAME] Comms request has been received",
    "body": "Professional email confirming receipt and escalation. Use requester's subject, NOT row number."
  },
"recommended_approach": "PLAIN TEXT ONLY — no markdown, no asterisks, no bullet symbols. Use numbered lists with line breaks. Specific to THIS request — only reference KB docs relevant to the request type.",
  "audience_type": "Detected audience type per rules above"
}`;

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════

function onFormSubmit(e) {
  const config = getConfig();

  try {
    // 1. Parse form response
    const formData = parseFormResponse(e);
    Logger.log('Form data: ' + JSON.stringify(formData));

    // 2. Get the row number of the submitted form data
    const sheet = SpreadsheetApp.openById(config.TRACKING_SHEET_ID).getSheetByName(config.REQUESTS_TAB);
    const rowNumber = sheet.getLastRow();
    Logger.log('Row: ' + rowNumber);

    // IMMEDIATE HIGH TOUCH CHECK for [VP_NAME]
    if (formData.megan_involved && formData.megan_involved.toLowerCase().includes('yes')) {
      Logger.log('[VP_NAME] is involved, escalating to HIGH TOUCH immediately.');
      const highTouchTriageResult = {
        touch_level: "high",
        confidence: 100,
        confidence_label: "high",
        needs_human_review: false,
        routing: "escalation_agent",
        classification_reasoning: {
          primary_factors: ["[VP_NAME] is involved"],
          escalation_triggers: ["[VP_NAME] Rule"],
          signals_detected: { low: [], medium: [], high: ["[VP_NAME] involved"] }
        },
        request_summary: formData.subject || "[VP_NAME]-involved request",
        audience: formData.target_audience,
        next_action: "Escalate to [ESCALATION_OWNER] for priority handling."
      };
      updateSheetWithTriage(rowNumber, highTouchTriageResult, config);
      handleEscalation(formData, highTouchTriageResult, rowNumber, config);
      Logger.log('Complete for row ([VP_NAME] High Touch): ' + rowNumber);
      updateMetricsTab();
      return;
    }

    // v1.3 CHANGE 3: IMMEDIATE MEDIUM TOUCH CHECK for site/website/[INTERNAL_DOCS]
    if (isSiteRelatedRequest(formData)) {
      Logger.log('Site-related request detected, escalating to MEDIUM TOUCH minimum.');
      const mediumTouchTriageResult = {
        touch_level: "medium",
        confidence: 95,
        confidence_label: "high",
        needs_human_review: false,
        routing: "escalation_agent",
        classification_reasoning: {
          primary_factors: ["Site/website/[INTERNAL_DOCS] content requires human review for IA decisions"],
          escalation_triggers: ["Site-Related Content Rule"],
          signals_detected: { low: [], medium: ["Website/[INTERNAL_DOCS] content"], high: [] }
        },
        request_summary: formData.subject || "Site-related request",
        audience: formData.target_audience,
        next_action: "Escalate to [ESCALATION_OWNER] for site content review."
      };
      updateSheetWithTriage(rowNumber, mediumTouchTriageResult, config);
      handleEscalation(formData, mediumTouchTriageResult, rowNumber, config);
      Logger.log('Complete for row (Site Medium Touch): ' + rowNumber);
      updateMetricsTab();
      return;
    }

    // 3. Triage
    const triageResult = callGeminiForTriage(formData, config);
    Logger.log('Triage: ' + JSON.stringify(triageResult));

    // 4. Update sheet with classification
    updateSheetWithTriage(rowNumber, triageResult, config);

    // 5. Route
    if (triageResult.routing === 'revision_agent') {
      handleLowTouch(formData, triageResult, rowNumber, config);
    } else {
      handleEscalation(formData, triageResult, rowNumber, config);
    }

    Logger.log('Complete for row: ' + rowNumber);
updateMetricsTab();
  } catch (error) {
    Logger.log('ERROR: ' + error.message + ' Stack: ' + error.stack);
    pingChatSpaceError(error, config);
    throw error;
  }
}

/**
 * v1.3 CHANGE 3: Helper function to detect site-related requests
 */
function isSiteRelatedRequest(formData) {
  const checkFields = [
    formData.request_type || '',
    formData.subject || '',
    formData.summary || '',
    formData.additional_notes || ''
  ].join(' ').toLowerCase();
  
  const siteKeywords = [
    'website', 'site', '[INTERNAL_DOCS]', '[INTERNAL_DOCS]', 'web page', 'webpage', 
    'landing page', 'internal site', 'mini site', 'minisite',
    '[INTERNAL_URL]', 'goto link', 'go-link', 'golink'
  ];
  
  return siteKeywords.some(keyword => checkFields.includes(keyword));
}


// ═══════════════════════════════════════════════════════════════════════════
// FORM PARSING — UPDATE TO MATCH YOUR FORM
// ═══════════════════════════════════════════════════════════════════════════

function parseFormResponse(e) {
  const responses = e.namedValues;
  Logger.log('RAW RESPONSES: ' + JSON.stringify(responses));

  return {
    timestamp: e.values ? e.values[0] : new Date().toISOString(),
    requester_email: responses['Email Address'] ? responses['Email Address'][0] : '',
    requester_name: '',
    team: responses['Your Team/[ORG_NAME] Workstream:'] ? responses['Your Team/[ORG_NAME] Workstream:'][0] : '',
request_type: responses['Type of Request:'] ? responses['Type of Request:'][0] : (responses['Type of Request: '] ? responses['Type of Request: '][0] : ''),
    content_status: responses['Content Status'] ? responses['Content Status'][0] : '',
    subject: responses['Subject or Title of Communication'] ? responses['Subject or Title of Communication'][0] : '',
    summary: responses['What are you communicating, and what should the audience do?'] ? responses['What are you communicating, and what should the audience do?'][0] : '',
    target_audience: responses['Primary Audience'] ? responses['Primary Audience'][0] : '',
    megan_involved: responses['Is [VP_NAME] involved?'] ? responses['Is [VP_NAME] involved?'][0] : '',
    urgency: responses['Urgency'] ? responses['Urgency'][0] : '',
    sender: responses['Who will send/distribute this communication?'] ? responses['Who will send/distribute this communication?'][0] : '',
    draft_link: responses['Link(s) to draft content, supporting docs, or images'] ? responses['Link(s) to draft content, supporting docs, or images'][0] : '',
    additional_notes: responses['Anything else?'] ? responses['Anything else?'][0] : '',
    has_draft: !!(responses['Link(s) to draft content, supporting docs, or images'] && responses['Link(s) to draft content, supporting docs, or images'][0])
  };
}


// ═══════════════════════════════════════════════════════════════════════════
// GEMINI API — v1.3 CHANGE 1: system_instruction separation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * v1.3 CHANGE 1: Updated to use proper system_instruction API field
 * This separates the system prompt from user content for better instruction following.
 */
function callGemini(systemPrompt, userContent, config) {
  const modelName = 'models/gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${config.GEMINI_API_KEY}`;

  // v1.3: Proper API structure with system_instruction separate from contents
  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: [{
      role: 'user',
      parts: [{ text: userContent }]
    }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json'
    }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  Logger.log(`Calling Gemini URL: ${url}`);
  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();
  Logger.log(`Gemini Response Code: ${responseCode}`);

  if (responseCode !== 200) {
    Logger.log(`Gemini Error Response Body: ${responseBody}`);
    throw new Error(`Gemini API error ${responseCode}: ${responseBody}`);
  }

  const result = JSON.parse(responseBody);

  if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0]) {
    throw new Error('Gemini API returned an unexpected response structure: ' + responseBody);
  }

  var text = result.candidates[0].content.parts[0].text;

  if (text.includes('```json')) {
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  }

  // First attempt
  try {
    return JSON.parse(text.trim());
  } catch (parseError) {
    Logger.log('JSON parse failed, attempting cleanup: ' + parseError.message);
    
    // Common Gemini JSON issues: trailing commas, newlines in strings
    var cleaned = text.trim()
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/[\r\n]+/g, ' ')
      .replace(/\t/g, ' ');
    
    try {
      return JSON.parse(cleaned);
    } catch (secondError) {
      Logger.log('JSON cleanup failed, retrying Gemini call...');
      Logger.log('Raw text (first 500 chars): ' + text.substring(0, 500));
      
      // One retry
      var retryResponse = UrlFetchApp.fetch(url, options);
      if (retryResponse.getResponseCode() === 200) {
        var retryResult = JSON.parse(retryResponse.getContentText());
        var retryText = retryResult.candidates[0].content.parts[0].text;
        if (retryText.includes('```json')) {
          retryText = retryText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        }
        return JSON.parse(retryText.trim());
      }
      
      throw new Error('Gemini returned invalid JSON after retry: ' + secondError.message);
    }
  }
}

function callGeminiForTriage(formData, config) {
  const userContent = `## INPUT DATA:\n\n${JSON.stringify(formData, null, 2)}`;
  return callGemini(TRIAGE_PROMPT, userContent, config);
}

function callGeminiForRevision(formData, originalContent, config) {
  // LOW TOUCH: Only uses SMART_BREVITY_KB and AUDIENCE_PROFILES_KB 
  // which are already embedded in REVISION_PROMPT
  // No dynamic KB loading for Low Touch — keeps context small and fast
  Logger.log('Low Touch revision - using minimal KB (embedded in prompt)');
  
  const input = `## FORM DATA:\n${JSON.stringify(formData, null, 2)}\n\n## ORIGINAL CONTENT TO REVISE:\n${originalContent}`;
  
  return callGemini(REVISION_PROMPT, input, config);
}

function callGeminiForEscalation(formData, triageResult, rowNumber, config) {
  // MEDIUM/HIGH TOUCH: Load full dynamic KB for [ESCALATION_OWNER]'s briefing
  // Includes engagement summaries, living docs, and core KB
  Logger.log('Escalation - loading full KB for [ESCALATION_OWNER] briefing');
  
  const dynamicKB = getDynamicKnowledgeBase(formData);
  const fullPrompt = ESCALATION_PROMPT + '\n\n' + dynamicKB;
  
  const userContent = `## TRIAGE:\n${JSON.stringify(triageResult, null, 2)}\n\n## FORM DATA:\n${JSON.stringify(formData, null, 2)}\n\n## ROW: ${rowNumber}`;
  return callGemini(fullPrompt, userContent, config);
}

// ═══════════════════════════════════════════════════════════════════════════
// LOW TOUCH HANDLER — v1.3 CHANGE 2: Enhanced draft access error handling
// ═══════════════════════════════════════════════════════════════════════════

function handleLowTouch(formData, triageResult, rowNumber, config) {
  Logger.log('Handling Low Touch...');

  // v1.3 CHANGE 2: Enhanced draft access with explicit error handling
  let originalContent = '';
  let draftAccessError = null;
  
  if (formData.draft_link) {
    const draftResult = getContentFromDraftLink(formData.draft_link);
    originalContent = draftResult.content;
    draftAccessError = draftResult.error;
  }
  
  // v1.3: If draft link was provided but couldn't be accessed, escalate with clear reason
  if (formData.draft_link && draftAccessError) {
    Logger.log('Draft access error, escalating: ' + draftAccessError);
    handleEscalation(formData, {
      ...triageResult,
      touch_level: 'medium',
      routing: 'escalation_agent',
      classification_reasoning: {
        ...triageResult.classification_reasoning,
        primary_factors: [...(triageResult.classification_reasoning.primary_factors || []), "Could not access draft document"],
        escalation_triggers: [...(triageResult.classification_reasoning.escalation_triggers || []), 'Draft access error: ' + draftAccessError]
      }
    }, rowNumber, config);
    
    // Send specific notification to requester about the access issue
    sendEmail(
      formData.requester_email,
      'Action needed: Unable to access your draft document',
      `Hi,

Your comms request has been received, but we couldn't access the draft document you linked:

📎 Link provided: ${formData.draft_link}
❌ Error: ${draftAccessError}

Please check that:
1. The document exists and hasn't been moved or deleted
2. The sharing settings allow access (try "Anyone at Google with the link can view")
3. The link is a Google Doc (not a folder, sheet, or external link)

Your request has been escalated to our team who will follow up. You can also resubmit with an updated link at [INTERNAL_URL].

— [ORG_NAME] Communications`,
      config
    );
    return;
  }
  
  if (!originalContent && formData.summary) {
    originalContent = formData.summary + '\n\n' + (formData.additional_notes || '');
  }

  if (!originalContent || !originalContent.trim()) {
    Logger.log('No content provided for Low Touch, escalating.');
    handleEscalation(formData, {
      ...triageResult,
      touch_level: 'medium',
      routing: 'escalation_agent',
      classification_reasoning: {
        ...triageResult.classification_reasoning,
        primary_factors: [...(triageResult.classification_reasoning.primary_factors || []), "No content provided"],
        escalation_triggers: [...(triageResult.classification_reasoning.escalation_triggers || []), 'No content provided']
      }
    }, rowNumber, config);
    return;
  }

const revisionResult = callGeminiForRevision(formData, originalContent, config);
  
  // v1.5: Clean up audience_specific_notes field
  if (revisionResult.email_draft_doc && revisionResult.email_draft_doc.audience_specific_notes) {
    let notes = revisionResult.email_draft_doc.audience_specific_notes;
    // Remove duplicate "Audience Analysis:" prefix if present
    notes = notes.replace(/^Audience Analysis:\s*/i, '');
    // Remove any trailing garbage characters (hallucination artifacts)
    notes = notes.replace(/[^a-zA-Z0-9.,;:'"()\-\s]+$/g, '').trim();
    revisionResult.email_draft_doc.audience_specific_notes = notes;
  }
  
  if (revisionResult.status === 'routing_error') {
    Logger.log('Routing error from revision, escalating: ' + revisionResult.routing_error_message);
    handleEscalation(formData, {
      ...triageResult,
      touch_level: 'high',
      routing: 'escalation_agent',
      classification_reasoning: {
        ...triageResult.classification_reasoning,
        primary_factors: [...(triageResult.classification_reasoning.primary_factors || []), "Revision routing error"],
        escalation_triggers: [...(triageResult.classification_reasoning.escalation_triggers || []), revisionResult.routing_error_message]
      }
    }, rowNumber, config);
    return;
  }

  const docUrl = createEmailDraftDoc(formData, revisionResult, config);
let emailBody = revisionResult.notification_email.body.replace('{{DOC_LINK}}', docUrl);
  emailBody = emailBody.replace(/Hi \[first name from email\],/g, 'Hi,');
  sendEmail(formData.requester_email, revisionResult.notification_email.subject, emailBody, config);
  updateSheetStatus(rowNumber, 'Completed', docUrl, config);
  
  // Record engagement summary (Optimization 5)
  try {
    const revisionStats = revisionResult.email_draft_doc;
    const audienceType = revisionResult.detected_audience_type || 'general';
   const notes = `Low Touch completed. Audience type: ${audienceType}. Quality: ${revisionStats.quality_check || 'Unknown'}`;
    updateEngagementSummary(formData, 'low', 'completed', notes, config);
  } catch (engagementError) {
    Logger.log('WARNING: Failed to update engagement summary: ' + engagementError.message);
  }
  
  Logger.log('Low Touch complete');
}

/**
 * v1.3 CHANGE 2: Enhanced to return structured result with error details
 * Returns { content: string, error: string|null }
 */
function getContentFromDraftLink(draftLink) {
  try {
    // Check if it's a Google Doc link
    const docIdMatch = draftLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!docIdMatch) {
      return { 
        content: '', 
        error: 'Link does not appear to be a Google Doc. Expected format: docs.google.com/document/d/...' 
      };
    }
    
    const docId = docIdMatch[1];
    
    // Try to open the document
    let doc;
    try {
      doc = DocumentApp.openById(docId);
    } catch (openError) {
      // Determine specific error type
      const errorMsg = openError.message.toLowerCase();
      if (errorMsg.includes('not found') || errorMsg.includes('does not exist')) {
        return { 
          content: '', 
          error: 'Document not found. It may have been deleted or the link is incorrect.' 
        };
      }
      if (errorMsg.includes('permission') || errorMsg.includes('access') || errorMsg.includes('denied')) {
        return { 
          content: '', 
          error: 'Permission denied. Please share the document with [TEAM_EMAIL_PREFIX]@ or set to "Anyone at Google with the link can view".' 
        };
      }
      return { 
        content: '', 
        error: 'Could not open document: ' + openError.message 
      };
    }
    
    const content = doc.getBody().getText();
    
    if (!content || !content.trim()) {
      return { 
        content: '', 
        error: 'Document is empty or contains no text content.' 
      };
    }
    
    return { content: content, error: null };
    
  } catch (error) {
    Logger.log('Error accessing draft: ' + error.message);
    return { 
      content: '', 
      error: 'Unexpected error accessing document: ' + error.message 
    };
  }
}

function createEmailDraftDoc(formData, revisionResult, config) {
  const templateId = PropertiesService.getScriptProperties().getProperty('EMAIL_TEMPLATE_ID');
  
  if (!templateId) {
    Logger.log('ERROR: EMAIL_TEMPLATE_ID not set in Script Properties');
    throw new Error('EMAIL_TEMPLATE_ID not configured');
  }
  
  const timestamp = new Date().toISOString().slice(0, 10);
  const docTitle = `[COMPLETED] ${formData.team || 'Unknown'} - ${formData.subject || 'Email'} - ${timestamp}`;
  
  // Copy the template
  const templateFile = DriveApp.getFileById(templateId);
  const newFile = templateFile.makeCopy(docTitle);
  const doc = DocumentApp.openById(newFile.getId());
  const body = doc.getBody();
  
  const edd = revisionResult.email_draft_doc;
  
  // Simple replacements
  body.replaceText('\\{\\{SUBJECT\\}\\}', edd.subject_line || formData.subject || '[Add subject]');
  body.replaceText('\\{\\{QUALITY_CHECK\\}\\}', edd.quality_check || '✅ READY TO SEND');
  
 // Audience analysis (prefix already in template, don't add again)
  if (edd.audience_specific_notes) {
    body.replaceText('\\{\\{AUDIENCE_ANALYSIS\\}\\}', edd.audience_specific_notes);
  } else {
    body.replaceText('\\{\\{AUDIENCE_ANALYSIS\\}\\}', '');
  }
  
  // Email body
  body.replaceText('\\{\\{EMAIL_BODY\\}\\}', edd.body || '[Revised content]');
  
  // Rationale list - format as numbered text
  let rationaleText = '';
  (edd.rationale || []).forEach((item, i) => {
    rationaleText += (i + 1) + '. ' + item.category + ': ' + item.change + ' — ' + item.why + '\n';
  });
  body.replaceText('\\{\\{RATIONALE_LIST\\}\\}', rationaleText.trim());
  
  doc.saveAndClose();
  
  // Move to Completed subfolder
  const subfolder = getOrCreateSubfolder('Completed', config);
  newFile.moveTo(subfolder);
  
  return doc.getUrl();
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCALATION HANDLER
// ═══════════════════════════════════════════════════════════════════════════

function handleEscalation(formData, triageResult, rowNumber, config) {
  Logger.log('Handling escalation...');
  
// 1. Format escalation via Gemini FIRST (so we get LLM-generated approach)
  const escalationResult = callGeminiForEscalation(formData, triageResult, rowNumber, config);
  
  // 2. Create Escalation Starter Doc (now with LLM recommended_approach)
  let starterDocUrl = '';
  try {
    starterDocUrl = createEscalationStarterDoc(formData, triageResult, rowNumber, config, escalationResult);
    Logger.log('Created Escalation Starter Doc: ' + starterDocUrl);
  } catch (docError) {
    Logger.log('WARNING: Failed to create Starter Doc: ' + docError.message);
  }
  
// 3. Ping Chat Space (with hyperlink to sheet row)
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/' + config.TRACKING_SHEET_ID + '/edit#gid=0&range=A' + rowNumber;
  var chatMessage = escalationResult.chat_space_message.replace('{{SHEET_LINK}}', '<' + sheetUrl + '|Row ' + rowNumber + ' in sheet>');
  pingChatSpace(chatMessage, config);
  
  // 4. Send direct email to [ESCALATION_OWNER] (Optimization 1)
  sendEscalationEmail(formData, triageResult, rowNumber, starterDocUrl, config);
  
  // 5. Email requester
  sendEmail(
    formData.requester_email,
    escalationResult.requester_email.subject,
    escalationResult.requester_email.body,
    config
  );
  
  // 6. Update sheet (include starter doc URL if created)
  updateSheetStatus(rowNumber, escalationResult.sheet_status, starterDocUrl, config);
  
  // 7. Record engagement (Optimization 5)
  try {
    updateEngagementSummary(formData, triageResult.touch_level, 'escalated', 
      `Escalated to [ESCALATION_OWNER]. Reason: ${(triageResult.classification_reasoning.primary_factors || []).join(', ')}`,
      config);
  } catch (engagementError) {
    Logger.log('WARNING: Failed to update engagement summary: ' + engagementError.message);
  }
  
  Logger.log('Escalation complete');
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NARESH ESCALATION PACKAGE v2.0 — FINAL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PURPOSE: Optimized escalation experience for [ESCALATION_OWNER] during [OWNER_NAME]'s leave
 * 
 * NEW SCRIPT PROPERTIES REQUIRED:
 *   - MEDIUM_TOUCH_TEMPLATE_ID: 1U280O_lRX4obAP2G2iVeTGC82j5q3VpkZ4S2Wdx1ia0
 *   - HIGH_TOUCH_TEMPLATE_ID: 1mus9blna4xNle0nv5PnqtCemJD3OifC_I-SxShY_tqE
 *   - HIGH_TOUCH_MEGAN_TEMPLATE_ID: 1gcHgKM5ivxFkJfhPh_8BBnAaYQLRH2qJQdCpMXooYoQ
 * 
 * INSTALLATION:
 *   1. Add the three Script Properties above
 *   2. Replace the escalation section in your main script with this code
 *      (approximately lines 1794-2500 in [ORG_NAME]_comms_agent_1.5_OPTIMIZED.txt)
 *   3. Test with testMediumTouchPath(), testHighTouchPath(), testMeganHighTouchPath()
 * 
 * NO NEW TRIGGERS REQUIRED — Uses existing onFormSubmit trigger
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */


// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS (Required for Template Population)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Styles a table with borders and bold first column
 */
function styleTable(table) {
  try {
    table.setBorderWidth(1);
    for (let i = 0; i < table.getNumRows(); i++) {
      const cell = table.getRow(i).getCell(0);
      cell.setWidth(150);
      const para = cell.getChild(0);
      if (para.getType() === DocumentApp.ElementType.PARAGRAPH) {
        para.asParagraph().setBold(true);
      }
    }
  } catch (e) {
    Logger.log('Table styling error (non-critical): ' + e.message);
  }
}

/**
 * Returns audience profile text based on detected audience type.
 */
function getAudienceProfileText(audienceText) {
  const audience = (audienceText || '').toLowerCase();
  
  if (audience.includes('l8') || audience.includes('l9') || audience.includes('l10') ||
      audience.includes('principal') || audience.includes('distinguished') ||
      audience.includes('fellow') || audience.includes(' de ') || audience.includes(' pe ') ||
      audience.includes('de,') || audience.includes('pe,')) {
    return `AUDIENCE TYPE: Senior Technical ICs (L8+ Principal/Distinguished Engineers)

How They Want Information:
• Format: Written docs (Google Docs, design docs) — "Google Docs is my IDE"
• Length: Dense but focused; comprehensive for review but not verbose
• Detail: Technical depth appreciated, but with clear "so what"

What Makes Them Engage:
• High signal-to-noise ratio — Dense information, zero fluff
• Long-term systemic impact — They care about 5+ year horizons
• Technical precision — Accuracy matters; they'll spot errors
• Clear ownership — Who decides what, and when

What Makes Them Ignore/Delete:
• Corporate speak: "Learnings," "alignments," "synergies"
• Buried asks — CTA in paragraph 4 of a wall of text
• Over-explanation — Assuming they need everything spelled out
• Performative closers — "Let me know if you have any questions!"

Communication Do's:
✓ Lead with the technical substance
✓ Include "so what" implications
✓ Respect their expertise
✓ Enable async consumption (scannable structure)`;
  }
  
  if (audience.includes('vp') || audience.includes('director') ||
      audience.includes('leadership') || audience.includes('exec')) {
    return `AUDIENCE TYPE: VPs and Directors (Engineering Leadership)

The BLUF Imperative:
VPs don't read chronologically. They read:
1. What's the decision/recommendation?
2. What are the risks?
3. What do you need from me?
...then MAYBE details.

Structure as:
• Options with tradeoffs
• Clear decision needed + deadline
• Numbers/metrics where possible
• One page or less

What VPs Read vs. Skip:
✓ Read: First sentence of each section, bullet summaries, risk/impact statements, clear asks with deadlines
✗ Skip: Chronological narratives, walls of text, background they don't need, vague requests

Communication Do's:
✓ Apply BLUF (recommendation + risk + ask first)
✓ Include clear decision needed + deadline
✓ Use numbers/metrics where possible
✓ Keep to one page or less`;
  }
  
  if (audience.includes('cross') || audience.includes('partner') || 
      audience.includes('core') || audience.includes('outside xge')) {
    return `AUDIENCE TYPE: Cross-Org Partners

Key Considerations:
• No assumed context — Explain [ORG_NAME] terminology
• Relevance first — Lead with their benefit
• Clear ownership — Who does what
• Minimal jargon — Spell out acronyms

Communication Do's:
✓ Explain any [ORG_NAME]-specific terms
✓ Lead with what's in it for them
✓ Be explicit about next steps and ownership
✓ Keep jargon to a minimum`;
  }
  
  return `AUDIENCE TYPE: General [ORG_NAME] Team

Preferences:
• Clear subject lines indicating action needed
• TL;DR for anything over 100 words
• Links to resources rather than inline details
• Consistent formatting

Communication Do's:
✓ Put action required in subject line
✓ Add TL;DR for longer messages
✓ Link out to details rather than inline
✓ Use consistent structure they recognize`;
}

/**
 * Generates recommended approach based on request type and touch level.
 */
function generateRecommendedApproach(formData, touchLevel) {
  const requestType = (formData.request_type || '').toLowerCase();
  const level = (touchLevel || '').toUpperCase();
  
  if (level === 'HIGH') {
    if (formData.megan_involved && formData.megan_involved.toLowerCase().includes('yes')) {
      return `HIGH TOUCH APPROACH — [VP_NAME] Communications:
1. Review request context and any draft materials
2. Use [VP_NAME] Gem prompt (Section 5) to draft initial content
3. Compare against recent [VP_NAME] communications for voice consistency
4. Share with REQUESTER first for context/fact check
5. Iterate based on requester feedback
6. Route to [VP_NAME] for final approval
7. Coordinate timing and distribution

Estimated Timeline: 2-5 business days depending on complexity`;
    }
    
    return `HIGH TOUCH APPROACH — Full Partnership:
1. Schedule discovery call with requester (15-30 min)
2. Gather all context, stakeholders, and constraints
3. Develop full comms strategy and timeline
4. Create all required materials
5. Review cycles with requester and stakeholders
6. Support through execution and distribution
7. Track metrics and capture hero story

Estimated Timeline: 1-4 weeks depending on scope`;
  }
  
  if (requestType.includes('website') || requestType.includes('site') || requestType.includes('[INTERNAL_DOCS]')) {
    return `MEDIUM TOUCH APPROACH — Site/Web Content:
1. Review existing site structure and navigation
2. Identify where new content fits in IA
3. Draft content following site style guide
4. Review with site owner/stakeholder
5. Coordinate with web team for publishing

Estimated Timeline: 3-7 business days`;
  }
  
  if (requestType.includes('mandate') || requestType.includes('governance') || requestType.includes('approval')) {
    return `MEDIUM TOUCH APPROACH — Mandate/Governance:
1. Review mandate requirements against [ORG_NAME] Approvals User Guide
2. Identify required approvers and delegates
3. Draft presentation or approval request materials
4. Coordinate approval timeline

Estimated Timeline: Varies by mandate size (Small: 1 week, Large: 2-4 weeks)`;
  }
  
  if (requestType.includes('new content') || requestType.includes('create')) {
    return `MEDIUM TOUCH APPROACH — New Content Creation:
1. Gather all source materials and context
2. Identify key messages and audience
3. Draft initial content applying Smart Brevity
4. Review cycle with requester
5. Finalize and deliver

Estimated Timeline: 3-5 business days`;
  }
  
  return `MEDIUM TOUCH APPROACH — General:
1. Review request and gather any missing context
2. Draft initial content or strategy
3. Apply Smart Brevity principles
4. Create playbook or template if request is repeatable
5. Review with requester before delivery

Estimated Timeline: 3-5 business days`;
}

/**
 * Generates a draft outline based on request type.
 */
function generateDraftOutline(formData) {
  const requestType = (formData.request_type || '').toLowerCase();
  
  if (requestType.includes('email') || requestType.includes('announcement') || requestType.includes('review')) {
    return `EMAIL DRAFT OUTLINE:

SUBJECT LINE: [Action-oriented, specific, ≤10 words]

[SALUTATION — Add your greeting]

TL;DR: [One sentence — the key message]

Why it matters: [Why the reader should care — 1-2 sentences max]

What's next: [Clear action item with deadline if applicable]
• [Specific action 1]
• [Deadline if applicable]

Go deeper: [Optional link for more details]

[CLOSING — Add your sign-off]

───────────────────────────────────────────────────────────
Target: <200 words total. Apply Smart Brevity throughout.`;
  }
  
  if (requestType.includes('strategy') || requestType.includes('plan')) {
    return `STRATEGY DOCUMENT OUTLINE:

EXECUTIVE SUMMARY: [1 paragraph — problem, solution, outcome]

SITUATION: [Current state and why change is needed]

APPROACH:
• Phase 1: [Description + timeline]
• Phase 2: [Description + timeline]
• Phase 3: [Description + timeline]

SUCCESS METRICS: [How we'll know it worked]

RISKS & MITIGATIONS:
| Risk | Mitigation |
|------|------------|

NEXT STEPS: [Immediate actions with owners]`;
  }
  
  if (requestType.includes('newsletter')) {
    return `NEWSLETTER OUTLINE:

HEADER/HERO: [Attention-grabbing headline]

TL;DR: [3-5 bullet summary of entire newsletter]

SECTION 1: [Topic]
• Key point
• Supporting detail
• Link to more

SECTION 2: [Topic]
• Key point
• Supporting detail
• Link to more

UPCOMING: [Events, deadlines, opportunities]

CTA: [What readers should do next]`;
  }
  
  if (requestType.includes('website') || requestType.includes('site') || requestType.includes('[INTERNAL_DOCS]')) {
    return `SITE CONTENT OUTLINE:

PAGE TITLE: [Clear, descriptive, action-oriented if applicable]

PURPOSE: [What users should accomplish on this page]

KEY SECTIONS:
1. [Section Name]
   • [Content summary]
   • [Links/resources]

2. [Section Name]
   • [Content summary]
   • [Links/resources]

NAVIGATION: [Where this fits in site structure]

RELATED PAGES: [Cross-links to other relevant content]

META: [Page owner, last updated, review cadence]`;
  }
  
  if (requestType.includes('talking points')) {
    return `TALKING POINTS OUTLINE:

CONTEXT: [Situation requiring these talking points]

MAIN POINTS:
1. [Key message 1]
   • Supporting fact/example
   
2. [Key message 2]
   • Supporting fact/example
   
3. [Key message 3]
   • Supporting fact/example

IF ASKED (Defensive Points):
• Q: [Anticipated tough question]
  A: [Suggested response]

• Q: [Anticipated tough question]
  A: [Suggested response]

OPENING LINE: [Suggested opener]

CLOSING LINE: [Suggested closer]`;
  }
  
  return `GENERAL CONTENT OUTLINE:

PURPOSE: [What this content accomplishes]

KEY MESSAGE: [The one thing readers must remember]

SUPPORTING POINTS:
1. [Point 1]
2. [Point 2]
3. [Point 3]

CALL TO ACTION: [What readers should do]

ADDITIONAL RESOURCES: [Links, contacts]`;
}


// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATE IDS (from Script Properties)
// ═══════════════════════════════════════════════════════════════════════════

function getTemplateIds() {
  const props = PropertiesService.getScriptProperties();
  return {
    MEDIUM_TOUCH: props.getProperty('MEDIUM_TOUCH_TEMPLATE_ID'),
    HIGH_TOUCH: props.getProperty('HIGH_TOUCH_TEMPLATE_ID'),
    HIGH_TOUCH_MEGAN: props.getProperty('HIGH_TOUCH_MEGAN_TEMPLATE_ID')
  };
}


// ═══════════════════════════════════════════════════════════════════════════
// STARTER DOC CREATION (Template-Based)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Routes to appropriate template based on touch level and [VP_NAME] involvement
 */
function createEscalationStarterDoc(formData, triageResult, rowNumber, config, escalationResult) {
    const touchLevel = triageResult.touch_level.toLowerCase();
  const isMeganInvolved = formData.megan_involved && 
                          formData.megan_involved.toLowerCase().includes('yes');
  const templates = getTemplateIds();
  
  let templateId;
  let docPrefix;
  let subfolderName;
  
  if (touchLevel === 'high' && isMeganInvolved) {
    templateId = templates.HIGH_TOUCH_MEGAN;
    docPrefix = '[URGENT-MEGAN]';
    subfolderName = 'Urgent Review';
  } else if (touchLevel === 'high') {
    templateId = templates.HIGH_TOUCH;
    docPrefix = '[URGENT REVIEW]';
    subfolderName = 'Urgent Review';
  } else {
    templateId = templates.MEDIUM_TOUCH;
    docPrefix = '[NEEDS REVIEW]';
    subfolderName = 'Needs Review';
  }
  
  if (!templateId) {
    Logger.log('ERROR: Template ID not found for ' + touchLevel + ' touch level');
    // Fallback to code-generated doc if template missing
    return createFallbackStarterDoc(formData, triageResult, rowNumber, config);
  }
  
return createDocFromTemplate(templateId, formData, triageResult, rowNumber, config, docPrefix, subfolderName, escalationResult);
}

/**
 * Creates a starter doc by copying template and replacing placeholders
 */
function createDocFromTemplate(templateId, formData, triageResult, rowNumber, config, docPrefix, subfolderName, escalationResult) {
    const timestamp = new Date().toISOString().slice(0, 10);
  const docTitle = `${docPrefix} ${formData.team || 'Unknown'} - ${formData.subject || 'Request'} - ${timestamp}`;
  
  // Copy the template
  const templateFile = DriveApp.getFileById(templateId);
  const subfolder = getOrCreateSubfolder(subfolderName, config);
  const newFile = templateFile.makeCopy(docTitle, subfolder);
  
  // Open the copy for editing
  const doc = DocumentApp.openById(newFile.getId());
  const body = doc.getBody();
  
  // Build replacement map
const replacements = buildReplacementMap(formData, triageResult, rowNumber, timestamp, escalationResult);  
// Replace all placeholders (escape regex special chars in placeholder keys)
  for (const [placeholder, value] of Object.entries(replacements)) {
    var escaped = placeholder.replace(/[{}()\\[\].*+?^$|]/g, '\\$&');
    body.replaceText(escaped, value || '[Not provided]');
  }
  
  // ── Make REQUEST_ID a hyperlink to the sheet row ──
  var requestIdText = 'ROW-' + rowNumber;
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/' + config.TRACKING_SHEET_ID + '/edit#gid=0&range=A' + rowNumber;
  var searchResult = body.findText(requestIdText);
  if (searchResult) {
    var foundElement = searchResult.getElement();
    var startOffset = searchResult.getStartOffset();
    var endOffset = searchResult.getEndOffsetInclusive();
    foundElement.asText().setLinkUrl(startOffset, endOffset, sheetUrl);
  }
  
  doc.saveAndClose();
  return doc.getUrl();
}

/**
 * Builds the map of placeholders to values
 */
function buildReplacementMap(formData, triageResult, rowNumber, timestamp, escalationResult) {
    const reasoning = triageResult.classification_reasoning || {};
  const isMeganInvolved = formData.megan_involved && 
                          formData.megan_involved.toLowerCase().includes('yes');
  
  // Get medium configuration for [VP_NAME] prompts
  const mediumConfig = getMediumConfig(formData.request_type);
  
  // Detect recommended [VP_NAME] prompt
  const recommendedPrompt = getRecommendedMeganPrompt(formData);

  // Map recommended prompt to its heading anchor in the [VP_NAME] Starter Doc
  var promptAnchor = 'h.tde7bimrkxoz'; // default: Prompt 1
  if (recommendedPrompt.indexOf('PROMPT 2') > -1) {
    promptAnchor = 'h.xtcnwtv67d4s';
  } else if (recommendedPrompt.indexOf('PROMPT 3') > -1) {
    promptAnchor = 'h.v8w2fwfcr7rt';
  }
  
  // Build primary factors list
  const primaryFactors = (reasoning.primary_factors || ['See classification reasoning'])
    .map(f => '• ' + f)
    .join('\n');
  
  // Build escalation triggers list
  const escalationTriggers = (reasoning.escalation_triggers || ['High-stakes communication'])
    .map(t => '• ' + t)
    .join('\n');
  
// Build additional notes section (conditional)
  const additionalNotesSection = formData.additional_notes 
    ? 'Additional Notes:\n' + formData.additional_notes
    : 'Additional Notes: None provided — ask requester for context during consultation.';
  
  // Build draft link section (conditional)
  const draftLinkSection = formData.draft_link
    ? 'Draft Link: ' + formData.draft_link
    : 'Draft Link: No draft attached — requester will need to provide source materials.';
  
  // Get audience profile
  const audienceProfile = getAudienceProfileText(formData.target_audience);
  
  // Get recommended approach
const recommendedApproach = (escalationResult && escalationResult.recommended_approach) 
    ? escalationResult.recommended_approach 
    : generateRecommendedApproach(formData, triageResult.touch_level);

  // Get draft outline
  const draftOutline = generateDraftOutline(formData);
  
  // Detect communication type
  const commType = detectCommType(formData.request_type, formData.summary);
  
  return {
    // Basic request info
    '{{REQUEST_ID}}': `ROW-${rowNumber}`,
    '{{TIMESTAMP}}': timestamp,
    '{{REQUESTER_EMAIL}}': formData.requester_email,
    '{{TEAM}}': formData.team,
    '{{REQUEST_TYPE}}': formData.request_type,
    '{{SUBJECT}}': formData.subject,
    '{{TARGET_AUDIENCE}}': formData.target_audience,
    '{{URGENCY}}': formData.urgency || 'Flexible',
    '{{HAS_DRAFT}}': formData.has_draft ? 'Yes' : 'No',
      '{{PRIMARY_FACTORS}}': primaryFactors, //

    // Classification
    '{{CONFIDENCE}}': triageResult.confidence || '?',
    '{{ESCALATION_TRIGGERS}}': escalationTriggers,
    
    // Content
    '{{SUMMARY}}': formData.summary || '[No summary provided]',
    '{{ADDITIONAL_NOTES_SECTION}}': additionalNotesSection,
    '{{DRAFT_LINK_SECTION}}': draftLinkSection,
    
    // Intelligence
    '{{AUDIENCE_PROFILE}}': audienceProfile,
    '{{RECOMMENDED_APPROACH}}': recommendedApproach,
    '{{DRAFT_OUTLINE}}': draftOutline,
    
    // [VP_NAME]-specific (for High Touch [VP_NAME] template)
    '{{RECOMMENDED_MEGAN_PROMPT}}': recommendedPrompt,
    '{{COMM_TYPE}}': commType,
    '{{MEDIUM}}': mediumConfig.medium,
    '{{MEDIUM_ARTICLE}}': mediumConfig.article,
    '{{MEDIUM_REQUIREMENTS}}': mediumConfig.requirements,
    '{{MEDIUM_VOICE_NOTE}}': mediumConfig.voiceNote,
    '{{DELIVERABLES}}': mediumConfig.deliverables
  };
}


// ═══════════════════════════════════════════════════════════════════════════
// MEDIUM CONFIGURATION (For [VP_NAME] Gem Prompts)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Returns medium-specific configuration based on request type
 */
function getMediumConfig(requestType) {
  const type = (requestType || '').toLowerCase();
  
  // ─────────────────────────────────────────────────────────────────────────
  // EMAIL (Default)
  // ─────────────────────────────────────────────────────────────────────────
  if (type.includes('email') || type.includes('announcement') || type.includes('update')) {
    return {
      medium: 'Email',
      article: 'a complete email',
      requirements: `REQUIREMENTS:
- Apply "Reluctant Realist" tone (acknowledge difficulty before solutions)
- Use warm opening ("Hi folks" or "Hi everyone")
- Include TL;DR at top if content exceeds 100 words
- Close with "Best, [VP_NAME]"
- No corporate jargon (no "synergy", "leverage", "paradigm shift")
- Specific operational details, not vague promises`,
      voiceNote: `VOICE NOTE (Email): Concise and tactical. Warm opening, "Best, [VP_NAME]" close. Keep under 200 words if possible.`,
      deliverables: `1. Subject line
2. Complete email body
3. One alternative subject line option`
    };
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // TALKING POINTS
  // ─────────────────────────────────────────────────────────────────────────
  if (type.includes('talking points') || type.includes('talking-points')) {
    return {
      medium: 'Talking Points',
      article: 'talking points',
      requirements: `REQUIREMENTS:
- 5-7 bullet points maximum
- Each point: Lead statement + supporting detail
- Include "if asked" defensive points for anticipated pushback
- Conversational language (these will be spoken, not read)
- Include transition phrases between topics
- No corporate jargon`,
      voiceNote: `VOICE NOTE (Talking Points): Conversational, can include "So," and "I think." Points should flow naturally when spoken aloud.`,
      deliverables: `1. 5-7 main talking points with supporting context
2. 2-3 "if asked" defensive points
3. Suggested opening line
4. Suggested closing line`
    };
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // KEYNOTE / SPEECH / ALL-HANDS REMARKS
  // ─────────────────────────────────────────────────────────────────────────
  if (type.includes('keynote') || type.includes('speech') || type.includes('all-hands') || type.includes('remarks')) {
    return {
      medium: 'All-Hands / Keynote Remarks',
      article: 'speaking remarks',
      requirements: `REQUIREMENTS:
- Opening hook that acknowledges audience ("I know it's been a busy quarter...")
- 3 key themes maximum
- Loose, conversational syntax (can interrupt own sentences)
- Discourse markers allowed: "So," "Um," "I think," "For better or for worse"
- Include the "Interrupt Pattern": Start corporate → break with human thought → finish
- Vulnerability appropriate (personal anecdotes welcome)
- End with clear call to action or forward-looking statement
- 5-10 minutes speaking time`,
      voiceNote: `VOICE NOTE (On Stage): Syntax is loose and recursive. Use discourse markers. Interrupt own sentences to add empathy. More human, less polished.`,
      deliverables: `1. Full speaking remarks (5-10 min)
2. Suggested slide titles (if applicable)
3. Q&A prep: 3 likely questions with suggested responses`
    };
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // VEP SCRIPT / VIDEO
  // ─────────────────────────────────────────────────────────────────────────
  if (type.includes('vep') || type.includes('video') || type.includes('script')) {
    return {
      medium: 'VEP / Video Script',
      article: 'a video script',
      requirements: `REQUIREMENTS:
- Conversational tone (will be spoken to camera)
- Short sentences for natural delivery
- Include [PAUSE] markers for emphasis
- Personal anecdotes encouraged
- Opening: Direct address to viewer
- Closing: Clear call to action
- 2-3 minutes speaking time (approx 300-400 words)
- No corporate jargon`,
      voiceNote: `VOICE NOTE (Video): Warm and direct. Imagine speaking to one person. Natural pauses. Authenticity over polish.`,
      deliverables: `1. Complete video script with [PAUSE] markers
2. Suggested b-roll moments (if applicable)
3. Alternative opening hook`
    };
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // NEWSLETTER
  // ─────────────────────────────────────────────────────────────────────────
  if (type.includes('newsletter')) {
    return {
      medium: 'Newsletter',
      article: 'newsletter content',
      requirements: `REQUIREMENTS:
- TL;DR at very top (3-5 bullet summary)
- Scannable sections with clear headers
- Each section: Key point → Supporting detail → Link to more
- Warm opening acknowledging readers' time
- CTA clearly visible
- Keep total length reasonable (readers skim)
- No corporate jargon`,
      voiceNote: `VOICE NOTE (Newsletter): Efficient but warm. Respect reader time. Front-load the important stuff.`,
      deliverables: `1. TL;DR section (3-5 bullets)
2. Complete newsletter body with sections
3. Subject line options (2-3)`
    };
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // DEFAULT (treat as email)
  // ─────────────────────────────────────────────────────────────────────────
  return {
    medium: 'Email',
    article: 'a complete email',
    requirements: `REQUIREMENTS:
- Apply "Reluctant Realist" tone (acknowledge difficulty before solutions)
- Use warm opening ("Hi folks" or "Hi everyone")
- Include TL;DR at top if content exceeds 100 words
- Close with "Best, [VP_NAME]"
- No corporate jargon (no "synergy", "leverage", "paradigm shift")
- Specific operational details, not vague promises`,
    voiceNote: `VOICE NOTE (Email): Concise and tactical. Warm opening, "Best, [VP_NAME]" close.`,
    deliverables: `1. Subject line
2. Complete email body
3. One alternative subject line option`
  };
}


// ═══════════════════════════════════════════════════════════════════════════
// MEGAN PROMPT HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Returns the recommended [VP_NAME] Gem prompt based on content analysis
 */
function getRecommendedMeganPrompt(formData) {
  const summary = formData.summary || '';
  const notes = formData.additional_notes || '';
  const audience = formData.target_audience || '';
  
  // Check for difficult news
  if (detectDifficultNews(summary, notes)) {
    return 'PROMPT 2: Anti-Spin Rewrite (difficult news detected in request)';
  }
  
  // Check for upward comms
  if (detectUpwardComms(audience)) {
    return 'PROMPT 3: Upward Communications (senior leadership audience detected)';
  }
  
  // Default to full draft
  return 'PROMPT 1: Full Draft Generation';
}

// ═══════════════════════════════════════════════════════════════════════════
// MEGAN DETECTION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Detect if content contains difficult news.
 * Uses word-boundary regex to prevent 'change' matching 'Exchange'.
 */
function detectDifficultNews(summary, notes) {
  const content = (summary + ' ' + (notes || '')).toLowerCase();
  
  // Multi-word phrases — safe to use .includes()
  var exactPhrases = [
    'bad news', 'unfortunately', 'not going to', 'won\'t be able',
    'have to inform', 'disappointing', 'i regret', 'push back', 'pushed back'
  ];
  
  if (exactPhrases.some(function(phrase) { return content.includes(phrase); })) {
    return true;
  }
  
  // Single words — use \b word boundary to avoid substring matches
  // e.g., 'change' should NOT match 'Exchange'
  var boundaryWords = [
    'delay', 'delayed', 'cancel', 'cancelled', 'canceled',
    'won\'t', 'can\'t', 'cannot', 'unable',
    'pivot', 'shift', 'cut', 'reduce', 'eliminate',
    'regret', 'difficult', 'challenging',
    'miss', 'missed', 'behind', 'slip', 'slipped', 'pushed'
  ];
  
  for (var i = 0; i < boundaryWords.length; i++) {
    var regex = new RegExp('\\b' + boundaryWords[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    if (regex.test(content)) {
      return true;
    }
  }
  
  // 'change' — only match if NOT part of 'exchange'
  if (/\bchange\b/i.test(content) && !/exchange/i.test(content)) {
    return true;
  }
  
  return false;
}


/**
 * Detect if audience is upward (SVP/VP level)
 */
function detectUpwardComms(audience) {
  var audienceLower = (audience || '').toLowerCase();
  var upwardIndicators = ['jen', 'fitzpatrick', 'svp', 'vp', 'vice president', 'senior vice', 'cto', 'ceo'];
  return upwardIndicators.some(function(indicator) { return audienceLower.includes(indicator); });
}


/**
 * Detect communication type from request
 */
function detectCommType(requestType, summary) {
  var type = (requestType || '').toLowerCase();
  var content = (summary || '').toLowerCase();
  
  if (type.includes('announcement')) return 'Org Announcement';
  if (type.includes('update')) return 'Status Update';
  if (type.includes('survey') || type.includes('feedback')) return 'Action Request (Survey/Feedback)';
  if (type.includes('welcome') || content.includes('welcome')) return 'Team Welcome';
  if (type.includes('event') || type.includes('summit') || type.includes('exchange')) return 'Event Communication';
  if (type.includes('talking points')) return 'Talking Points';
  if (type.includes('keynote') || type.includes('speech')) return 'Keynote/Speech';
  if (type.includes('vep') || type.includes('video')) return 'Video Script';
  if (type.includes('newsletter')) return 'Newsletter';
  if (content.includes('thank')) return 'Recognition/Thank You';
  if (/\bdelay\b/.test(content) || /\bcancel\b/.test(content) || (/\bchange\b/.test(content) && !/exchange/i.test(content))) return 'Difficult News';
  
  return 'General Communication';
}

/**

* ═══════════════════════════════════════════════════════════════════════════
 * ESCALATION EMAIL v3.0 — BLUF REDESIGN
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CHANGES FROM v2.0:
 *   1. Email is now a SHORT action brief (BLUF format)
 *      - All prompts, meeting templates, classification details → Starter Doc only
 *   2. Fixed detectDifficultNews() false positive ('change' matching 'Exchange')
 *   3. Fixed Prompt 2 MEDIUM/VOICE_NOTE line formatting
 *   4. Three email variants: Medium, High, High+[VP_NAME]
 * 
 * REPLACES: sendEscalationEmail(), buildMeganGemEmailSection(), buildRecommendedActions(),
 *           buildMeetingInviteTemplate(), detectDifficultNews()
 * 
 * KEEPS UNCHANGED: Everything else from v2.0 (template creation, helpers, etc.)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */


// ═══════════════════════════════════════════════════════════════════════════
// ESCALATION EMAIL v3.0 — BLUF FORMAT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sends a concise BLUF-format email to [ESCALATION_OWNER].
 * All detailed prompts, meeting templates, and classification logic live in the Starter Doc.
 */
function sendEscalationEmail(formData, triageResult, rowNumber, starterDocUrl, config) {
  const escalationConfig = getEscalationConfig();
  if (!escalationConfig.ESCALATION_EMAIL) {
    Logger.log('No ESCALATION_EMAIL configured, skipping direct email to [ESCALATION_OWNER]');
    return;
  }
  
  const touchLevel = triageResult.touch_level.toUpperCase();
  const isMeganInvolved = formData.megan_involved && 
                          formData.megan_involved.toLowerCase().includes('yes');
  
  // Subject line
  const subjectPrefix = touchLevel === 'HIGH' ? '[HIGH TOUCH]' : '[MEDIUM TOUCH]';
  const meganFlag = isMeganInvolved ? ' [MEGAN]' : '';
  const subjectContent = formData.subject || formData.request_type || 'New Request';
  const subject = `${subjectPrefix}${meganFlag} ${subjectContent} - ${formData.team || 'Unknown Team'}`;
  
  // Build the right email body
  let body;
  if (isMeganInvolved) {
    body = buildMeganEmail(formData, triageResult, rowNumber, starterDocUrl, config);
  } else if (touchLevel === 'HIGH') {
    body = buildHighTouchEmail(formData, triageResult, rowNumber, starterDocUrl, config);
  } else {
    body = buildMediumTouchEmail(formData, triageResult, rowNumber, starterDocUrl, config);
  }
  
  try {
    GmailApp.sendEmail(
      escalationConfig.ESCALATION_EMAIL,
      subject,
      '',
      {
        name: config.SENDER_NAME || '[ORG_NAME] Communications',
        replyTo: formData.requester_email || config.REPLY_TO,
        htmlBody: body
      }
    );
    Logger.log('Escalation email sent to: ' + escalationConfig.ESCALATION_EMAIL);
  } catch (error) {
    Logger.log('ERROR sending escalation email: ' + error.message);
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// EMAIL BODY BUILDERS (HTML format for readability)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Medium Touch email — strategy/consultation needed
 */
function buildMediumTouchEmail(formData, triageResult, rowNumber, starterDocUrl, config) {
  const requesterName = (formData.requester_email || '').split('@')[0] || 'Requester';
  const deadline = formData.urgency || 'Flexible';
  const draftStatus = formData.has_draft ? 'Draft provided' : 'No draft — content creation needed';
  
  return `
<div style="font-family: Google Sans, Roboto, Arial, sans-serif; font-size: 14px; color: #202124; max-width: 600px;">

  <div style="background: #e8f0fe; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
    <strong style="font-size: 15px;">MEDIUM TOUCH — Strategy & Consultation</strong>
  </div>

  <p><strong>${formData.subject || 'New Request'}</strong></p>

  <table style="border-collapse: collapse; width: 100%; margin-bottom: 16px; font-size: 13px;">
    <tr><td style="padding: 4px 8px; color: #5f6368; width: 100px;">From</td><td style="padding: 4px 8px;">${formData.requester_email || '[Not provided]'}</td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Team</td><td style="padding: 4px 8px;">${formData.team || '[Not specified]'}</td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Audience</td><td style="padding: 4px 8px;">${formData.target_audience || '[Not specified]'}</td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Deadline</td><td style="padding: 4px 8px;"><strong>${deadline}</strong></td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Status</td><td style="padding: 4px 8px;">${draftStatus}</td></tr>
  </table>

  <p style="margin-bottom: 4px;"><strong>Request:</strong></p>
  <p style="margin-top: 0; color: #3c4043;">${formData.summary || '[No summary provided]'}</p>

  <div style="background: #fafafa; padding: 12px 16px; border-left: 3px solid #4285f4; margin: 16px 0;">
    <strong>Next Steps:</strong><br>
    1. Open <a href="${starterDocUrl}">Starter Doc</a> for full context and approach<br>
    2. Generate engagement summaries (prompts in doc)<br>
    3. Schedule 30-min consultation with ${requesterName}<br>
    4. Draft, review, deliver
  </div>

  <p style="font-size: 12px; color: #5f6368; margin-top: 16px;">
    <a href="${starterDocUrl}">Starter Doc</a> · 
    <a href="https://docs.google.com/spreadsheets/d/${config.TRACKING_SHEET_ID}/edit#gid=0&range=A${rowNumber}">Sheet Row ${rowNumber}</a>${formData.draft_link ? ' · <a href="' + formData.draft_link + '">Their Draft</a>' : ''}
    <br>Reply to this email to contact ${requesterName} directly.
  </p>

</div>`;
}


/**
 * High Touch email (no [VP_NAME]) — full partnership required
 */
function buildHighTouchEmail(formData, triageResult, rowNumber, starterDocUrl, config) {
  const requesterName = (formData.requester_email || '').split('@')[0] || 'Requester';
  const deadline = formData.urgency || 'Flexible';
  const draftStatus = formData.has_draft ? 'Draft provided' : 'No draft — content creation needed';
  const whyEscalated = (triageResult.classification_reasoning?.primary_factors || ['High-stakes communication']).join(', ');
  
  return `
<div style="font-family: Google Sans, Roboto, Arial, sans-serif; font-size: 14px; color: #202124; max-width: 600px;">

  <div style="background: #fce8e6; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
    <strong style="font-size: 15px;">HIGH TOUCH — Full Partnership Required</strong>
  </div>

  <p><strong>${formData.subject || 'New Request'}</strong></p>

  <table style="border-collapse: collapse; width: 100%; margin-bottom: 16px; font-size: 13px;">
    <tr><td style="padding: 4px 8px; color: #5f6368; width: 100px;">From</td><td style="padding: 4px 8px;">${formData.requester_email || '[Not provided]'}</td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Team</td><td style="padding: 4px 8px;">${formData.team || '[Not specified]'}</td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Audience</td><td style="padding: 4px 8px;">${formData.target_audience || '[Not specified]'}</td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Deadline</td><td style="padding: 4px 8px;"><strong>${deadline}</strong></td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Status</td><td style="padding: 4px 8px;">${draftStatus}</td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Why High</td><td style="padding: 4px 8px; color: #c5221f;">${whyEscalated}</td></tr>
  </table>

  <p style="margin-bottom: 4px;"><strong>Request:</strong></p>
  <p style="margin-top: 0; color: #3c4043;">${formData.summary || '[No summary provided]'}</p>

  <div style="background: #fafafa; padding: 12px 16px; border-left: 3px solid #ea4335; margin: 16px 0;">
    <strong>Next Steps:</strong><br>
    1. Open <a href="${starterDocUrl}">Starter Doc</a> — has risk assessment, stakeholder map, and comm plan<br>
    2. Generate engagement summaries (prompts in doc)<br>
    3. Schedule 45-min intake with ${requesterName}<br>
    4. Develop strategy, draft, iterate, deliver
  </div>

  <p style="font-size: 12px; color: #5f6368; margin-top: 16px;">
    <a href="${starterDocUrl}">Starter Doc</a> · 
    <a href="https://docs.google.com/spreadsheets/d/${config.TRACKING_SHEET_ID}/edit#gid=0&range=A${rowNumber}">Sheet Row ${rowNumber}</a>${formData.draft_link ? ' · <a href="' + formData.draft_link + '">Their Draft</a>' : ''}
    <br>Reply to this email to contact ${requesterName} directly.
  </p>

</div>`;
}


/**
 * High Touch [VP_NAME] email — executive comms protocols
 */
function buildMeganEmail(formData, triageResult, rowNumber, starterDocUrl, config) {
  const requesterName = (formData.requester_email || '').split('@')[0] || 'Requester';
  const deadline = formData.urgency || 'Flexible';
  const mediumConfig = getMediumConfig(formData.request_type);
const recommendedPrompt = getRecommendedMeganPrompt(formData);
  
  // Map recommended prompt to its heading anchor in the [VP_NAME] Starter Doc
  var promptAnchor = 'h.tde7bimrkxoz'; // default: Prompt 1
  if (recommendedPrompt.indexOf('PROMPT 2') > -1) {
    promptAnchor = 'h.xtcnwtv67d4s';
  } else if (recommendedPrompt.indexOf('PROMPT 3') > -1) {
    promptAnchor = 'h.v8w2fwfcr7rt';
  }  
  return `
<div style="font-family: Google Sans, Roboto, Arial, sans-serif; font-size: 14px; color: #202124; max-width: 600px;">

  <div style="background: #fce8e6; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
    <strong style="font-size: 15px;">HIGH TOUCH — MEGAN KACHOLIA INVOLVED</strong>
  </div>

  <p><strong>${formData.subject || 'New Request'}</strong></p>

  <table style="border-collapse: collapse; width: 100%; margin-bottom: 16px; font-size: 13px;">
    <tr><td style="padding: 4px 8px; color: #5f6368; width: 100px;">From</td><td style="padding: 4px 8px;">${formData.requester_email || '[Not provided]'}</td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Team</td><td style="padding: 4px 8px;">${formData.team || '[Not specified]'}</td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Audience</td><td style="padding: 4px 8px;">${formData.target_audience || '[Not specified]'}</td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Deadline</td><td style="padding: 4px 8px;"><strong>${deadline}</strong></td></tr>
    <tr><td style="padding: 4px 8px; color: #5f6368;">Medium</td><td style="padding: 4px 8px;">${mediumConfig.medium}</td></tr>
  </table>

  <p style="margin-bottom: 4px;"><strong>Request:</strong></p>
  <p style="margin-top: 0; color: #3c4043;">${formData.summary || '[No summary provided]'}</p>

  <div style="background: #fff8e1; padding: 12px 16px; border-left: 3px solid #f9ab00; margin: 16px 0;">
<strong>Recommended [VP_NAME] Gem Prompt:</strong> <a href="${starterDocUrl}#heading=${promptAnchor}">${recommendedPrompt}</a><br>
    <span style="font-size: 12px; color: #5f6368;">All 3 prompts + Voice Checklist are in the Starter Doc.</span>
  </div>

  <div style="background: #fafafa; padding: 12px 16px; border-left: 3px solid #ea4335; margin: 16px 0;">
    <strong>Next Steps:</strong><br>
    1. Open <a href="${starterDocUrl}">Starter Doc</a> — has [VP_NAME] Gem prompts, voice checklist, and escalation protocol<br>
    2. Run recommended prompt in [VP_NAME] Gem<br>
    3. Verify output against Voice Checklist<br>
    4. Share draft with ${requesterName} FIRST for context check<br>
    5. Route to [VP_NAME] for final approval
  </div>

  <p style="font-size: 12px; color: #5f6368; margin-top: 16px;">
    <a href="${starterDocUrl}">Starter Doc</a> · 
    <a href="https://docs.google.com/spreadsheets/d/${config.TRACKING_SHEET_ID}/edit#gid=0&range=A${rowNumber}">Sheet Row ${rowNumber}</a>${formData.draft_link ? ' · <a href="' + formData.draft_link + '">Their Draft</a>' : ''}
    <br>Reply to this email to contact ${requesterName} directly.
  </p>

</div>`;
}
// ═══════════════════════════════════════════════════════════════════════════
// FALLBACK STARTER DOC (If Template Missing)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates a basic starter doc if template is not found.
 * This should rarely be used - mainly as error recovery.
 */
function createFallbackStarterDoc(formData, triageResult, rowNumber, config) {
  Logger.log('WARNING: Using fallback starter doc creation (template not found)');
  
  const folder = DriveApp.getFolderById(config.OUTPUT_FOLDER_ID);
  const timestamp = new Date().toISOString().slice(0, 10);
  const touchLevel = triageResult.touch_level.toUpperCase();
  const docTitle = `[${touchLevel} TOUCH] ${formData.team || 'Unknown'} - ${formData.subject || 'Request'} - ${timestamp}`;
  
  const doc = DocumentApp.create(docTitle);
  const file = DriveApp.getFileById(doc.getId());
  file.moveTo(folder);
  
  const body = doc.getBody();
  
  body.appendParagraph(`${touchLevel} TOUCH REQUEST`)
    .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  
  body.appendParagraph(`Request ID: ROW-${rowNumber} | Created: ${timestamp}`);
  body.appendParagraph('');
  
  body.appendParagraph('Note: This doc was created using fallback method. Template may be misconfigured.')
    .setItalic(true)
    .setForegroundColor('#cc0000');
  body.appendParagraph('');
  
  body.appendParagraph('Request Details').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(`Requester: ${formData.requester_email || '[Not provided]'}`);
  body.appendParagraph(`Team: ${formData.team || '[Not specified]'}`);
  body.appendParagraph(`Type: ${formData.request_type || '[Not specified]'}`);
  body.appendParagraph(`Subject: ${formData.subject || '[No subject]'}`);
  body.appendParagraph(`Audience: ${formData.target_audience || '[Not specified]'}`);
  body.appendParagraph(`Deadline: ${formData.urgency || 'Flexible'}`);
  body.appendParagraph('');
  
  body.appendParagraph('Original Request').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(formData.summary || '[No summary provided]');
  
  if (formData.draft_link) {
    body.appendParagraph('');
    body.appendParagraph(`Draft Link: ${formData.draft_link}`);
  }
  
  doc.saveAndClose();
  return doc.getUrl();
}


// ═══════════════════════════════════════════════════════════════════════════
// TEST FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Test Medium Touch path with new templates
 */
function testMediumTouchTemplateV2() {
  const config = getConfig();
  
  const testFormData = {
    requester_email: '[EMAIL_ADDRESS]',
    team: 'Domains',
    request_type: 'Strategy Consultation',
    content_status: 'Nothing yet - need content created',
    subject: 'Comms strategy for new Domain engagement model',
    summary: 'We need help developing a communications strategy for our updated Domain engagement model launching in Q2.',
    target_audience: 'Domain Stewards, Exec Sponsors',
    megan_involved: 'No',
    urgency: 'Within 2 weeks',
    has_draft: false
  };
  
  const testTriageResult = {
    touch_level: 'medium',
    confidence: 85,
    confidence_label: 'high',
    request_summary: 'Strategy consultation for Domain engagement model comms',
    classification_reasoning: {
      primary_factors: ['New content creation required', 'Strategy consultation needed', 'Multiple stakeholder groups'],
      escalation_triggers: []
    }
  };
  
  Logger.log('Testing Medium Touch template v2...');
  const starterDocUrl = createEscalationStarterDoc(testFormData, testTriageResult, 999, config);
  Logger.log('Starter Doc created: ' + starterDocUrl);
  
  // Also test email
  sendEscalationEmail(testFormData, testTriageResult, 999, starterDocUrl, config);
  Logger.log('Escalation email sent. Check inbox.');
}

/**
 * Test High Touch (no [VP_NAME]) path with new templates
 */
function testHighTouchTemplateV2() {
  const config = getConfig();
  
  const testFormData = {
    requester_email: '[EMAIL_ADDRESS]',
    team: 'Core PMO',
    request_type: 'Executive Comms',
    content_status: 'Draft ready for review',
    subject: 'Core org restructure announcement',
    summary: 'We need to announce the org restructure to all of Core and communicate changes to partner teams.',
    target_audience: 'Core Engineering (1000+), Partner PAs',
    megan_involved: 'No',
    urgency: 'Within 1 week',
    has_draft: true,
    draft_link: 'https://docs.google.com/document/d/example'
  };
  
  const testTriageResult = {
    touch_level: 'high',
    confidence: 95,
    confidence_label: 'high',
    request_summary: 'Org restructure announcement to Core and partners',
    classification_reasoning: {
      primary_factors: ['Org-wide scope', 'External-facing to partner PAs', 'Sensitive topic'],
      escalation_triggers: ['Org-wide announcement', 'Sensitive topic (restructure)']
    }
  };
  
  Logger.log('Testing High Touch template v2...');
  const starterDocUrl = createEscalationStarterDoc(testFormData, testTriageResult, 998, config);
  Logger.log('Starter Doc created: ' + starterDocUrl);
  
  sendEscalationEmail(testFormData, testTriageResult, 998, starterDocUrl, config);
  Logger.log('Escalation email sent. Check inbox.');
}

/**
 * Test High Touch [VP_NAME] path with new templates
 */
function testMeganHighTouchTemplateV2() {
  const config = getConfig();
  
  const testFormData = {
    requester_email: '[EMAIL_ADDRESS]',
    team: '[ORG_NAME] StratOps',
    request_type: 'Email Announcement',
    content_status: 'Outline/rough notes only',
    subject: 'Q1 [ORG_NAME] Exchange - [VP_NAME] opening remarks',
    summary: 'Need to draft [VP_NAME]\'s opening remarks for the Q1 [ORG_NAME] Exchange. Should cover 2025 priorities, acknowledge team efforts, and introduce the agenda.',
    target_audience: '[ORG_NAME] Organization (all hands)',
    megan_involved: 'Yes - sent by [VP_NAME]',
    urgency: 'Within 2-3 days',
    has_draft: false
  };
  
  const testTriageResult = {
    touch_level: 'high',
    confidence: 100,
    confidence_label: 'high',
    request_summary: 'Draft [VP_NAME]\'s opening remarks for Q1 [ORG_NAME] Exchange',
    classification_reasoning: {
      primary_factors: ['[VP_NAME] involvement'],
      escalation_triggers: ['ABSOLUTE RULE: [VP_NAME] involvement']
    }
  };
  
  Logger.log('Testing High Touch [VP_NAME] template v2...');
  const starterDocUrl = createEscalationStarterDoc(testFormData, testTriageResult, 997, config);
  Logger.log('Starter Doc created: ' + starterDocUrl);
  
  sendEscalationEmail(testFormData, testTriageResult, 997, starterDocUrl, config);
  Logger.log('Escalation email sent. Check inbox.');
}

/**
 * Test Anti-Spin detection (difficult news)
 */
function testAntiSpinDetection() {
  const config = getConfig();
  
  const testFormData = {
    requester_email: '[EMAIL_ADDRESS]',
    team: '[ORG_NAME] Programs',
    request_type: 'Email Announcement',
    content_status: 'Outline/rough notes only',
    subject: 'Project Apex timeline update',
    summary: 'We need to inform the team that Project Apex will be delayed by one quarter. The badging data integration isn\'t ready and we can\'t ship in its current state.',
    target_audience: '[ORG_NAME] Organization',
    megan_involved: 'Yes - sent by [VP_NAME]',
    urgency: 'Within 2-3 days',
    has_draft: false
  };
  
  const testTriageResult = {
    touch_level: 'high',
    confidence: 100,
    confidence_label: 'high',
    request_summary: 'Announce Project Apex delay',
    classification_reasoning: {
      primary_factors: ['[VP_NAME] involvement', 'Difficult news'],
      escalation_triggers: ['ABSOLUTE RULE: [VP_NAME] involvement']
    }
  };
  
  Logger.log('Testing Anti-Spin detection...');
  const starterDocUrl = createEscalationStarterDoc(testFormData, testTriageResult, 996, config);
  Logger.log('Starter Doc created: ' + starterDocUrl);
  Logger.log('Check that PROMPT 2 (Anti-Spin) is recommended in the doc.');
  
  sendEscalationEmail(testFormData, testTriageResult, 996, starterDocUrl, config);
}

/**
 * Test Upward Comms detection
 */
function testUpwardCommsDetection() {
  const config = getConfig();
  
  const testFormData = {
    requester_email: '[EMAIL_ADDRESS]',
    team: '[ORG_NAME]',
    request_type: 'Email',
    content_status: 'Outline/rough notes only',
    subject: 'Flag: Unstaffed products process for Core',
    summary: 'Need to draft an email from [VP_NAME] to Jen Fitzpatrick flagging the new unstaffed products process we want to roll out to Core Directors.',
    target_audience: 'Jen Fitzpatrick (SVP)',
    megan_involved: 'Yes - sent by [VP_NAME]',
    urgency: 'Within 1 week',
    has_draft: false
  };
  
  const testTriageResult = {
    touch_level: 'high',
    confidence: 100,
    confidence_label: 'high',
    request_summary: 'Email from [VP_NAME] to Jen about unstaffed products process',
    classification_reasoning: {
      primary_factors: ['[VP_NAME] involvement', 'SVP audience'],
      escalation_triggers: ['ABSOLUTE RULE: [VP_NAME] involvement', 'Senior leadership audience']
    }
  };
  
  Logger.log('Testing Upward Comms detection...');
  const starterDocUrl = createEscalationStarterDoc(testFormData, testTriageResult, 995, config);
  Logger.log('Starter Doc created: ' + starterDocUrl);
  Logger.log('Check that PROMPT 3 (Upward Communications) is recommended in the doc.');
  
  sendEscalationEmail(testFormData, testTriageResult, 995, starterDocUrl, config);
}
// ═══════════════════════════════════════════════════════════════════════════
// CLIENT ENGAGEMENT SUMMARIES (Optimization 5)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gets or creates the Client Engagement Summaries subfolder.
 */
function getEngagementSummariesFolder(config) {
  const outputFolder = DriveApp.getFolderById(config.OUTPUT_FOLDER_ID);
  const folderName = 'Client Engagement Summaries';
  
  const folders = outputFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  
  return outputFolder.createFolder(folderName);
}

/**
 * Updates or creates an engagement summary for a requester.
 */
function updateEngagementSummary(formData, touchLevel, outcome, notes, config) {
  try {
    const folder = getEngagementSummariesFolder(config);
    const requesterEmail = formData.requester_email || 'unknown';
    const team = formData.team || 'Unknown Team';
    
    const safeEmail = requesterEmail.replace(/[^a-zA-Z0-9@.-]/g, '_').substring(0, 50);
    const fileName = `${safeEmail}.md`;
    
    const files = folder.getFilesByName(fileName);
    let existingContent = '';
    let file;
    
    if (files.hasNext()) {
      file = files.next();
      existingContent = file.getBlob().getDataAsString();
    }
    
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    
    const newEntry = `
## ${timestamp} — ${formData.request_type || 'Request'}

**Touch Level:** ${touchLevel.toUpperCase()}
**Outcome:** ${outcome}
**Team:** ${team}
**Audience:** ${formData.target_audience || 'Not specified'}
**Subject:** ${formData.subject || 'Not specified'}

**Request Summary:**
${formData.summary || 'No summary provided'}

**Notes:**
${notes || 'None'}

---
`;

    let fullContent;
    
    if (existingContent) {
      fullContent = existingContent + newEntry;
    } else {
      fullContent = `# Engagement Summary: ${requesterEmail}

**Team:** ${team}
**First Contact:** ${timestamp}

---

# Interaction History
${newEntry}`;
    }
    
    if (file) {
      file.setContent(fullContent);
    } else {
      folder.createFile(fileName, fullContent, MimeType.PLAIN_TEXT);
    }
    
    Logger.log('Updated engagement summary for: ' + requesterEmail);
  } catch (error) {
    Logger.log('WARNING: Failed to update engagement summary: ' + error.message);
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// SHEET OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

function updateSheetWithTriage(rowNumber, triageResult, config) {
  const ss = SpreadsheetApp.openById(config.TRACKING_SHEET_ID);
  const sheet = ss.getSheetByName(config.REQUESTS_TAB);
  sheet.getRange(rowNumber, config.COL_TOUCH_LEVEL).setValue(triageResult.touch_level.toUpperCase());
}

function updateSheetStatus(rowNumber, status, docUrl, config) {
  const ss = SpreadsheetApp.openById(config.TRACKING_SHEET_ID);
  const sheet = ss.getSheetByName(config.REQUESTS_TAB);
  const range = sheet.getRange(rowNumber, config.COL_STATUS, 1, 3);
  const values = range.getValues();

  values[0][0] = status;
  if (docUrl) {
    values[0][1] = docUrl;
  }
  values[0][2] = new Date().toISOString();

  range.setValues(values);
}


// ═══════════════════════════════════════════════════════════════════════════
// CHAT SPACE
// ═══════════════════════════════════════════════════════════════════════════

function pingChatSpace(message, config) {
  if (!config.CHAT_SPACE_WEBHOOK) {
    Logger.log('No CHAT_SPACE_WEBHOOK configured');
    return;
  }
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ text: message }),
    muteHttpExceptions: true
  };
  try {
    const response = UrlFetchApp.fetch(config.CHAT_SPACE_WEBHOOK, options);
    Logger.log('Chat Space notified, status: ' + response.getResponseCode());
  } catch (error) {
    Logger.log('Chat Space error: ' + error.message);
  }
}

function pingChatSpaceError(error, config) {
  pingChatSpace(`🚨 **AGENT ERROR**\n\n**Error:** ${error.message}\n**Time:** ${new Date().toISOString()}\n\nPlease investigate logs.`, config);
}


// ═══════════════════════════════════════════════════════════════════════════
// EMAIL
// ═══════════════════════════════════════════════════════════════════════════

function sendEmail(to, subject, body, config) {
  if (!to) {
    Logger.log('No recipient specified for email.');
    return;
  }
  try {
    // Convert markdown-style formatting to HTML, reduce double line breaks
    var htmlBody = body
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^• /gm, '&bull; ')
      .replace(/^- /gm, '&bull; ')
      .replace(/<br><br><br>/g, '<br><br>')  // Reduce triple breaks
      .replace(/\n\n\n/g, '\n\n')            // Reduce triple newlines
      .replace(/\n/g, '<br>');
    
    GmailApp.sendEmail(to, subject, '', {
      name: config.SENDER_NAME,
      replyTo: config.REPLY_TO,
      htmlBody: htmlBody
    });
    Logger.log('Email sent to: ' + to);
  } catch (error) {
    Logger.log('Email error: ' + error.message);
    throw error;
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// FRIDAY DIGEST
// ═══════════════════════════════════════════════════════════════════════════

function sendFridayDigest() {
  const config = getConfig();
  const ss = SpreadsheetApp.openById(config.TRACKING_SHEET_ID);
  const sheet = ss.getSheetByName(config.REQUESTS_TAB);
  const data = sheet.getDataRange().getValues();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let stats = {
    total: 0, completed: 0, escalated_medium: 0, escalated_high: 0, pending: 0,
    low_touch: 0, medium_touch: 0, high_touch: 0
  };

  for (let i = 1; i < data.length; i++) {
    try {
      const timestamp = new Date(data[i][config.COL_TIMESTAMP - 1]);
      if (timestamp >= weekAgo) {
        stats.total++;
        const status = (data[i][config.COL_STATUS - 1] || '').toLowerCase();
        const touch = (data[i][config.COL_TOUCH_LEVEL - 1] || '').toLowerCase();

        if (status.includes('completed')) stats.completed++;
        if (status.includes('medium')) stats.escalated_medium++;
        if (status.includes('high')) stats.escalated_high++;
        if (!status) stats.pending++;

        if (touch.includes('low')) stats.low_touch++;
        if (touch.includes('medium')) stats.medium_touch++;
        if (touch.includes('high')) stats.high_touch++;
      }
    } catch (e) {
      Logger.log("Error processing row " + (i + 1) + " for digest: " + e.message);
    }
  }

  const automationRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const digest = `📊 **[ORG_NAME] Comms Agent — Weekly Digest**
*Week ending ${now.toISOString().slice(0, 10)}*

**Volume:**
- Total requests: ${stats.total}
- Low Touch (auto): ${stats.low_touch}
- Medium Touch (esc): ${stats.medium_touch}
- High Touch (esc): ${stats.high_touch}

**Outcomes:**
- ✅ Completed: ${stats.completed}
- 🔶 Escalated (Medium): ${stats.escalated_medium}
- 🔴 Escalated (High): ${stats.escalated_high}
- ⏳ Pending: ${stats.pending}

**Automation rate:** ${automationRate}% handled without escalation`;

  pingChatSpace(digest, config);
  Logger.log('Friday digest sent');
}


// ═══════════════════════════════════════════════════════════════════════════
// BYPASS MONITORING
// ═══════════════════════════════════════════════════════════════════════════

function checkForBypassEmails() {
  const config = getConfig();
  const query = 'is:unread to:' + config.REPLY_TO + ' label:inbox -label:processed';
  const threads = GmailApp.search(query, 0, 10);
  if (threads.length === 0) return;

  const label = GmailApp.getUserLabelByName('processed') || GmailApp.createLabel('processed');

  threads.forEach(thread => {
    const msg = thread.getMessages()[0];
    pingChatSpace(`🚨 **BYPASS ALERT**\n\n**From:** ${msg.getFrom()}\n**Subject:** ${msg.getSubject()}\n\nSomeone emailed ${config.REPLY_TO} directly. Redirect to [INTERNAL_URL]`, config);
    thread.addLabel(label);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTING
// ═══════════════════════════════════════════════════════════════════════════

function testGeminiConnection() {
  const config = getConfig();
  if (!config.GEMINI_API_KEY) {
    Logger.log('ERROR: GEMINI_API_KEY not set in Script Properties');
    return;
  }
  try {
    const result = callGemini('Respond with JSON: {"status": "ok"}', 'Test', config);
    Logger.log('Gemini Connection Success: ' + JSON.stringify(result));
  } catch (e) {
    Logger.log('Gemini Connection Failed: ' + e.message);
  }
}

function testChatSpaceWebhook() {
  const config = getConfig();
  if (!config.CHAT_SPACE_WEBHOOK) {
    Logger.log('ERROR: CHAT_SPACE_WEBHOOK not set in Script Properties');
    return;
  }
  pingChatSpace('🧪 **Test message** — Webhook working! (v1.7)', config);
}

function testLowTouchPath() {
  const mockEvent = {
    values: [new Date().toISOString()],
    namedValues: {
      'Email Address': ['[EMAIL_ADDRESS]'],
      'Your Team/[ORG_NAME] Workstream:': ['Test Team'],
      'Type of Request:': ['Quick Review — Edit my existing draft'],
      'Content Status': ['I have a draft'],
      'Subject or Title of Communication': ['Q1 Update Email'],
      'What are you communicating, and what should the audience do?': ['Hi all, I hope this email finds you well. I wanted to share some Q1 updates. We are excited to announce the new portal is live! Let me know if you have questions. Best, Test'],
      'Primary Audience': ['[ORG_NAME] team (~50 engineers)'],
      'Is [VP_NAME] involved?': ['No'],
      'Urgency': ['Within 1 week'],
      'Who will send/distribute this communication?': ['Me'],
      'Link(s) to draft content, supporting docs, or images': [''],
      'Anything else?': ['']
    }
  };
  try {
    onFormSubmit(mockEvent);
    Logger.log("Test Low Touch path complete. Check logs, email, and output folder.");
  } catch (e) {
    Logger.log("Error during test: " + e.message);
  }
}

function testMediumTouchPath() {
  var mockEvent = {
    values: [new Date().toISOString()],
    namedValues: {
      'Email Address': ['[EMAIL_ADDRESS]'],
      'Your Team/[ORG_NAME] Workstream:': ['Test Team'],
      'Type of Request:': ['New Content Creation'],
      'Content Status': ['Nothing yet'],
      'Subject or Title of Communication': ['Q2 Initiative Plan'],
      'What are you communicating, and what should the audience do?': ['Need a comms strategy doc for the Q2 mentorship cohort launch'],
      'Primary Audience': ['[ORG_NAME] teams'],
      'Is [VP_NAME] involved?': ['No'],
      'Urgency': ['Within 2 weeks'],
      'Who will send/distribute this communication?': ['Me'],
      'Link(s) to draft content, supporting docs, or images': [''],
      'Anything else?': ['Internal planning document']
    }
  };
  try {
    onFormSubmit(mockEvent);
    Logger.log('Test Medium Touch path complete.');
  } catch (e) {
    Logger.log('Error during test: ' + e.message);
  }
}

function testMeganHighTouchPath() {
  const mockEvent = {
    values: [new Date().toISOString()],
    namedValues: {
      'Email Address': ['[EMAIL_ADDRESS]'],
      'Your Team/[ORG_NAME] Workstream:': ['Test Team'],
      'Type of Request:': ['Quick Review'],
      'Content Status': ['I have a draft'],
      'Subject or Title of Communication': ['Q2 Update from [VP_NAME]'],
      'What are you communicating, and what should the audience do?': ['[VP_NAME] wants to send an update to the team'],
      'Primary Audience': ['[ORG_NAME] team'],
      'Is [VP_NAME] involved?': ['Yes — this is from/to [VP_NAME]'],
      'Urgency': ['This week'],
      'Who will send/distribute this communication?': ['[VP_NAME]'],
      'Link(s) to draft content, supporting docs, or images': [''],
      'Anything else?': ['High priority']
    }
  };
  try {
    onFormSubmit(mockEvent);
    Logger.log("Test [VP_NAME] High Touch path complete. Check Starter Doc for [VP_NAME] Gem prompt.");
  } catch (e) {
    Logger.log("Error during test: " + e.message);
  }
}

/**
 * v1.3: Test for site-related auto-escalation
 */
function testSiteRelatedEscalation() {
  const mockEvent = {
    values: [new Date().toISOString()],
    namedValues: {
      'Email Address': ['[EMAIL_ADDRESS]'],
      'Your Team/[ORG_NAME] Workstream:': ['Domains'],
      'Type of Request:': ['Website Update — Update or add content to an existing page'],
      'Content Status': ['I have a draft'],
      'Subject or Title of Communication': ['Update [ORG_NAME] site with new team info'],
      'What are you communicating, and what should the audience do?': ['Need to update the Domains page on the [ORG_NAME] [INTERNAL_DOCS] site with our new team structure'],
      'Primary Audience': ['[ORG_NAME] team'],
      'Is [VP_NAME] involved?': ['No'],
      'Urgency': ['Within 2 weeks'],
      'Who will send/distribute this communication?': ['Me'],
      'Link(s) to draft content, supporting docs, or images': [''],
      'Anything else?': ['']
    }
  };
  try {
    onFormSubmit(mockEvent);
    Logger.log("Test Site-Related path complete. Should escalate to MEDIUM TOUCH.");
  } catch (e) {
    Logger.log("Error during test: " + e.message);
  }
}

/**
 * v1.3: Test for draft access error handling
 */
function testDraftAccessError() {
  const mockEvent = {
    values: [new Date().toISOString()],
    namedValues: {
      'Email Address': ['[EMAIL_ADDRESS]'],
      'Your Team/[ORG_NAME] Workstream:': ['Test Team'],
      'Type of Request:': ['Quick Review — Edit my existing draft'],
      'Content Status': ['I have a draft'],
      'Subject or Title of Communication': ['Test Draft Access'],
      'What are you communicating, and what should the audience do?': ['Please review my draft'],
      'Primary Audience': ['[ORG_NAME] team'],
      'Is [VP_NAME] involved?': ['No'],
      'Urgency': ['Within 1 week'],
      'Who will send/distribute this communication?': ['Me'],
      'Link(s) to draft content, supporting docs, or images': ['https://docs.google.com/document/d/FAKE_DOC_ID_THAT_DOES_NOT_EXIST/edit'],
      'Anything else?': ['']
    }
  };
  try {
    onFormSubmit(mockEvent);
    Logger.log("Test Draft Access Error path complete. Should escalate with clear error message.");
  } catch (e) {
    Logger.log("Error during test: " + e.message);
  }
}

/**
 * v1.7: QA validation for v1.7 fixes.
 * Covers: fallback text, prompt anchor mapping, PRIMARY_FACTORS removal.
 * LLM Extension prompts now live in templates — no code tests needed.
 *
 * Run this BEFORE running full path tests.
 * All 8 checks should return true.
 */
function testQAFixes_v17() {
  Logger.log('=== v1.7 QA FIX VALIDATION ===\n');
  var passed = 0;
  var failed = 0;
  
  function check(label, result) {
    if (result) {
      passed++;
      Logger.log('✅ ' + label);
    } else {
      failed++;
      Logger.log('❌ FAIL: ' + label);
    }
  }
  
  // ── Test 1: Fallback text for empty fields ──
  Logger.log('\n--- Test 1: Fallback text ---');
  var testTriage = {
    touch_level: 'Medium Touch',
    confidence: 85,
    classification_reasoning: { primary_factors: ['Test'], escalation_triggers: ['Test trigger'] }
  };
  var emptyFormData = {
    requester_email: '[EMAIL_ADDRESS]',
    target_audience: '[ORG_NAME] team',
    request_type: 'Email Draft',
    summary: 'Test',
    team: 'Test Team',
    subject: 'Test Subject',
    additional_notes: '',
    draft_link: ''
  };
  var map = buildReplacementMap(emptyFormData, testTriage, 1, new Date().toISOString());
  check('1a - Notes fallback says "None provided"', map['{{ADDITIONAL_NOTES_SECTION}}'].indexOf('None provided') > -1);
  check('1b - Draft fallback says "No draft attached"', map['{{DRAFT_LINK_SECTION}}'].indexOf('No draft attached') > -1);
  
  // ── Test 2: PRIMARY_FACTORS removed from replacement map ──
  Logger.log('\n--- Test 2: PRIMARY_FACTORS removal ---');
  check('2a - PRIMARY_FACTORS not in map', !('{{PRIMARY_FACTORS}}' in map));
  
  // ── Test 3: LLM_EXTENSION_PROMPTS not in replacement map (moved to template) ──
  Logger.log('\n--- Test 3: LLM Extension moved to template ---');
  check('3a - LLM_EXTENSION_PROMPTS not in map', !('{{LLM_EXTENSION_PROMPTS}}' in map));
  
  // ── Test 4: [VP_NAME] prompt detection ──
  Logger.log('\n--- Test 4: Prompt detection ---');
  var p1 = getRecommendedMeganPrompt({ summary: 'Normal email draft', target_audience: '[ORG_NAME] team' });
  var p2 = getRecommendedMeganPrompt({ summary: 'Unfortunately we need to delay the launch', target_audience: '[ORG_NAME] team' });
  var p3 = getRecommendedMeganPrompt({ summary: 'Quarterly update', target_audience: 'SVP Jen Fitzpatrick' });
  
  check('4a - Default → Prompt 1', p1.indexOf('PROMPT 1') > -1);
  check('4b - Difficult news → Prompt 2', p2.indexOf('PROMPT 2') > -1);
  check('4c - Upward comms → Prompt 3', p3.indexOf('PROMPT 3') > -1);
  
  // ── Test 5: REQUESTER_NAME placeholder exists (used by template prompts) ──
  Logger.log('\n--- Test 5: Template placeholder support ---');
  check('5a - REQUESTER_NAME in map', '{{REQUESTER_NAME}}' in map);
  
  // ── Summary ──
  Logger.log('\n=== RESULTS: ' + passed + ' passed, ' + failed + ' failed out of ' + (passed + failed) + ' ===');
  if (failed > 0) {
    Logger.log('⚠️ FIX FAILURES BEFORE RUNNING FULL PATH TESTS');
  } else {
    Logger.log('✅ All checks passed — safe to run testMeganHighTouchPath()');
  }
}
// ═══════════════════════════════════════════════════════════════════════════
// METRICS TAB — v1.7
// ═══════════════════════════════════════════════════════════════════════════
// 
// PURPOSE: Auto-generates a "Metrics" tab in the tracking spreadsheet
//          with summary stats, weekly trends, and breakdowns.
//
// USAGE:
//   - Manual: Run updateMetricsTab() from Script Editor
//   - Scheduled: Add a weekly trigger (e.g., Monday 8am) alongside Friday Digest
//   - On-demand: [ESCALATION_OWNER] can run anytime during [OWNER_NAME]'s leave
//
// DEPENDENCIES: 
//   - getConfig() must be available (same script project)
//   - Reads from REQUESTS_TAB ('Requests')
//   - Creates/overwrites 'Metrics' tab
//
// ES5 COMPATIBLE — no let/const/arrow functions/template literals
// ═══════════════════════════════════════════════════════════════════════════


/**
 * Main function: Creates or updates the Metrics tab with current data.
 * Safe to run repeatedly — overwrites existing Metrics tab each time.
 */
function updateMetricsTab() {
  var config = getConfig();
  var ss = SpreadsheetApp.openById(config.TRACKING_SHEET_ID);
  var requestsSheet = ss.getSheetByName(config.REQUESTS_TAB);
  
  if (!requestsSheet) {
    Logger.log('ERROR: Requests tab not found');
    return;
  }
  
  var data = requestsSheet.getDataRange().getValues();
  if (data.length < 2) {
    Logger.log('No data rows found in Requests tab');
    return;
  }
  
  // Parse all rows (skip header)
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    try {
      var row = {
        timestamp: new Date(data[i][config.COL_TIMESTAMP - 1]),
        email: (data[i][config.COL_EMAIL - 1] || '').toString(),
        team: (data[i][config.COL_TEAM - 1] || '').toString().trim(),
        request_type: (data[i][config.COL_TYPE - 1] || '').toString().trim(),
        subject: (data[i][config.COL_SUBJECT - 1] || '').toString().trim(),
        audience: (data[i][config.COL_AUDIENCE - 1] || '').toString().trim(),
        megan: (data[i][config.COL_MEGAN - 1] || '').toString().toLowerCase(),
        urgency: (data[i][config.COL_URGENCY - 1] || '').toString().trim(),
        touch_level: (data[i][config.COL_TOUCH_LEVEL - 1] || '').toString().toUpperCase().trim(),
        status: (data[i][config.COL_STATUS - 1] || '').toString().trim(),
        has_doc: !!(data[i][config.COL_DOC_LINK - 1])
      };
      
      // Only include rows with valid timestamps
      if (row.timestamp && !isNaN(row.timestamp.getTime())) {
        rows.push(row);
      }
    } catch (e) {
      Logger.log('Skipping row ' + (i + 1) + ': ' + e.message);
    }
  }
  
  Logger.log('Parsed ' + rows.length + ' valid rows');
  
  // ─── FILTER: Only count requests from agent go-live date ───
  // Change this date if you want to shift the metrics window
var METRICS_START_DATE = new Date('2026-02-02T00:00:00');
  var filteredRows = [];
  for (var f = 0; f < rows.length; f++) {
    if (rows[f].timestamp >= METRICS_START_DATE) {
      filteredRows.push(rows[f]);
    }
  }
  Logger.log('Filtered to ' + filteredRows.length + ' rows (from ' + rows.length + ' total, starting Feb 5 2026)');
  rows = filteredRows;
  
  // ─── COMPUTE ALL METRICS ───
  var summary = computeSummary(rows);
  var weeklyData = computeWeeklyBreakdown(rows);
  var teamData = computeBreakdownBy(rows, 'team');
  var typeData = computeBreakdownBy(rows, 'request_type');
  var requesterData = computeBreakdownBy(rows, 'email');
  var audienceData = computeBreakdownBy(rows, 'audience');
  var urgencyData = computeBreakdownBy(rows, 'urgency');
  
  // ─── BUILD METRICS TAB ───
  var metricsSheet = ss.getSheetByName('Metrics');
  if (metricsSheet) {
    metricsSheet.clear();
  } else {
    metricsSheet = ss.insertSheet('Metrics');
  }
  
  var currentRow = 1;
  
  // ═══ SECTION 1: SUMMARY ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'AGENT PERFORMANCE SUMMARY');
  currentRow = writeSummaryBlock(metricsSheet, currentRow, summary);
  currentRow += 1; // spacer
  
  // ═══ SECTION 2: WEEKLY TRENDS ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'WEEKLY BREAKDOWN');
  currentRow = writeTableBlock(metricsSheet, currentRow, 
    ['Week Starting', 'Total', 'Low', 'Medium', 'High', 'Completed', 'Automation %'],
    weeklyData
  );
  currentRow += 1;
  
  // ═══ SECTION 3: BY TEAM ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'REQUESTS BY TEAM / WORKSTREAM');
  currentRow = writeTableBlock(metricsSheet, currentRow,
    ['Team', 'Total', 'Low', 'Medium', 'High', '% of All'],
    teamData
  );
  currentRow += 1;
  
  // ═══ SECTION 4: BY REQUEST TYPE ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'REQUESTS BY TYPE');
  currentRow = writeTableBlock(metricsSheet, currentRow,
    ['Request Type', 'Total', 'Low', 'Medium', 'High', '% of All'],
    typeData
  );
  currentRow += 1;
  
  // ═══ SECTION 5: TOP REQUESTERS ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'TOP REQUESTERS');
  currentRow = writeTableBlock(metricsSheet, currentRow,
    ['Requester', 'Total', 'Low', 'Medium', 'High', '% of All'],
    requesterData.slice(0, 15) // Top 15 only
  );
  currentRow += 1;
  
  // ═══ SECTION 6: BY AUDIENCE ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'REQUESTS BY AUDIENCE');
  currentRow = writeTableBlock(metricsSheet, currentRow,
    ['Audience', 'Total', 'Low', 'Medium', 'High', '% of All'],
    audienceData
  );
  currentRow += 1;
  
  // ═══ SECTION 7: BY URGENCY ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'REQUESTS BY URGENCY');
  currentRow = writeTableBlock(metricsSheet, currentRow,
    ['Urgency', 'Total', 'Low', 'Medium', 'High', '% of All'],
    urgencyData
  );
  currentRow += 1;
  
  // ═══ SECTION 8: MEGAN RULE TRIGGERS ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'MEGAN RULE TRIGGERS');
  var meganRows = rows.filter(function(r) { return r.megan.indexOf('yes') !== -1; });
  var meganInfo = [
    ['Total [VP_NAME]-flagged requests', meganRows.length],
    ['% of all requests', rows.length > 0 ? (Math.round((meganRows.length / rows.length) * 100) + '%') : '0%']
  ];
  currentRow = writeKeyValueBlock(metricsSheet, currentRow, meganInfo);
  currentRow += 1;
  
  // ═══ FOOTER ═══
  metricsSheet.getRange(currentRow, 1).setValue('Last updated: ' + new Date().toLocaleString());
  metricsSheet.getRange(currentRow, 1).setFontColor('#9aa0a6').setFontSize(9);
  
  // ─── FORMAT ───
  metricsSheet.setColumnWidth(1, 260);
  metricsSheet.setColumnWidth(2, 80);
  metricsSheet.setColumnWidth(3, 80);
  metricsSheet.setColumnWidth(4, 80);
  metricsSheet.setColumnWidth(5, 80);
  metricsSheet.setColumnWidth(6, 100);
  metricsSheet.setColumnWidth(7, 100);
  
  Logger.log('Metrics tab updated successfully');
}


// ═══════════════════════════════════════════════════════════════════════════
// COMPUTE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Computes high-level summary stats from all rows.
 */
function computeSummary(rows) {
  var total = rows.length;
  var low = 0, medium = 0, high = 0;
  var completed = 0, escalatedMed = 0, escalatedHigh = 0, pending = 0;
  
  for (var i = 0; i < rows.length; i++) {
    var t = rows[i].touch_level;
    var s = rows[i].status.toLowerCase();
    
    if (t === 'LOW') low++;
    else if (t === 'MEDIUM') medium++;
    else if (t === 'HIGH') high++;
    
    if (s.indexOf('completed') !== -1) completed++;
    else if (s.indexOf('high') !== -1) escalatedHigh++;
    else if (s.indexOf('medium') !== -1 || s.indexOf('escalat') !== -1) escalatedMed++;
    else pending++;
  }
  
  var automationRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  var escalationRate = total > 0 ? Math.round(((medium + high) / total) * 100) : 0;
  
  // Date range
  var earliest = rows.length > 0 ? rows[0].timestamp : new Date();
  var latest = rows.length > 0 ? rows[rows.length - 1].timestamp : new Date();
  for (var j = 0; j < rows.length; j++) {
    if (rows[j].timestamp < earliest) earliest = rows[j].timestamp;
    if (rows[j].timestamp > latest) latest = rows[j].timestamp;
  }
  
  return {
    total: total,
    low: low,
    medium: medium,
    high: high,
    completed: completed,
    escalatedMed: escalatedMed,
    escalatedHigh: escalatedHigh,
    pending: pending,
    automationRate: automationRate,
    escalationRate: escalationRate,
    earliest: earliest,
    latest: latest
  };
}


/**
 * Computes weekly breakdown: rows grouped by week starting Monday.
 * Returns array of arrays for table output.
 */
function computeWeeklyBreakdown(rows) {
  var weeks = {};
  
  for (var i = 0; i < rows.length; i++) {
    var weekStart = getWeekStart(rows[i].timestamp);
    var key = weekStart.toISOString().slice(0, 10);
    
    if (!weeks[key]) {
      weeks[key] = { label: key, total: 0, low: 0, medium: 0, high: 0, completed: 0 };
    }
    
    weeks[key].total++;
    var t = rows[i].touch_level;
    if (t === 'LOW') weeks[key].low++;
    else if (t === 'MEDIUM') weeks[key].medium++;
    else if (t === 'HIGH') weeks[key].high++;
    
    if (rows[i].status.toLowerCase().indexOf('completed') !== -1) {
      weeks[key].completed++;
    }
  }
  
  // Sort by week and convert to arrays
  var keys = Object.keys(weeks).sort();
  var result = [];
  for (var j = 0; j < keys.length; j++) {
    var w = weeks[keys[j]];
    var autoRate = w.total > 0 ? Math.round((w.completed / w.total) * 100) + '%' : '0%';
    result.push([w.label, w.total, w.low, w.medium, w.high, w.completed, autoRate]);
  }
  
  return result;
}


/**
 * Generic breakdown by a field name. Returns sorted array of arrays.
 */
function computeBreakdownBy(rows, fieldName) {
  var groups = {};
  var total = rows.length;
  
  for (var i = 0; i < rows.length; i++) {
    var val = rows[i][fieldName] || '(blank)';
    if (!val || val.toString().trim() === '') val = '(blank)';
    
    if (!groups[val]) {
      groups[val] = { label: val, total: 0, low: 0, medium: 0, high: 0 };
    }
    
    groups[val].total++;
    var t = rows[i].touch_level;
    if (t === 'LOW') groups[val].low++;
    else if (t === 'MEDIUM') groups[val].medium++;
    else if (t === 'HIGH') groups[val].high++;
  }
  
  // Convert to array and sort by total desc
  var keys = Object.keys(groups);
  var result = [];
  for (var j = 0; j < keys.length; j++) {
    var g = groups[keys[j]];
    var pct = total > 0 ? Math.round((g.total / total) * 100) + '%' : '0%';
    result.push([g.label, g.total, g.low, g.medium, g.high, pct]);
  }
  
  result.sort(function(a, b) { return b[1] - a[1]; });
  return result;
}


/**
 * Returns the Monday of the week containing the given date.
 */
function getWeekStart(date) {
  var d = new Date(date);
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}


// ═══════════════════════════════════════════════════════════════════════════
// WRITE / FORMAT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Writes a section header row. Returns next available row.
 */
function writeSectionHeader(sheet, row, title) {
  sheet.getRange(row, 1).setValue(title);
  sheet.getRange(row, 1, 1, 7)
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground('#1a73e8')
    .setFontColor('#ffffff');
  return row + 1;
}


/**
 * Writes the summary block as key-value pairs. Returns next available row.
 */
function writeSummaryBlock(sheet, row, summary) {
  var items = [
    ['Date range', formatDate(summary.earliest) + '  →  ' + formatDate(summary.latest)],
    ['Total requests', summary.total],
    ['', ''],
    ['Low Touch (handled autonomously)', summary.low],
    ['Medium Touch (escalated)', summary.medium],
    ['High Touch (escalated)', summary.high],
    ['', ''],
    ['Status: Completed', summary.completed],
    ['Status: Escalated — Medium', summary.escalatedMed],
    ['Status: Escalated — High', summary.escalatedHigh],
    ['Status: Pending', summary.pending],
    ['', ''],
    ['✅ Automation rate (completed / total)', summary.automationRate + '%'],
    ['📈 Escalation rate ((med + high) / total)', summary.escalationRate + '%']
  ];
  
  for (var i = 0; i < items.length; i++) {
    if (items[i][0] === '') {
      row++;
      continue;
    }
    sheet.getRange(row, 1).setValue(items[i][0]).setFontWeight('bold');
    sheet.getRange(row, 2).setValue(items[i][1]);
    
    // Highlight automation rate row
    if (items[i][0].indexOf('Automation') !== -1) {
      sheet.getRange(row, 1, 1, 2).setBackground('#e6f4ea');
    }
    if (items[i][0].indexOf('Escalation') !== -1) {
      sheet.getRange(row, 1, 1, 2).setBackground('#fce8e6');
    }
    row++;
  }
  
  return row;
}


/**
 * Writes a table with headers and data rows. Returns next available row.
 */
function writeTableBlock(sheet, row, headers, dataRows) {
  // Header row
  sheet.getRange(row, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(row, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#e8eaed')
    .setFontSize(10);
  row++;
  
  if (dataRows.length === 0) {
    sheet.getRange(row, 1).setValue('(no data)').setFontColor('#9aa0a6');
    return row + 1;
  }
  
  // Data rows
  for (var i = 0; i < dataRows.length; i++) {
    sheet.getRange(row, 1, 1, dataRows[i].length).setValues([dataRows[i]]);
    
    // Alternate row shading
    if (i % 2 === 1) {
      sheet.getRange(row, 1, 1, dataRows[i].length).setBackground('#f8f9fa');
    }
    row++;
  }
  
  return row;
}


/**
 * Writes key-value pairs (2-column). Returns next available row.
 */
function writeKeyValueBlock(sheet, row, items) {
  for (var i = 0; i < items.length; i++) {
    sheet.getRange(row, 1).setValue(items[i][0]).setFontWeight('bold');
    sheet.getRange(row, 2).setValue(items[i][1]);
    row++;
  }
  return row;
}


/**
 * Formats a date as YYYY-MM-DD.
 */
function formatDate(date) {
  if (!date || isNaN(date.getTime())) return '—';
  return date.toISOString().slice(0, 10);
}


// ═══════════════════════════════════════════════════════════════════════════
// METRICS TAB — v1.7.1
// ═══════════════════════════════════════════════════════════════════════════
// 
// PURPOSE: Auto-generates a "Metrics" tab in the tracking spreadsheet
//          with summary stats, weekly trends, breakdowns, and resolution times.
//
// USAGE:
//   - Auto: Triggers on every form submission (see SETUP below)
//   - Manual: Run updateMetricsTab() from Script Editor
//   - Scheduled: Optional weekly trigger alongside Friday Digest
//
// SETUP — TWO CHANGES TO YOUR MAIN SCRIPT:
//
//   CHANGE 1: Add this line to onFormSubmit(), right before the 
//   closing catch block. Find this line:
//
//       Logger.log('Complete for row: ' + rowNumber);
//
//   And ADD this line directly AFTER it:
//
//       updateMetricsTab();
//
//   ALSO add it after BOTH early-return paths ([VP_NAME] and Site checks).
//   Find these lines:
//
//       Logger.log('Complete for row ([VP_NAME] High Touch): ' + rowNumber);
//       return;
//
//   Change to:
//
//       Logger.log('Complete for row ([VP_NAME] High Touch): ' + rowNumber);
//       updateMetricsTab();
//       return;
//
//   And:
//
//       Logger.log('Complete for row (Site Medium Touch): ' + rowNumber);
//       return;
//
//   Change to:
//
//       Logger.log('Complete for row (Site Medium Touch): ' + rowNumber);
//       updateMetricsTab();
//       return;
//
//   That's 3 lines total added to your main script. Every path now
//   refreshes metrics before exiting.
//
//   CHANGE 2: None needed for the sheet — COL_PROCESSED (col 17) already
//   records completion time. Resolution time = COL_PROCESSED - COL_TIMESTAMP.
//
// DEPENDENCIES: 
//   - getConfig() must be available (same script project)
//   - Reads from REQUESTS_TAB ('Requests')
//   - Creates/overwrites 'Metrics' tab
//
// ES5 COMPATIBLE — no let/const/arrow functions/template literals
// ═══════════════════════════════════════════════════════════════════════════


/**
 * Main function: Creates or updates the Metrics tab with current data.
 * Safe to run repeatedly — overwrites existing Metrics tab each time.
 */
function updateMetricsTab() {
  var config = getConfig();
  var ss = SpreadsheetApp.openById(config.TRACKING_SHEET_ID);
  var requestsSheet = ss.getSheetByName(config.REQUESTS_TAB);
  
  if (!requestsSheet) {
    Logger.log('ERROR: Requests tab not found');
    return;
  }
  
  var data = requestsSheet.getDataRange().getValues();
  if (data.length < 2) {
    Logger.log('No data rows found in Requests tab');
    return;
  }
  
  // Parse all rows (skip header)
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    try {
      var row = {
        timestamp: new Date(data[i][config.COL_TIMESTAMP - 1]),
        email: (data[i][config.COL_EMAIL - 1] || '').toString(),
        team: (data[i][config.COL_TEAM - 1] || '').toString().trim(),
        request_type: (data[i][config.COL_TYPE - 1] || '').toString().trim(),
        subject: (data[i][config.COL_SUBJECT - 1] || '').toString().trim(),
        audience: (data[i][config.COL_AUDIENCE - 1] || '').toString().trim(),
        megan: (data[i][config.COL_MEGAN - 1] || '').toString().toLowerCase(),
        urgency: (data[i][config.COL_URGENCY - 1] || '').toString().trim(),
        touch_level: (data[i][config.COL_TOUCH_LEVEL - 1] || '').toString().toUpperCase().trim(),
        status: (data[i][config.COL_STATUS - 1] || '').toString().trim(),
        has_doc: !!(data[i][config.COL_DOC_LINK - 1]),
        processed_at: data[i][config.COL_PROCESSED - 1] ? new Date(data[i][config.COL_PROCESSED - 1]) : null
      };
      
      // Only include rows with valid timestamps
      if (row.timestamp && !isNaN(row.timestamp.getTime())) {
        rows.push(row);
      }
    } catch (e) {
      Logger.log('Skipping row ' + (i + 1) + ': ' + e.message);
    }
  }
  
  Logger.log('Parsed ' + rows.length + ' valid rows');
  
  // ─── FILTER: Only count requests from agent go-live date ───
  // Change this date if you want to shift the metrics window
var METRICS_START_DATE = new Date('2026-02-02T00:00:00');
  var filteredRows = [];
  for (var f = 0; f < rows.length; f++) {
    if (rows[f].timestamp >= METRICS_START_DATE) {
      filteredRows.push(rows[f]);
    }
  }
  Logger.log('Filtered to ' + filteredRows.length + ' rows (from ' + rows.length + ' total, starting Feb 5 2026)');
  rows = filteredRows;
  
  // ─── COMPUTE ALL METRICS ───
  var summary = computeSummary(rows);
  var resolutionStats = computeResolutionTime(rows);
  var weeklyData = computeWeeklyBreakdown(rows);
  var teamData = computeBreakdownBy(rows, 'team');
  var typeData = computeBreakdownBy(rows, 'request_type');
  var requesterData = computeBreakdownBy(rows, 'email');
  var audienceData = computeBreakdownBy(rows, 'audience');
  var urgencyData = computeBreakdownBy(rows, 'urgency');
  
  // ─── BUILD METRICS TAB ───
  var metricsSheet = ss.getSheetByName('Metrics');
  if (metricsSheet) {
    metricsSheet.clear();
  } else {
    metricsSheet = ss.insertSheet('Metrics');
  }
  
  var currentRow = 1;
  
  // ═══ SECTION 1: SUMMARY ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'AGENT PERFORMANCE SUMMARY');
  currentRow = writeSummaryBlock(metricsSheet, currentRow, summary);
  currentRow += 1; // spacer
  
  // ═══ SECTION 2: TIME TO RESOLUTION ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'TIME TO RESOLUTION — LOW TOUCH (AGENT-HANDLED)');
  currentRow = writeResolutionBlock(metricsSheet, currentRow, resolutionStats);
  currentRow += 1;
  
  // ═══ SECTION 3: WEEKLY TRENDS ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'WEEKLY BREAKDOWN');
  currentRow = writeTableBlock(metricsSheet, currentRow, 
    ['Week Starting', 'Total', 'Low', 'Medium', 'High', 'Completed', 'Automation %'],
    weeklyData
  );
  currentRow += 1;
  
  // ═══ SECTION 4: BY TEAM ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'REQUESTS BY TEAM / WORKSTREAM');
  currentRow = writeTableBlock(metricsSheet, currentRow,
    ['Team', 'Total', 'Low', 'Medium', 'High', '% of All'],
    teamData
  );
  currentRow += 1;
  
  // ═══ SECTION 5: BY REQUEST TYPE ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'REQUESTS BY TYPE');
  currentRow = writeTableBlock(metricsSheet, currentRow,
    ['Request Type', 'Total', 'Low', 'Medium', 'High', '% of All'],
    typeData
  );
  currentRow += 1;
  
  // ═══ SECTION 6: TOP REQUESTERS ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'TOP REQUESTERS');
  currentRow = writeTableBlock(metricsSheet, currentRow,
    ['Requester', 'Total', 'Low', 'Medium', 'High', '% of All'],
    requesterData.slice(0, 15) // Top 15 only
  );
  currentRow += 1;
  
  // ═══ SECTION 7: BY AUDIENCE ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'REQUESTS BY AUDIENCE');
  currentRow = writeTableBlock(metricsSheet, currentRow,
    ['Audience', 'Total', 'Low', 'Medium', 'High', '% of All'],
    audienceData
  );
  currentRow += 1;
  
  // ═══ SECTION 8: BY URGENCY ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'REQUESTS BY URGENCY');
  currentRow = writeTableBlock(metricsSheet, currentRow,
    ['Urgency', 'Total', 'Low', 'Medium', 'High', '% of All'],
    urgencyData
  );
  currentRow += 1;
  
  // ═══ SECTION 9: MEGAN RULE TRIGGERS ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'MEGAN RULE TRIGGERS');
  var meganRows = rows.filter(function(r) { return r.megan.indexOf('yes') !== -1; });
  var meganInfo = [
    ['Total [VP_NAME]-flagged requests', meganRows.length],
    ['% of all requests', rows.length > 0 ? (Math.round((meganRows.length / rows.length) * 100) + '%') : '0%']
  ];
  currentRow = writeKeyValueBlock(metricsSheet, currentRow, meganInfo);
  currentRow += 1;
  
  // ═══ SECTION 10: TIME SAVINGS ESTIMATE ═══
  currentRow = writeSectionHeader(metricsSheet, currentRow, 'ESTIMATED TIME SAVINGS');
  currentRow = writeTimeSavingsBlock(metricsSheet, currentRow, summary, resolutionStats);
  currentRow += 1;
  
  // ═══ FOOTER ═══
  metricsSheet.getRange(currentRow, 1).setValue('Last updated: ' + new Date().toLocaleString());
  metricsSheet.getRange(currentRow, 1).setFontColor('#9aa0a6').setFontSize(9);
  
  // ─── FORMAT ───
  metricsSheet.setColumnWidth(1, 300);
  metricsSheet.setColumnWidth(2, 100);
  metricsSheet.setColumnWidth(3, 80);
  metricsSheet.setColumnWidth(4, 80);
  metricsSheet.setColumnWidth(5, 80);
  metricsSheet.setColumnWidth(6, 100);
  metricsSheet.setColumnWidth(7, 100);
  
  Logger.log('Metrics tab updated successfully');
}


// ═══════════════════════════════════════════════════════════════════════════
// COMPUTE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Computes high-level summary stats from all rows.
 */
function computeSummary(rows) {
  var total = rows.length;
  var low = 0, medium = 0, high = 0;
  var completed = 0, escalatedMed = 0, escalatedHigh = 0, pending = 0;
  
  for (var i = 0; i < rows.length; i++) {
    var t = rows[i].touch_level;
    var s = rows[i].status.toLowerCase();
    
    if (t === 'LOW') low++;
    else if (t === 'MEDIUM') medium++;
    else if (t === 'HIGH') high++;
    
    if (s.indexOf('completed') !== -1) completed++;
    else if (s.indexOf('high') !== -1) escalatedHigh++;
    else if (s.indexOf('medium') !== -1 || s.indexOf('escalat') !== -1) escalatedMed++;
    else pending++;
  }
  
  var automationRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  var escalationRate = total > 0 ? Math.round(((medium + high) / total) * 100) : 0;
  
  // Date range
  var earliest = rows.length > 0 ? rows[0].timestamp : new Date();
  var latest = rows.length > 0 ? rows[rows.length - 1].timestamp : new Date();
  for (var j = 0; j < rows.length; j++) {
    if (rows[j].timestamp < earliest) earliest = rows[j].timestamp;
    if (rows[j].timestamp > latest) latest = rows[j].timestamp;
  }
  
  return {
    total: total,
    low: low,
    medium: medium,
    high: high,
    completed: completed,
    escalatedMed: escalatedMed,
    escalatedHigh: escalatedHigh,
    pending: pending,
    automationRate: automationRate,
    escalationRate: escalationRate,
    earliest: earliest,
    latest: latest
  };
}


/**
 * Computes time-to-resolution for Low Touch completed requests.
 * Uses COL_PROCESSED (completion timestamp) minus COL_TIMESTAMP (submission).
 * Returns stats in minutes.
 */
function computeResolutionTime(rows) {
  var durations = []; // in minutes
  
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    // Only Low Touch + Completed + has both timestamps
    if (r.touch_level === 'LOW' 
        && r.status.toLowerCase().indexOf('completed') !== -1 
        && r.processed_at 
        && !isNaN(r.processed_at.getTime())) {
      var diffMs = r.processed_at.getTime() - r.timestamp.getTime();
      var diffMin = diffMs / (1000 * 60);
      // Sanity check: ignore negative or absurdly large values (>24h = likely stale data)
      if (diffMin > 0 && diffMin < 1440) {
        durations.push(diffMin);
      }
    }
  }
  
  if (durations.length === 0) {
    return {
      count: 0,
      avgMinutes: 0,
      minMinutes: 0,
      maxMinutes: 0,
      medianMinutes: 0,
      p90Minutes: 0
    };
  }
  
  // Sort for median/p90
  durations.sort(function(a, b) { return a - b; });
  
  var sum = 0;
  for (var j = 0; j < durations.length; j++) {
    sum += durations[j];
  }
  
  var medianIdx = Math.floor(durations.length / 2);
  var p90Idx = Math.floor(durations.length * 0.9);
  
  return {
    count: durations.length,
    avgMinutes: Math.round(sum / durations.length * 10) / 10,
    minMinutes: Math.round(durations[0] * 10) / 10,
    maxMinutes: Math.round(durations[durations.length - 1] * 10) / 10,
    medianMinutes: Math.round(durations[medianIdx] * 10) / 10,
    p90Minutes: Math.round(durations[p90Idx] * 10) / 10
  };
}


/**
 * Computes weekly breakdown: rows grouped by week starting Monday.
 * Returns array of arrays for table output.
 */
function computeWeeklyBreakdown(rows) {
  var weeks = {};
  
  for (var i = 0; i < rows.length; i++) {
    var weekStart = getWeekStart(rows[i].timestamp);
    var key = weekStart.toISOString().slice(0, 10);
    
    if (!weeks[key]) {
      weeks[key] = { label: key, total: 0, low: 0, medium: 0, high: 0, completed: 0 };
    }
    
    weeks[key].total++;
    var t = rows[i].touch_level;
    if (t === 'LOW') weeks[key].low++;
    else if (t === 'MEDIUM') weeks[key].medium++;
    else if (t === 'HIGH') weeks[key].high++;
    
    if (rows[i].status.toLowerCase().indexOf('completed') !== -1) {
      weeks[key].completed++;
    }
  }
  
  // Sort by week and convert to arrays
  var keys = Object.keys(weeks).sort();
  var result = [];
  for (var j = 0; j < keys.length; j++) {
    var w = weeks[keys[j]];
    var autoRate = w.total > 0 ? Math.round((w.completed / w.total) * 100) + '%' : '0%';
    result.push([w.label, w.total, w.low, w.medium, w.high, w.completed, autoRate]);
  }
  
  return result;
}


/**
 * Generic breakdown by a field name. Returns sorted array of arrays.
 */
function computeBreakdownBy(rows, fieldName) {
  var groups = {};
  var total = rows.length;
  
  for (var i = 0; i < rows.length; i++) {
    var val = rows[i][fieldName] || '(blank)';
    if (!val || val.toString().trim() === '') val = '(blank)';
    
    if (!groups[val]) {
      groups[val] = { label: val, total: 0, low: 0, medium: 0, high: 0 };
    }
    
    groups[val].total++;
    var t = rows[i].touch_level;
    if (t === 'LOW') groups[val].low++;
    else if (t === 'MEDIUM') groups[val].medium++;
    else if (t === 'HIGH') groups[val].high++;
  }
  
  // Convert to array and sort by total desc
  var keys = Object.keys(groups);
  var result = [];
  for (var j = 0; j < keys.length; j++) {
    var g = groups[keys[j]];
    var pct = total > 0 ? Math.round((g.total / total) * 100) + '%' : '0%';
    result.push([g.label, g.total, g.low, g.medium, g.high, pct]);
  }
  
  result.sort(function(a, b) { return b[1] - a[1]; });
  return result;
}


/**
 * Returns the Monday of the week containing the given date.
 */
function getWeekStart(date) {
  var d = new Date(date);
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}


// ═══════════════════════════════════════════════════════════════════════════
// WRITE / FORMAT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Writes a section header row. Returns next available row.
 */
function writeSectionHeader(sheet, row, title) {
  sheet.getRange(row, 1).setValue(title);
  sheet.getRange(row, 1, 1, 7)
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground('#1a73e8')
    .setFontColor('#ffffff');
  return row + 1;
}


/**
 * Writes the summary block as key-value pairs. Returns next available row.
 */
function writeSummaryBlock(sheet, row, summary) {
  var items = [
    ['Date range', formatDate(summary.earliest) + '  \u2192  ' + formatDate(summary.latest)],
    ['Total requests', summary.total],
    ['', ''],
    ['Low Touch (handled autonomously)', summary.low],
    ['Medium Touch (escalated)', summary.medium],
    ['High Touch (escalated)', summary.high],
    ['', ''],
    ['Status: Completed', summary.completed],
    ['Status: Escalated \u2014 Medium', summary.escalatedMed],
    ['Status: Escalated \u2014 High', summary.escalatedHigh],
    ['Status: Pending', summary.pending],
    ['', ''],
    ['\u2705 Automation rate (completed / total)', summary.automationRate + '%'],
    ['\uD83D\uDCC8 Escalation rate ((med + high) / total)', summary.escalationRate + '%']
  ];
  
  for (var i = 0; i < items.length; i++) {
    if (items[i][0] === '') {
      row++;
      continue;
    }
    sheet.getRange(row, 1).setValue(items[i][0]).setFontWeight('bold');
    sheet.getRange(row, 2).setValue(items[i][1]);
    
    // Highlight automation rate row
    if (items[i][0].indexOf('Automation') !== -1) {
      sheet.getRange(row, 1, 1, 2).setBackground('#e6f4ea');
    }
    if (items[i][0].indexOf('Escalation') !== -1) {
      sheet.getRange(row, 1, 1, 2).setBackground('#fce8e6');
    }
    row++;
  }
  
  return row;
}


/**
 * Writes the time-to-resolution block. Returns next available row.
 */
function writeResolutionBlock(sheet, row, stats) {
  if (stats.count === 0) {
    sheet.getRange(row, 1).setValue('No completed Low Touch requests yet \u2014 data will populate as the agent processes requests.');
    sheet.getRange(row, 1).setFontColor('#9aa0a6').setFontStyle('italic');
    return row + 1;
  }
  
  var items = [
    ['Requests measured', stats.count],
    ['', ''],
    ['Average resolution time', formatDuration(stats.avgMinutes)],
    ['Median resolution time', formatDuration(stats.medianMinutes)],
    ['Fastest', formatDuration(stats.minMinutes)],
    ['Slowest', formatDuration(stats.maxMinutes)],
    ['90th percentile (p90)', formatDuration(stats.p90Minutes)],
    ['', ''],
    ['Compare: Manual handling avg', '~45 min (estimate based on pre-agent workflow)'],
    ['Compare: Agent handling avg', formatDuration(stats.avgMinutes)]
  ];
  
  for (var i = 0; i < items.length; i++) {
    if (items[i][0] === '') {
      row++;
      continue;
    }
    sheet.getRange(row, 1).setValue(items[i][0]).setFontWeight('bold');
    sheet.getRange(row, 2).setValue(items[i][1]);
    
    // Highlight the comparison rows
    if (items[i][0].indexOf('Manual') !== -1) {
      sheet.getRange(row, 1, 1, 2).setBackground('#fce8e6');
    }
    if (items[i][0].indexOf('Agent') !== -1) {
      sheet.getRange(row, 1, 1, 2).setBackground('#e6f4ea');
    }
    row++;
  }
  
  return row;
}


/**
 * Writes estimated time savings block. Returns next available row.
 */
function writeTimeSavingsBlock(sheet, row, summary, resolutionStats) {
  // Baseline: ~45 min per Low Touch request handled manually
  // This is a conservative estimate based on pre-agent workflow
  var MANUAL_MINUTES_PER_REQUEST = 45;
  var agentAvg = resolutionStats.avgMinutes > 0 ? resolutionStats.avgMinutes : 2; // default 2 min if no data yet
  var timeSavedPerRequest = MANUAL_MINUTES_PER_REQUEST - agentAvg;
  var totalTimeSaved = timeSavedPerRequest * summary.completed;
  var totalHoursSaved = Math.round(totalTimeSaved / 60 * 10) / 10;
  
  // Project monthly (assume current rate continues)
  var earliest = summary.earliest;
  var latest = summary.latest;
  var daysCovered = Math.max(1, (latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24));
  var requestsPerDay = summary.completed / daysCovered;
  var projectedMonthlyRequests = Math.round(requestsPerDay * 30);
  var projectedMonthlyHours = Math.round((projectedMonthlyRequests * timeSavedPerRequest) / 60 * 10) / 10;
  
  var items = [
    ['Baseline: Manual handling estimate', MANUAL_MINUTES_PER_REQUEST + ' min per request'],
    ['Agent: Avg handling time', formatDuration(agentAvg)],
    ['Time saved per request', formatDuration(timeSavedPerRequest)],
    ['', ''],
    ['Low Touch requests completed by agent', summary.completed],
    ['Total time saved to date', totalHoursSaved + ' hours'],
    ['', ''],
    ['Projected monthly requests (at current rate)', projectedMonthlyRequests],
    ['Projected monthly time savings', projectedMonthlyHours + ' hours/month'],
    ['', ''],
    ['Note', 'Manual baseline is 45 min avg (triage + revision + email). Adjust in code if needed.']
  ];
  
  for (var i = 0; i < items.length; i++) {
    if (items[i][0] === '') {
      row++;
      continue;
    }
    sheet.getRange(row, 1).setValue(items[i][0]).setFontWeight('bold');
    sheet.getRange(row, 2).setValue(items[i][1]);
    
    if (items[i][0].indexOf('Total time saved') !== -1) {
      sheet.getRange(row, 1, 1, 2).setBackground('#e6f4ea').setFontSize(11);
    }
    if (items[i][0].indexOf('Projected monthly') !== -1 && items[i][0].indexOf('savings') !== -1) {
      sheet.getRange(row, 1, 1, 2).setBackground('#e6f4ea');
    }
    if (items[i][0] === 'Note') {
      sheet.getRange(row, 1).setFontWeight('normal').setFontColor('#9aa0a6').setFontSize(9);
      sheet.getRange(row, 2).setFontColor('#9aa0a6').setFontSize(9);
    }
    row++;
  }
  
  return row;
}


/**
 * Writes a table with headers and data rows. Returns next available row.
 */
function writeTableBlock(sheet, row, headers, dataRows) {
  // Header row
  sheet.getRange(row, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(row, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#e8eaed')
    .setFontSize(10);
  row++;
  
  if (dataRows.length === 0) {
    sheet.getRange(row, 1).setValue('(no data)').setFontColor('#9aa0a6');
    return row + 1;
  }
  
  // Data rows
  for (var i = 0; i < dataRows.length; i++) {
    sheet.getRange(row, 1, 1, dataRows[i].length).setValues([dataRows[i]]);
    
    // Alternate row shading
    if (i % 2 === 1) {
      sheet.getRange(row, 1, 1, dataRows[i].length).setBackground('#f8f9fa');
    }
    row++;
  }
  
  return row;
}


/**
 * Writes key-value pairs (2-column). Returns next available row.
 */
function writeKeyValueBlock(sheet, row, items) {
  for (var i = 0; i < items.length; i++) {
    sheet.getRange(row, 1).setValue(items[i][0]).setFontWeight('bold');
    sheet.getRange(row, 2).setValue(items[i][1]);
    row++;
  }
  return row;
}


/**
 * Formats minutes into human-readable duration.
 */
function formatDuration(minutes) {
  if (minutes < 1) {
    return Math.round(minutes * 60) + ' sec';
  } else if (minutes < 60) {
    return Math.round(minutes * 10) / 10 + ' min';
  } else {
    var hrs = Math.floor(minutes / 60);
    var mins = Math.round(minutes % 60);
    return hrs + 'h ' + mins + 'm';
  }
}


/**
 * Formats a date as YYYY-MM-DD.
 */
function formatDate(date) {
  if (!date || isNaN(date.getTime())) return '\u2014';
  return date.toISOString().slice(0, 10);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Test: Run this to verify the Metrics tab generates without errors.
 * Check the Metrics tab in your spreadsheet after running.
 */
function testMetricsTab() {
  Logger.log('=== TEST: Metrics Tab Generation ===');
  
  try {
    updateMetricsTab();
    Logger.log('\u2705 PASS \u2014 Metrics tab generated. Check spreadsheet.');
  } catch (e) {
    Logger.log('\u274C FAIL \u2014 ' + e.message);
    Logger.log('Stack: ' + e.stack);
  }
  
  // Verify tab exists
  var config = getConfig();
  var ss = SpreadsheetApp.openById(config.TRACKING_SHEET_ID);
  var metricsSheet = ss.getSheetByName('Metrics');
  
  if (metricsSheet) {
    var lastRow = metricsSheet.getLastRow();
    Logger.log('\u2705 Metrics tab exists with ' + lastRow + ' rows');
  } else {
    Logger.log('\u274C Metrics tab not found after running updateMetricsTab()');
  }
}
function testHighTouchPath() {
  var config = getConfig();
  var formData = {
    timestamp: new Date().toISOString(),
    requester_email: config.REPLY_TO,
    requester_name: '',
    team: 'Core Partnerships',
    request_type: 'New Content Creation',
    content_status: 'Nothing yet — need content created',
    subject: 'Q2 Cross-PA Partnership Report for Cloud VP and Android Director',
    summary: 'Create a quarterly partnership report summarizing [ORG_NAME] cross-PA collaborations for external PA leadership.',
    target_audience: 'Cloud VP, Android Director',
    megan_involved: 'No',
    urgency: 'Within 1 week',
    sender: '[OWNER_NAME]',
    draft_link: '',
    additional_notes: 'Requires executive-level framing. Focus on measurable impact and strategic alignment.',
    has_draft: false
  };

  var sheet = SpreadsheetApp.openById(config.TRACKING_SHEET_ID).getSheetByName(config.REQUESTS_TAB);
  var rowNumber = sheet.getLastRow() + 1;
  sheet.getRange(rowNumber, 1).setValue(formData.timestamp);
  sheet.getRange(rowNumber, 2).setValue(formData.requester_email);

  var triageResult = callGeminiForTriage(formData, config);
  Logger.log('Triage result: ' + JSON.stringify(triageResult));

  handleEscalation(formData, triageResult, rowNumber, config);
  Logger.log('High Touch (non-[VP_NAME]) test complete');
}
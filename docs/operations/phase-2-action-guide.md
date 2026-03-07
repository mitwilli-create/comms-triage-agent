# [TEAM_NAME] Comms Agent — Phase 2 Action Guide

**Autonomous Engagement Summaries: Security Review & Requirements**

**Status:** 🟡 PRE-WORK ONLY  
**Scope Boundary:** File security review and document requirements during [OWNER_NAME]'s leave.  
**Implementation:** Deferred to [OWNER_NAME]'s return (May 2026)  
**Prepared for:** [BACKUP_OPERATOR], [ESCALATION_OWNER]  
**Last Updated:** February 1, 2026

---

## Executive Summary

Phase 2 enables the agent to **automatically generate engagement summaries** by accessing [INTERNAL_DIRECTORY], People API, and internal document metadata. This eliminates the manual step of running LLM Extension.

**Current state:** Agent flags "run engagement summary manually" → [ESCALATION_OWNER] executes via LLM Extension.

**Phase 2 state:** Agent detects unfamiliar L8+ audience → automatically retrieves profile data → generates engagement summary → includes in Escalation Starter Doc.

**Why deferred:** Requires App Engine on [CORP_NETWORK] (not simple Cloud Function), SPUR security review (weeks to months), and API owner approvals. Complexity exceeds pre-surgery timeline.

---

## What Can Be Done During [OWNER_NAME]'s Leave

### ✅ Initiate (Anton/[ESCALATION_OWNER] can do)

| Action | Owner | Timeline |
|--------|-------|----------|
| File SPUR security review request | Anton | Week 1 |
| Document API requirements | Anton | Week 1-2 |
| Request Bifrost onboarding info | Anton | Week 2 |
| Identify App Engine sponsor | Anton | Week 2-3 |
| Create placeholder [CORP_NAME] project | Anton | Week 3 |

### 🚫 Requires [Comms Lead]

| Action | Why [Comms Lead] |
|--------|--------------|
| Architecture design decisions | Deep context on agent requirements |
| OAuth flow implementation | Complex integration between Apps Script ↔ App Engine |
| API access negotiation | Relationships with API owners |
| Deployment and testing | End-to-end system knowledge |
| Rollback procedures | Risk management |

---

## Technical Background (From Duckie Research)

### Why Phase 2 Is Complex

**The core challenge:** Apps Script runs in the organization's *external* production environment ([AUTOMATION_PLATFORM_URL]). It cannot directly access *internal* services protected by [AUTH_PROXY] ([INTERNAL_DIRECTORY], People API, internal doc metadata).

**What doesn't work:**
- ❌ Standard Cloud Functions — Cannot obtain [AUTH_CREDENTIALS] for [AUTH_PROXY]
- ❌ Direct API calls from Apps Script — No path through [AUTH_PROXY]

**What does work:**
- ✅ App Engine on [CORP_NETWORK] — Runs inside corp network perimeter
- ✅ Bifrost — Whitelists specific service accounts for specific APIs

### Required Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     APPS SCRIPT                              │
│  ([AUTOMATION_PLATFORM_URL] - external production)                  │
│                                                              │
│  Form Submit → Triage → Detect L8+ audience                 │
│                              ↓                               │
│                    OAuth-authenticated call                  │
└──────────────────────────────│──────────────────────────────┘
                               │
                               ↓
┌──────────────────────────────────────────────────────────────┐
│                  APP ENGINE ([CORP_NETWORK])                  │
│  (runs inside corp network - can access internal services)   │
│                                                               │
│  Receives request with target LDAP/group                     │
│           ↓                                                   │
│  [Bifrost-authenticated service account]                      │
│           ↓                                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  [INTERNAL_DIRECTORY] API      People API      Doc Metadata API         │ │
│  │  (profile)     (org chart)     (recent artifacts)       │ │
│  └─────────────────────────────────────────────────────────┘ │
│           ↓                                                   │
│  Synthesize engagement summary                                │
│           ↓                                                   │
│  Return JSON to Apps Script                                   │
└──────────────────────────────────────────────────────────────┘
                               │
                               ↓
┌──────────────────────────────────────────────────────────────┐
│                     APPS SCRIPT                               │
│                                                               │
│  Receives engagement summary → Injects into Starter Doc      │
└──────────────────────────────────────────────────────────────┘
```

---

## Pre-Work Checklist (For Leave Period)

### Week 1: Initiate Security Review

**Task:** File SPUR request ([INTERNAL_LINK])

**Information needed for SPUR:**
- [ ] Service name: "[TEAM_NAME] Communications Agent - Engagement Summary Service"
- [ ] Service description: "Retrieves team member profile data to generate communication strategy summaries"
- [ ] Data accessed: [INTERNAL_DIRECTORY] profiles, People API org data, document metadata
- [ ] Data sensitivity: Contains PII (names, roles, org structure)
- [ ] Data flow: Apps Script → App Engine → Internal APIs → Apps Script → document
- [ ] Retention: Engagement summaries stored in Drive indefinitely
- [ ] Access control: [TEAM_NAME] StratOps team only
- [ ] Use case justification: "Enables communications team to tailor messages to L8+ audience preferences"

**Who can help:** Your team's security champion, or [INTERNAL_LINK]

### Week 2: Document API Requirements

**Create document with:**

1. **[INTERNAL_DIRECTORY] API**
   - What we need: Profile data (name, role, level, PA, current projects)
   - API endpoint: [To research]
   - Authentication: [AUTH_SYSTEM]/[RPC_FRAMEWORK]
   - Rate limits: [To research]
   - Owner team: [To identify]

2. **People API (internal)**
   - What we need: Org chart (manager, reports, team structure)
   - API endpoint: [To research]
   - Authentication: [AUTH_SYSTEM]/[RPC_FRAMEWORK]
   - Rate limits: [To research]
   - Owner team: [To identify]

3. **Doc Metadata API**
   - What we need: List of recent docs authored/edited by target
   - API endpoint: [To research]
   - Authentication: [AUTH_SYSTEM]/[RPC_FRAMEWORK]
   - Rate limits: [To research]
   - Owner team: [To identify]

**Research method:** [INTERNAL_LINK], [INTERNAL_LINK], or ask in relevant team chats

### Week 2-3: Bifrost Onboarding Information

**Task:** Understand Bifrost requirements ([INTERNAL_LINK])

**Questions to answer:**
- [ ] What information is needed to request Bifrost whitelisting?
- [ ] What is the typical timeline for approval?
- [ ] Are there existing examples of similar use cases?
- [ ] Who approves Bifrost requests for the target APIs?

**Do NOT request whitelisting yet** — just gather information for [Comms Lead].

### Week 3: Identify App Engine Sponsor

**Task:** Find someone who can sponsor an App Engine project on [CORP_NETWORK]

**Questions:**
- [ ] Does [TEAM_NAME] already have an App Engine presence on [CORP_NETWORK]?
- [ ] If not, what team/PA should sponsor this?
- [ ] What's the process for creating a new App Engine project internally?
- [ ] Are there quota or cost considerations?

**Potential contacts:** [TEAM_NAME] engineering leads, Core infrastructure contacts

### Week 3-4: Create Placeholder [CORP_NAME] Project

If approved, create a [CORP_NAME] project placeholder:
- Project name: `[TEAM_NAME]-comms-agent-engagement`
- Purpose: Eventual home for App Engine service
- Do NOT deploy anything — just reserve the project

---

## Information [Comms Lead] Will Need

When [Comms Lead] returns, provide:

1. **SPUR Status**
   - Request ID
   - Current status (pending/approved/questions)
   - Any feedback or required changes

2. **API Research Document**
   - Endpoints identified
   - Owner teams contacted
   - Any blockers discovered

3. **Bifrost Information**
   - Requirements documented
   - Timeline expectations
   - Key contacts

4. **App Engine Status**
   - Sponsor identified (or not)
   - Project created (or blocker)
   - Cost estimates if available

5. **Open Questions**
   - Anything unclear or requiring decisions

---

## Why This Architecture (Technical Justification)

**Q: Why not just call the APIs from Apps Script?**

A: Apps Script runs in the organization's external production ([AUTOMATION_PLATFORM_URL]). Internal APIs like [INTERNAL_DIRECTORY] require [AUTH_PROXY] authentication, which means the caller needs [AUTH_CREDENTIALS]. Apps Script cannot obtain [AUTH_CREDENTIALS].

**Q: Why not use a Cloud Function?**

A: Standard Cloud Functions run in [CORP_NAME], which is also outside the corp network. Cloud Function service accounts cannot obtain [AUTH_CREDENTIALS] either. Same problem.

**Q: Why App Engine on [CORP_NETWORK] specifically?**

A: [CORP_NETWORK] is the internal hosting environment that runs *inside* the corp network perimeter. Services running there can obtain the credentials needed for [AUTH_PROXY]-protected APIs.

**Q: What's Bifrost?**

A: Bifrost is a system for whitelisting specific [CORP_NAME] service accounts to access specific internal [RPC_FRAMEWORK] services. Even with App Engine on [CORP_NETWORK], you need explicit permission to call each API. Bifrost manages this.

**Q: How does Apps Script talk to App Engine?**

A: Via OAuth-authenticated HTTPS calls. Apps Script makes an external call (which it can do), App Engine receives it, makes internal API calls (which it can do), and returns the result.

---

## Implementation Milestones (Post-Leave)

When [Comms Lead] returns, the full implementation path is:

| Milestone | Description | Estimated Time |
|-----------|-------------|----------------|
| M1: Design Review | Architecture doc + security review approval | 2-4 weeks |
| M2: API Onboarding | Bifrost requests for each API | 2-4 weeks |
| M3: App Engine Setup | Deploy basic service, test connectivity | 1-2 weeks |
| M4: Integration | Connect Apps Script ↔ App Engine | 1-2 weeks |
| M5: Testing | End-to-end testing with real data | 1-2 weeks |
| M6: Rollout | Staged deployment with monitoring | 1 week |

**Total estimated timeline:** 2-3 months after [OWNER_NAME]'s return

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| SPUR rejection | Blocks entire Phase 2 | File early, respond quickly to questions |
| API owners decline access | Can't get data | Identify alternative APIs, escalate if needed |
| App Engine quota/cost issues | Delays project | Get cost estimates early, secure budget |
| Bifrost approval delays | Extends timeline | Start requests in parallel |
| Complexity exceeds available time | Phase 2 never completes | Keep Phase 1 (manual) as permanent fallback |

---

## Decision Point: Is Phase 2 Worth It?

Phase 2 should be implemented if:
- ✅ SPUR approves the security review
- ✅ API owners grant access
- ✅ Engagement summary volume justifies automation (>10/month)
- ✅ Manual workflow friction is significant

Phase 2 should be deferred/cancelled if:
- ❌ Security review raises insurmountable concerns
- ❌ API owners decline or add prohibitive restrictions
- ❌ Volume is low enough that manual works fine
- ❌ Costs exceed value

**Current recommendation:** Proceed with pre-work. Make [INTERNAL_LINK] decision when [Comms Lead] returns based on SPUR outcome and API research findings.

---

## Contacts

| Area | Contact | Notes |
|------|---------|-------|
| Security review questions | [INTERNAL_LINK] | General guidance |
| Bifrost onboarding | [INTERNAL_LINK] | Self-serve docs |
| App Engine internal | [To identify] | Need internal sponsor |
| [INTERNAL_DIRECTORY] API | [To research] | During Week 2 |
| People API | [To research] | During Week 2 |

---

## Summary

**Your scope during leave:**
1. File SPUR security review
2. Document API requirements
3. Gather Bifrost information
4. Identify App Engine sponsor
5. Create placeholder [CORP_NAME] project (if approved)

**[OWNER_NAME]'s scope on return:**
1. Review pre-work findings
2. Make [INTERNAL_LINK] decision
3. Lead implementation if proceeding

**Timeline expectation:** Phase 2 implementation = May-July 2026 at earliest.

---

*This guide prepared with input from Duckie ([INTERNAL_LINK]) research on internal API access patterns.*

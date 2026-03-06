# Testing Procedures — xGE Internal Comms Triage Agent

**Version:** 1.0  
**Last Updated:** February 2026  
**Target:** 90%+ success rate before production deployment

---

## Overview

Testing the Comms Triage Agent validates two distinct layers:

1. **Triage accuracy** — Does the agent correctly classify request touch level?
2. **Revision quality** — For Low Touch requests, are the edits appropriate and explained clearly?

Both layers must be validated before any deployment or prompt change goes live.

---

## Test Environment Setup

### Running Tests Safely

All test execution uses the `DRY_RUN` mode to prevent accidental emails being sent during testing:

```javascript
// Config.gs — set before running any tests
var DRY_RUN = true;
```

When `DRY_RUN = true`:
- All triage, revision, and escalation logic runs normally
- Output is written to the Apps Script console and the Agent Log sheet
- **No emails or Chat messages are sent**

### Test Logging

Every test run writes to the `Agent Log` sheet with `Status = TEST` so production entries are distinguishable from test entries. Filter on the Status column to separate them.

---

## Test Categories

### Category 1: Golden Path Tests

**Purpose:** Confirm the agent works correctly on ideal, well-formed inputs.  
**Pass criteria:** Correct touch level, correct action taken, rationale present.  
**Minimum set:** 10 golden path tests before first deployment.

### Category 2: Edge Case Tests

**Purpose:** Confirm the agent handles ambiguous, incomplete, or unusual inputs gracefully.  
**Pass criteria:** Agent either classifies correctly or escalates when uncertain (confidence <70%).  
**Minimum set:** 5 edge case tests before first deployment.

### Category 3: Adversarial Tests

**Purpose:** Confirm the agent fails safely — it should escalate or ask for clarification rather than guess dangerously.  
**Pass criteria:** Agent does NOT produce confident Low Touch output for high-stakes requests.  
**Minimum set:** 3 adversarial tests before first deployment.

### Category 4: Consistency Tests

**Purpose:** Confirm that submitting the same input twice produces substantially similar output.  
**Pass criteria:** Touch level is identical; revision length and structure are within acceptable variance.  
**Minimum set:** 3 consistency tests (submit same payload twice, compare outputs).

---

## Test Case Library

### Golden Path: Low Touch

---

**Test ID:** GT-001  
**Scenario:** Routine email draft review  
**Input payload:**

```
Request Type: Email Draft Review
Content Status: Draft ready for review
Audience: Internal xGE team (~30 people)
Leadership Visibility: No
Urgency: Within 1 week
Summary: "Review this email announcing our new office hours to the xGE team."
[Draft attached: 3 paragraphs, ~200 words]
```

**Expected behavior:**
- Touch level: **Low**
- Confidence: ≥90%
- Agent handles autonomously
- Revised draft returned with rationale
- Quality check footer: ✅ READY TO SEND

**Pass/Fail criteria:** Low Touch classification + revision email produced (or dry-run console output showing revision)

---

**Test ID:** GT-002  
**Scenario:** Newsletter blurb optimization  
**Input payload:**

```
Request Type: Newsletter Contribution
Content Status: Draft ready for review
Audience: Tech Leads (~150 people)
Leadership Visibility: No
Urgency: Within 2 weeks
Summary: "Edit this blurb for the TL Hub Q2 newsletter about the new mentorship program launch."
[Draft attached: 2 paragraphs, ~120 words]
```

**Expected behavior:**
- Touch level: **Low**
- Confidence: ≥85%
- Smart Brevity applied (TL;DR added, word count reduced)
- Rationale explains each change

---

**Test ID:** GT-003  
**Scenario:** Website content update  
**Input payload:**

```
Request Type: Website Update
Content Status: Draft ready for review
Audience: xGE Engineering (internal)
Leadership Visibility: No
Urgency: Flexible
Summary: "Update the Training page text with the new dates for Storytelling training."
[Draft: 2 updated paragraphs]
```

**Expected behavior:**
- Touch level: **Low**
- Agent processes autonomously
- Confirmation of understanding included before revisions

---

### Golden Path: Medium Touch

---

**Test ID:** GT-004  
**Scenario:** Comms strategy consultation  
**Input payload:**

```
Request Type: Strategy Consultation
Content Status: Nothing yet — need content created
Audience: Cross-org (multiple teams within Google)
Leadership Visibility: No
Urgency: Within 2 weeks
Summary: "We're launching a new mentorship program and need help thinking through the comms rollout strategy."
```

**Expected behavior:**
- Touch level: **Medium**
- Confidence: ≥85%
- Escalated to [ESCALATION_OWNER] with summary and recommended approach
- Requester notified that escalation occurred

---

**Test ID:** GT-005  
**Scenario:** Event comms requiring coordination  
**Input payload:**

```
Request Type: Event Comms
Content Status: Outline/rough notes only
Audience: Core L8+ ICs (~500 people)
Leadership Visibility: Yes — VP/Director visibility
Urgency: Within 1 week
Summary: "Need help with speaker recruitment and invite copy for the Q3 Mini Connect."
```

**Expected behavior:**
- Touch level: **Medium** (VP visibility bumps from Low)
- Escalated to [ESCALATION_OWNER]
- Classification reasoning cites audience size and leadership visibility

---

### Golden Path: High Touch

---

**Test ID:** GT-006  
**Scenario:** Org-wide announcement with leadership visibility  
**Input payload:**

```
Request Type: New Content Creation
Content Status: Nothing yet
Audience: Org-wide (1,000+ engineers) + external partners
Leadership Visibility: Yes — VP/Director visibility
Urgency: Sensitive — must coordinate timing
Summary: "We need to announce an org restructure to all of xGE and communicate changes to partner teams."
```

**Expected behavior:**
- Touch level: **High**
- Confidence: ≥95%
- Immediate escalation to [ESCALATION_OWNER]
- Escalation notification includes all 6 classification factors

---

**Test ID:** GT-007  
**Scenario:** [VP_NAME] hard escalation rule  
**Input payload:**

```
Request Type: Executive Comms
Content Status: Draft ready for review
Audience: xGE team
Leadership Visibility: Yes — [VP_NAME] involved
Urgency: Within 2-3 days
Summary: "Draft talking points for [VP_NAME] for the Q4 xGE Exchange."
```

**Expected behavior:**
- Touch level: **High** — triggered by hard escalation rule, NOT AI scoring
- Escalation fires before triage prompt runs
- Log entry notes: "Hard rule triggered: [VP_NAME] detected"

> **What this validates:** The hard rule path bypasses the AI classification chain entirely. This is intentional and critical.

---

### Edge Cases

---

**Test ID:** EC-001  
**Scenario:** VP audience, all other factors Low  
**Input payload:**

```
Request Type: Email Draft Review
Content Status: Draft ready for review
Audience: Single VP (internal)
Leadership Visibility: Yes — VP/Director visibility
Urgency: Flexible
Summary: "Can you review this project status email I'm sending to my VP?"
```

**Expected behavior:**
- Touch level: **Medium** (VP audience overrides Low factors)
- Confidence: ~65–75% (some ambiguity is expected here)
- If confidence <70%: escalate regardless of classification
- Agent may ask clarifying questions about stakes before proceeding

---

**Test ID:** EC-002  
**Scenario:** Urgency unspecified  
**Input payload:**

```
Request Type: Email Draft Review
Content Status: Draft ready for review
Audience: Internal xGE (~20 people)
Leadership Visibility: No
Urgency: [left blank]
Summary: "Please review this email."
[Draft attached: 1 paragraph]
```

**Expected behavior:**
- Agent asks a clarifying question about urgency before classifying
- Does NOT assume a default urgency and proceed
- Confidence drops and agent notes "timeline unknown" in classification reasoning

---

**Test ID:** EC-003  
**Scenario:** Intake form bypassed — direct message request  
**Input payload:**

```
[No form submission — direct Chat message to agent]
"Hey can you just take a quick look at this email real fast"
[Draft pasted inline, 4 paragraphs, audience unclear]
```

**Expected behavior:**
- Agent prompts requester to submit via the intake form
- Does NOT process the request
- Logs the bypass attempt in the Agent Log

---

### Adversarial Tests

---

**Test ID:** ADV-001  
**Scenario:** Sensitive topic buried in Low Touch framing  
**Input payload:**

```
Request Type: Email Draft Review
Content Status: Draft ready for review
Audience: Internal xGE (~30 people)
Leadership Visibility: No
Urgency: Within 1 week
Summary: "Can you review this email? It's about the upcoming team restructure."
```

**Expected behavior:**
- Agent detects sensitive topic (restructure) in Summary field
- Bumps classification to at least **Medium Touch**
- Does NOT process as Low Touch based on surface-level form factors alone
- Notes: "Sensitive topic detected: restructure language"

---

**Test ID:** ADV-002  
**Scenario:** Contradictory signals  
**Input payload:**

```
Request Type: Quick Review
Content Status: Draft ready for review
Audience: "Just my team"
Leadership Visibility: Yes — [VP_NAME] involved
Urgency: Flexible
Summary: "Quick look at this team email, thanks"
```

**Expected behavior:**
- Hard escalation rule fires on [VP_NAME] detection
- Agent does NOT accept "Quick Review" framing
- High Touch classification regardless of other signals

---

**Test ID:** ADV-003  
**Scenario:** Completely empty submission  
**Input payload:**

```
[All form fields blank or default]
Summary: [empty]
```

**Expected behavior:**
- Agent does NOT attempt to classify or process
- Returns: "Unable to process — required fields missing. Please resubmit with at minimum: request type, summary, and target audience."
- No escalation email sent; requester receives error response only

---

### Consistency Tests

---

**Test ID:** CON-001  
**Procedure:**

1. Submit **GT-001** payload
2. Record: touch level, confidence score, word count of revision
3. Submit the identical **GT-001** payload a second time
4. Compare outputs

**Pass criteria:**
- Touch level identical both times
- Confidence within ±5 points
- Revision word count within ±15% of first run
- Key structural changes (TL;DR, CTA position) identical

---

## How to Run Tests

### Option A: Manual Test Submission

1. Set `DRY_RUN = true` in `Config.gs`
2. Open the intake Google Form
3. Submit the test payload as written above
4. Check Apps Script console (View → Logs) for output
5. Check Agent Log sheet for the new row

### Option B: Programmatic Test Runner

For batch testing, use the `runTestSuite()` function in `TestRunner.gs`:

```javascript
function runTestSuite() {
  var tests = [
    buildTestPayload('GT-001', { ... }),
    buildTestPayload('GT-002', { ... }),
    // ... add all test cases
  ];

  var results = [];
  for (var i = 0; i < tests.length; i++) {
    var result = processRequest(tests[i], true); // true = dry run
    results.push({
      id: tests[i].id,
      expected: tests[i].expectedTouchLevel,
      actual: result.touchLevel,
      pass: result.touchLevel === tests[i].expectedTouchLevel
    });
  }

  logTestResults(results);
}
```

---

## Interpreting Test Results

| Outcome | Meaning | Action |
|---------|---------|--------|
| Touch level correct + rationale present | ✅ Pass | No action needed |
| Touch level correct, confidence <70% | ⚠️ Partial pass | Review triage prompt for that factor |
| Touch level wrong, one level off | ⚠️ Soft fail | Adjust weighting in triage criteria |
| Touch level wrong, more than one level off | ❌ Hard fail | Review triage prompt and knowledge base |
| Hard rule bypassed | ❌ Critical fail | Do not deploy; fix immediately |
| Agent produced output with no rationale | ❌ Hard fail | Revision prompt guardrails broken |

### Passing Threshold

| Test Category | Required Pass Rate |
|---------------|-------------------|
| Golden Path | 10/10 (100%) |
| Edge Cases | 4/5 (80%) |
| Adversarial | 3/3 (100%) |
| Consistency | 3/3 (100%) |

**Overall minimum: 90%+ before production deployment.**

---

## Documenting Test Results

After each test run, log results in this format:

```markdown
## Test Run: [Date]
**Prompt version:** [e.g., v1.2]
**Tester:** [Your name]

| Test ID | Expected | Actual | Pass? | Notes |
|---------|----------|--------|-------|-------|
| GT-001  | Low      | Low    | ✅    | Confidence 94% |
| GT-007  | High     | High   | ✅    | Hard rule fired correctly |
| EC-001  | Medium   | Low    | ❌    | VP audience not weighted correctly |

**Issues found:** [List any failures]
**Changes made:** [What was updated before re-test]
```

Store test logs in `/tests/logs/` in the repository.

---

## Regression Testing

Run the full test suite whenever:
- A prompt is modified
- A triage rule is added or changed
- A new edge case is discovered in production
- A new name is added to the hard escalation list

The goal is to confirm that fixing one thing hasn't broken another. Treat this test suite as the agent's safety net.

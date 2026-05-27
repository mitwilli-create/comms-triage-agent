# comms-triage-agent

Autonomous triage, revision, and escalation for internal comms intake — built on Apps Script + Gemini with a three-prompt architecture. Deployed across a ~1,000-engineer org (Principal / Distinguished / Fellow tier at Google xGE); recaptured ~160 operational hours/year at >90% classification accuracy.

---

## What It Does

Incoming comms requests hit a Google Form. The agent runs three sequential prompts — **triage** (classify intent and urgency), **revise** (rewrite or flag for structural issues), **escalate** (route to owner or hold for human review) — with conditional knowledge base loading at each step. No human in the loop unless the confidence threshold isn't met.

## Why It Matters

Senior ICs at the Principal/Distinguished/Fellow tier generate a high volume of comms intake that doesn't need a human first pass — but it does need judgment. This agent applies that judgment at intake, before anything reaches a program manager. The 160 hrs/year figure comes from logging actual triage volume against pre-automation baseline across the org.

---

## Architecture

```
Form submission → triage prompt (classify + KB load)
                → revision prompt (rewrite or flag)
                → escalation prompt (route or hold)
                → output to Sheets + optional email trigger
```

Three prompts, not one. Each prompt has a defined scope and a conditional exit. The KB load is gated — not every request pulls the full context window.

---

## Quick Start

**Prerequisites:** Google Workspace account, Gemini API key, Apps Script access.

1. **Clone or copy** the script files into a new Apps Script project bound to a Google Sheet.

2. **Set script properties** (Extensions → Apps Script → Project Settings → Script Properties):
   ```
   GEMINI_API_KEY=your_key_here
   TRIAGE_KB_URL=your_knowledge_base_sheet_id
   ESCALATION_EMAIL=owner@yourdomain.com
   ```

3. **Configure your intake form.** The bound Sheet must have columns matching the field map in `config.gs`. Adjust `FIELD_MAP` to match your form structure.

4. **Deploy the trigger:**
   ```
   Apps Script → Triggers → Add Trigger
   Function: onFormSubmit
   Event: From spreadsheet → On form submit
   ```

5. **Test with a sample submission.** Run `testTriageAgent()` from the script editor to fire a dry-run against the first row of your Sheet without sending escalation emails.

6. **Review output** in the `Triage_Log` tab — classification label, revision diff, escalation decision, and confidence score per submission.

---

## Methodology Note

The ~160 hrs/year figure is derived from: average triage time per request (pre-automation baseline) × monthly request volume × 12, compared against post-deployment human-review rate. Logging lives in the `Triage_Log` tab. If you're running this in a different org, your baseline will differ — the `config.gs` file exposes the volume and time-per-request constants so you can recalculate against your own numbers.

---

## What This Demonstrates

- **Agentic system design** — multi-step prompt architecture with conditional branching, not a single-shot LLM call
- **Production judgment** — built for a real org, real volume, real accountability tier (top 0.5% of a 180K-person eng org)
- **Ops thinking** — the metric isn't "it works," it's hours recaptured and classification accuracy
- **Comms domain depth** — the triage logic reflects actual comms intake patterns, not generic classification

---

## Stack

`Google Apps Script` · `Gemini API` · `Google Sheets` · `Google Forms`

---

*Part of a broader agentic comms infrastructure built at Google xGE. See also: [Voice DNA RAG pipeline](#) · [AI Mentorship Platform](#)*
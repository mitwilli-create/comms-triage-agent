# comms-triage-agent

Autonomous triage, revision, and escalation for internal comms intake, built on Apps Script + Gemini with a three-prompt architecture. Built for a large engineering organization (Principal / Distinguished / Fellow IC tier, roughly 1,000 engineers); designed to auto-handle the majority of inbound requests without escalation, projected to recapture ~160 operational hours/year (design targets, derived from pre-automation baselines).

---

## What It Does

Incoming comms requests hit a Google Form. The agent runs three sequential prompts, with conditional knowledge base loading at each step: **triage** (classify intent and urgency), **revise** (rewrite or flag for structural issues), and **escalate** (route to owner or hold for human review). No human in the loop unless the confidence threshold isn't met.

## Why It Matters

Senior ICs at the Principal/Distinguished/Fellow tier generate a high volume of comms intake that doesn't need a human first pass, but it does need judgment. This agent applies that judgment at intake, before anything reaches a program manager. The ~160 hrs/year figure is a design target: a projection built from pre-automation triage-volume baselines logged across the org, not a measured production outcome.

---

## Architecture

```
Form submission → triage prompt (classify + KB load)
                → revision prompt (rewrite or flag)
                → escalation prompt (route or hold)
                → output to Sheets + optional email trigger
```

Three prompts, not one. Each prompt has a defined scope and a conditional exit. The KB load is gated: not every request pulls the full context window.

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

6. **Review output** in the `Triage_Log` tab: classification label, revision diff, escalation decision, and confidence score per submission.

---

## Methodology Note

The ~160 hrs/year design target is derived from: average triage time per request (pre-automation baseline) × monthly request volume × 12, with an assumed post-deployment human-review rate. It is a projection, not a measured outcome. Logging lives in the `Triage_Log` tab so the projection can be validated against real throughput over time. If you're running this in a different org, your baseline will differ; the `config.gs` file exposes the volume and time-per-request constants so you can recalculate against your own numbers.

---

## What This Demonstrates

- **Agentic system design:** multi-step prompt architecture with conditional branching, not a single-shot LLM call
- **Production judgment:** built for a real organization's intake patterns, with a senior-IC accountability tier
- **Ops thinking:** success is defined in operational terms (hours recaptured), and the volume and time constants are exposed so the design target can be recalculated against any org's baseline
- **Comms domain depth:** the triage logic reflects actual comms intake patterns, not generic classification

---

## Stack

`Google Apps Script` · `Gemini API` · `Google Sheets` · `Google Forms`

---

*Part of a broader agentic comms infrastructure built for a large engineering organization. See also: [Voice DNA RAG pipeline](#) · [AI Mentorship Platform](#)*
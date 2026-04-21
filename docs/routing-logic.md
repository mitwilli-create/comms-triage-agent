# Routing Logic Documentation

**Purpose:** Defines how the triage agent routes every incoming request.

---

## The Decision Tree

```
INCOMING REQUEST
│
▼
┌─────────────────────────────────────┐
│ STEP 1: ABSOLUTE OVERRIDE CHECK     │
│                                     │
│ Is [VP_NAME] mentioned anywhere?    │
│ ├── YES → HIGH TOUCH (stop here)    │
│ └── NO → Continue to Step 2        │
└─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────┐
│ STEP 2: UNDERSTANDING CONFIRM       │
│                                     │
│ Summarize understanding.            │
│ Get explicit YES before scoring.    │
└─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────┐
│ STEP 3: FACTOR SCORING              │
│                                     │
│ Score all 7 factors: L / M / H      │
│ · Scope                             │
│ · Audience Size                     │
│ · Audience Type                     │
│ · Timeline                          │
│ · ROI                               │
│ · Cost of Failure                   │
│ · OKR Alignment                     │
└─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────┐
│ STEP 4: APPLY DECISION RULES        │
│                                     │
│ 2+ H factors → HIGH TOUCH           │
│ Org-wide or external → HIGH         │
│ Any 1 H factor → MEDIUM TOUCH       │
│ Mix of L+M, no H → LOW TOUCH        │
│ All L → LOW TOUCH                   │
└─────────────────────────────────────┘
│
▼
┌─────────────────────────────────────┐
│ STEP 5: CONFIDENCE CHECK            │
│                                     │
│ 90–100% → Proceed                   │
│ 70–89% → Proceed + note             │
│ 50–69% → Flag for review            │
│ <50% → Escalate now                 │
└─────────────────────────────────────┘
│
▼
┌───────────────────────────────────────────┐
│ STEP 6: ROUTE                             │
│                                           │
│ LOW TOUCH → Execute autonomously          │
│ MEDIUM TOUCH → Escalate                   │
│ HIGH TOUCH → Escalate (urgent)            │
│ <50% confidence → Escalate regardless     │
└───────────────────────────────────────────┘
```

---

## Decision Rules Reference

### Rule 1: Factor Majority Rule
| Pattern | Classification |
|---------|----------------|
| All L | Low Touch |
| Majority L, no H | Low Touch |
| Mix L + M, no H | Low Touch (default down) |
| Majority M, or any single H | Medium Touch |
| 2+ H, or any org-wide/external scope | High Touch |

### Rule 2: Absolute Override — [VP_NAME]
If [VP_NAME] is mentioned anywhere in the request — including as a recipient, approver, sender, or reference — the classification is automatically High Touch. No other factors apply.

### Rule 3: Confidence Floor
Any classification below 70% confidence must be escalated, regardless of the L/M/H result.

### Rule 4: Default Up
When any factor is ambiguous or unknown, apply the higher-risk assumption.

### Rule 5: Strategy = Medium Minimum
If the requester uses language like "I need advice on," "help me think through," or "what's the best approach" — the request is at minimum Medium Touch.

---

## Failure States and Handling

**Request too vague to classify:** Ask 1–2 targeted clarifying questions before scoring.

**Requester provides incorrect information during confirmation:** Re-assess with corrected information. Restart factor scoring.

**Mid-execution, agent realizes request is higher touch:** Stop execution. Don't deliver partial output. Escalate with note: "Reclassified during execution — [reason]."

**[ESCALATION_OWNER] is unavailable:** Notify requester of delay. Hold the request. Don't attempt to handle Medium or High Touch autonomously under any circumstances.

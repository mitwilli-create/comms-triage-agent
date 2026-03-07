# Engagement Summary Prompts

**For use with:** [INTERNAL_LINK] (Chrome Extension)  
**Purpose:** Generate communication strategy profiles for unfamiliar audiences  
**Last Updated:** February 1, 2026

---

## Quick Start

1. Install [INTERNAL_LINK] if not already installed
2. Navigate to target page ([INTERNAL_DIRECTORY] profiles or distribution list)
3. Click LLM Extension icon → **Pin this page**
4. Open new LLM Extension chat
5. Paste appropriate prompt below
6. Review output → Apply to your communication

---

## Prompt 1: Individual team member

**When to use:** Creating communication for a specific L8+ individual you haven't worked with before

**Navigate to:** Target person's [INTERNAL_DIRECTORY] profiles ([INTERNAL_LINK]/[[EMPLOYEE_ID]])

**Prompt:**

```
Analyze this team member to create a communications engagement strategy.

Search across their [INTERNAL_DIRECTORY] profiles, recent documents, presentations, email threads (if visible), and any org announcements they've authored or been mentioned in. Focus on patterns that reveal how they communicate and what they care about.

## Analysis Framework

### 1. Role & Strategic Position
- Current title, level, PA
- What are they accountable for?
- Where do they sit in the org structure?
- What decisions do they influence?

### 2. Current Priorities
- What initiatives are they driving right now?
- What problems are they trying to solve?
- What metrics or outcomes matter to them?
- Any visible OKRs or stated goals?

### 3. Communication Style Analysis
- Async vs. sync preference (do they write long docs or prefer meetings?)
- Detail orientation (high-level strategic or deep technical?)
- Tone (formal, casual, direct, diplomatic?)
- Response patterns (fast/slow, thorough/brief?)

### 4. Strategic Hooks
Based on their priorities, what framing would resonate?
- What connects to their current work?
- What problems are they trying to solve that I can help with?
- What language/terminology do they use?

### 5. Tactical Guidance
- What communication approach works best for them?
- What should I avoid?
- What format would they prefer (doc, email, chat, meeting)?

## Output Format

**Header**
| Field | Value |
|-------|-------|
| Name | [Full name] |
| Role | [Title] |
| Level | [L-level if visible] |
| PA | [Product Area] |
| Key Focus | [One sentence on current priority] |

**Executive Engagement Strategy**
[2-3 sentences: How to approach this person, what matters to them, recommended communication style]

**Strategic Hooks**
- [Hook 1: Connection to their priority + how to frame your message]
- [Hook 2: ...]
- [Hook 3: ...]

**Communication Intelligence**
- **Preferred Format:** [Doc/Email/Chat/Meeting]
- **Detail Level:** [High-level/Detailed/Varies by topic]
- **Tone:** [Formal/Casual/Direct/etc.]
- **Response Style:** [What to expect]

**Tactical Do's and Don'ts**

| Do | Don't |
|----|-------|
| [Specific action based on their style] | [What to avoid] |
| [Another do] | [Another don't] |
| [Another do] | [Another don't] |

---

**Constraints:**
- Exclude any artifacts older than January 2023
- Focus on professional communication patterns, not personal details
- If data is limited, note "Limited data available" and provide best assessment
```

---

## Prompt 2: distribution list / Alias

**When to use:** Creating communication for a distribution list or committee you haven't worked with before

**Navigate to:** The distribution list page for the alias

**Prompt:**

```
Analyze this distribution list to create a communications engagement strategy.

Search the group membership, recent threads, any documentation about the group's purpose, and visible artifacts from key members. Focus on understanding how this group operates and what communication approaches work.

## Analysis Framework

### 1. Group Identity
- What is this group's mandate/purpose?
- Who created it and why?
- What decisions does this group make or influence?
- Is it a decision-making body, information-sharing forum, or discussion space?

### 2. Membership Analysis
- How many members? What's the composition (levels, PAs, roles)?
- Who are the most active/influential voices?
- Are there clear leaders or is it peer-driven?
- Any visible subgroups or factions?

### 3. Communication Norms
- What's the typical thread style? (Long debates vs. quick LGTMs)
- Are pre-reads expected before discussions?
- How are decisions made? (Consensus, leader decides, voting?)
- What's the meeting vs. async balance?

### 4. Content Patterns
- What topics dominate recent discussions?
- What gets engagement vs. ignored?
- Are there recurring themes or concerns?
- What language/framing resonates?

### 5. Strategic Approach
- How should I introduce new topics to this group?
- What format works best for this audience?
- Who should I align with before group-wide communication?
- What objections or concerns should I anticipate?

## Output Format

**Header**
| Field | Value |
|-------|-------|
| Group Name | [Name] |
| Alias | [email alias] |
| Purpose | [One sentence mandate] |
| Size | [Approximate membership] |
| Type | [Decision-making/Advisory/Information-sharing/Discussion] |

**Group Engagement Strategy**
[2-3 sentences: How this group operates, what communication approach works, key dynamics to understand]

**Key Stakeholder Personas**
Identify 3-5 archetypes in this group:

1. **[Persona Name]** (e.g., "The Technical Gatekeeper")
   - Role pattern: [What role do people like this play?]
   - What they care about: [Their priorities]
   - How to engage: [Approach that works]

2. **[Persona Name]**
   - Role pattern:
   - What they care about:
   - How to engage:

3. **[Persona Name]**
   - Role pattern:
   - What they care about:
   - How to engage:

**Communication Intelligence**
- **Decision Style:** [How decisions happen in this group]
- **Pre-work Expectations:** [Are pre-reads required? How much context?]
- **Engagement Pattern:** [Active discussion vs. passive consumption]
- **Best Time to Reach:** [If patterns visible]

**Strategic Do's and Don'ts**

| Do | Don't |
|----|-------|
| [Specific action based on group norms] | [What to avoid] |
| [Another do] | [Another don't] |
| [Another do] | [Another don't] |

---

**Constraints:**
- Exclude artifacts older than 18 months
- Focus on group dynamics, not individual profiles
- If membership is hidden or data is limited, note this and provide best assessment
```

---

## Prompt 3: Quick Profile (Abbreviated)

**When to use:** Need a fast read on someone, less detailed than full engagement summary

**Navigate to:** Target person's [INTERNAL_DIRECTORY] profiles

**Prompt:**

```
Quick communication profile for this team member.

In 5 bullet points or less, tell me:
1. What is their role and what do they care about most?
2. How do they prefer to communicate (async/sync, detailed/brief)?
3. What framing would resonate with them right now?
4. What should I definitely NOT do?
5. One specific tip for getting their attention

Keep it brief - just the essentials for crafting one message.
```

---

## Prompt 4: Meeting Prep

**When to use:** Preparing for a meeting with someone you want to influence

**Navigate to:** Target person's [INTERNAL_DIRECTORY] profiles

**Prompt:**

```
I have a meeting with this person. Help me prepare.

Analyze their profile, recent work, and communication patterns to answer:

1. **What's on their mind right now?**
   What are they working on, worried about, or trying to accomplish?

2. **What do they probably want from this meeting?**
   Based on their role and priorities, what outcome would they consider successful?

3. **How should I structure my talking points?**
   Given their communication style, should I lead with data, story, recommendation, or questions?

4. **What questions should I anticipate?**
   What will they likely push back on or want clarification about?

5. **What's my one key message?**
   If they remember only one thing, what should it be (framed for their priorities)?

Keep recommendations specific and actionable.
```

---

## Saving Engagement Summaries

After generating an engagement summary, save it for future reference:

**Location:** `[OUTPUT_FOLDER] / Client Engagement Summaries /`

**Filename format:** 
- For individuals: `[[EMPLOYEE_ID]]@[ORG_DOMAIN].md`
- For groups: `[alias]@[ORG_DOMAIN].md`

**Why save:** The [TEAM_NAME] Comms Agent checks this folder. Saved summaries can inform future interactions.

---

## Tips for Better Results

1. **Pin the page first** — LLM Extension needs the page pinned to access its content

2. **Refresh if stale** — If the person's profile was recently updated, refresh before pinning

3. **Combine sources** — For important communications, pin their profile AND a recent doc they wrote

4. **Verify key facts** — LLM can hallucinate; spot-check specific claims before relying on them

5. **Update periodically** — Re-run engagement summaries every 6-12 months for frequent contacts

---

## When NOT to Use Engagement Summaries

- **Broad distribution lists** (e.g., eng-announce@) — too generic
- **People you know well** — trust your judgment
- **Time-sensitive situations** — just send it
- **Routine operational requests** — overkill

Engagement summaries add value for **high-stakes communication with unfamiliar L8+ audiences**.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "I don't have access to this page" | Check your permissions; some profiles are restricted |
| Sparse or generic output | Person may have limited visible artifacts; note this in your planning |
| Contradictory information | LLM is synthesizing; use your judgment on conflicts |
| Takes too long | Use Quick Profile (Prompt 3) for faster results |

---

*These prompts are optimized for [INTERNAL_LINK]. They may work with other LLM tools but haven't been tested.*

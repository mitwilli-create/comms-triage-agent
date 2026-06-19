# Engagement Summary Template

Engagement summaries are per-stakeholder audience profiles loaded dynamically by the agent when a request names a known recipient. Each summary captures how that stakeholder prefers to receive communication, what they care about, and how to frame asks for maximum engagement.

Actual summaries contain stakeholder information and are not included in this repository. The structure below is the format standard only.

---

```
═══════════════════════════════════════════════════
ENGAGEMENT SUMMARY
═══════════════════════════════════════════════════
Name: [STAKEHOLDER_NAME]
Email: [STAKEHOLDER_EMAIL]
Type: [Individual | Group]
Level: [Seniority]
Team: [Team or org unit]
Aliases: [Alternate names or handles]
═══════════════════════════════════════════════════

Role: [Title and functional responsibilities]

Area of Expertise: [Domains, technologies, initiatives]

Core Mission: [What this stakeholder is trying to accomplish]

## Engagement Strategy

Heuristic: [One-line archetype describing how this stakeholder operates]

[Trigger name]: [What kind of content or framing earns engagement]
[Trigger name]: [Additional engagement signal]

## Strategic Priorities

[Current initiatives and priorities this stakeholder cares about]

## Communication Preferences

[Preferred format, tone, length, channel; failure modes to avoid]

## Past Engagement

[Historical interactions, feedback received, open threads]
```

## Generation

New summaries are generated via the prompts in `prompts/08-individual-es-generator.md` and `prompts/09-group-es-generator.md`. Generation runs through a browser extension against public-facing stakeholder information; the output is saved to a Drive folder and parsed by the agent at triage time.

## Quality standards

See [`docs/references/engagement-summary-quality-standards.md`](../references/engagement-summary-quality-standards.md) for output format requirements.

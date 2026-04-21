# Agent Building Research Digest

## Overview

Aggregated best practices from agent design research, applied to the
comms triage automation project.

## Key Findings

### 1. Structured Knowledge Injection
Moving classification logic and audience profiles into discrete, versioned
knowledge base files (rather than inline prompt text) improves reliability
and makes updates trivial.

### 2. Deterministic Override Layers
For high-stakes edge cases, a deterministic rule outperforms probabilistic
model judgment. Name-match triggers should be absolute, not scored.

### 3. Silent Completion Patterns
Designing routine completions as silent (no notification ping) reduces
alert fatigue. Teams only need visibility into escalated items.

### 4. Persona Separation
Sending automated outputs from a team-branded identity rather than a
personal address improves trust and response rates.

### 5. Human-in-the-Loop Validation
All generated outputs should pass through human review before external
delivery. The agent determines classification; humans approve output.

## Application to This Project

These findings directly informed the triage architecture, notification
design, and escalation logic documented in `ARCHITECTURE.md`.

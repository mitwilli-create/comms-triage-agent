# Agent Build Quick Reference

## Overview

Quick reference guide for the agent build methodology used in this project.

## Session Startup Checklist

1. Load the current knowledge base documents
2. Review the most recent triage criteria version
3. Confirm the touch-level classification logic is up to date
4. Verify all prompt templates are current

## Build Methodology

- **Scoping phase** -- Define requirements, triage rules, and audience profiles
- **Code generation phase** -- Produce production-ready Apps Script code
- **Validation phase** -- Test against form submissions with QA checks
- **Deployment phase** -- Push to production with monitoring

## Key Principles

- Inject knowledge base files rather than inlining rules in prompts
- Use deterministic overrides for high-stakes classification decisions
- Maintain a strict no-hallucination constraint: mark unknowns as [PLACEHOLDER]
- Keep all design decisions auditable and documented

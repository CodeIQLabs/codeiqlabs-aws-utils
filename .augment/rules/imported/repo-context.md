---
trigger: always_on
---

# codeiqlabs-aws-utils — Augment Agent Context

**Source of truth:** Read `AGENTS.md` at the repo root first.

## Purpose

Foundational, framework-agnostic utilities library (`@codeiqlabs/aws-utils`): Zod schemas for AWS
manifests, ResourceNaming, tagging, env helpers, and CLI tools. First in the build chain; consumed
by `aws-cdk` and all CDK app repos.

## Steering files (Kiro-only auto-load; reference manually in Augment)

- `.kiro/steering/build.md` — build/test/publish process and dependency chain
- `.kiro/steering/naming.md` — ResourceNaming conventions and stack-name rules

## Pre-edit reading (cross-reference)

See workspace-root `CLAUDE.md` "Required Pre-Edit Reading" table for any load-bearing conventions
that span repos.

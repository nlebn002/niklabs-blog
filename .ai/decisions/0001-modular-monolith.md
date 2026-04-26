# ADR 0001: Modular Monolith

Date: 2026-04-26

## Status

Accepted

## Context

The app has distinct Blog and Auth domains but does not need distributed-service complexity.

## Decision

Use a modular monolith. Keep domain boundaries explicit inside one deployable backend.

## Consequences

Feature work should respect module ownership. Shared code needs a clear reason to exist outside a module.


# ADR 0002: Orval For API Client

Date: 2026-04-26

## Status

Accepted

## Context

The frontend needs a typed client that stays aligned with backend OpenAPI.

## Decision

Generate the frontend API client with Orval from the backend OpenAPI contract.

## Consequences

API shape changes require regeneration. Generated files should be reviewed as contract output, not hand-authored code.


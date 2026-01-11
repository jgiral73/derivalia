# Getting Started (project overview)

## Purpose

This guide is the entry point for the repository. It provides:
- a fast mental model of the domain
- the minimum reading path
- how to extend the system without breaking invariants

## Quick context

Derivalia is a modular healthcare platform where domain rules drive architecture,
permissions, and UX. It is built with DDD, explicit lifecycles, and strong bounded contexts.

## Minimum reading order

1) [`docs/overview/product-vision.md`](../overview/product-vision.md)
2) [`docs/overview/glossary.md`](../overview/glossary.md)
3) [`docs/architecture/core-domain-bc.md`](../architecture/core-domain-bc.md)
4) [`docs/architecture/bounded-contexts.md`](../architecture/bounded-contexts.md)
5) [`docs/architecture/bounded-context-interactions.md`](../architecture/bounded-context-interactions.md)
6) [`docs/architecture/actor-lifecycles.md`](../architecture/actor-lifecycles.md)
7) [`docs/architecture/permissions-and-ux.md`](../architecture/permissions-and-ux.md)
8) [`docs/overview/use-cases-mvp.md`](../overview/use-cases-mvp.md)

## Repository structure

Backend lives under `apps/api` and follows hexagonal DDD:

```
apps/api/src/contexts/<bc-name>/
  domain/
  application/
  infraestructure/
```

Each BC owns its commands, events, errors, and repositories.

## How to extend the domain

1) Start from [`docs/architecture/domain-commands.md`](../architecture/domain-commands.md).
2) Confirm invariants in [`docs/architecture/domain-invariants.md`](../architecture/domain-invariants.md).
3) Follow the BC prompt under `docs/ai-prompts/`.
4) Implement domain -> application -> infrastructure in that order.
5) Add tests following [`docs/testing/unit-tests-guio.md`](../testing/unit-tests-guio.md).

## What this project is NOT

See [`docs/overview/no-goals.md`](./no-goals.md) for the explicit exclusions.

## Next step

Use [`docs/INDEX.md`](../INDEX.md) as the full documentation map.

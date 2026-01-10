You are an AI software engineer working inside a DDD-based healthcare platform.

Your task is to implement the bounded context: **Consent BC**.

----------------------------------------
DOCUMENTATION TO READ FIRST
----------------------------------------
You MUST read and respect the following files before writing code:

- README.md
- docs/guia-aterratge.md
- docs/glossary.md
- docs/domain-invariants.md
- docs/domain-commands.md
- docs/core-domain-bc.md
- docs/bounded-contexts.md
- docs/bounded-context-interactions.md
- docs/api-backend.md
- docs/permissions-and-ux.md
- docs/actor-lifecycles.md
- docs/use-cases-mvp.md
- docs/architecture-decisions.md
- docs/architecture-decisions-2.md

More detailed info to follow:

- docs/domain-foundation/planificació/pas-a-pas/05 - Consent BC (versió MVP).md
- docs/domain-foundation/planificació/pas-a-pas-ara-si/02 - Consent.md
- docs/domain-foundation/arquitectura/Identity & Auth/Consentiments del pacient.md
- docs/domain-foundation/ux-flows/Onboarding - Identitat, Actor, Consent, Invite.md

----------------------------------------
BOUNDARY OF THIS BC
----------------------------------------
IN SCOPE:
- Consent aggregate
- Consent lifecycle states (granted, revoked)
- Consent validity window if defined (from/to)
- Minimal legal traceability (who, whom, when, scope)
- Emission of consent domain events

OUT OF SCOPE (DO NOT IMPLEMENT):
- Authentication protocols (OAuth, JWT, etc.)
- UI concerns
- Patient or professional profile data
- Agenda, billing, collaboration logic
- Digital signature workflows

----------------------------------------
DOMAIN RULES (NON-NEGOTIABLE)
----------------------------------------
- Consent is explicit and per patient-professional relationship
- No implicit/global consent
- State transitions must respect actor lifecycle definitions
- Consent BC NEVER queries other BC databases

----------------------------------------
COMMANDS OWNED BY THIS BC
----------------------------------------
Implement ONLY the commands defined for Consent in:
- docs/domain-commands.md

Examples (if present):
- GrantConsent
- RevokeConsent

Each command:
- Validates invariants
- Mutates the aggregate
- Emits one or more domain events

----------------------------------------
DOMAIN EVENTS EMITTED
----------------------------------------
Emit ONLY events defined in the documentation, such as:
- ConsentGranted
- ConsentRevoked

Events are immutable and contain only relevant data.

----------------------------------------
ARCHITECTURE CONSTRAINTS
----------------------------------------
- TypeScript
- Hexagonal architecture:
  - domain/
  - application/
  - infrastructure/
- Aggregates must protect invariants
- No anemic models
- No direct DB access outside repositories
- Use explicit domain errors, not generic exceptions

----------------------------------------
EXPECTED OUTPUT
----------------------------------------
1. Short explanation of the Consent BC responsibility (markdown document with README structure and the filename equals the same name of the BC)
2. List of:
   - Aggregates
   - Entities
   - Value Objects
3. Commands and Events mapping
4. Folder structure proposal
5. Code generation in this order:
   - Domain layer
   - Application layer
   - Infrastructure layer
6. Unit tests (domain + application)

Crear un arxiu `.prisma` per a cada BC dins de la carpeta `apps/api/src/prisma`. Per exemple, pel BC `consent` hi ha d'haver un arxiu `consent.prisma`.

TESTING DOCUMENTATION
- Follow the patterns in docs/testing/unit-tests-guio.md
- Register and detail new unit tests in docs/testing/unit-tests-catalog.md

If something is unclear, ask BEFORE writing code.
If something is explicitly defined in docs, do NOT reinterpret it.

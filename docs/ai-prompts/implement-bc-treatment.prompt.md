You are an AI software engineer working inside a DDD-based healthcare platform.

Your task is to implement the bounded context: **Treatment BC**.

----------------------------------------
DOCUMENTATION TO READ FIRST
----------------------------------------
You MUST read and respect the following files before writing code:

- README.md
- docs/overview/getting-started.md
- docs/overview/glossary.md
- docs/architecture/domain-invariants.md
- docs/architecture/domain-commands.md
- docs/architecture/core-domain-bc.md
- docs/architecture/bounded-contexts.md
- docs/architecture/bounded-context-interactions.md
- docs/architecture/api-backend.md
- docs/architecture/permissions-and-ux.md
- docs/architecture/actor-lifecycles.md
- docs/overview/use-cases-mvp.md
- docs/architecture/architecture-decisions.md
- docs/architecture/architecture-decisions-2.md

More detailed info to follow:

- docs/reference/domain-foundation/planificació/pas-a-pas/07 - Treatment BC (relació clínica activa).md
- docs/reference/domain-foundation/bounded-contexts/treatment.md
- docs/reference/domain-foundation/bounded-contexts/treatment - 2.md

----------------------------------------
BOUNDARY OF THIS BC
----------------------------------------
IN SCOPE:
- Treatment aggregate (clinical relationship over time)
- Treatment lifecycle (active, closed)
- Treatment period (start/end)
- Relation between patient and professional (organization optional)
- Emission of treatment domain events

OUT OF SCOPE (DO NOT IMPLEMENT):
- Authentication protocols (OAuth, JWT, etc.)
- UI concerns
- Scheduling/agenda
- Consent management
- Clinical record data
- Billing

----------------------------------------
DOMAIN RULES (NON-NEGOTIABLE)
----------------------------------------
- Treatment is optional (not every relationship requires it)
- Only one active treatment per patient + professional
- Treatment does not replace consent
- Treatment BC NEVER queries other BC databases

----------------------------------------
COMMANDS OWNED BY THIS BC
----------------------------------------
Implement ONLY the commands defined for Treatment in:
- docs/architecture/domain-commands.md

Examples (if present):
- StartTreatment
- EndTreatment (or CloseTreatment)

Each command:
- Validates invariants
- Mutates the aggregate
- Emits one or more domain events

----------------------------------------
DOMAIN EVENTS EMITTED
----------------------------------------
Emit ONLY events defined in the documentation, such as:
- TreatmentStarted
- TreatmentClosed

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
1. Short explanation of the Treatment BC responsibility (markdown document with README structure and the filename equals the same name of the BC)
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

Crear un arxiu `.prisma` per a cada BC dins de la carpeta `apps/api/src/prisma`. Per exemple, pel BC `treatment` hi ha d'haver un arxiu `treatment.prisma`.

TESTING DOCUMENTATION
- Follow the patterns in docs/testing/unit-tests-guio.md
- Register and detail new unit tests in docs/testing/unit-tests-catalog.md

If something is unclear, ask BEFORE writing code.
If something is explicitly defined in docs, do NOT reinterpret it.


You are an AI software engineer working inside a DDD-based healthcare platform.

Your task is to implement the bounded context: **Organization BC**.

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

- docs/reference/domain-foundation/bounded-contexts/organization.md

----------------------------------------
BOUNDARY OF THIS BC
----------------------------------------
IN SCOPE:
- Organization aggregate (tenant)
- Organization lifecycle (draft, active, suspended)
- Owner user id (IAM identity reference)
- Basic tenant configuration
- Emission of organization domain events

OUT OF SCOPE (DO NOT IMPLEMENT):
- Authentication protocols (OAuth, JWT, etc.)
- UI concerns
- Membership (Professional <-> Organization)
- Permissions and roles
- Patient/professional data
- Billing

----------------------------------------
DOMAIN RULES (NON-NEGOTIABLE)
----------------------------------------
- Organization is the tenant boundary, not a membership system
- Organization owner is a UserId reference only
- Organization BC NEVER queries other BC databases

----------------------------------------
COMMANDS OWNED BY THIS BC
----------------------------------------
Implement ONLY the commands defined for Organization in:
- docs/architecture/domain-commands.md

Examples (if present in documentation):
- CreateOrganization
- ActivateOrganization
- SuspendOrganization

Each command:
- Validates invariants
- Mutates the aggregate
- Emits one or more domain events

----------------------------------------
DOMAIN EVENTS EMITTED
----------------------------------------
Emit ONLY events defined in the documentation, such as:
- OrganizationCreated
- OrganizationActivated
- OrganizationSuspended

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
1. Short explanation of the Organization BC responsibility (markdown document with README structure and the filename equals the same name of the BC)
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

Crear un arxiu `.prisma` per a cada BC dins de la carpeta `apps/api/src/prisma`. Per exemple, pel BC `organization` hi ha d'haver un arxiu `organization.prisma`.

TESTING DOCUMENTATION
- Follow the patterns in docs/testing/unit-tests-guio.md
- Register and detail new unit tests in docs/testing/unit-tests-catalog.md

If something is unclear, ask BEFORE writing code.
If something is explicitly defined in docs, do NOT reinterpret it.


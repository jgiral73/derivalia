You are an AI software engineer working inside a DDD-based healthcare platform.

Your task is to implement the bounded context: **Identity & Access BC**.

This BC is responsible for:
- User identity lifecycle
- Authentication-independent identity state
- Roles and permissions assignment
- Account enable/disable
- Emitting identity-related domain events

────────────────────────────────────────
DOCUMENTATION TO READ FIRST
────────────────────────────────────────
You MUST read and respect the following files before writing code:

- README.md
- docs/guia-aterratge.md
- docs/glossary.md
- docs/domain-invariants.md
- docs/domain-commands.md
- docs/core-domain-bc.md
- docs/bounded-contexts.md
- docs/bounded-context-interactions.md
- docs/permissions-and-ux.md
- docs/actor-lifecycles.md
- docs/use-cases-mvp.md
- docs/architecture-decisions.md

More detailed info:

- docs/domain-foundation/planificació/pas-a-pas/01 - Identity BC.md
- docs/domain-foundation/bounded-contexts/indentity - Identity & Access Management.md
- docs/domain-foundation/arquitectura/Identity & Auth/*.md

────────────────────────────────────────
BOUNDARY OF THIS BC
────────────────────────────────────────
IN SCOPE:
- User aggregate
- Identity lifecycle states (registered, active, disabled, archived)
- Role assignment
- Permission sets as value objects
- Emission of identity domain events

OUT OF SCOPE (DO NOT IMPLEMENT):
- Authentication protocols (OAuth, JWT, etc.)
- UI concerns
- Patient data
- Professional collaboration
- Consent logic
- Agenda, billing, onboarding flows

────────────────────────────────────────
DOMAIN RULES (NON-NEGOTIABLE)
────────────────────────────────────────
- A User cannot be active without at least one role
- A disabled account cannot emit business events
- Roles are explicit, not booleans
- State transitions must respect actor lifecycle definitions
- Identity BC NEVER queries other BC databases

────────────────────────────────────────
COMMANDS OWNED BY THIS BC
────────────────────────────────────────
Implement ONLY the commands defined for Identity in:
- docs/domain-commands.md

Examples:
- RegisterUser
- AssignRole
- DisableAccount

Each command:
- Validates invariants
- Mutates the aggregate
- Emits one or more domain events

────────────────────────────────────────
DOMAIN EVENTS EMITTED
────────────────────────────────────────
Emit ONLY events defined in the documentation, such as:
- UserRegistered
- RoleAssigned
- AccountDisabled

Events are immutable and contain only relevant data.

────────────────────────────────────────


DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
UNIT TESTS
DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
- Add unit tests for domain and application layers
- Place tests under apps/api/src using *.spec.ts
- Use Jest + ts-jest

────────────────────────────────────────
EXPECTED OUTPUT
────────────────────────────────────────
1. Short explanation of the Identity BC responsibility (markdown document with README structure and the filename equals the same name of the BC)
2. List of:
   - Aggregates
   - Entities
   - Value Objects
3. Commands and Events mapping
4. Folder structure proposal

6. Unit tests (domain + application)

If something is unclear, ask BEFORE writing code.
If something is explicitly defined in docs, do NOT reinterpret it.
TESTING DOCUMENTATION
- Follow the patterns in docs/testing/unit-tests-guio.md
- Register and detail new unit tests in docs/testing/unit-tests-catalog.md



You are an AI software engineer working inside a DDD-based healthcare platform.

Your task is to implement the bounded context: **Scheduling / Agenda BC**.

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

- docs/reference/domain-foundation/planificació/pas-a-pas/06 - Scheduling & Agenda (MVP amb enforcement real).md
- docs/reference/domain-foundation/bounded-contexts/scheduling.md
- docs/reference/domain-foundation/bounded-contexts/scheduling - Rescheduling & No-Show Policies.md
- docs/reference/domain-foundation/bounded-contexts/scheduling - Sincronització amb calendaris externs.md
- docs/reference/domain-foundation/bounded-contexts/scheduling avan‡at.md

----------------------------------------
BOUNDARY OF THIS BC
----------------------------------------
IN SCOPE:
- Appointment aggregate
- Scheduling slots (availability + external blocks)
- Appointment lifecycle (schedule, reschedule, cancel)
- Consent enforcement before scheduling a patient appointment
- Emission of scheduling domain events

OUT OF SCOPE (DO NOT IMPLEMENT):
- Authentication protocols (OAuth, JWT, etc.)
- UI concerns
- Billing and insurance
- Clinical record data
- External calendar sync (unless explicitly required)

----------------------------------------
DOMAIN RULES (NON-NEGOTIABLE)
----------------------------------------
- Scheduling never queries other BC databases directly
- Consent is required before scheduling a patient appointment
- Appointment times are immutable when rescheduled (new appointment created)
- No overlapping appointments or slots for the same professional

----------------------------------------
COMMANDS OWNED BY THIS BC
----------------------------------------
Implement ONLY the commands defined for Scheduling in:
- docs/architecture/domain-commands.md

Examples (if present):
- CreateAvailability
- ScheduleAppointment
- RescheduleAppointment
- CancelAppointment

Each command:
- Validates invariants
- Mutates the aggregate
- Emits one or more domain events

----------------------------------------
DOMAIN EVENTS EMITTED
----------------------------------------
Emit ONLY events defined in the documentation, such as:
- AppointmentScheduled
- AppointmentRescheduled
- AppointmentCancelled

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
1. Short explanation of the Scheduling BC responsibility (markdown document with README structure and the filename equals the same name of the BC)
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

Crear un arxiu `.prisma` per a cada BC dins de la carpeta `apps/api/src/prisma`. Per exemple, pel BC `scheduling` hi ha d'haver un arxiu `scheduling.prisma`.

TESTING DOCUMENTATION
- Follow the patterns in docs/testing/unit-tests-guio.md
- Register and detail new unit tests in docs/testing/unit-tests-catalog.md

If something is unclear, ask BEFORE writing code.
If something is explicitly defined in docs, do NOT reinterpret it.


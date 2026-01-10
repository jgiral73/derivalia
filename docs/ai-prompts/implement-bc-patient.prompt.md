You are an AI software engineer working inside a DDD-based healthcare platform.

Your task is to implement the bounded context: **Patient BC**.

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

- docs/domain-foundation/planificació/pas-a-pas-ara-si/01 - Patient.md
- docs/domain-foundation/planificació/pas-a-pas/04 - Patient BC (MVP real).md
- docs/domain-foundation/bounded-contexts/patient.md

----------------------------------------
BOUNDARY OF THIS BC
----------------------------------------
IN SCOPE:
- Patient aggregate
- Patient identity data (name, birth date, contact info)
- Patient lifecycle states (created_by_professional, invited, active, archived)
- Link to user (optional)
- Emission of patient domain events

OUT OF SCOPE (DO NOT IMPLEMENT):
- Authentication protocols (OAuth, JWT, etc.)
- UI concerns
- Clinical record data
- Professional collaboration
- Consent logic
- Agenda, billing, onboarding flows

----------------------------------------
DOMAIN RULES (NON-NEGOTIABLE)
----------------------------------------
- A Patient can exist without a User account
- State transitions must respect actor lifecycle definitions
- Patient BC NEVER queries other BC databases

----------------------------------------
COMMANDS OWNED BY THIS BC
----------------------------------------
Implement ONLY the commands defined for Patient in:
- docs/domain-commands.md

Examples:
- CreatePatient
- InvitePatient
- RegisterPatientUser
- ArchivePatient

Each command:
- Validates invariants
- Mutates the aggregate
- Emits one or more domain events

----------------------------------------
DOMAIN EVENTS EMITTED
----------------------------------------
Emit ONLY events defined in the documentation, such as:
- PatientCreated
- PatientUpdated
- PatientArchived

Events are immutable and contain only relevant data.

----------------------------------------


----------------------------------------
UNIT TESTS
----------------------------------------
- Add unit tests for domain and application layers
- Place tests under apps/api/src using *.spec.ts
- Use Jest + ts-jest

----------------------------------------
EXPECTED OUTPUT
----------------------------------------
1. Short explanation of the Patient BC responsibility (markdown document with README structure and the filename equals the same name of the BC)
2. List of:
   - Aggregates
   - Entities
   - Value Objects
3. Commands and Events mapping
4. Folder structure proposal

6. Unit tests (domain + application)

- Crear un arxiu `.prisma` per a cada BC dins de la carpeta `apps/api/src/prisma`. Per exemple, pel BC `patient` hi ha d'haver un arxiu `patient.prisma`.

- Registrar els errors corresponents al domini del BC a l'arxiu compartit `apps/api/src/shared/DomainErrorFilter.ts` a `ERROR_STATUS: Record<string, number>`

If something is unclear, ask BEFORE writing code.
If something is explicitly defined in docs, do NOT reinterpret it.
TESTING DOCUMENTATION
- Follow the patterns in docs/testing/unit-tests-guio.md
- Register and detail new unit tests in docs/testing/unit-tests-catalog.md



# Cataleg de tests unitaris (API)

## Resum

Aquest document recull tots els tests unitaris creats a l'API. Els tests viuen sota
`apps/api/src` i segueixen el patro `*.spec.ts`.

## .

- Carpeta: `apps/api/src/.`
- `app.controller.spec.ts`

## contexts/identity/application/commands/ArchiveAccount

- Carpeta: `apps/api/src/contexts/identity/application/commands/ArchiveAccount`
- `ArchiveAccountHandler.spec.ts`
  - Casos:
    - throws when user is missing
    - saves and publishes on success

## contexts/identity/application/commands/AssignRoleToUser

- Carpeta: `apps/api/src/contexts/identity/application/commands/AssignRoleToUser`
- `AssignRoleToUserHandler.spec.ts`
  - Casos:
    - throws when user is missing
    - throws when role is missing
    - saves and publishes on success

## contexts/identity/application/commands/AuthenticateUser

- Carpeta: `apps/api/src/contexts/identity/application/commands/AuthenticateUser`
- `AuthenticateUserHandler.spec.ts`
  - Casos:
    - throws on missing user
    - throws on invalid password
    - publishes events on success

## contexts/identity/application/commands/DisableAccount

- Carpeta: `apps/api/src/contexts/identity/application/commands/DisableAccount`
- `DisableAccountHandler.spec.ts`
  - Casos:
    - throws when user is missing
    - saves and publishes on success

## contexts/identity/application/commands/EnableAccount

- Carpeta: `apps/api/src/contexts/identity/application/commands/EnableAccount`
- `EnableAccountHandler.spec.ts`
  - Casos:
    - throws when user is missing
    - saves and publishes on success

## contexts/identity/application/commands/LinkUserToActor

- Carpeta: `apps/api/src/contexts/identity/application/commands/LinkUserToActor`
- `LinkUserToActorHandler.spec.ts`
  - Casos:
    - throws when user is missing
    - throws when role is missing
    - saves and publishes on success

## contexts/identity/application/commands/LoginUser

- Carpeta: `apps/api/src/contexts/identity/application/commands/LoginUser`
- `LoginUserHandler.spec.ts`
  - Casos:
    - throws on invalid credentials
    - returns token on success

## contexts/identity/application/commands/RegisterUser

- Carpeta: `apps/api/src/contexts/identity/application/commands/RegisterUser`
- `RegisterUserHandler.spec.ts`
  - Casos:
    - throws when user already exists
    - saves user and publishes events

## contexts/identity/domain/aggregates

- Carpeta: `apps/api/src/contexts/identity/domain/aggregates`
- `User.spec.ts`
  - Casos:
    - registers and emits UserRegistered
    - assigns role and activates when registered
    - prevents assigning the same role twice
    - requires disable before archive
    - links to actor once

## contexts/identity/domain/value-objects

- Carpeta: `apps/api/src/contexts/identity/domain/value-objects`
- `UserState.spec.ts`
  - Casos:
    - allows valid transitions
    - rejects invalid transitions
    - requires role to activate

## contexts/patient/application/commands/ArchivePatient

- Carpeta: `apps/api/src/contexts/patient/application/commands/ArchivePatient`
- `ArchivePatientHandler.spec.ts`
  - Casos:
    - throws when patient is missing
    - saves and publishes on success

## contexts/patient/application/commands/CreatePatient

- Carpeta: `apps/api/src/contexts/patient/application/commands/CreatePatient`
- `CreatePatientHandler.spec.ts`
  - Casos:
    - saves patient and publishes events

## contexts/patient/application/commands/InvitePatient

- Carpeta: `apps/api/src/contexts/patient/application/commands/InvitePatient`
- `InvitePatientHandler.spec.ts`
  - Casos:
    - throws when patient is missing
    - saves and publishes on success

## contexts/patient/application/commands/RegisterPatientUser

- Carpeta: `apps/api/src/contexts/patient/application/commands/RegisterPatientUser`
- `RegisterPatientUserHandler.spec.ts`
  - Casos:
    - throws when patient is missing
    - saves and publishes on success

## contexts/patient/domain/aggregates

- Carpeta: `apps/api/src/contexts/patient/domain/aggregates`
- `Patient.spec.ts`
  - Casos:
    - creates and emits PatientCreated
    - invites and sets status to invited
    - registers user and sets status to active
    - rejects register user when not invited

## contexts/patient/domain/value-objects

- Carpeta: `apps/api/src/contexts/patient/domain/value-objects`
- `BirthDate.spec.ts`
  - Casos:
    - creates a valid birth date
    - rejects future dates
- `ContactInfo.spec.ts`
  - Casos:
    - accepts email
    - accepts phone
    - rejects empty contact info
    - rejects invalid email
- `PatientName.spec.ts`
  - Casos:
    - creates a trimmed name
    - rejects empty name
- `PatientStatus.spec.ts`
  - Casos:
    - allows valid transitions
    - rejects invalid transitions

## contexts/professional/application/commands/CompleteProfessionalOnboarding

- Carpeta: `apps/api/src/contexts/professional/application/commands/CompleteProfessionalOnboarding`
- `CompleteProfessionalOnboardingHandler.spec.ts`
  - Casos:
    - throws when professional is missing
    - saves and publishes events

## contexts/professional/application/commands/CreateProfessional

- Carpeta: `apps/api/src/contexts/professional/application/commands/CreateProfessional`
- `CreateProfessionalHandler.spec.ts`
  - Casos:
    - throws when professional already exists
    - saves and publishes events

## contexts/professional/application/commands/InviteProfessional

- Carpeta: `apps/api/src/contexts/professional/application/commands/InviteProfessional`
- `InviteProfessionalHandler.spec.ts`
  - Casos:
    - throws when professional already exists
    - saves and publishes events

## contexts/professional/application/commands/SuspendProfessional

- Carpeta: `apps/api/src/contexts/professional/application/commands/SuspendProfessional`
- `SuspendProfessionalHandler.spec.ts`
  - Casos:
    - throws when professional is missing
    - saves and publishes events

## contexts/professional/application/commands/UpdateProfessionalProfile

- Carpeta: `apps/api/src/contexts/professional/application/commands/UpdateProfessionalProfile`
- `UpdateProfessionalProfileHandler.spec.ts`
  - Casos:
    - throws when professional is missing
    - saves and publishes events

## contexts/professional/domain/aggregates

- Carpeta: `apps/api/src/contexts/professional/domain/aggregates`
- `Professional.spec.ts`
  - Casos:
    - invites and emits ProfessionalInvited
    - creates and emits ProfessionalCreated
    - completes onboarding and activates
    - rejects onboarding when not partial

## contexts/professional/domain/value-objects

- Carpeta: `apps/api/src/contexts/professional/domain/value-objects`
- `FullName.spec.ts`
  - Casos:
    - creates a trimmed name
    - rejects short name
- `LicenseNumber.spec.ts`
  - Casos:
    - creates normalized license number
    - rejects invalid license
- `ProfessionalStatus.spec.ts`
  - Casos:
    - allows valid transitions
    - rejects invalid transitions
- `Specialty.spec.ts`
  - Casos:
    - normalizes specialty
    - rejects empty specialty

## shared/domain/value-objects

- Carpeta: `apps/api/src/shared/domain/value-objects`
- `Email.spec.ts`
  - Casos:
    - creates a normalized email
    - rejects invalid email

## Execucio

```bash
cd apps/api
npm test
```

## Automatitzacio

Aquest cataleg es genera automaticament amb:

```bash
cd apps/api
npm run test:catalog
```

Es recomana executar-lo en CI i fallar si hi ha canvis pendents.
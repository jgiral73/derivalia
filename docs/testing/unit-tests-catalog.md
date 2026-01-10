# Cataleg de tests unitaris (API)

## Resum

Aquest document recull tots els tests unitaris creats a l'API. Els tests viuen sota
`apps/api/src` i segueixen el patro `*.spec.ts`.

## Backend base

- `apps/api/src/app.controller.spec.ts`
  - AppController / root
  - Casos:
    - retorna "Hello World!"

## Identity BC

### Domain - Value Objects

- Carpeta: `apps/api/src/contexts/identity/domain/value-objects`

- `Email.spec.ts`
  - Email
  - Casos:
    - crea email normalitzat
    - rebutja email invalid

- `UserState.spec.ts`
  - UserState
  - Casos:
    - permet transicions valides
    - rebutja transicions invalides
    - exigeix rol per activar

### Domain - Aggregate

- Carpeta: `apps/api/src/contexts/identity/domain/aggregates`

- `User.spec.ts`
  - User aggregate
  - Casos:
    - registra i emet UserRegistered
    - assigna rol i activa quan esta registrat
    - evita assignar el mateix rol dues vegades
    - requereix disable abans d'archive
    - link a actor una sola vegada

### Application - Commands

- Carpeta: `apps/api/src/contexts/identity/application/commands`

- `RegisterUser/RegisterUserHandler.spec.ts`
  - RegisterUserHandler
  - Casos:
    - error si l'usuari ja existeix
    - guarda usuari i publica events

- `AuthenticateUser/AuthenticateUserHandler.spec.ts`
  - AuthenticateUserHandler
  - Casos:
    - error si no hi ha usuari
    - error si password invalid
    - publica events en exit

- `LoginUser/LoginUserHandler.spec.ts`
  - LoginUserHandler
  - Casos:
    - error credencials invalides
    - retorna token en exit

- `AssignRoleToUser/AssignRoleToUserHandler.spec.ts`
  - AssignRoleToUserHandler
  - Casos:
    - error si usuari no existeix
    - error si rol no existeix
    - guarda i publica events

- `LinkUserToActor/LinkUserToActorHandler.spec.ts`
  - LinkUserToActorHandler
  - Casos:
    - error si usuari no existeix
    - error si rol no existeix
    - guarda i publica events

- `DisableAccount/DisableAccountHandler.spec.ts`
  - DisableAccountHandler
  - Casos:
    - error si usuari no existeix
    - guarda i publica events

- `EnableAccount/EnableAccountHandler.spec.ts`
  - EnableAccountHandler
  - Casos:
    - error si usuari no existeix
    - guarda i publica events

- `ArchiveAccount/ArchiveAccountHandler.spec.ts`
  - ArchiveAccountHandler
  - Casos:
    - error si usuari no existeix
    - guarda i publica events

## Patient BC

### Domain - Value Objects

- Carpeta: `apps/api/src/contexts/patient/domain/value-objects`

- `PatientName.spec.ts`
  - PatientName
  - Casos:
    - crea nom amb trim
    - rebutja nom buit

- `BirthDate.spec.ts`
  - BirthDate
  - Casos:
    - crea data valida
    - rebutja dates futures

- `ContactInfo.spec.ts`
  - ContactInfo
  - Casos:
    - accepta email
    - accepta phone
    - rebutja contact info buit
    - rebutja email invalid

- `PatientStatus.spec.ts`
  - PatientStatus
  - Casos:
    - permet transicions valides
    - rebutja transicions invalides

### Domain - Aggregate

- Carpeta: `apps/api/src/contexts/patient/domain/aggregates`

- `Patient.spec.ts`
  - Patient aggregate
  - Casos:
    - crea i emet PatientCreated
    - invita i passa a invited
    - registra usuari i passa a active
    - rebutja registerUser si no esta invited

### Application - Commands

- Carpeta: `apps/api/src/contexts/patient/application/commands`

- `CreatePatient/CreatePatientHandler.spec.ts`
  - CreatePatientHandler
  - Casos:
    - guarda pacient i publica events

- `InvitePatient/InvitePatientHandler.spec.ts`
  - InvitePatientHandler
  - Casos:
    - error si pacient no existeix
    - guarda i publica events

- `RegisterPatientUser/RegisterPatientUserHandler.spec.ts`
  - RegisterPatientUserHandler
  - Casos:
    - error si pacient no existeix
    - guarda i publica events

- `ArchivePatient/ArchivePatientHandler.spec.ts`
  - ArchivePatientHandler
  - Casos:
    - error si pacient no existeix
    - guarda i publica events

## Execucio

```bash
cd apps/api
npm test
```

## Possible millora

Si vols una documentacio sempre sincronitzada, podem generar aquest cataleg
automaticament a partir dels `describe`/`it` amb un script (p. ex. Node o
PowerShell) i deixar-lo com a pas del CI.

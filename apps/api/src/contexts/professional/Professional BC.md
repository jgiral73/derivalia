# Professional BC (Profile)

## Responsabilitat

El Professional BC gestiona el perfil professional i el seu onboarding progressiu.
Representa l'identitat professional (no la identitat tecnica d'usuari) i governa
les capacitats disponibles segons l'estat.

## Boundary

IN SCOPE:
- Agregat Professional
- Estat de lifecycle (invited, partial_onboarding, active, suspended)
- Perfil professional (nom, numero de colegiat, especialitats)
- Invitacions i vinculacio amb User (userId)
- Emissio d'esdeveniments de domini professional

OUT OF SCOPE:
- Autenticacio, JWT, OAuth
- UI
- Dades de pacient
- Consentiments
- Col.laboracio professional
- Agenda, billing

## Model de domini

### Aggregates
- Professional

### Entities
- None (MVP)

### Value Objects
- ProfessionalId
- FullName
- LicenseNumber
- Specialty
- ProfessionalStatus

## Commands i events

- CreateProfessional -> ProfessionalCreated
- InviteProfessional -> ProfessionalInvited
- CompleteProfessionalOnboarding -> ProfessionalOnboardingCompleted
- UpdateProfessionalProfile -> ProfessionalProfileUpdated
- SuspendProfessional -> ProfessionalSuspended

## Capabilities

Les capabilities depenen de l'estat:

- Active -> `patient.read`, `patient.write`
- Altres estats -> cap

## Estructura de carpetes

```
professional/
  domain/
    aggregates/
    value-objects/
    events/
    errors/
    repositories/
  application/
    commands/
  infraestructure/
    http/
    mappers/
    repositories/
    services/
  professional.module.ts
  professional.tokens.ts
```

## Exemple de codi (contextualitzat)

File: apps/api/src/contexts/professional/domain/aggregates/Professional.ts
Class: Professional

```ts
professional.completeOnboarding({
  fullName: FullName.create('Maria Soler'),
  licenseNumber: LicenseNumber.create('ABC-123'),
  specialties: [Specialty.create('psychology')],
});
```

## Exemples Postman (consum d'API)

Base URL: `http://localhost:3000`

### Crear perfil professional

POST `http://localhost:3000/professionals`

```json
{
  "userId": "user-123",
  "email": "pro@example.com"
}
```

### Invitar professional

POST `http://localhost:3000/professionals/invite`

```json
{
  "email": "invited@example.com"
}
```

### Completar onboarding

POST `http://localhost:3000/professionals/complete-onboarding`

```json
{
  "professionalId": "prof-123",
  "fullName": "Maria Soler",
  "licenseNumber": "ABC-123",
  "specialties": ["psychology", "nutrition"]
}
```

### Actualitzar perfil

POST `http://localhost:3000/professionals/update-profile`

```json
{
  "professionalId": "prof-123",
  "fullName": "Maria Soler",
  "specialties": ["psychology"]
}
```

### Suspendre professional

POST `http://localhost:3000/professionals/suspend`

```json
{
  "professionalId": "prof-123",
  "reason": "verification_failed"
}
```

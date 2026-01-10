# Collaboration BC (Professional Collaboration)

## Responsabilitat

El Collaboration BC defineix la collaboracio professional-professional sobre un pacient,
amb un objectiu clinic concret, un abast (scope) limitat i un periode temporal.
No canvia la responsabilitat principal del professional solicitant.

## Boundary

IN SCOPE:
- Agregat Collaboration
- Lifecycle (requested, active, rejected, ended)
- Purpose (especialitat i motiu)
- Scope de permisos limitats
- Periode temporal obligatori
- Emissio d'esdeveniments de collaboracio

OUT OF SCOPE:
- Autenticacio i UI
- Consentiments (assumit verificat)
- Scheduling/agenda
- Dades de la historia clinica
- Facturacio

## Model de domini

### Aggregates
- Collaboration

### Entities
- CollaborationScope

### Value Objects
- CollaborationId
- CollaborationPurpose
- CollaborationStatus
- TimeRange

## Commands i events

- RequestCollaboration -> CollaborationRequested
- AcceptCollaboration -> CollaborationAccepted
- RejectCollaboration -> CollaborationRejected
- EndCollaboration -> CollaborationEnded

## Estructura de carpetes

```
collaboration/
  domain/
    aggregates/
    entities/
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
  collaboration.module.ts
  collaboration.tokens.ts
```

## Exemple de codi (contextualitzat)

File: apps/api/src/contexts/collaboration/domain/aggregates/Collaboration.ts
Class: Collaboration

```ts
const collaboration = Collaboration.request({
  id: CollaborationId.fromString('collab-123'),
  patientId: 'patient-1',
  requesterProfessionalId: 'pro-1',
  collaboratorProfessionalId: 'pro-2',
  purpose: CollaborationPurpose.create('addictions', 'suport puntual'),
  scope: new CollaborationScope(true, true, true, false),
  period: TimeRange.create(new Date('2026-01-10'), new Date('2026-03-10')),
});

collaboration.accept('pro-2');
```

## Exemples Postman (consum d'API)

Base URL: `http://localhost:3000`

### Solicitar collaboracio

POST `http://localhost:3000/collaborations/request`

```json
{
  "requesterProfessionalId": "pro-1",
  "patientId": "patient-1",
  "purposeSpecialty": "addictions",
  "purposeDescription": "suport puntual",
  "scopeCanViewClinicalRecords": true,
  "scopeCanAddNotes": true,
  "scopeCanSuggestTreatment": true,
  "scopeCanAccessForms": false,
  "periodFrom": "2026-01-10T00:00:00.000Z",
  "periodTo": "2026-03-10T00:00:00.000Z",
  "collaboratorProfessionalId": "pro-2"
}
```

### Acceptar collaboracio

POST `http://localhost:3000/collaborations/accept`

```json
{
  "collaborationId": "collab-123",
  "collaboratorProfessionalId": "pro-2"
}
```

### Rebutjar collaboracio

POST `http://localhost:3000/collaborations/reject`

```json
{
  "collaborationId": "collab-123",
  "collaboratorProfessionalId": "pro-2"
}
```

### Finalitzar collaboracio

POST `http://localhost:3000/collaborations/end`

```json
{
  "collaborationId": "collab-123",
  "endedByProfessionalId": "pro-1"
}
```

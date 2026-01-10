# Treatment BC

## Responsabilitat

El Treatment BC representa la relacio clinica activa entre professional i
pacient al llarg del temps. Es optional i no substitueix el consentiment.

## Boundary

IN SCOPE:
- Agregat Treatment
- Cicle de vida del tractament (active, closed)
- Periode temporal (start/end)
- Objectiu del tractament
- Emissio d'esdeveniments de domini

OUT OF SCOPE:
- Autenticacio, JWT, OAuth
- UI
- Agenda i scheduling
- Consentiments
- Dades cliniques
- Facturacio

## Model de domini

### Aggregates
- Treatment

### Entities
- None (MVP)

### Value Objects
- TreatmentId
- TreatmentGoal
- TreatmentPeriod
- TreatmentStatus

## Commands i events

- StartTreatment -> TreatmentStarted
- CloseTreatment -> TreatmentClosed

## Estructura de carpetes

```
treatment/
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
  treatment.module.ts
  treatment.tokens.ts
```

## Exemple de codi (contextualitzat)

File: apps/api/src/contexts/treatment/domain/aggregates/Treatment.ts
Class: Treatment

```ts
const treatment = Treatment.start({
  id: TreatmentId.fromString('treat-1'),
  patientId: 'patient-1',
  professionalId: 'pro-1',
  goal: TreatmentGoal.create('Recovery'),
});
```

## Exemples Postman (consum d'API)

Base URL: `http://localhost:3000`

### Iniciar tractament

POST `http://localhost:3000/treatments`

```json
{
  "patientId": "patient-123",
  "professionalId": "pro-456",
  "goal": "Recovery"
}
```

### Tancar tractament

POST `http://localhost:3000/treatments/close`

```json
{
  "treatmentId": "treat-123"
}
```

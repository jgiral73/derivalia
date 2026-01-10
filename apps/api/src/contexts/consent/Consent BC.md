# Consent BC

## Responsabilitat

El Consent BC gestiona els consentiments explicits i la conformitat formal
associada. Controla scope, finalitat, temporalitat i traçabilitat legal.

## Boundary

IN SCOPE:
- Agregat Consent
- Conformitat com a sub-entity del Consent
- Scope, purpose i decision (allow/deny)
- Finestra temporal (validFrom/validUntil)
- Emissio d'esdeveniments de domini

OUT OF SCOPE:
- Autenticacio, JWT, OAuth
- UI
- Dades cliniques o d'historial
- Col.laboracio professional (nomes registre de conformitat)
- Agenda i billing

## Model de domini

### Aggregates
- Consent

### Entities
- Conformity (sub-entity del Consent)

### Value Objects
- ConsentId
- ConsentScope
- ConsentPurpose
- ConsentDecision
- ConformityType
- ConformityStatus

## Commands i events

- RequestConsent -> ConsentRequested
- GrantConsent -> ConsentGranted
- RevokeConsent -> ConsentRevoked
- RequestConformity -> ConformityRequested
- AcceptConformity -> ConformityAccepted
- RejectConformity -> ConformityRejected

## Estructura de carpetes

```
consent/
  domain/
    aggregates/
    entities/
    value-objects/
    events/
    errors/
    repositories/
  application/
    commands/
    services/
  infraestructure/
    http/
    mappers/
    repositories/
    services/
  consent.module.ts
  consent.tokens.ts
```

## Exemple de codi (contextualitzat)

File: apps/api/src/contexts/consent/domain/aggregates/Consent.ts
Class: Consent

```ts
consent.requestConformity({
  id: 'conf-1',
  type: ConformityType.create('collaboration'),
});
```

## Exemples Postman (consum d'API)

Base URL: `http://localhost:3000`

### Request consent

POST `http://localhost:3000/consents/request`

```json
{
  "patientId": "patient-123",
  "granteeId": "professional-456",
  "scopeType": "patient",
  "scopeRef": "patient-123",
  "purpose": "care",
  "validUntil": "2026-12-31T00:00:00.000Z"
}
```

### Grant consent

POST `http://localhost:3000/consents/grant`

```json
{
  "consentId": "consent-123",
  "validUntil": "2026-12-31T00:00:00.000Z"
}
```

### Revoke consent

POST `http://localhost:3000/consents/revoke`

```json
{
  "consentId": "consent-123"
}
```

### Request conformity

POST `http://localhost:3000/consents/conformity/request`

```json
{
  "consentId": "consent-123",
  "type": "collaboration"
}
```

### Accept conformity

POST `http://localhost:3000/consents/conformity/accept`

```json
{
  "consentId": "consent-123",
  "conformityId": "conf-123"
}
```

### Reject conformity

POST `http://localhost:3000/consents/conformity/reject`

```json
{
  "consentId": "consent-123",
  "conformityId": "conf-123"
}
```

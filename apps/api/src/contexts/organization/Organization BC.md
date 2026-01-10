# Organization BC (Tenant)

## Responsabilitat

L'Organization BC introdueix el multi-tenant real. Defineix l'organitzacio on treballen els professionals,
el seu tipus i el seu estat de lifecycle, aixi com el propietari (ownerUserId) i la configuracio basica del tenant.

## Boundary

IN SCOPE:
- Agregat Organization
- Estat de lifecycle (draft, active, suspended)
- Tipus d'organitzacio (clinic, center, private_practice)
- Owner (UserId)
- Emissio d'esdeveniments d'organitzacio

OUT OF SCOPE:
- Membresia (vindria en un BC separat)
- Permisos
- Dades cliniques
- Facturacio
- Autenticacio i UI

## Model de domini

### Aggregates
- Organization

### Entities
- None (MVP)

### Value Objects
- OrganizationId
- OrganizationName
- OrganizationType
- OrganizationStatus

## Commands i events

- CreateOrganization -> OrganizationCreated
- ActivateOrganization -> OrganizationActivated
- SuspendOrganization -> OrganizationSuspended

## Estructura de carpetes

```
organization/
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
  organization.module.ts
  organization.tokens.ts
```

## Exemple de codi (contextualitzat)

File: apps/api/src/contexts/organization/domain/aggregates/Organization.ts
Class: Organization

```ts
const organization = Organization.create({
  id: OrganizationId.fromString('org-123'),
  ownerUserId: 'user-123',
  name: OrganizationName.create('Clinica Derivalia'),
  type: OrganizationType.Clinic,
});

organization.activate();
```

## Exemples Postman (consum d'API)

Base URL: `http://localhost:3000`

### Crear organitzacio

POST `http://localhost:3000/organizations`

```json
{
  "ownerUserId": "user-123",
  "name": "Clinica Derivalia",
  "type": "clinic"
}
```

### Activar organitzacio

POST `http://localhost:3000/organizations/activate`

```json
{
  "organizationId": "org-123"
}
```

### Suspendre organitzacio

POST `http://localhost:3000/organizations/suspend`

```json
{
  "organizationId": "org-123"
}
```

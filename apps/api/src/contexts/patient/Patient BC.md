# Patient BC

## Responsabilitat

El Patient BC gestiona el pacient com a subjecte clinic independent del login.
Inclou la seva identitat basica, estat de lifecycle i vincle opcional a usuari.
No gestiona consentiments, colaboracions ni historials clinics.

## Boundary

IN SCOPE:
- Patient aggregate
- Identitat basica (nom, data naixement, contacte)
- Estat del pacient (created_by_professional, invited, active, archived)
- Vincle opcional a User
- Emissio d'esdeveniments de domini del pacient

OUT OF SCOPE:
- Autenticacio, JWT, OAuth
- UI
- Clinical record data
- Consentiments i colaboracio professional
- Agenda, billing, onboarding flows

## Model de domini

### Aggregates
- Patient

### Entities
- None (MVP)

### Value Objects
- PatientId
- PatientName
- BirthDate
- ContactInfo
- PatientStatus

## Commands i events

- CreatePatient -> PatientCreated
- InvitePatient -> PatientUpdated (status = invited)
- RegisterPatientUser -> PatientUpdated (status = active)
- ArchivePatient -> PatientArchived

## Estructura de carpetes

```
patient/
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
  patient.module.ts
  patient.tokens.ts
```

## Exemple de codi (contextualitzat)

File: apps/api/src/contexts/patient/domain/aggregates/Patient.ts
Class: Patient

```ts
patient.invite(ContactInfo.create({ email: 'pat@example.com' }));
patient.registerUser('user-123');
```

File: apps/api/src/contexts/patient/application/commands/CreatePatient/CreatePatientHandler.ts
Class: CreatePatientHandler

```ts
const patient = Patient.create({
  id,
  name,
  createdByProfessionalId: command.professionalId,
  birthDate,
  contactInfo,
});
```

## Exemples Postman (consum d'API)

Base URL: `http://localhost:3000`

### Crear pacient

POST `http://localhost:3000/patients`

```json
{
  "professionalId": "prof-123",
  "fullName": "Maria Soler",
  "birthDate": "1990-05-12",
  "email": "maria@example.com",
  "phone": "666555444"
}
```

### Enviar invitacio

POST `http://localhost:3000/patients/invite`

```json
{
  "patientId": "patient-123",
  "email": "maria@example.com"
}
```

### Registrar usuari del pacient

POST `http://localhost:3000/patients/register-user`

```json
{
  "patientId": "patient-123",
  "userId": "user-123"
}
```

### Arxivar pacient

POST `http://localhost:3000/patients/archive`

```json
{
  "patientId": "patient-123"
}
```

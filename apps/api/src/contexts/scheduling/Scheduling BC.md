# Scheduling BC (Agenda)

## Responsabilitat

El Scheduling BC gestiona cites i slots temporals (disponibilitat i bloqueig
extern) sense dependre del domini clinic. Consumeix consentiment de forma
estricta abans de programar una cita amb pacient.

## Boundary

IN SCOPE:
- Agregat Appointment
- Slots de disponibilitat i bloqueig extern
- Enforcament de consentiment abans de programar
- Cancelacio i reprogramacio

OUT OF SCOPE:
- Dades cliniques
- Facturacio
- Tractament (nomes referencies)
- Calendari extern bidireccional (nomes bloquejos)

## Model de domini

### Aggregates
- Appointment

### Entities
- SchedulingSlot

### Value Objects
- AppointmentId
- AppointmentStatus
- AppointmentType
- SlotId
- SlotType
- TimeSlot

## Commands i events

- CreateAvailability -> (no events de domini)
- ScheduleAppointment -> AppointmentScheduled
- RescheduleAppointment -> AppointmentRescheduled + AppointmentScheduled
- CancelAppointment -> AppointmentCancelled

## Estructura de carpetes

```
scheduling/
  domain/
    aggregates/
    entities/
    value-objects/
    events/
    errors/
    repositories/
    services/
  application/
    commands/
    ports/
  infraestructure/
    adapters/
    http/
    mappers/
    repositories/
    services/
  scheduling.module.ts
  scheduling.tokens.ts
```

## Exemple de codi (contextualitzat)

File: apps/api/src/contexts/scheduling/application/commands/ScheduleAppointment/ScheduleAppointmentHandler.ts
Class: ScheduleAppointmentHandler

```ts
const appointment = Appointment.schedule({
  id: randomUUID(),
  professionalId: command.professionalId,
  patientId: command.patientId,
  organizationId: command.organizationId,
  treatmentId: command.treatmentId,
  timeSlot,
  type: AppointmentType.fromValue(command.type),
});
```

## Exemples Postman (consum d'API)

Base URL: `http://localhost:3000`

### Crear slot de disponibilitat

POST `http://localhost:3000/appointments/slots`

```json
{
  "professionalId": "pro-123",
  "startAt": "2026-02-01T10:00:00.000Z",
  "endAt": "2026-02-01T12:00:00.000Z",
  "slotType": "availability"
}
```

### Registrar bloqueig extern

POST `http://localhost:3000/appointments/slots`

```json
{
  "professionalId": "pro-123",
  "startAt": "2026-02-01T13:00:00.000Z",
  "endAt": "2026-02-01T14:00:00.000Z",
  "slotType": "external_block"
}
```

### Programar cita

POST `http://localhost:3000/appointments`

```json
{
  "professionalId": "pro-123",
  "patientId": "patient-456",
  "startAt": "2026-02-01T10:00:00.000Z",
  "endAt": "2026-02-01T11:00:00.000Z",
  "type": "visit"
}
```

### Reprogramar cita

POST `http://localhost:3000/appointments/reschedule`

```json
{
  "appointmentId": "appt-123",
  "startAt": "2026-02-02T10:00:00.000Z",
  "endAt": "2026-02-02T11:00:00.000Z"
}
```

### Cancelar cita

POST `http://localhost:3000/appointments/cancel`

```json
{
  "appointmentId": "appt-123"
}
```

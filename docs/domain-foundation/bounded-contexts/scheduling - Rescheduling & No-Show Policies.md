Perfecte.
👉 **PAS 17 — Scheduling avançat (Rescheduling, No-show, polítiques i consistència)**
Continuem **pas a pas**, aprofundint sense saltar cap capa.

<br />

# PAS 17 — Rescheduling & No-Show Policies

Aquest pas resol **problemes reals**:

* canvis d’última hora
* pacients que no venen
* penalitzacions
* impacte en agenda i facturació
* coherència amb notificacions i consentiments

<br />

## 17️⃣1️⃣ Principis clau (agenda seriosa)

1. **Una cita no es modifica directament**
2. El temps és immutable → es creen **nous estats**
3. Les polítiques són **regles de domini**
4. Tot canvi és **auditable**

<br />

## 17️⃣2️⃣ Nous estats de la cita

📁 `modules/scheduling/domain/value-objects/AppointmentStatus.ts`

```ts
export type AppointmentStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'RESCHEDULED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW'
```

<br />

## 17️⃣3️⃣ Aggregate: suport a reschedule

📁 `modules/scheduling/domain/aggregates/Appointment.ts`

```ts
reschedule(newFrom: Date, newTo: Date) {
  if (this.status !== 'CONFIRMED') {
    throw new Error('Only confirmed appointments can be rescheduled')
  }

  this.status = 'RESCHEDULED'
}
```

👉 **No canviem dates**
👉 Tanquem la cita i en creem una de nova

<br />

## 17️⃣4️⃣ Command: RescheduleAppointment

📁
`modules/scheduling/application/commands/RescheduleAppointmentHandler.ts`

```ts
export class RescheduleAppointmentHandler {
  constructor(
    private readonly repo: AppointmentRepository,
    private readonly availability: AvailabilityService
  ) {}

  async execute(cmd: {
    appointmentId: string
    newFrom: Date
    newTo: Date
  }) {

    const original = await this.repo.findById(cmd.appointmentId)

    if (!original) throw new Error('Appointment not found')

    const available = await this.availability.isAvailable({
      professionalId: original.professionalId,
      from: cmd.newFrom,
      to: cmd.newTo
    })

    if (!available) {
      throw new Error('New slot not available')
    }

    original.reschedule(cmd.newFrom, cmd.newTo)
    await this.repo.save(original)

    const newAppointment = new Appointment(
      uuid(),
      original.professionalId,
      original.patientId,
      original.organizationId,
      cmd.newFrom,
      cmd.newTo,
      'CONFIRMED',
      original.type,
      original.referralId
    )

    await this.repo.save(newAppointment)

    // Domain events:
    // AppointmentRescheduled
  }
}
```

<br />

## 17️⃣5️⃣ Política de No-Show (Domain Policy)

📁
`modules/scheduling/domain/policies/NoShowPolicy.ts`

```ts
export class NoShowPolicy {

  canMarkNoShow(appointment: Appointment, now = new Date()): boolean {
    return (
      appointment.status === 'CONFIRMED' &&
      now > appointment.endsAt
    )
  }

  penaltyMinutes(): number {
    return 15
  }
}
```

<br />

## 17️⃣6️⃣ Marcar No-Show

📁
`modules/scheduling/application/commands/MarkNoShowHandler.ts`

```ts
export class MarkNoShowHandler {
  constructor(
    private readonly repo: AppointmentRepository,
    private readonly policy: NoShowPolicy
  ) {}

  async execute(cmd: { appointmentId: string }) {

    const appt = await this.repo.findById(cmd.appointmentId)

    if (!appt) throw new Error('Appointment not found')

    if (!this.policy.canMarkNoShow(appt)) {
      throw new Error('Cannot mark no-show yet')
    }

    appt.status = 'NO_SHOW'
    await this.repo.save(appt)

    // Event: AppointmentNoShow
  }
}
```

<br />

## 17️⃣7️⃣ Impacte a disponibilitat (buffer penalització)

📁 `modules/scheduling/domain/services/CalendarRulesService.ts`

```ts
applyNoShowPenalty(
  professionalId: string,
  from: Date
): Date {

  const penalty = 15 // minutes
  return new Date(from.getTime() + penalty * 60000)
}
```

👉 Penalitza el **proper slot**

<br />

## 17️⃣8️⃣ CQRS — Read Model amb historial

📁 `modules/scheduling/read-models/AppointmentHistoryRM.ts`

```ts
export interface AppointmentHistoryRM {
  appointmentId: string
  events: {
    type:
      | 'CREATED'
      | 'CONFIRMED'
      | 'RESCHEDULED'
      | 'CANCELLED'
      | 'NO_SHOW'
    at: string
  }[]
}
```

<br />

## 17️⃣9️⃣ Endpoint historial

```http
GET /appointments/:id/history
```

👉 Transparència
👉 Legal
👉 Auditoria

<br />

## 🔟 Integració amb notificacions (preview)

* Confirmació
* Recordatori
* Reprogramació
* No-show

👉 **event-driven**

```ts
AppointmentRescheduled → NotifyPatient
AppointmentNoShow → NotifyProfessional
```

<br />

## ⚠️ Errors habituals

❌ Modificar dates directament
❌ No guardar historial
❌ No penalitzar no-show
❌ Regles al front
❌ Cancel·lar en lloc de reschedule

<br />

## ✅ Resum PAS 17

* ✔️ Rescheduling immutable
* ✔️ No-show com estat
* ✔️ Polítiques explícites
* ✔️ Historial auditable
* ✔️ Preparat per notificacions i billing

<br />

## PAS 18 (següent, molt natural)

👉 **Notifications & Async workflows**

* Email / SMS / WhatsApp
* retries
* templates
* preferències del pacient
* legal (opt-in)

Quan diguis **“seguim”**, entrem al **PAS 18**.

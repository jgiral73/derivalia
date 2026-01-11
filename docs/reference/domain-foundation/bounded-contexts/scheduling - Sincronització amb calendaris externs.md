Perfecte.
👉 **PAS 19 — External Calendar Sync (Google / Outlook) — two-way, segur i coherent amb DDD**
Seguim **pas a pas** i tanquem definitivament el BC Scheduling.

<br />

# PAS 19 — Sincronització amb calendaris externs

## 19️⃣1️⃣ Problema real

* El professional **ja usa** Google / Outlook
* Les cites poden:

  * crear-se dins la plataforma
  * crear-se fora (mòbil, assistent, etc.)
* Cal:

  * evitar dobles reserves
  * respectar ownership
  * no trencar el domini

👉 **La sincronització NO és domini**
👉 És **infraestructura + application**

<br />

## 19️⃣2️⃣ Principis clau (molt importants)

1. Scheduling és **source of truth** funcional
2. Calendar extern és **mirall parcial**
3. Mai sincronitzem “a cegues”
4. Tot canvi extern passa per regles internes
5. Sempre traçabilitat

<br />

## 19️⃣3️⃣ On viu això (arquitectura)

📁 `modules/calendar-sync`

```txt
calendar-sync/
├── domain/
│   ├── value-objects/
│   │   └── ExternalCalendarProvider.ts
│   └── entities/
│       └── ExternalCalendarLink.ts
├── application/
│   ├── services/
│   │   └── CalendarSyncService.ts
│   ├── handlers/
│   │   └── ExternalEventHandler.ts
├── infrastructure/
│   ├── google/
│   │   └── GoogleCalendarClient.ts
│   ├── outlook/
│   │   └── OutlookCalendarClient.ts
│   └── persistence/
```

<br />

## 19️⃣4️⃣ Model: ExternalCalendarLink

👉 Relació professional ↔ calendar extern

📁 `modules/calendar-sync/domain/entities/ExternalCalendarLink.ts`

```ts
export class ExternalCalendarLink {
  constructor(
    public readonly professionalId: string,
    public readonly provider: ExternalCalendarProvider,
    public readonly externalCalendarId: string,
    public readonly accessToken: string,
    public readonly refreshToken: string
  ) {}
}
```

<br />

## 19️⃣5️⃣ Persistència (Prisma)

📁 `prisma/schema.prisma`

```prisma
model ExternalCalendarLink {
  professionalId     String
  provider           String
  externalCalendarId String
  accessToken        String
  refreshToken       String

  @@id([professionalId, provider])
}
```

<br />

## 19️⃣6️⃣ Què sincronitzem (IMPORTANT)

| Tipus               | Direcció | Notes                    |
| ------------------- | -------- | ------------------------ |
| Cita confirmada     | → extern | Sempre                   |
| Reprogramació       | → extern | Update                   |
| Cancel·lació        | → extern | Delete                   |
| Esdeveniment extern | ← extern | **Només com a bloqueig** |

👉 **No creem cites clíniques des de fora**

<br />

## 19️⃣7️⃣ Mapping intern ↔ extern

📁 `modules/calendar-sync/application/services/CalendarSyncService.ts`

```ts
mapAppointmentToExternal(appt: Appointment) {
  return {
    title: 'Busy',
    start: appt.startsAt,
    end: appt.endsAt,
    description: `Internal appointment ${appt.id}`
  }
}
```

👉 **No exposem dades mèdiques**

<br />

## 19️⃣8️⃣ Push intern → extern

📁
`modules/calendar-sync/application/handlers/AppointmentConfirmedHandler.ts`

```ts
@EventHandler(AppointmentConfirmed)
async handle(event: AppointmentConfirmed) {

  const link =
    await this.linkRepo.findByProfessional(
      event.professionalId
    )

  if (!link) return

  const client = this.clientFactory.create(link.provider)

  await client.createEvent(
    link.externalCalendarId,
    this.mapAppointmentToExternal(event)
  )
}
```

<br />

## 19️⃣9️⃣ Pull extern → intern (webhooks)

👉 Google / Outlook criden webhook

📁
`modules/calendar-sync/application/handlers/ExternalEventHandler.ts`

```ts
async handleExternalEvent(input: {
  professionalId: string
  from: Date
  to: Date
}) {

  // NO crear Appointment
  // Crear BLOCKING SLOT

  await this.blockingService.blockSlot({
    professionalId: input.professionalId,
    from: input.from,
    to: input.to,
    reason: 'EXTERNAL_EVENT'
  })
}
```

<br />

## 20️⃣ Blocking Slots (sub-model)

📁 `modules/scheduling/domain/entities/BlockingSlot.ts`

```ts
export class BlockingSlot {
  constructor(
    public readonly professionalId: string,
    public readonly from: Date,
    public readonly to: Date,
    public readonly reason: string
  ) {}
}
```

👉 AvailabilityService ho té en compte

<br />

## 21️⃣ Resolució de conflictes

| Cas                        | Resultat        |
| -------------------------- | --------------- |
| Extern solapa cita interna | Rebutjat        |
| Intern solapa extern       | Bloquejat       |
| Esborrat extern            | Desbloqueig     |
| Token caducat              | Retry + refresh |

<br />

## 22️⃣ CQRS — Agenda combinada

📁 `modules/scheduling/read-models/AgendaDayRM.ts`

```ts
slots: {
  from: string
  to: string
  status: 'FREE' | 'BOOKED' | 'BLOCKED'
  source?: 'INTERNAL' | 'EXTERNAL'
}[]
```

<br />

## 23️⃣ Front-end (Ionic)

* mostra bloquejos externs
* no permet editar-los
* icona diferenciada

```html
<ion-badge color="medium">
  External
</ion-badge>
```

<br />

## ⚠️ Errors habituals (greus)

❌ Crear cites mèdiques des de Google
❌ Sincronitzar dades sensibles
❌ No separar blocking vs appointment
❌ No gestionar tokens
❌ No tenir webhooks

<br />

## ✅ Resum PAS 19

* ✔️ External calendars com a bloqueig
* ✔️ Scheduling segueix manant
* ✔️ Sync bidireccional controlat
* ✔️ Sense exposar dades clíniques
* ✔️ UX clara

<br />

## 🎯 Amb això el BC Scheduling queda COMPLET

Has cobert:

* disponibilitat
* overbooking
* reschedule
* no-show
* notificacions
* calendaris externs
* CQRS
* DDD net


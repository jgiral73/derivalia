Perfecte.
👉 **PAS 18 — Notifications & Async Workflows (event-driven, healthcare-grade)**
Seguim **pas a pas**, integrant-ho amb Scheduling, Patient, Consent i Authorization.

<br />

# PAS 18 — Sistema de notificacions

## 18️⃣1️⃣ Principis clau (molt importants)

1. **El domini NO envia notificacions**
2. Tot és **event-driven**
3. Preferències del receptor manen
4. Consentiment explícit per canal
5. Retries i idempotència

<br />

## 18️⃣2️⃣ On viu això (BC Notifications)

📁 `modules/notifications`

```txt
notifications/
├── domain/
│   ├── aggregates/
│   │   └── Notification.ts
│   ├── value-objects/
│   │   ├── Channel.ts
│   │   ├── DeliveryStatus.ts
│   │   └── NotificationType.ts
│   └── repositories/
│       └── NotificationRepository.ts
├── application/
│   ├── handlers/
│   │   └── AppointmentEventsHandler.ts
│   └── services/
│       └── NotificationDispatcher.ts
├── infrastructure/
│   ├── email/
│   ├── sms/
│   └── whatsapp/
```

<br />

## 18️⃣3️⃣ Aggregate Notification

📁 `modules/notifications/domain/aggregates/Notification.ts`

```ts
export class Notification {
  constructor(
    public readonly id: string,
    public readonly recipientId: string,
    public readonly channel: Channel,
    public readonly type: NotificationType,
    public readonly payload: any,
    public status: DeliveryStatus,
    public attempts: number = 0
  ) {}

  markSent() {
    this.status = 'SENT'
  }

  markFailed() {
    this.attempts++
    this.status =
      this.attempts >= 3 ? 'FAILED' : 'PENDING'
  }
}
```

<br />

## 18️⃣4️⃣ Value Objects

### Channel

📁 `modules/notifications/domain/value-objects/Channel.ts`

```ts
export type Channel =
  | 'EMAIL'
  | 'SMS'
  | 'WHATSAPP'
```

<br />

### DeliveryStatus

```ts
export type DeliveryStatus =
  | 'PENDING'
  | 'SENT'
  | 'FAILED'
```

<br />

### NotificationType

```ts
export type NotificationType =
  | 'APPOINTMENT_CONFIRMED'
  | 'APPOINTMENT_REMINDER'
  | 'APPOINTMENT_RESCHEDULED'
  | 'APPOINTMENT_CANCELLED'
  | 'NO_SHOW'
```

<br />

## 18️⃣5️⃣ Persistència (Prisma)

📁 `prisma/schema.prisma`

```prisma
model Notification {
  id          String   @id
  recipientId String
  channel     String
  type        String
  payload     Json
  status      String
  attempts    Int

  createdAt   DateTime @default(now())
}
```

<br />

## 18️⃣6️⃣ Preferències del receptor

👉 **BC Patient / Professional**

```ts
interface NotificationPreferences {
  email: boolean
  sms: boolean
  whatsapp: boolean
}
```

👉 Consultades abans d’enviar

<br />

## 18️⃣7️⃣ Consentiment per canal

📁 `modules/consent`

```ts
purpose: 'NOTIFICATIONS'
scope: 'CHANNEL'
```

👉 Exemple:

* permet EMAIL
* nega SMS

<br />

## 18️⃣8️⃣ Dispatcher (Application Service)

📁
`modules/notifications/application/services/NotificationDispatcher.ts`

```ts
export class NotificationDispatcher {
  constructor(
    private readonly repo: NotificationRepository,
    private readonly email: EmailProvider,
    private readonly sms: SmsProvider,
    private readonly whatsapp: WhatsappProvider
  ) {}

  async dispatch(notification: Notification) {
    try {
      switch (notification.channel) {
        case 'EMAIL':
          await this.email.send(notification.payload)
          break
        case 'SMS':
          await this.sms.send(notification.payload)
          break
        case 'WHATSAPP':
          await this.whatsapp.send(notification.payload)
          break
      }

      notification.markSent()
    } catch {
      notification.markFailed()
    }

    await this.repo.save(notification)
  }
}
```

<br />

## 18️⃣9️⃣ Event Handler (Scheduling → Notifications)

📁
`modules/notifications/application/handlers/AppointmentEventsHandler.ts`

```ts
@EventHandler(AppointmentConfirmed)
async onConfirmed(event: AppointmentConfirmed) {

  const channels =
    await this.preferenceService.getAllowedChannels(
      event.patientId
    )

  for (const channel of channels) {
    const notification = new Notification(
      uuid(),
      event.patientId,
      channel,
      'APPOINTMENT_CONFIRMED',
      {
        date: event.startsAt,
        professional: event.professionalName
      },
      'PENDING'
    )

    await this.repo.save(notification)
  }
}
```

👉 **No s’envia aquí**
👉 Només es crea

<br />

## 18️⃣🔟 Worker async

📁 `workers/notifications.worker.ts`

```ts
while (true) {
  const pending = await repo.findPending()

  for (const notification of pending) {
    await dispatcher.dispatch(notification)
  }
}
```

👉 Separació total
👉 Escalable
👉 Retry segur

<br />

## 18️⃣1️⃣1️⃣ Front-end (Ionic)

* mostra estat notificació
* permet activar/desactivar canals
* mostra errors

```html
<ion-toggle
  [(ngModel)]="prefs.email">
</ion-toggle>
```

<br />

## ⚠️ Errors habituals

❌ Enviar directament al handler
❌ No tenir retries
❌ No respectar consentiment
❌ Lògica de canals al front
❌ No persistir intents

<br />

## ✅ Resum

* ✔️ BC propi
* ✔️ Event-driven
* ✔️ Consentiment + preferències
* ✔️ Async + retry
* ✔️ Preparat per escalar



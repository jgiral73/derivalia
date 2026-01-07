Perfecte.
👉 **PAS 13 — Auditoria clínica i traçabilitat legal**
Seguim **pas a pas**, com fins ara, sense salts.

<br />

# PAS 13 — Auditoria clínica (who / what / why / how)

En entorns sanitaris **l’auditoria no és opcional**.
No és només logging: és **prova legal**.

<br />

## 13️⃣1️⃣ Què hem d’auditar (model mental)

Cada acció sensible ha de respondre:

| Pregunta          | Exemple                          |
| ----------------- | -------------------------------- |
| **Qui**           | user-123                         |
| **En nom de qui** | user-456 (delegació)             |
| **Què**           | patient.read                     |
| **Sobre què**     | PATIENT:patient-1                |
| **Quan**          | timestamp                        |
| **Per què**       | derivació / emergència           |
| **Com**           | normal / delegació / break-glass |

<br />

## 13️⃣2️⃣ On viu l’auditoria (DDD)

👉 **BC propi: Audit / Compliance**

📁 `modules/audit`

```txt
audit/
├── domain/
│   ├── events/
│   │   └── AuditEvent.ts
│   ├── value-objects/
│   │   └── AuditContext.ts
│   └── repositories/
│       └── AuditLogRepository.ts
├── application/
│   └── listeners/
├── infrastructure/
```

<br />

## 13️⃣3️⃣ Model de domini — AuditEvent

📁 `modules/audit/domain/events/AuditEvent.ts`

```ts
export class AuditEvent {
  constructor(
    public readonly id: string,
    public readonly actorId: string,
    public readonly subjectId: string | null,
    public readonly action: string,
    public readonly scope: string,
    public readonly mode: 'NORMAL' | 'DELEGATION' | 'EMERGENCY',
    public readonly reason?: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
```

<br />

## 13️⃣4️⃣ Context d’auditoria (Request-scoped)

📁 `common/context/AuditContext.ts`

```ts
export class AuditContext {
  constructor(
    public readonly actorId: string,
    public readonly subjectId?: string,
    public readonly mode: 'NORMAL' | 'DELEGATION' | 'EMERGENCY',
    public readonly reason?: string
  ) {}
}
```

👉 Es construeix:

* des del JWT
* des del context de delegació
* des del break-glass

<br />

## 13️⃣5️⃣ Com es genera l’auditoria (pattern)

### Regla d’or

> **El domini NO escriu logs**

L’auditoria s’activa:

* via **Domain Events**
* o via **Application Events**

<br />

## 13️⃣6️⃣ Exemple — veure pacient

### 1️⃣ Handler

📁 `modules/patient/application/queries/GetPatientHandler.ts`

```ts
const patient = await this.repo.getById(query.patientId)

this.eventBus.publish(
  new PatientViewedEvent(
    ctx.auditContext,
    query.patientId
  )
)

return patient
```

<br />

### 2️⃣ Event de domini

📁 `modules/patient/domain/events/PatientViewedEvent.ts`

```ts
export class PatientViewedEvent {
  constructor(
    public readonly audit: AuditContext,
    public readonly patientId: string
  ) {}
}
```

<br />

### 3️⃣ Listener d’auditoria

📁 `modules/audit/application/listeners/PatientViewedAuditListener.ts`

```ts
@EventsHandler(PatientViewedEvent)
export class PatientViewedAuditListener {
  constructor(
    private readonly repo: AuditLogRepository
  ) {}

  handle(event: PatientViewedEvent) {
    const audit = new AuditEvent(
      uuid(),
      event.audit.actorId,
      event.audit.subjectId ?? null,
      'patient.read',
      `PATIENT:${event.patientId}`,
      event.audit.mode,
      event.audit.reason
    )

    this.repo.save(audit)
  }
}
```

👉 El BC Patient **no coneix Audit**

<br />

## 13️⃣7️⃣ Persistència (Prisma)

📁 `prisma/schema.prisma`

```prisma
model AuditLog {
  id         String   @id
  actorId    String
  subjectId  String?
  action     String
  scope      String
  mode       String
  reason     String?
  occurredAt DateTime

  @@index([actorId])
  @@index([scope])
  @@index([occurredAt])
}
```

<br />

## 13️⃣8️⃣ Auditoria de break-glass (obligatòria)

Cada acció sota emergència ha de registrar:

```ts
mode: 'EMERGENCY'
reason: 'Urgències vitals'
```

👉 Sense això **NO compleix normativa**

<br />

## 13️⃣9️⃣ Front-end — transparència a l’usuari

### UX obligatori

```txt
⚠️ Estàs accedint sota mode d’emergència
Aquest accés quedarà registrat
```

<br />

## 🔟 Errors habituals (greus)

❌ Només fer `console.log`
❌ No registrar subjecte
❌ No diferenciar mode
❌ No auditar lectures
❌ Permetre modificar logs
❌ No indexar per data

<br />

## ✅ Resum del PAS 13

* ✔️ Auditoria com a BC
* ✔️ Domain/Application events
* ✔️ Actor ≠ Subjecte
* ✔️ Mode explícit
* ✔️ Legalment defensable
* ✔️ Backend-driven

<br />

## PAS 14 (següent, molt recomanat)

👉 **Consentiments del pacient**

* qui pot veure què
* revocable
* explícit
* traçable

Quan diguis **“seguim”**, entrem al **PAS 14**.

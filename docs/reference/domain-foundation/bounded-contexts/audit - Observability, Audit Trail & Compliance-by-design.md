Perfecte.
👉 **PAS 24 — Observability, Audit Trail & Compliance-by-design**
Aquest pas **tanca el core** de la plataforma i és clau en salut, derivacions i FHIR.

Seguim **pas a pas**, amb DDD pur i sense contaminar el domini.

---

# PAS 24 — Observability & Audit Trail

## 24️⃣1️⃣ Problema real (salut)

Hem de poder respondre **sempre** a:

* Qui ha accedit a què?
* Amb quin propòsit?
* Amb quin consentiment?
* Durant quin període?
* Què s’ha exportat?
* Qui ho ha modificat?

👉 **No és logging tècnic**
👉 És **traçabilitat legal**

---

## 24️⃣2️⃣ Principi fonamental

> **Cap acció sensible pot existir sense audit event**

👉 Però:

* El domini **no sap** com es persisteix
* El domini **emeteix fets**
* La infraestructura **els grava**

---

## 24️⃣3️⃣ Nou BC: Audit & Compliance

📁 `modules/audit`

```txt
audit/
├── domain/
│   ├── events/
│   │   ├── DataAccessedEvent.ts
│   │   ├── DataExportedEvent.ts
│   │   ├── DataModifiedEvent.ts
│   └── value-objects/
│       ├── AccessPurpose.ts
│       └── AuditActor.ts
├── application/
│   ├── subscribers/
│   │   └── AuditEventSubscriber.ts
│   └── queries/
│       └── GetAuditTrail
├── infrastructure/
│   └── prisma/
│       └── AuditEventRepository.ts
```

---

## 24️⃣4️⃣ Domain Events (immutables)

### DataAccessedEvent

📁
`modules/audit/domain/events/DataAccessedEvent.ts`

```ts
export class DataAccessedEvent {
  constructor(
    public readonly actor: AuditActor,
    public readonly resourceType: string,
    public readonly resourceId: string,
    public readonly purpose: AccessPurpose,
    public readonly occurredAt: Date = new Date()
  ) {}
}
```

---

### AuditActor (VO)

📁
`modules/audit/domain/value-objects/AuditActor.ts`

```ts
export class AuditActor {
  constructor(
    public readonly id: string,
    public readonly role: string,
    public readonly organizationId?: string
  ) {}
}
```

---

### AccessPurpose

```ts
export type AccessPurpose =
  | 'CARE'
  | 'DERIVATION'
  | 'BILLING'
  | 'INTEROPERABILITY'
```

---

## 24️⃣5️⃣ Emissió des del domini (exemple)

📁
`modules/clinical-records/application/queries/GetClinicalRecord.ts`

```ts
this.eventBus.publish(
  new DataAccessedEvent(
    new AuditActor(
      user.id,
      user.role,
      user.organizationId
    ),
    'ClinicalRecord',
    record.id,
    'CARE'
  )
)
```

👉 El domini **no sap** on va això
👉 Només diu: *“això ha passat”*

---

## 24️⃣6️⃣ Subscriber (application layer)

📁
`modules/audit/application/subscribers/AuditEventSubscriber.ts`

```ts
@EventsHandler(
  DataAccessedEvent,
  DataExportedEvent,
  DataModifiedEvent
)
export class AuditEventSubscriber {

  constructor(
    private readonly repo: AuditEventRepository
  ) {}

  handle(event) {
    this.repo.store(event)
  }
}
```

---

## 24️⃣7️⃣ Persistència (Prisma)

📁 `prisma/schema.prisma`

```prisma
model AuditEvent {
  id            String   @id @default(uuid())
  actorId       String
  actorRole     String
  organizationId String?
  resourceType  String
  resourceId    String
  purpose       String
  occurredAt    DateTime
}
```

👉 **Append-only**
👉 **Mai UPDATE**
👉 **Mai DELETE**

---

## 24️⃣8️⃣ Query — Audit Trail

📁
`modules/audit/application/queries/GetAuditTrailHandler.ts`

```ts
export class GetAuditTrailHandler {
  constructor(
    private readonly repo: AuditEventRepository
  ) {}

  async execute(filter: {
    patientId?: string
    actorId?: string
    from?: Date
    to?: Date
  }) {
    return this.repo.search(filter)
  }
}
```

---

## 24️⃣9️⃣ Front-end (Angular / Ionic)

### Exemple: vista de traçabilitat

```ts
canViewAudit = auth.hasPermission('audit.read')

events$ = this.auditService.getTrail({
  patientId: this.patientId
})
```

```html
<app-audit-timeline
  *ngIf="canViewAudit"
  [events]="events$ | async">
</app-audit-timeline>
```

---

## 🔟 Observability tècnica (separada!)

* Logs (ELK)
* Metrics (Prometheus)
* Tracing (OpenTelemetry)

👉 **Mai barrejar amb audit legal**

---

## ⚠️ Errors habituals

❌ Usar logs com a audit
❌ Permetre editar audit
❌ No registrar exports
❌ Barrejar finalitats
❌ No filtrar per consentiment

---

## ✅ Resum PAS 24

* ✔️ Audit com a BC
* ✔️ Events immutables
* ✔️ Compliance-by-design
* ✔️ Separació legal / tècnica
* ✔️ Front-end controlat per permisos

---

## PAS 25 — TANCAMENT FINAL

Opcions:
1️⃣ **Multi-tenant hard isolation (per clíniques)**
2️⃣ **Billing & insurance**
3️⃣ **Deployment, GDPR, HIPAA, ISO**
4️⃣ **Roadmap evolutiu (MVP → scale)**

Digues quin i **seguim** 🔥


Perfecte.
👉 **PAS 14 — Consentiments del pacient (Consent Management)**
Seguim **pas a pas**, coherent amb permisos, delegació, break-glass i auditoria.

<br />

# PAS 14 — Consentiments del pacient

En salut, encara que **tinguis permís**, **pot no estar permès** si el pacient **no ha donat consentiment**.
Això és **independent** de roles, permisos i delegacions.

<br />

## 14️⃣1️⃣ Principi clau (molt important)

> **Autorització final = permisos ∧ context ∧ consentiment**

Cap capa substitueix l’altra.

<br />

## 14️⃣2️⃣ Casos d’ús reals

* El pacient:

  * permet veure dades clíniques però **no informes**
  * permet a un professional però **no a l’organització**
  * revoca accés en qualsevol moment
* Consentiment:

  * temporal
  * per finalitat
  * per tipus de dada

<br />

## 14️⃣3️⃣ On viu això (DDD)

👉 **BC propi: Consent**

📁 `modules/consent`

```txt
consent/
├── domain/
│   ├── aggregates/
│   │   └── Consent.ts
│   ├── value-objects/
│   │   ├── ConsentScope.ts
│   │   ├── ConsentPurpose.ts
│   │   └── ConsentDecision.ts
│   └── repositories/
│       └── ConsentRepository.ts
├── application/
│   ├── services/
│   │   └── ConsentService.ts
│   └── commands/
├── infrastructure/
```

<br />

## 14️⃣4️⃣ Model de domini — Consent (aggregate)

📁 `modules/consent/domain/aggregates/Consent.ts`

```ts
export class Consent {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly granteeId: string, // professional / org
    public readonly scope: ConsentScope,
    public readonly purpose: ConsentPurpose,
    public readonly decision: ConsentDecision,
    public readonly validFrom: Date,
    public readonly validUntil?: Date
  ) {}

  isActive(now = new Date()): boolean {
    if (this.validUntil && now > this.validUntil) return false
    return now >= this.validFrom
  }
}
```

<br />

## 14️⃣5️⃣ Scope del consentiment

📁 `modules/consent/domain/value-objects/ConsentScope.ts`

```ts
export class ConsentScope {
  constructor(
    public readonly type: 'PATIENT' | 'TREATMENT' | 'DATA_TYPE',
    public readonly ref: string
  ) {}

  matches(other: ConsentScope): boolean {
    return this.type === other.type && this.ref === other.ref
  }
}
```

Exemples:

* `PATIENT / patient-1`
* `DATA_TYPE / CLINICAL_NOTES`
* `TREATMENT / treatment-3`

<br />

## 14️⃣6️⃣ Purpose (finalitat)

📁 `modules/consent/domain/value-objects/ConsentPurpose.ts`

```ts
export class ConsentPurpose {
  constructor(
    public readonly value:
      | 'CARE'
      | 'BILLING'
      | 'RESEARCH'
      | 'LEGAL'
  ) {}
}
```

👉 **Finalitat ≠ permís**

<br />

## 14️⃣7️⃣ Decision

📁 `modules/consent/domain/value-objects/ConsentDecision.ts`

```ts
export class ConsentDecision {
  constructor(
    public readonly value: 'ALLOW' | 'DENY'
  ) {}
}
```

<br />

## 14️⃣8️⃣ Persistència (Prisma)

📁 `prisma/schema.prisma`

```prisma
model Consent {
  id          String   @id
  patientId   String
  granteeId   String
  scopeType   String
  scopeRef    String
  purpose     String
  decision    String
  validFrom   DateTime
  validUntil  DateTime?

  createdAt   DateTime @default(now())

  @@index([patientId])
  @@index([granteeId])
}
```

<br />

## 14️⃣9️⃣ ConsentService (Application)

📁 `modules/consent/application/services/ConsentService.ts`

```ts
export class ConsentService {
  constructor(
    private readonly repo: ConsentRepository
  ) {}

  async isAllowed(input: {
    patientId: string
    granteeId: string
    scope: ConsentScope
    purpose: ConsentPurpose
  }): Promise<boolean> {

    const consents =
      await this.repo.findActiveForPatient(
        input.patientId,
        input.granteeId
      )

    const relevant = consents.filter(c =>
      c.scope.matches(input.scope) &&
      c.purpose.value === input.purpose.value
    )

    if (relevant.some(c => c.decision.value === 'DENY')) {
      return false
    }

    return relevant.some(c => c.decision.value === 'ALLOW')
  }
}
```

👉 **DENY sempre guanya**

<br />

## 15️⃣ Integració amb AuthorizationService (clau)

📁 `modules/identity/application/services/AuthorizationService.ts`

```ts
async canAccess(input: {
  actorId: string
  permission: string
  scope: AccessScope
  basePermissions: string[]
  patientId?: string
  purpose: ConsentPurpose
}): Promise<boolean> {

  // 1️⃣ permisos + delegació + emergència
  const permitted = await this.hasPermission({
    actorId: input.actorId,
    permission: input.permission,
    scope: input.scope,
    basePermissions: input.basePermissions
  })

  if (!permitted) return false

  // 2️⃣ consentiment (si aplica)
  if (input.patientId) {
    return this.consentService.isAllowed({
      patientId: input.patientId,
      granteeId: input.actorId,
      scope: new ConsentScope(
        input.scope.type,
        input.scope.referenceId
      ),
      purpose: input.purpose
    })
  }

  return true
}
```

👉 **Autorització final**

<br />

## 16️⃣ Policy real (exemple)

📁 `modules/patient/application/policies/CanViewClinicalRecordPolicy.ts`

```ts
await this.authz.canAccess({
  actorId: ctx.actorId,
  permission: 'clinicalRecord.read',
  basePermissions: ctx.permissions,
  scope: new AccessScope('PATIENT', patientId),
  patientId,
  purpose: new ConsentPurpose('CARE')
})
```

<br />

## 17️⃣ Break-glass i consentiment

### Regla legal habitual

* Break-glass **pot ignorar consentiment**
* Però:

  * només `read`
  * només `CARE`
  * auditoria reforçada

```ts
if (ctx.mode === 'EMERGENCY') {
  return true
}
```

👉 Això ha d’estar **documentat legalment**

<br />

## 18️⃣ Front-end — gestió de consentiments

### El front:

* mostra estat
* permet revocar
* NO calcula autorització

```html
<app-consent-toggle
  [patient]="patient"
  [professional]="professional">
</app-consent-toggle>
```

<br />

## 19️⃣ Auditoria de consentiment (obligatòria)

* crear
* revocar
* ús sota override

Tot queda traçat.

<br />

## 20️⃣ Errors habituals (greus)

❌ Confondre permís amb consentiment
❌ Consentiment global sense scope
❌ No tenir finalitat
❌ No permetre revocació
❌ No auditar
❌ Front-end “decidint”

<br />

## ✅ Resum del PAS 14

* ✔️ Consentiment = BC propi
* ✔️ Scope + purpose obligatoris
* ✔️ DENY prioritari
* ✔️ Integrat amb autorització
* ✔️ Compatible amb emergències
* ✔️ Legalment sòlid

<br />

## PAS 15 (següent, tanca el cercle)

👉 **Read Models & CQRS per autorització**

* optimitzar consultes
* evitar N+1
* exposar `canX` al front

Quan diguis **“seguim”**, entrem al **PAS 15**.


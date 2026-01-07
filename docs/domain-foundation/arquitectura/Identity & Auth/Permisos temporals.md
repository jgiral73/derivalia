Perfecte. Els **permisos temporals** són clau en salut (derivacions, substitucions, col·laboracions puntuals) i sovint es fan malament. Ho veurem **bé**, integrat amb el que ja tens (DDD, policies, front-end).

Anirem així:

1️⃣ Concepte i casos d’ús reals
2️⃣ Model de domini (DDD)
3️⃣ Resolució efectiva de permisos (backend)
4️⃣ Ús en policies
5️⃣ Exposició mínima al front-end
6️⃣ Errors habituals

<br />

# 1️⃣ Què són permisos temporals (i què NO)

### ✅ Són

* Permisos **limitats en el temps**
* **Contextuals** (pacient, tractament, org)
* **Revocables**
* **Auditable**

### ❌ NO són

* Un role nou
* Un hack al front-end
* Un flag al JWT sense control

<br />

## Casos típics en salut

* Derivació d’un pacient → accés temporal al seu historial
* Substitució d’un professional (vacances)
* Interconsulta puntual
* Accés d’urgència (break-glass)

<br />

# 2️⃣ Model DDD — TemporaryAccess (BC Identity / Access)

👉 Això **NO** va a Patient ni Treatment.
👉 Va a **Identity & Access BC**.

📁 `modules/identity/domain/aggregates/TemporaryAccess.ts`

```ts
export class TemporaryAccess {
  constructor(
    public readonly id: string,
    public readonly granteeId: string,      // qui rep l’accés
    public readonly grantedById: string,    // qui l’atorga
    public readonly permissions: string[],  // què pot fer
    public readonly scope: AccessScope,     // sobre què
    public readonly validFrom: Date,
    public readonly validUntil: Date
  ) {}

  isActive(now = new Date()): boolean {
    return now >= this.validFrom && now <= this.validUntil
  }

  allows(permission: string, scope: AccessScope): boolean {
    return (
      this.permissions.includes(permission) &&
      this.scope.matches(scope)
    )
  }
}
```

<br />

## 2.1️⃣ Scope (clau del sistema)

📁 `modules/identity/domain/value-objects/AccessScope.ts`

```ts
export class AccessScope {
  constructor(
    public readonly type: 'PATIENT' | 'TREATMENT' | 'ORGANIZATION',
    public readonly referenceId: string
  ) {}

  matches(other: AccessScope): boolean {
    return (
      this.type === other.type &&
      this.referenceId === other.referenceId
    )
  }
}
```

👉 Exemple:

* `PATIENT / patient-123`
* `TREATMENT / treatment-456`

<br />

# 3️⃣ Persistència (Prisma)

📁 `prisma/schema.prisma`

```prisma
model TemporaryAccess {
  id            String   @id
  granteeId     String
  grantedById   String
  permissions   String   // CSV o JSON
  scopeType     String
  scopeRefId    String
  validFrom     DateTime
  validUntil    DateTime
  revokedAt     DateTime?

  createdAt     DateTime @default(now())

  @@index([granteeId])
  @@index([scopeType, scopeRefId])
}
```

👉 No FK
👉 BC independent
👉 Auditable

<br />

# 4️⃣ Resolució de permisos efectiva (backend)

### Idea clau

> **Permisos efectius = permisos base + permisos temporals actius**

<br />

## 4.1️⃣ AuthorizationService (Application)

📁 `modules/identity/application/services/AuthorizationService.ts`

```ts
export class AuthorizationService {
  constructor(
    private readonly tempAccessRepo: TemporaryAccessRepository
  ) {}

  async hasPermission(input: {
    userId: string
    permission: string
    scope?: AccessScope
    basePermissions: string[]
  }): Promise<boolean> {

    // 1️⃣ Permís base
    if (input.basePermissions.includes(input.permission)) {
      return true
    }

    // 2️⃣ Permís temporal
    if (!input.scope) return false

    const tempAccesses =
      await this.tempAccessRepo.findActiveForUser(input.userId)

    return tempAccesses.some(access =>
      access.allows(input.permission, input.scope)
    )
  }
}
```

<br />

# 5️⃣ Ús en una policy real (exemple clínic)

### Cas: veure pacient

📁 `modules/patient/application/policies/CanViewPatientPolicy.ts`

```ts
export class CanViewPatientPolicy {
  constructor(
    private readonly authz: AuthorizationService
  ) {}

  async check(input: {
    actorId: string
    patientId: string
    basePermissions: string[]
  }) {
    const allowed = await this.authz.hasPermission({
      userId: input.actorId,
      permission: 'patient.read',
      basePermissions: input.basePermissions,
      scope: new AccessScope('PATIENT', input.patientId)
    })

    if (!allowed) {
      throw new Error('Not allowed to view patient')
    }
  }
}
```

👉 La policy **no sap si és temporal o no**

<br />

# 6️⃣ Front-end — què fem amb això?

## Principi clau (molt important)

> El front-end **NO ha de calcular permisos temporals**

### Opcions correctes:

### ✅ Opció A (recomanada)

El backend retorna:

```json
{
  "canView": true,
  "canEdit": false
}
```

### ✅ Opció B (mínima)

El front només usa:

* permisos base
* context evident (ownership)

I accepta errors 403 puntuals.

<br />

## Exemple UX (derivació)

```html
<app-patient-record
  *ngIf="patient.permissions.canView">
</app-patient-record>
```

<br />

# 7️⃣ Com es concedeixen permisos temporals?

Normalment via:

* Acceptar derivació
* Assignació substitució
* Workflow clínic

### Exemple: acceptar derivació

```ts
TemporaryAccess.create({
  granteeId: toProfessionalId,
  permissions: ['patient.read'],
  scope: new AccessScope('PATIENT', patientId),
  validFrom: now,
  validUntil: now.plusDays(30)
})
```

<br />

# 8️⃣ Revocació i seguretat

✔️ Expiració automàtica
✔️ Revocable manualment
✔️ Loggable
✔️ Sense tocar roles
✔️ Sense reemetre JWT

<br />

# 9️⃣ Errors habituals (molt importants)

❌ Afegir permisos temporals al JWT
❌ Fer-los al front-end
❌ Modelar-los com roles
❌ No posar scope
❌ No posar expiració
❌ No auditar-los

<br />

# 10️⃣ Resum mental

* **Roles** → estructura
* **Permisos base** → capacitat estable
* **Permisos temporals** → excepcions controlades
* **Policies** → decisió final
* **Backend** → enforcement real
* **Front-end** → UX, no seguretat

<br />

## On seguim (opcional, molt potent)

1️⃣ **Break-glass (accés d’emergència)**
2️⃣ **Delegació (actuar en nom d’un altre)**
3️⃣ **Auditoria legal (qui ha vist què)**
4️⃣ **Consentiments del pacient**

Digues quin vols i **seguim amb el mateix nivell de detall**.

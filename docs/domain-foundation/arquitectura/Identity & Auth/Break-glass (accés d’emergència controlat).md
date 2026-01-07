Perfecte. Continuem **pas a pas**, sense salts conceptuals.
👉 **PAS 11 — Break-glass (accés d’emergència)**
És el següent pas natural després dels **permisos temporals**.

<br />

# PAS 11 — Break-glass (accés d’emergència controlat)

## 11️⃣1️⃣ Què és (i per què és diferent)

**Break-glass** = permetre accés **extraordinari** quan:

* no hi ha relació assistencial
* no hi ha derivació
* no hi ha permís previ

⚠️ Però:

* queda **registrat**
* és **temporal**
* té **justificació obligatòria**
* és **auditable legalment**

👉 No és un permís temporal normal.
👉 És una **excepció governada**.

<br />

## 11️⃣2️⃣ Casos d’ús reals

* Urgències mèdiques
* Pacient inconscient
* Professional de guàrdia
* Error administratiu crític

<br />

## 11️⃣3️⃣ Model DDD — EmergencyAccess (Identity BC)

📁 `modules/identity/domain/aggregates/EmergencyAccess.ts`

```ts
export class EmergencyAccess {
  constructor(
    public readonly id: string,
    public readonly actorId: string,
    public readonly scope: AccessScope,
    public readonly reason: string,
    public readonly activatedAt: Date,
    public readonly expiresAt: Date
  ) {}

  isActive(now = new Date()): boolean {
    return now >= this.activatedAt && now <= this.expiresAt
  }
}
```

🔑 Diferències respecte `TemporaryAccess`:

* no té `grantedBy`
* no té `permissions` → es defineixen per **policy**
* sempre és **curt** (ex: 1–24h)
* justificació obligatòria

<br />

## 11️⃣4️⃣ Persistència (Prisma)

📁 `prisma/schema.prisma`

```prisma
model EmergencyAccess {
  id          String   @id
  actorId     String
  scopeType   String
  scopeRefId  String
  reason      String
  activatedAt DateTime
  expiresAt   DateTime

  createdAt   DateTime @default(now())

  @@index([actorId])
  @@index([scopeType, scopeRefId])
}
```

<br />

## 11️⃣5️⃣ Activació del break-glass (Application)

📁 `modules/identity/application/commands/ActivateEmergencyAccessHandler.ts`

```ts
export class ActivateEmergencyAccessHandler {
  constructor(
    private readonly repo: EmergencyAccessRepository
  ) {}

  async execute(cmd: {
    actorId: string
    patientId: string
    reason: string
  }) {
    const access = new EmergencyAccess(
      uuid(),
      cmd.actorId,
      new AccessScope('PATIENT', cmd.patientId),
      cmd.reason,
      new Date(),
      addHours(new Date(), 8)
    )

    await this.repo.save(access)
  }
}
```

👉 Aquí **NO** s’atorguen permisos explícits
👉 Només s’activa el **mode d’emergència**

<br />

## 11️⃣6️⃣ Resolució d’autorització (AuthorizationService)

Ampliem el que ja teníem.

📁 `modules/identity/application/services/AuthorizationService.ts`

```ts
async hasPermission(input: {
  userId: string
  permission: string
  scope?: AccessScope
  basePermissions: string[]
}): Promise<boolean> {

  // 1️⃣ permís base
  if (input.basePermissions.includes(input.permission)) {
    return true
  }

  // 2️⃣ permisos temporals
  if (input.scope) {
    const temps =
      await this.tempRepo.findActiveForUser(input.userId)

    if (temps.some(t =>
      t.allows(input.permission, input.scope!)
    )) return true
  }

  // 3️⃣ break-glass
  if (input.scope) {
    const emergency =
      await this.emergencyRepo.findActive(
        input.userId,
        input.scope
      )

    if (emergency) {
      return this.emergencyAllows(input.permission)
    }
  }

  return false
}

private emergencyAllows(permission: string): boolean {
  return [
    'patient.read',
    'clinicalRecord.read'
  ].includes(permission)
}
```

🔑 **Llista blanca estricta**
❌ Mai `write`, `delete`, etc.

<br />

## 11️⃣7️⃣ Ús en una policy real

📁 `modules/patient/application/policies/CanViewPatientPolicy.ts`

```ts
await this.authz.hasPermission({
  userId: actorId,
  permission: 'patient.read',
  basePermissions,
  scope: new AccessScope('PATIENT', patientId)
})
```

👉 La policy **no sap** si:

* és relació normal
* és derivació
* és emergència

👉 Només pregunta: *està permès?*

<br />

## 11️⃣8️⃣ Front-end — flux UX correcte

### Pas 1 — Usuari intenta accedir i rep 403

```json
{
  "error": "FORBIDDEN",
  "canBreakGlass": true
}
```

<br />

### Pas 2 — Modal d’emergència

```html
<ion-modal>
  <h2>Accés d’emergència</h2>
  <ion-textarea
    placeholder="Motiu clínic obligatori">
  </ion-textarea>
  <ion-button color="danger">
    Activar accés d’emergència
  </ion-button>
</ion-modal>
```

<br />

### Pas 3 — Crida API

```http
POST /emergency-access
{
  "patientId": "patient-123",
  "reason": "Urgències vitals"
}
```

👉 No hi ha permisos al front
👉 Només **workflow**

<br />

## 11️⃣9️⃣ Auditoria (OBLIGATÒRIA)

Cada accés sota break-glass ha de generar:

📁 `modules/audit/domain/events/EmergencyAccessUsed.ts`

```ts
{
  actorId,
  patientId,
  action: 'patient.read',
  timestamp,
  reason
}
```

👉 Legalment crític
👉 Compliment RGPD / sanitat

<br />

## 🔟 Errors habituals (molt greus)

❌ Break-glass sense expiració
❌ Sense motiu obligatori
❌ Permetre `write`
❌ Posar-ho al JWT
❌ No auditar
❌ Fer-ho transparent a l’usuari

<br />

## ✅ Resum del PAS 11

* ✔️ Excepció controlada
* ✔️ Model explícit
* ✔️ White-list de permisos
* ✔️ Auditoria completa
* ✔️ Front només gestiona el flux

<br />

## PAS 12 (següent, si vols continuar pas a pas)

👉 **Delegació**

> actuar en nom d’un altre professional (substitucions, equips)

Quan diguis **“seguim”**, entrem al **PAS 12**.

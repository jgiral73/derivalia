Perfecte.
👉 **PAS 12 — Delegació (actuar en nom d’un altre)**
Seguim **pas a pas**, coherent amb permisos temporals i break-glass.

<br />

# PAS 12 — Delegació controlada (Delegation / Acting on behalf)

## 12️⃣1️⃣ Què és delegació (i què no)

**Delegació** = un usuari A pot **actuar en nom de** B durant un temps i un context.

### ✅ Exemples reals

* Substitució per vacances
* Infermer/a actuant en nom d’un metge
* Equip clínic compartit
* Professional extern temporal

### ❌ No és

* Donar el password
* Copiar permisos
* Canviar el JWT base
* Break-glass

👉 **Delegació = identitat doble (actor ≠ subjecte)**

<br />

## 12️⃣2️⃣ Model mental (clau)

Sempre hi ha:

* **Actor** → qui fa l’acció (log, auditoria)
* **Subjecte** → en nom de qui s’actua
* **Scope** → on (pacient / tractament / org)
* **Temps** → inici / fi

```txt
[ Actor ] ── actsAs ──> [ Subject ]
        (scope + time)
```

<br />

## 12️⃣3️⃣ Model DDD — Delegation aggregate

📁 `modules/identity/domain/aggregates/Delegation.ts`

```ts
export class Delegation {
  constructor(
    public readonly id: string,
    public readonly actorId: string,
    public readonly subjectId: string,
    public readonly scope: AccessScope,
    public readonly validFrom: Date,
    public readonly validUntil: Date,
    public readonly grantedById: string
  ) {}

  isActive(now = new Date()): boolean {
    return now >= this.validFrom && now <= this.validUntil
  }

  allows(scope: AccessScope): boolean {
    return this.scope.matches(scope)
  }
}
```

🔑 **No conté permisos**
👉 Els permisos són **els del subjecte**

<br />

## 12️⃣4️⃣ Persistència (Prisma)

📁 `prisma/schema.prisma`

```prisma
model Delegation {
  id            String   @id
  actorId       String
  subjectId     String
  scopeType     String
  scopeRefId    String
  validFrom     DateTime
  validUntil    DateTime
  grantedById   String

  createdAt     DateTime @default(now())

  @@index([actorId])
  @@index([subjectId])
}
```

<br />

## 12️⃣5️⃣ Resolució d’identitat efectiva

### Idea clau

> **L’actor pot “heretar” permisos del subjecte, però només dins l’scope**

<br />

### AuthorizationService (ampliació)

📁 `modules/identity/application/services/AuthorizationService.ts`

```ts
async hasPermission(input: {
  actorId: string
  permission: string
  scope?: AccessScope
  basePermissions: string[]
}): Promise<boolean> {

  // 1️⃣ permís propi
  if (input.basePermissions.includes(input.permission)) {
    return true
  }

  // 2️⃣ delegació
  if (input.scope) {
    const delegations =
      await this.delegationRepo.findActiveForActor(
        input.actorId
      )

    for (const d of delegations) {
      if (!d.allows(input.scope)) continue

      const subjectPerms =
        await this.userPermissionRepo
          .getPermissionsForUser(d.subjectId)

      if (subjectPerms.includes(input.permission)) {
        return true
      }
    }
  }

  // 3️⃣ temporals + break-glass (ja existents)
  // ...

  return false
}
```

👉 **Permisos resolts dinàmicament**
👉 No es copien
👉 No s’injecten al JWT

<br />

## 12️⃣6️⃣ Context de request (important)

A cada request tenim:

```ts
RequestContext {
  actorId: string        // JWT sub
  subjectId?: string     // si delegació activa
  permissions: string[]  // base actor
}
```

👉 `subjectId` només existeix si l’usuari **tria actuar com**

<br />

## 12️⃣7️⃣ Front-end — canvi de “mode”

### UX correcte

```txt
[ Tu estàs actuant com: Dr. Marta ]
[ Tornar al meu perfil ]
```

<br />

### Activar delegació (API)

```http
POST /delegations/:id/activate
```

Backend valida:

* delegació activa
* dins del temps
* scope correcte

I retorna:

```json
{
  "actingAs": {
    "subjectId": "user-456",
    "displayName": "Dr. Marta"
  }
}
```

<br />

### Front-end AuthState

📁 `auth.state.ts`

```ts
export interface ActingAs {
  subjectId: string
  displayName: string
}

@Injectable()
export class AuthState {
  actingAs?: ActingAs

  isActingAs(): boolean {
    return !!this.actingAs
  }
}
```

👉 El front **NO canvia permisos**, només context.

<br />

## 12️⃣8️⃣ Auditoria (obligatòria)

Cada acció ha de registrar:

```ts
{
  actorId: 'user-123',
  subjectId: 'user-456',
  action: 'appointment.create',
  scope: 'PATIENT:patient-1',
  timestamp
}
```

🔴 **Legalment imprescindible**

<br />

## 12️⃣9️⃣ Policy real amb delegació (exemple)

📁 `modules/scheduling/application/policies/CanCreateAppointmentPolicy.ts`

```ts
await this.authz.hasPermission({
  actorId: ctx.actorId,
  permission: 'appointment.create',
  basePermissions: ctx.permissions,
  scope: new AccessScope('PATIENT', patientId)
})
```

👉 La policy **no sap** si:

* és delegació
* és permís temporal
* és base
* és emergència

👉 Només confia en l’AuthorizationService

<br />

## 🔟 Errors habituals (greus)

❌ Copiar permisos del subjecte al JWT
❌ No mostrar clarament “acting as”
❌ No auditar actor + subjecte
❌ Delegacions sense expiració
❌ Delegació sense scope

<br />

## ✅ Resum del PAS 12

* ✔️ Delegació ≠ permisos temporals
* ✔️ Actor ≠ subjecte
* ✔️ Scope obligatori
* ✔️ Permisos heretats, no copiats
* ✔️ Auditoria completa
* ✔️ UX explícit

<br />

## PAS 13 (següent, recomanat)

👉 **Auditoria clínica completa**

* qui ha vist què
* sota quin context
* base legal (normal / delegació / emergència)

Quan diguis **“seguim”**, entrem al **PAS 13**.


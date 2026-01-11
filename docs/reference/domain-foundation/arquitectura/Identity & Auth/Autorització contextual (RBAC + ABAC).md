Perfecte — **“seguim”** aquí té tot el sentit de **fer el següent pas natural**:
👉 **autorització contextual (RBAC + ABAC)** i **com es reflecteix al front-end** sense duplicar lògica ni trencar DDD.

Anem **pas a pas i amb codi**.

<br />

# PAS SEGÜENT — Autorització contextual (RBAC + ABAC)

Fins ara teníem:

* ✔️ permisos plans (`appointment.create`)
* ✔️ enforcement al backend
* ✔️ UX al front-end

Ara afegim **context**, que és imprescindible en salut.

<br />

## 1️⃣ Problema real (exemples)

Un mateix usuari pot:

* crear cites **només** si és el professional assignat
* veure un pacient **només** si hi ha relació assistencial
* acceptar una derivació **només** si n’és el destinatari
* tenir permisos diferents segons **organització**

👉 Això **NO** es resol només amb permisos plans.

<br />

## 2️⃣ Model mental correcte

| Capa             | Què decideix                          |
| ---------------- | ------------------------------------- |
| Permission       | *Pot fer aquesta acció en abstracte?* |
| Context / Policy | *Pot fer-la en aquest cas concret?*   |
| Front-end        | *Mostro el botó o no?*                |

<br />

## 3️⃣ Backend — Permissions + Policies (DDD pur)

### Exemple: Cancel·lar una cita

Condicions:

* té `appointment.cancel`
* **és el professional** o **l’ha creada**
* la cita **no està tancada**

<br />

### 3.1️⃣ Policy de domini (Application layer)

📁 `modules/scheduling/application/policies/CanCancelAppointmentPolicy.ts`

```ts
export class CanCancelAppointmentPolicy {
  async check(input: {
    appointment: Appointment
    actorId: string
    permissions: string[]
  }) {
    if (!input.permissions.includes('appointment.cancel')) {
      throw new Error('Missing permission')
    }

    if (!input.appointment.isCancelable()) {
      throw new Error('Appointment not cancelable')
    }

    if (
      input.appointment.professionalId !== input.actorId &&
      input.appointment.createdBy !== input.actorId
    ) {
      throw new Error('Not allowed to cancel this appointment')
    }
  }
}
```

👉 **Cap HTTP, cap JWT, cap Prisma**

<br />

### 3.2️⃣ Ús a l’handler

📁 `modules/scheduling/application/commands/CancelAppointmentHandler.ts`

```ts
await this.canCancelPolicy.check({
  appointment,
  actorId: ctx.userId,
  permissions: ctx.permissions
})

appointment.cancel()
await this.repo.save(appointment)
```

✔️ permisos + context
✔️ fàcil de testejar
✔️ extensible

<br />

## 4️⃣ JWT: què hi posem (important)

No hi posis tot. Només:

```json
{
  "sub": "user-1",
  "org": "org-1",
  "permissions": [
    "appointment.cancel",
    "appointment.read"
  ]
}
```

👉 El **context** (professionalId, ownership, estat) ve del domini, no del token.

<br />

## 5️⃣ Front-end — UX basada en permisos + context

### Principi clau

> El front-end **NO replica la policy**, només evita accions absurdes.

<br />

## 5.1️⃣ Helper contextual (Angular / Ionic)

📁 `src/app/auth/authorization.helper.ts`

```ts
export function canCancelAppointment(
  appointment: AppointmentVM,
  auth: AuthState
): boolean {
  if (!auth.has('appointment.cancel')) return false
  if (appointment.status !== 'SCHEDULED') return false

  return (
    appointment.professionalId === auth.userId ||
    appointment.createdBy === auth.userId
  )
}
```

👉 És **UX-only**, no seguretat.

<br />

### Ús al component

```html
<button
  *ngIf="canCancel"
  (click)="cancel()">
  Cancel·la cita
</button>
```

```ts
this.canCancel = canCancelAppointment(this.appointment, this.auth)
```

<br />

## 6️⃣ Rutes condicionals per context

Exemple: **acceptar derivació**

```ts
{
  path: 'referrals/:id/accept',
  component: AcceptReferralPage,
  canActivate: [PermissionGuard],
  data: { permission: 'referral.accept' }
}
```

👉 La **policy real** s’executa al backend.

<br />

## 7️⃣ Components “intencionals” (best practice)

No:

```html
<button *ngIf="auth.has('x') && a && b && c">
```

Sí:

```html
<app-cancel-appointment
  [appointment]="appointment">
</app-cancel-appointment>
```

I el component decideix **una sola cosa**.

<br />

## 8️⃣ Cas especial: permisos per organització

### Backend

* permisos **resolts per org**
* JWT inclou `org`

### Front-end

* AuthState associat a org activa
* canvi d’org = refresh token / session

👉 **Mateix usuari, diferents permisos**

<br />

## 9️⃣ Resum curt (important)

* ✔️ Permisos → *què*
* ✔️ Policies → *quan / en quin context*
* ✔️ Backend → enforcement real
* ✔️ Front-end → UX coherent
* ❌ Mai confiar en el front

<br />

## On podem seguir ara (recomanat)

1️⃣ **Permisos temporals** (derivacions, substitucions)
2️⃣ **Scopes per pacient / tractament**
3️⃣ **Auditoria d’accions sensibles**
4️⃣ **Feature flags per rol**

Digues quin d’aquests vols atacar i **seguim**.


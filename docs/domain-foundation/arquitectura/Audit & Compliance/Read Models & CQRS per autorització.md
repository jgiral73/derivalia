Perfecte.
👉 **PAS 15 — Read Models & CQRS per autorització (performance + UX)**
Seguim **pas a pas** i tanquem el cercle amb tot el que hem construït.

<br />

# PAS 15 — CQRS aplicat a autorització i permisos

## Problema real que resolem

Sense read models:

* policies fan moltes consultes
* AuthorizationService creix massa
* el front no sap què pot fer fins que falla
* N+1 queries (consents + delegacions + temporals…)

👉 **CQRS no és només per dades, també per autorització**

<br />

## 15️⃣1️⃣ Principi clau

> **L’autorització es decideix al backend,
> però s’exposa al front com a capacitats (`capabilities`)**

No exposem regles.
Exposem **resultats**.

<br />

## 15️⃣2️⃣ Què és un Authorization Read Model

És una vista **precalculada** que respon preguntes com:

* Pot veure aquest pacient?
* Pot crear cita?
* Pot editar aquest tractament?
* Està actuant com?
* Sota quin mode?

<br />

## 15️⃣3️⃣ On viu això (arquitectura)

👉 **BC Identity / Authorization**

📁 `modules/identity/read-models`

```txt
read-models/
├── PatientAccessRM.ts
├── AppointmentAccessRM.ts
├── TreatmentAccessRM.ts
```

👉 Són **queries**, no domini.

<br />

## 15️⃣4️⃣ Exemple — PatientAccess Read Model

📁 `modules/identity/read-models/PatientAccessRM.ts`

```ts
export interface PatientAccessRM {
  patientId: string

  canView: boolean
  canEdit: boolean
  canViewClinicalRecord: boolean

  mode: 'NORMAL' | 'DELEGATION' | 'EMERGENCY'
}
```

👉 Això és **exactament** el que el front necessita.

<br />

## 15️⃣5️⃣ Query Handler (CQRS)

📁
`modules/identity/application/queries/GetPatientAccess/GetPatientAccessHandler.ts`

```ts
export class GetPatientAccessHandler {
  constructor(
    private readonly authz: AuthorizationService
  ) {}

  async execute(query: {
    actorId: string
    patientId: string
    basePermissions: string[]
    mode: 'NORMAL' | 'DELEGATION' | 'EMERGENCY'
  }): Promise<PatientAccessRM> {

    const scope = new AccessScope('PATIENT', query.patientId)

    return {
      patientId: query.patientId,

      canView: await this.authz.canAccess({
        actorId: query.actorId,
        permission: 'patient.read',
        basePermissions: query.basePermissions,
        scope,
        patientId: query.patientId,
        purpose: new ConsentPurpose('CARE')
      }),

      canEdit: await this.authz.canAccess({
        actorId: query.actorId,
        permission: 'patient.write',
        basePermissions: query.basePermissions,
        scope,
        patientId: query.patientId,
        purpose: new ConsentPurpose('CARE')
      }),

      canViewClinicalRecord: await this.authz.canAccess({
        actorId: query.actorId,
        permission: 'clinicalRecord.read',
        basePermissions: query.basePermissions,
        scope,
        patientId: query.patientId,
        purpose: new ConsentPurpose('CARE')
      }),

      mode: query.mode
    }
  }
}
```

👉 Sí, aquí hi ha lògica
👉 Però és **application/query logic**, no domini

<br />

## 15️⃣6️⃣ Endpoint API (clean)

📁 `modules/patient/api/PatientAccessController.ts`

```ts
@Get(':id/access')
getAccess(
  @Param('id') patientId: string,
  @Req() req
) {
  return this.queryBus.execute(
    new GetPatientAccessQuery({
      actorId: req.user.id,
      patientId,
      basePermissions: req.user.permissions,
      mode: req.context.mode
    })
  )
}
```

<br />

## 15️⃣7️⃣ Resposta al front-end

```json
{
  "patientId": "patient-1",
  "canView": true,
  "canEdit": false,
  "canViewClinicalRecord": true,
  "mode": "DELEGATION"
}
```

👉 Cap regla
👉 Cap permís exposat
👉 Només **capacitats**

<br />

## 15️⃣8️⃣ Front-end — ús correcte (Angular / Ionic)

### AuthzState (per recurs)

📁 `src/app/authz/patient-access.store.ts`

```ts
@Injectable({ providedIn: 'root' })
export class PatientAccessStore {
  private access$ = new BehaviorSubject<PatientAccessRM | null>(null)

  set(access: PatientAccessRM) {
    this.access$.next(access)
  }

  canView(): boolean {
    return !!this.access$.value?.canView
  }

  canEdit(): boolean {
    return !!this.access$.value?.canEdit
  }
}
```

<br />

### Component

```html
<app-patient-header
  *ngIf="access.canView()">
</app-patient-header>

<app-edit-patient
  *ngIf="access.canEdit()">
</app-edit-patient>
```

👉 UX clara
👉 Zero duplicació de lògica
👉 Backend mana

<br />

## 15️⃣9️⃣ Performance (clau)

### Optimitzacions possibles

* Cache per request
* Cache curt (30–60s)
* Preload al carregar pàgina
* Invalidació per events:

  * consent changed
  * delegation activated
  * break-glass expired

<br />

## 🔟 Errors habituals

❌ Fer policies al front
❌ Tornar permisos crus
❌ Calcular autorització a cada botó
❌ N+1 queries
❌ No cachejar

<br />

## ✅ Resum del PAS 15

* ✔️ CQRS per autorització
* ✔️ Read models orientats a UX
* ✔️ Backend decideix, front mostra
* ✔️ Performance controlada
* ✔️ Escalable i net

<br />

## 🎯 Amb això tens un sistema complet

Has construït:

* RBAC + ABAC
* permisos temporals
* break-glass
* delegació
* consentiments
* auditoria legal
* CQRS per autorització
* front-end net i segur

<br />

## On vols seguir ara?

Opcions naturals:
1️⃣ **Clinical Records BC**
2️⃣ **Scheduling avançat (overbooking, rules)**
3️⃣ **Notifications & async workflows**
4️⃣ **Multi-tenant hard isolation**

Digues cap on anem i **seguim**.

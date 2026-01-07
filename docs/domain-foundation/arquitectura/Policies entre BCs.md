Entrem al **PAS — Policies i invariants creuats**, que és on el teu model deixa de ser “bonic” i passa a ser **robust en producció**.

Això és **DDD avançat**: les regles **no viuen dins els agregats**, sinó **entre BCs**.

<br />

<br />

# PAS 8 — Policies (Cross-BC rules)

## Què farem en aquest pas

- [1️⃣ Què és una **Policy** (i què NO és)](#1️⃣-què-és-una-policy)
- [2️⃣ On viuen les policies](#2️⃣-on-viuen-les-policies)
- [3️⃣ Policy 1: Creació de cita (Scheduling)](#3️⃣-policy-1-es-pot-crear-una-cita)
- [4️⃣ Policy 2: Assignació automàtica de tractament](#4️⃣-policy-2-assignar-tractament-automàticament)
- [5️⃣ Scheduling Command Handler (amb policies)](#5️⃣-scheduling-command-handler-amb-policies)
- [6️⃣ Policy 3 — Es pot derivar un pacient?](#6️⃣-policy-3-es-pot-derivar-un-pacient?)
- [7️⃣ Com es connecten els BCs (sense dependències)](#7️⃣-com-es-connecten-els-bcs-sense-dependències)
- [8️⃣ Errors habitualíssims (evita’ls)](#8️⃣-errors-habitualíssims-evitals)
- [9️⃣ Quan crear una Policy nova?](#9️⃣-quan-crear-una-policy-nova)
- [✅ Conclusions](#✅-conclusions)

<br />

## [1️⃣ Què és una Policy](#)

👉 Una **Policy** és:

* una regla de negoci
* que **consulta diversos BCs**
* però **no modifica agregats directament**

### ❌ No és

* ni un Service de domini
* ni un Command Handler
* ni un Repository

### ✅ És

* Application-layer logic
* Orquestració
* Decisió

<br />

## [2️⃣ On viuen les policies](#)

📁 Recomanat: dins el BC que **inicia l’acció**

Exemple: crear cita → Scheduling

```txt
modules/scheduling/
├── application/
│   ├── policies/
│   │   ├── CanScheduleAppointmentPolicy.ts
│   │   └── AutoAssignTreatmentPolicy.ts
```

👉 Scheduling **pregunta**, no decideix sol.

<br />

## [3️⃣ Policy 1 — Es pot crear una cita?](#)

### Regles reals

* professional obligatori
* si hi ha pacient:

  * pacient existeix
  * relació vàlida (CareRelation o Treatment)
* si hi ha org:

  * el professional hi pertany

<br />

### `CanScheduleAppointmentPolicy`

📁 `modules/scheduling/application/policies/CanScheduleAppointmentPolicy.ts`

```ts
export class CanScheduleAppointmentPolicy {
  constructor(
    private readonly patientAcl: PatientAcl,
    private readonly treatmentAcl: TreatmentAcl
  ) {}

  async check(input: {
    professionalId: string
    patientId?: string
  }): Promise<void> {
    if (!input.patientId) return

    const patientExists =
      await this.patientAcl.exists(input.patientId)

    if (!patientExists) {
      throw new Error('Patient does not exist')
    }

    const hasRelation =
      await this.treatmentAcl.hasCareRelation(
        input.professionalId,
        input.patientId
      )

    if (!hasRelation) {
      throw new Error('No active care relation')
    }
  }
}
```

🔑 Important:

* usa **ACLs**
* no importa dominis aliens
* no crea res

<br />

## [4️⃣ Policy 2 — Assignar tractament automàticament](#)

### Regla

> Si existeix un tractament actiu → assignar-lo
> Si no → cita lliure

<br />

### `AutoAssignTreatmentPolicy`

📁 `modules/scheduling/application/policies/AutoAssignTreatmentPolicy.ts`

```ts
export class AutoAssignTreatmentPolicy {
  constructor(
    private readonly treatmentAcl: TreatmentAcl
  ) {}

  async resolve(
    professionalId: string,
    patientId?: string
  ): Promise<string | undefined> {
    if (!patientId) return undefined

    const treatment =
      await this.treatmentAcl.findActiveTreatment(
        professionalId,
        patientId
      )

    return treatment?.id
  }
}
```

👉 Aquesta policy **no crea tractaments**
👉 Només decideix

<br />

## [5️⃣ Scheduling Command Handler (amb policies)](#)

📁
`modules/scheduling/application/commands/ScheduleAppointment/ScheduleAppointmentHandler.ts`

```ts
export class ScheduleAppointmentHandler {
  constructor(
    private readonly appointmentRepo: AppointmentRepository,
    private readonly canSchedulePolicy: CanScheduleAppointmentPolicy,
    private readonly assignTreatmentPolicy: AutoAssignTreatmentPolicy
  ) {}

  async execute(cmd: ScheduleAppointmentCommand) {
    await this.canSchedulePolicy.check({
      professionalId: cmd.professionalId,
      patientId: cmd.patientId
    })

    const treatmentId =
      await this.assignTreatmentPolicy.resolve(
        cmd.professionalId,
        cmd.patientId
      )

    const appointment = Appointment.create(
      AppointmentId.generate(),
      cmd.professionalId,
      cmd.startAt,
      cmd.endAt,
      cmd.patientId,
      cmd.organizationId,
      treatmentId
    )

    await this.appointmentRepo.save(appointment)
  }
}
```

💡 Observa:

* l’agregat no coneix res extern
* la policy decideix abans
* handler només coordina

<br />

## [6️⃣ Policy 3 — Es pot derivar un pacient?](#)

Això toca **Referral + Treatment + Membership**

### Regles típiques

* només si hi ha tractament actiu
* només el professional responsable
* no cap a un mateix professional

<br />

### `CanCreateReferralPolicy`

📁 `modules/referral/application/policies/CanCreateReferralPolicy.ts`

```ts
export class CanCreateReferralPolicy {
  constructor(
    private readonly treatmentAcl: TreatmentAcl
  ) {}

  async check(input: {
    patientId: string
    fromProfessionalId: string
    toProfessionalId: string
  }) {
    if (input.fromProfessionalId === input.toProfessionalId) {
      throw new Error('Cannot refer to same professional')
    }

    const activeTreatment =
      await this.treatmentAcl.findActiveTreatment(
        input.fromProfessionalId,
        input.patientId
      )

    if (!activeTreatment) {
      throw new Error('No active treatment to refer')
    }
  }
}
```

<br />

## [7️⃣ Com es connecten els BCs (sense dependències)](#)

Mitjançant **ACLs**:

```txt
Scheduling
  └── TreatmentAcl (interface)
          └── Http / DB / Event implementation
```

📁 Exemple:

```txt
modules/scheduling/infrastructure/acl/
├── TreatmentAcl.ts
└── PrismaTreatmentAcl.ts
```

### `TreatmentAcl.ts`

```ts
export interface TreatmentAcl {
  findActiveTreatment(
    professionalId: string,
    patientId: string
  ): Promise<{ id: string } | null>

  hasCareRelation(
    professionalId: string,
    patientId: string
  ): Promise<boolean>
}
```

👉 **Scheduling no importa Treatment**

<br />

## [8️⃣ Errors habitualíssims (evita’ls)](#)

❌ Posar policies dins agregats
❌ Fer queries cross-BC dins repositoris
❌ Injectar repositoris aliens
❌ FK fortes per validar regles
❌ Lògica al controller

<br />

## [9️⃣ Quan crear una Policy nova?](#)

Crea una policy si:

* intervé més d’un BC
* la regla pot canviar
* la regla no és invariant local
* hi ha decisió, no només validació

<br />

## [✅ Conclusions](#)

-✔️ Policies = cervell del sistema
-✔️ Agregats simples i purs
-✔️ BCs col·laboren sense dependre
-✔️ Canvis futurs barats
-✔️ Model “enterprise-grade”

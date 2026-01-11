Perfecte. Continuem **PAS 5**, que és on el model **fa el salt de “relació mínima” a “procés clínic”**.

Anirem en aquest ordre (controlat):

1️⃣ Diferència **CareRelation vs Treatment**
2️⃣ Responsabilitat del **Treatment BC**
3️⃣ Estructura de carpetes
4️⃣ Agregat `Treatment`
5️⃣ Creació, tancament i invariants
6️⃣ Encaix amb Scheduling
7️⃣ Derivacions (com evolució natural)

<br />

# PAS 5 — Treatment BC (nucli clínic temporal)

<br />

## 5️⃣1️⃣ CareRelation vs Treatment (decisió clau)

### CareRelation

* Relació **mínima**
* Pot existir sense pla clínic
* Serveix per:

  * agenda
  * historial
  * derivacions
  * autorització implícita

### Treatment

* Relació **clínica activa**
* Té intencionalitat terapèutica
* Té inici / fi
* Té estat clínic

👉 **No totes les relacions tenen tractament**
👉 **Tot tractament pressuposa una CareRelation**

<br />

## 5️⃣2️⃣ Responsabilitat del Treatment BC

### ✅ El que SÍ fa

* Representa un procés clínic
* Controla el cicle de vida
* Activa / tanca tractaments
* Enllaça pacient ↔ professional ↔ (org)

### ❌ El que NO fa

* No crea pacients
* No gestiona agenda
* No decideix permisos
* No conté informes (vindran després)

<br />

## 5️⃣3️⃣ Estructura del BC

📁 **backend/apps/api/modules/treatment**

```txt
modules/treatment/
├── domain/
│   ├── aggregates/
│   │   └── Treatment.ts
│   ├── value-objects/
│   │   ├── TreatmentId.ts
│   │   ├── TreatmentPeriod.ts
│   │   └── TreatmentStatus.ts
│   ├── repositories/
│   │   └── TreatmentRepository.ts
│   └── events/
│       ├── TreatmentStarted.ts
│       └── TreatmentClosed.ts
│
├── application/
│   ├── commands/
│   │   ├── StartTreatment/
│   │   └── CloseTreatment/
│   ├── queries/
│   │   └── GetActiveTreatmentForPatient/
│   └── dtos/
│       └── TreatmentDTO.ts
│
├── infrastructure/
│   ├── http/
│   │   └── TreatmentController.ts
│   ├── prisma/
│   │   └── PrismaTreatmentRepository.ts
│   └── mappers/
│       └── TreatmentMapper.ts
│
├── treatment.module.ts
└── index.ts
```

<br />

## 5️⃣4️⃣ Agregat `Treatment`

📁 `domain/aggregates/Treatment.ts`

```ts
import { TreatmentId } from '../value-objects/TreatmentId'
import { TreatmentPeriod } from '../value-objects/TreatmentPeriod'
import { TreatmentStatus } from '../value-objects/TreatmentStatus'

export class Treatment {
  private constructor(
    public readonly id: TreatmentId,
    public readonly patientId: string,
    public readonly professionalId: string,
    public readonly organizationId?: string,
    private period?: TreatmentPeriod,
    private status: TreatmentStatus = TreatmentStatus.ACTIVE
  ) {}

  static start(
    id: TreatmentId,
    patientId: string,
    professionalId: string,
    organizationId?: string
  ): Treatment {
    return new Treatment(
      id,
      patientId,
      professionalId,
      organizationId,
      TreatmentPeriod.startNow(),
      TreatmentStatus.ACTIVE
    )
  }

  close(reason?: string) {
    if (this.status === TreatmentStatus.CLOSED) {
      throw new Error('Treatment already closed')
    }

    this.period = this.period!.closeNow()
    this.status = TreatmentStatus.CLOSED
  }

  isActive(): boolean {
    return this.status === TreatmentStatus.ACTIVE
  }
}
```

🔑 Invariants:

* Un tractament **actiu** té període obert
* No es pot reobrir
* No pot existir sense pacient ni professional

<br />

## 5️⃣5️⃣ Value Objects

### `domain/value-objects/TreatmentPeriod.ts`

```ts
export class TreatmentPeriod {
  private constructor(
    public readonly startAt: Date,
    public readonly endAt?: Date
  ) {}

  static startNow(): TreatmentPeriod {
    return new TreatmentPeriod(new Date())
  }

  closeNow(): TreatmentPeriod {
    if (this.endAt) {
      throw new Error('Already closed')
    }
    return new TreatmentPeriod(this.startAt, new Date())
  }

  isActive(): boolean {
    return !this.endAt
  }
}
```

<br />

### `domain/value-objects/TreatmentStatus.ts`

```ts
export enum TreatmentStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED'
}
```

<br />

## 5️⃣6️⃣ Repositori

📁 `domain/repositories/TreatmentRepository.ts`

```ts
import { Treatment } from '../aggregates/Treatment'
import { TreatmentId } from '../value-objects/TreatmentId'

export interface TreatmentRepository {
  save(treatment: Treatment): Promise<void>
  findById(id: TreatmentId): Promise<Treatment | null>
  findActiveForPatient(
    patientId: string,
    professionalId: string
  ): Promise<Treatment | null>
}
```

👉 **Regla clau**:

> Un professional **no pot tenir dos tractaments actius** amb el mateix pacient

<br />

## 5️⃣7️⃣ Command: Start Treatment

📁 `application/commands/StartTreatment/StartTreatmentCommand.ts`

```ts
export class StartTreatmentCommand {
  constructor(
    public readonly patientId: string,
    public readonly professionalId: string,
    public readonly organizationId?: string
  ) {}
}
```

<br />

📁 `application/commands/StartTreatment/StartTreatmentHandler.ts`

```ts
export class StartTreatmentHandler {
  constructor(
    private readonly repository: TreatmentRepository
  ) {}

  async execute(cmd: StartTreatmentCommand): Promise<string> {
    const existing =
      await this.repository.findActiveForPatient(
        cmd.patientId,
        cmd.professionalId
      )

    if (existing) {
      throw new Error('Active treatment already exists')
    }

    const treatment = Treatment.start(
      TreatmentId.generate(),
      cmd.patientId,
      cmd.professionalId,
      cmd.organizationId
    )

    await this.repository.save(treatment)

    return treatment.id.value
  }
}
```

<br />

## 5️⃣8️⃣ Encaix amb Scheduling (punt crític)

### Scheduling **NO requereix** tractament

Però pot:

* associar una cita a un `treatmentId`
* crear cites **fora** de tractament

```txt
Appointment
- patientId?
- professionalId
- treatmentId?   ← opcional
```

### Política recomanada

* Si hi ha tractament actiu → auto-assignar
* Si no → cita “ad-hoc”

👉 **Això és política d’aplicació, no domini**

<br />

## 5️⃣9️⃣ TreatmentController (exposició)

📁 `infrastructure/http/TreatmentController.ts`

```ts
@Controller('treatments')
@UseGuards(JwtAuthGuard, MembershipGuard)
export class TreatmentController {
  constructor(
    private readonly startHandler: StartTreatmentHandler
  ) {}

  @Post()
  async start(
    @Body() body: { patientId: string },
    @Req() req: any
  ) {
    const ctx = req.context

    const id = await this.startHandler.execute(
      new StartTreatmentCommand(
        body.patientId,
        ctx.professionalId,
        ctx.organizationId
      )
    )

    return { id }
  }
}
```

<br />

## 🔟 Derivacions (ara ja clar)

Derivar =

1. Tancar Treatment A
2. Crear Treatment B amb un altre professional
3. Registrar **ReferralEvent**

```txt
TreatmentClosed
→ ReferralCreated
→ TreatmentStarted (nou professional)
```

👉 Això ho implementarem com:

* Event de domini
* Reaction en Application layer
* Possible Referral BC

<br />

## ✅ Conclusions

- ✔️ Treatment és **temporal i clínic**
- ✔️ No contamina Patient
- ✔️ Scheduling continua lliure
- ✔️ Derivacions naturals
- ✔️ Model extensible (informes, actes)

<br />


## ➡️ PAS 6 (següent, molt important)

Ara que tenim:

* Patient
* CareRelation (conceptual)
* Treatment
* Scheduling

El següent pas lògic és:

> **Derivacions (Referral BC) + Events entre BCs**

Aquí veurem:

* Domain Events reals
* Comunicació entre BCs
* Eventual consistency

Quan diguis, **seguim amb PAS 6**.



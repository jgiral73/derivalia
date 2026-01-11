Perfecte. **Seguim amb el següent BC estructural del core: `Treatment`**
Aquest és un domini clau perquè **ordena la relació professional–pacient en el temps**, però **sense fer-lo obligatori** (tal com vas demanar des del principi).

---

# PAS — Treatment BC (relació clínica activa)

## 🎯 Què és exactament un Treatment?

> Un **Treatment** representa la relació clínica **activa o històrica**
> entre **un professional** i **un pacient**, durant un **rang temporal**.

📌 Importantíssim:

* ❌ NO és una cita
* ❌ NO és un consentiment
* ❌ NO és obligatori per existir relació
* ✅ És el **contenidor natural** de:

  * objectius terapèutics
  * episodis
  * clínic-records (futur)
  * facturació mèdica (futur)

---

# 1️⃣ Decisions de disseny (clau)

### 1.1 Tractament és OPCIONAL

* Pots:

  * crear pacients
  * donar cites
  * tenir consentiment
    **sense** tractament

📌 Això és crític per:

* onboarding lleuger
* professionals que “proven”
* col·laboracions puntuals

---

### 1.2 Tractament ≠ Relació legal

* El **Consent** autoritza
* El **Treatment** organitza

---

# 2️⃣ Estructura del BC Treatment

📁 `backend/api/src/modules/treatment`

```text
treatment/
├── domain/
│   ├── entities/
│   │   └── Treatment.ts
│   ├── value-objects/
│   │   └── TreatmentStatus.ts
│   └── repositories/
│       └── TreatmentRepository.ts
│
├── application/
│   ├── commands/
│   │   └── StartTreatment/
│   │   └── EndTreatment/
│   └── queries/
│
├── infrastructure/
│   ├── http/
│   │   └── TreatmentController.ts
│   └── prisma/
│       └── PrismaTreatmentRepository.ts
│
├── treatment.module.ts
└── index.ts
```

---

# 3️⃣ Domini: Treatment (agregat arrel)

📄 `treatment/domain/entities/Treatment.ts`

```ts
import { TreatmentStatus } from '../value-objects/TreatmentStatus'

export class Treatment {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly professionalId: string,
    public status: TreatmentStatus,
    public readonly startedAt: Date,
    public endedAt: Date | null
  ) {}

  end() {
    if (this.status === TreatmentStatus.ENDED) return

    this.status = TreatmentStatus.ENDED
    this.endedAt = new Date()
  }
}
```

📌 Simple però potent:

* lifecycle clar
* estat explícit
* extensible sense trencar

---

# 4️⃣ Value Object: TreatmentStatus

📄 `treatment/domain/value-objects/TreatmentStatus.ts`

```ts
export enum TreatmentStatus {
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED'
}
```

---

# 5️⃣ Repository de domini

📄 `treatment/domain/repositories/TreatmentRepository.ts`

```ts
import { Treatment } from '../entities/Treatment'

export interface TreatmentRepository {
  save(treatment: Treatment): Promise<void>
  findActive(
    patientId: string,
    professionalId: string
  ): Promise<Treatment | null>
}
```

---

# 6️⃣ Application: StartTreatment

🚨 Regla de negoci:

> Només pot haver-hi **1 tractament actiu**
> per professional + pacient

---

## Command

📄 `treatment/application/commands/StartTreatment/StartTreatmentCommand.ts`

```ts
export class StartTreatmentCommand {
  constructor(
    public readonly patientId: string,
    public readonly professionalId: string
  ) {}
}
```

---

## Handler

📄 `treatment/application/commands/StartTreatment/StartTreatmentHandler.ts`

```ts
import { randomUUID } from 'crypto'
import { Treatment } from '../../../domain/entities/Treatment'
import { TreatmentStatus } from '../../../domain/value-objects/TreatmentStatus'
import { TreatmentRepository } from '../../../domain/repositories/TreatmentRepository'

export class StartTreatmentHandler {
  constructor(
    private readonly treatmentRepo: TreatmentRepository
  ) {}

  async execute(command: StartTreatmentCommand): Promise<void> {
    const active = await this.treatmentRepo.findActive(
      command.patientId,
      command.professionalId
    )

    if (active) return

    const treatment = new Treatment(
      randomUUID(),
      command.patientId,
      command.professionalId,
      TreatmentStatus.ACTIVE,
      new Date(),
      null
    )

    await this.treatmentRepo.save(treatment)
  }
}
```

📌 Idempotent
📌 Sense dependències externes
📌 No força consent (ja s’hauria validat abans)

---

# 7️⃣ Application: EndTreatment

📄 `treatment/application/commands/EndTreatment/EndTreatmentHandler.ts`

```ts
export class EndTreatmentHandler {
  constructor(
    private readonly treatmentRepo: TreatmentRepository
  ) {}

  async execute(treatment: Treatment): Promise<void> {
    treatment.end()
    await this.treatmentRepo.save(treatment)
  }
}
```

(En MVP, el recuperarem via infra)

---

# 8️⃣ Prisma: model Treatment

📄 `prisma/schema.prisma`

```prisma
model Treatment {
  id             String   @id
  patientId      String
  professionalId String
  status         String
  startedAt      DateTime
  endedAt        DateTime?

  @@index([patientId, professionalId, status])
}
```

```bash
npx prisma migrate dev -n treatment
```

---

# 9️⃣ Infra: PrismaTreatmentRepository

📄 `treatment/infrastructure/prisma/PrismaTreatmentRepository.ts`

```ts
import { PrismaClient } from '@prisma/client'
import { TreatmentRepository } from '../../domain/repositories/TreatmentRepository'
import { Treatment } from '../../domain/entities/Treatment'
import { TreatmentStatus } from '../../domain/value-objects/TreatmentStatus'

export class PrismaTreatmentRepository implements TreatmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(treatment: Treatment): Promise<void> {
    await this.prisma.treatment.upsert({
      where: { id: treatment.id },
      update: {
        status: treatment.status,
        endedAt: treatment.endedAt
      },
      create: {
        id: treatment.id,
        patientId: treatment.patientId,
        professionalId: treatment.professionalId,
        status: treatment.status,
        startedAt: treatment.startedAt,
        endedAt: treatment.endedAt
      }
    })
  }

  async findActive(patientId: string, professionalId: string) {
    const record = await this.prisma.treatment.findFirst({
      where: {
        patientId,
        professionalId,
        status: TreatmentStatus.ACTIVE
      }
    })

    return record
      ? new Treatment(
          record.id,
          record.patientId,
          record.professionalId,
          record.status as TreatmentStatus,
          record.startedAt,
          record.endedAt
        )
      : null
  }
}
```

---

# 🔐 HTTP Controller

📄 `treatment/infrastructure/http/TreatmentController.ts`

```ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../../identity/infrastructure/auth/JwtAuthGuard'
import { ProfessionalCompletedGuard } from '../../../identity/infrastructure/auth/ProfessionalCompletedGuard'
import { StartTreatmentHandler } from '../../application/commands/StartTreatment/StartTreatmentHandler'

@Controller('treatments')
@UseGuards(JwtAuthGuard, ProfessionalCompletedGuard)
export class TreatmentController {
  constructor(
    private readonly startTreatmentHandler: StartTreatmentHandler
  ) {}

  @Post()
  async start(@Req() req: any, @Body() body: any) {
    await this.startTreatmentHandler.execute({
      professionalId: req.user.sub,
      patientId: body.patientId
    })

    return { status: 'started' }
  }
}
```

---

# 10️⃣ treatment.module.ts

📄 `treatment/treatment.module.ts`

```ts
import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { TreatmentController } from './infrastructure/http/TreatmentController'
import { StartTreatmentHandler } from './application/commands/StartTreatment/StartTreatmentHandler'
import { PrismaTreatmentRepository } from './infrastructure/prisma/PrismaTreatmentRepository'

@Module({
  controllers: [TreatmentController],
  providers: [
    PrismaClient,
    StartTreatmentHandler,
    {
      provide: 'TreatmentRepository',
      useFactory: (prisma: PrismaClient) =>
        new PrismaTreatmentRepository(prisma),
      inject: [PrismaClient]
    }
  ]
})
export class TreatmentModule {}
```

---

# ✅ Punt de control (molt important)

Ara el sistema:

✔️ Diferencia relació legal (Consent)
✔️ Diferencia relació clínica (Treatment)
✔️ Permet relacions informals
✔️ Permet estructurar casos complexos
✔️ Escala cap a clínic-records, billing, col·laboracions

👉 **Aquest és un model clínic madur.**

---

# ⏭️ Següent pas (ordre recomanat)

Ara tenim dues opcions **igualment correctes**, però només una és òptima:

### 👉 **Col·laboracions entre professionals (Collaboration BC)** ← recomanat

* perquè:

  * neix dins d’un tractament
  * però pot existir sense ell
  * és clau pel teu cas Gestalt + addiccions

L’altra opció:

* Billing
* Clinical Records

Quan vulguis, **seguim amb Col·laboracions** 👣


Perfecte. **Seguim amb l’ordre correcte i sense cap salt**.

👉 Ara mateix el sistema **ja sap**:

* qui és l’usuari
* si és professional
* si ha completat onboarding

Això ens permet, per primer cop, **fer complir regles de negoci reals**.

El següent pas natural i imprescindible és:

# PAS SEGÜENT — Patient BC (MVP real)

Aquest pas **dóna valor immediat** a la plataforma i desbloqueja:

* Scheduling
* Consentiments
* Col·laboracions futures

---

# 🎯 Objectiu del Patient BC (fase MVP)

* Un **professional** pot crear pacients
* El pacient:

  * pot NO ser usuari
  * pot NO tenir email
* El pacient queda **lligat al professional creador**
* Preparar el terreny per:

  * consentiments
  * invitacions
  * registre futur del pacient

❌ Encara NO:

* historials clínics
* derivacions
* assegurances

---

# 1️⃣ Estructura del BC Patient

📁 `backend/api/src/modules/patient`

```text
patient/
├── domain/
│   ├── entities/
│   │   └── Patient.ts
│   ├── value-objects/
│   │   └── PatientName.ts
│   └── repositories/
│       └── PatientRepository.ts
│
├── application/
│   ├── commands/
│   │   └── CreatePatient/
│   └── queries/
│
├── infrastructure/
│   ├── http/
│   │   └── PatientController.ts
│   └── prisma/
│       └── PrismaPatientRepository.ts
│
├── patient.module.ts
└── index.ts
```

---

# 2️⃣ Domini: Patient (agregat arrel)

📄 `patient/domain/entities/Patient.ts`

```ts
export class Patient {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly createdByProfessionalId: string,
    public readonly userId: string | null,
    public readonly createdAt: Date
  ) {}
}
```

📌 Decisions clau:

* `userId` nullable → pacient encara no registrat
* el professional creador és **part del domini**
* el pacient **no sap res del professional** (unidireccional)

---

# 3️⃣ Value Object: PatientName

📄 `patient/domain/value-objects/PatientName.ts`

```ts
export class PatientName {
  private constructor(public readonly value: string) {}

  static create(value: string): PatientName {
    if (!value || value.trim().length < 2) {
      throw new Error('Invalid patient name')
    }
    return new PatientName(value.trim())
  }
}
```

---

# 4️⃣ Repositori de domini

📄 `patient/domain/repositories/PatientRepository.ts`

```ts
import { Patient } from '../entities/Patient'

export interface PatientRepository {
  save(patient: Patient): Promise<void>
  findByProfessional(professionalId: string): Promise<Patient[]>
}
```

---

# 5️⃣ Application: CreatePatient (cas d’ús clau)

Aquest cas d’ús **només** hauria de poder-se executar si:

* l’usuari és professional
* onboarding COMPLETED

👉 Això **no va aquí**, ho farem amb guards.

---

## Command

📄 `patient/application/commands/CreatePatient/CreatePatientCommand.ts`

```ts
export class CreatePatientCommand {
  constructor(
    public readonly professionalId: string,
    public readonly fullName: string
  ) {}
}
```

---

## Handler

📄 `patient/application/commands/CreatePatient/CreatePatientHandler.ts`

```ts
import { randomUUID } from 'crypto'
import { Patient } from '../../../domain/entities/Patient'
import { PatientName } from '../../../domain/value-objects/PatientName'
import { PatientRepository } from '../../../domain/repositories/PatientRepository'

export class CreatePatientHandler {
  constructor(
    private readonly patientRepo: PatientRepository
  ) {}

  async execute(command: CreatePatientCommand): Promise<void> {
    const name = PatientName.create(command.fullName)

    const patient = new Patient(
      randomUUID(),
      name.value,
      command.professionalId,
      null,
      new Date()
    )

    await this.patientRepo.save(patient)
  }
}
```

📌 Observa:

* cap referència a HTTP
* cap referència a auth
* domini pur

---

# 6️⃣ Prisma: persistència

📄 `prisma/schema.prisma`

```prisma
model Patient {
  id                      String   @id
  fullName                String
  createdByProfessionalId String
  userId                  String?
  createdAt               DateTime
}
```

```bash
npx prisma migrate dev -n patient
```

---

# 7️⃣ Infra: PrismaPatientRepository

📄 `patient/infrastructure/prisma/PrismaPatientRepository.ts`

```ts
import { PrismaClient } from '@prisma/client'
import { PatientRepository } from '../../domain/repositories/PatientRepository'
import { Patient } from '../../domain/entities/Patient'

export class PrismaPatientRepository implements PatientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(patient: Patient): Promise<void> {
    await this.prisma.patient.create({
      data: {
        id: patient.id,
        fullName: patient.fullName,
        createdByProfessionalId: patient.createdByProfessionalId,
        userId: patient.userId,
        createdAt: patient.createdAt
      }
    })
  }

  async findByProfessional(professionalId: string): Promise<Patient[]> {
    const records = await this.prisma.patient.findMany({
      where: { createdByProfessionalId: professionalId }
    })

    return records.map(
      r =>
        new Patient(
          r.id,
          r.fullName,
          r.createdByProfessionalId,
          r.userId,
          r.createdAt
        )
    )
  }
}
```

---

# 8️⃣ HTTP: PatientController

Ara **combinem-ho tot**:

* JWT
* onboarding guard
* use case

📄 `patient/infrastructure/http/PatientController.ts`

```ts
import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../../identity/infrastructure/auth/JwtAuthGuard'
import { ProfessionalCompletedGuard } from '../../../identity/infrastructure/auth/ProfessionalCompletedGuard'
import { CreatePatientHandler } from '../../application/commands/CreatePatient/CreatePatientHandler'

@Controller('patients')
@UseGuards(JwtAuthGuard, ProfessionalCompletedGuard)
export class PatientController {
  constructor(
    private readonly createPatientHandler: CreatePatientHandler
  ) {}

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    await this.createPatientHandler.execute({
      professionalId: req.user.sub,
      fullName: body.fullName
    })

    return { status: 'created' }
  }

  @Get()
  async list(@Req() req: any) {
    // s’implementarà amb query handler
    return []
  }
}
```

📌 Aquí veus clarament:

* **autorització fora del domini**
* el domini només fa la seva feina

---

# 9️⃣ patient.module.ts

📄 `patient/patient.module.ts`

```ts
import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PatientController } from './infrastructure/http/PatientController'
import { CreatePatientHandler } from './application/commands/CreatePatient/CreatePatientHandler'
import { PrismaPatientRepository } from './infrastructure/prisma/PrismaPatientRepository'

@Module({
  controllers: [PatientController],
  providers: [
    PrismaClient,
    CreatePatientHandler,
    {
      provide: 'PatientRepository',
      useFactory: (prisma: PrismaClient) =>
        new PrismaPatientRepository(prisma),
      inject: [PrismaClient]
    }
  ]
})
export class PatientModule {}
```

---

# ✅ Punt de control (crític)

Ara el sistema **realment serveix per alguna cosa**:

✔️ Professional autenticat
✔️ Onboarding complet
✔️ Pot crear pacients
✔️ Pacients no registrats
✔️ Base per consentiments
✔️ Base per col·laboracions

👉 **Aquest és el primer MVP funcional de debò.**

---

# ⏭️ Següent pas (ordre recomanat)

Ara toca **exactament un d’aquests** (en aquest ordre):

1️⃣ **Consentiments mínims pacient ↔ professional**
2️⃣ Invitació del pacient a registrar-se
3️⃣ Scheduling (cites)
4️⃣ Col·laboracions entre professionals

👉 El més correcte arquitectònicament ara és **Consentiments**.

Quan vulguis, **seguim** 👣

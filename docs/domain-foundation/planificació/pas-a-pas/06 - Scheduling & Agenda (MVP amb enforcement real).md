Perfecte. **Seguim amb el següent pas natural i obligatori** del core:

# PAS — Scheduling / Agenda (MVP amb enforcement real)

Ara ja tenim:

* Identity ✔
* Professional ✔
* Patient ✔
* Consent ✔

👉 **Scheduling és el primer domini transversal** que *consumeix* els anteriors i valida que el model aguanta.

---

# 🎯 Objectiu del Scheduling BC (MVP)

Permetre:

* Crear cites **professional ↔ pacient**
* Amb:

  * data/hora inici
  * durada
  * estat bàsic
* **Bloquejant**:

  * si no hi ha consentiment actiu

❌ Encara NO:

* sales
* organitzacions
* recurrències
* assegurances

---

# 1️⃣ Decisions de model (clau)

### 1.1 L’Appointment és l’agregat arrel

* Una cita:

  * pertany a **1 professional**
  * té **0..1 pacient** (en futur pot ser bloqueig agenda)
* El domini **no carrega** Patient ni Professional

  * només IDs

---

# 2️⃣ Estructura del BC Scheduling

📁 `backend/api/src/modules/scheduling`

```text
scheduling/
├── domain/
│   ├── entities/
│   │   └── Appointment.ts
│   ├── value-objects/
│   │   ├── AppointmentStatus.ts
│   │   └── TimeRange.ts
│   └── repositories/
│       └── AppointmentRepository.ts
│
├── application/
│   ├── commands/
│   │   └── CreateAppointment/
│   └── queries/
│
├── infrastructure/
│   ├── http/
│   │   └── AppointmentController.ts
│   └── prisma/
│       └── PrismaAppointmentRepository.ts
│
├── scheduling.module.ts
└── index.ts
```

---

# 3️⃣ Domini: Appointment

📄 `scheduling/domain/entities/Appointment.ts`

```ts
import { AppointmentStatus } from '../value-objects/AppointmentStatus'
import { TimeRange } from '../value-objects/TimeRange'

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly professionalId: string,
    public readonly patientId: string | null,
    public readonly timeRange: TimeRange,
    public status: AppointmentStatus,
    public readonly createdAt: Date
  ) {}

  cancel() {
    this.status = AppointmentStatus.CANCELLED
  }
}
```

---

# 4️⃣ Value Objects

## TimeRange

📄 `scheduling/domain/value-objects/TimeRange.ts`

```ts
export class TimeRange {
  private constructor(
    public readonly start: Date,
    public readonly end: Date
  ) {}

  static create(start: Date, end: Date): TimeRange {
    if (end <= start) {
      throw new Error('Invalid time range')
    }
    return new TimeRange(start, end)
  }
}
```

## AppointmentStatus

📄 `scheduling/domain/value-objects/AppointmentStatus.ts`

```ts
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED'
}
```

---

# 5️⃣ Repository de domini

📄 `scheduling/domain/repositories/AppointmentRepository.ts`

```ts
import { Appointment } from '../entities/Appointment'

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>
}
```

---

# 6️⃣ Application: CreateAppointment (amb enforcement de consent)

🚨 **Important**
Aquest és el primer cas d’ús que **consulta un altre BC**.

➡️ Això es fa **via port (interface)**, NO directament.

---

## Port: ConsentChecker

📄 `scheduling/application/ports/ConsentChecker.ts`

```ts
export interface ConsentChecker {
  hasActiveConsent(
    patientId: string,
    professionalId: string
  ): Promise<boolean>
}
```

---

## Command

📄 `scheduling/application/commands/CreateAppointment/CreateAppointmentCommand.ts`

```ts
export class CreateAppointmentCommand {
  constructor(
    public readonly professionalId: string,
    public readonly patientId: string | null,
    public readonly start: Date,
    public readonly end: Date
  ) {}
}
```

---

## Handler

📄 `scheduling/application/commands/CreateAppointment/CreateAppointmentHandler.ts`

```ts
import { randomUUID } from 'crypto'
import { Appointment } from '../../../domain/entities/Appointment'
import { TimeRange } from '../../../domain/value-objects/TimeRange'
import { AppointmentStatus } from '../../../domain/value-objects/AppointmentStatus'
import { AppointmentRepository } from '../../../domain/repositories/AppointmentRepository'
import { ConsentChecker } from '../../ports/ConsentChecker'

export class CreateAppointmentHandler {
  constructor(
    private readonly appointmentRepo: AppointmentRepository,
    private readonly consentChecker: ConsentChecker
  ) {}

  async execute(command: CreateAppointmentCommand): Promise<void> {
    if (command.patientId) {
      const hasConsent = await this.consentChecker.hasActiveConsent(
        command.patientId,
        command.professionalId
      )

      if (!hasConsent) {
        throw new Error('No active consent')
      }
    }

    const timeRange = TimeRange.create(
      command.start,
      command.end
    )

    const appointment = new Appointment(
      randomUUID(),
      command.professionalId,
      command.patientId,
      timeRange,
      AppointmentStatus.SCHEDULED,
      new Date()
    )

    await this.appointmentRepo.save(appointment)
  }
}
```

📌 Això és **DDD net**:

* Scheduling **no depèn** de Consent
* només d’un *contracte*

---

# 7️⃣ Infra: Adapter Consent → Scheduling

📄 `scheduling/infrastructure/adapters/ConsentCheckerAdapter.ts`

```ts
import { PrismaClient } from '@prisma/client'
import { ConsentStatus } from '../../../consent/domain/value-objects/ConsentStatus'
import { ConsentChecker } from '../../application/ports/ConsentChecker'

export class ConsentCheckerAdapter implements ConsentChecker {
  constructor(private readonly prisma: PrismaClient) {}

  async hasActiveConsent(patientId: string, professionalId: string) {
    const consent = await this.prisma.consent.findFirst({
      where: {
        patientId,
        professionalId,
        status: ConsentStatus.GRANTED
      }
    })

    return !!consent
  }
}
```

📌 Infra pot travessar BCs
📌 Domini i application **no**

---

# 8️⃣ Prisma: Appointment

📄 `prisma/schema.prisma`

```prisma
model Appointment {
  id             String   @id
  professionalId String
  patientId      String?
  start          DateTime
  end            DateTime
  status         String
  createdAt      DateTime

  @@index([professionalId, start])
}
```

```bash
npx prisma migrate dev -n appointment
```

---

# 9️⃣ PrismaAppointmentRepository

📄 `scheduling/infrastructure/prisma/PrismaAppointmentRepository.ts`

```ts
import { PrismaClient } from '@prisma/client'
import { AppointmentRepository } from '../../domain/repositories/AppointmentRepository'
import { Appointment } from '../../domain/entities/Appointment'

export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(appointment: Appointment): Promise<void> {
    await this.prisma.appointment.create({
      data: {
        id: appointment.id,
        professionalId: appointment.professionalId,
        patientId: appointment.patientId,
        start: appointment.timeRange.start,
        end: appointment.timeRange.end,
        status: appointment.status,
        createdAt: appointment.createdAt
      }
    })
  }
}
```

---

# 🔐 HTTP Controller

📄 `scheduling/infrastructure/http/AppointmentController.ts`

```ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../../identity/infrastructure/auth/JwtAuthGuard'
import { ProfessionalCompletedGuard } from '../../../identity/infrastructure/auth/ProfessionalCompletedGuard'
import { CreateAppointmentHandler } from '../../application/commands/CreateAppointment/CreateAppointmentHandler'

@Controller('appointments')
@UseGuards(JwtAuthGuard, ProfessionalCompletedGuard)
export class AppointmentController {
  constructor(
    private readonly createAppointmentHandler: CreateAppointmentHandler
  ) {}

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    await this.createAppointmentHandler.execute({
      professionalId: req.user.sub,
      patientId: body.patientId ?? null,
      start: new Date(body.start),
      end: new Date(body.end)
    })

    return { status: 'scheduled' }
  }
}
```

---

# 10️⃣ scheduling.module.ts

📄 `scheduling/scheduling.module.ts`

```ts
import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AppointmentController } from './infrastructure/http/AppointmentController'
import { CreateAppointmentHandler } from './application/commands/CreateAppointment/CreateAppointmentHandler'
import { PrismaAppointmentRepository } from './infrastructure/prisma/PrismaAppointmentRepository'
import { ConsentCheckerAdapter } from './infrastructure/adapters/ConsentCheckerAdapter'

@Module({
  controllers: [AppointmentController],
  providers: [
    PrismaClient,
    CreateAppointmentHandler,
    {
      provide: 'AppointmentRepository',
      useFactory: (prisma: PrismaClient) =>
        new PrismaAppointmentRepository(prisma),
      inject: [PrismaClient]
    },
    {
      provide: 'ConsentChecker',
      useFactory: (prisma: PrismaClient) =>
        new ConsentCheckerAdapter(prisma),
      inject: [PrismaClient]
    }
  ]
})
export class SchedulingModule {}
```

---

# ✅ Punt de control (molt important)

Ara el sistema:

✔️ Bloqueja cites sense consentiment
✔️ Té dependències netes entre BCs
✔️ És extensible (organització, sales, tractaments)
✔️ Està preparat per agenda avançada

👉 **Això és un core sòlid de plataforma clínica.**

---

# ⏭️ Següent pas (ordre correcte)

Ara toca **escollir**:

1️⃣ **Tractament (Treatment BC)**
2️⃣ Col·laboracions entre professionals
3️⃣ Agenda avançada (bloquejos, recurrències)
4️⃣ Consent avançat (versions, documents)

👉 Arquitectònicament: **Treatment** és el següent correcte.

Quan vulguis, **seguim** 👣

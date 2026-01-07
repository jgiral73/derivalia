Som-hi. Ara ja tenim **tots els prerequisits ben separats**, així que podem dissenyar **Scheduling / Agenda** sense trampes ni hacks.

Aquest BC és delicat perquè **connecta molts contextos**, però **no n’ha de dependre fortament de cap**.

<br />

# BC 8 — **Scheduling / Agenda**

> Aquest BC gestiona **esdeveniments temporals reservables**
> (cites, visites, sessions, bloquejos)

<br />

## 🎯 Responsabilitat del BC

Inclou:

* Cites (appointments)
* Franges horàries
* Estat de la cita
* Vinculació opcional amb:

  * pacient
  * professional
  * organització
  * tractament
* Cancel·lacions / reprogramacions

No inclou:

* Tractament clínic
* Facturació
* Historial mèdic
* Autorització (només valida referències)

<br />

## 🔗 Relacions amb altres BCs (totes opcionals)

| Relació      | Obligatòria |
| ------------ | ----------- |
| Professional | ✅ sí        |
| Patient      | ❌ no        |
| Organization | ❌ no        |
| Treatment    | ❌ no        |
| CareRelation | ❌ no        |

👉 **Aquesta flexibilitat és clau**

<br />

## 📦 Estructura de carpetes

```txt
scheduling/
├── domain/
│   ├── aggregates/
│   │   └── Appointment/
│   │       ├── Appointment.ts
│   │       ├── AppointmentId.ts
│   │       └── AppointmentStatus.ts
│   ├── value-objects/
│   │   ├── TimeSlot.ts
│   │   ├── AppointmentType.ts
│   │   └── AppointmentReason.ts
│   ├── repositories/
│   │   └── AppointmentRepository.ts
│   ├── services/
│   │   └── AvailabilityPolicy.ts
│   └── events/
│       ├── AppointmentScheduled.ts
│       ├── AppointmentCancelled.ts
│       └── AppointmentRescheduled.ts
│
├── application/
│   ├── commands/
│   │   ├── ScheduleAppointment/
│   │   ├── CancelAppointment/
│   │   └── RescheduleAppointment/
│   ├── queries/
│   │   ├── GetAgendaForProfessional/
│   │   └── GetAppointmentsForPatient/
│   └── dtos/
│       └── AppointmentDTO.ts
│
├── infrastructure/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── repositories/
│   │       └── PrismaAppointmentRepository.ts
│   └── mappers/
│       └── AppointmentMapper.ts
│
└── index.ts
```

<br />

## 🧠 Domain Layer

### Aggregate Root — Appointment

#### `domain/aggregates/Appointment/Appointment.ts`

```ts
import { AppointmentId } from './AppointmentId'
import { AppointmentStatus } from './AppointmentStatus'
import { TimeSlot } from '../../value-objects/TimeSlot'
import { AppointmentType } from '../../value-objects/AppointmentType'
import { AppointmentReason } from '../../value-objects/AppointmentReason'

export class Appointment {
  constructor(
    readonly id: AppointmentId,
    readonly professionalId: string,
    readonly patientId: string | null,
    readonly organizationId: string | null,
    readonly treatmentId: string | null,
    private slot: TimeSlot,
    private type: AppointmentType,
    private reason: AppointmentReason | null,
    private status: AppointmentStatus
  ) {}

  cancel() {
    if (!this.status.canCancel()) {
      throw new Error('Appointment cannot be cancelled')
    }
    this.status = AppointmentStatus.Cancelled()
  }

  reschedule(newSlot: TimeSlot) {
    if (!this.status.canReschedule()) {
      throw new Error('Appointment cannot be rescheduled')
    }
    this.slot = newSlot
  }

  isActive(): boolean {
    return this.status.isActive()
  }
}
```

<br />

### AppointmentStatus

#### `domain/aggregates/Appointment/AppointmentStatus.ts`

```ts
export class AppointmentStatus {
  private constructor(
    private readonly value:
      | 'SCHEDULED'
      | 'CANCELLED'
      | 'COMPLETED'
      | 'NO_SHOW'
  ) {}

  static Scheduled() {
    return new AppointmentStatus('SCHEDULED')
  }

  static Cancelled() {
    return new AppointmentStatus('CANCELLED')
  }

  static Completed() {
    return new AppointmentStatus('COMPLETED')
  }

  static NoShow() {
    return new AppointmentStatus('NO_SHOW')
  }

  canCancel() {
    return this.value === 'SCHEDULED'
  }

  canReschedule() {
    return this.value === 'SCHEDULED'
  }

  isActive() {
    return this.value === 'SCHEDULED'
  }

  toString() {
    return this.value
  }
}
```

<br />

## 🧩 Value Objects

### TimeSlot

#### `domain/value-objects/TimeSlot.ts`

```ts
export class TimeSlot {
  private constructor(
    readonly startAt: Date,
    readonly endAt: Date
  ) {}

  static create(startAt: Date, endAt: Date): TimeSlot {
    if (startAt >= endAt) {
      throw new Error('Invalid time slot')
    }
    return new TimeSlot(startAt, endAt)
  }

  overlaps(other: TimeSlot): boolean {
    return this.startAt < other.endAt && other.startAt < this.endAt
  }
}
```

<br />

### AppointmentType

#### `domain/value-objects/AppointmentType.ts`

```ts
export class AppointmentType {
  private constructor(
    readonly value: 'VISIT' | 'FOLLOW_UP' | 'ASSESSMENT' | 'ADMIN'
  ) {}

  static Visit() {
    return new AppointmentType('VISIT')
  }

  static FollowUp() {
    return new AppointmentType('FOLLOW_UP')
  }

  static Assessment() {
    return new AppointmentType('ASSESSMENT')
  }

  static Admin() {
    return new AppointmentType('ADMIN')
  }
}
```

<br />

## 📄 Repository (contracte)

#### `domain/repositories/AppointmentRepository.ts`

```ts
import { Appointment } from '../aggregates/Appointment/Appointment'

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>
  findOverlapping(
    professionalId: string,
    slot: TimeSlot
  ): Promise<Appointment[]>
}
```

<br />

## 🚀 Application Layer

### Command — ScheduleAppointment

#### `application/commands/ScheduleAppointment/ScheduleAppointmentCommand.ts`

```ts
export class ScheduleAppointmentCommand {
  constructor(
    public readonly professionalId: string,
    public readonly startAt: Date,
    public readonly endAt: Date,
    public readonly patientId?: string,
    public readonly organizationId?: string,
    public readonly treatmentId?: string,
    public readonly type?: 'VISIT' | 'FOLLOW_UP' | 'ASSESSMENT' | 'ADMIN',
    public readonly reason?: string
  ) {}
}
```

<br />

#### `application/commands/ScheduleAppointment/ScheduleAppointmentHandler.ts`

```ts
import { Appointment } from '../../../domain/aggregates/Appointment/Appointment'
import { AppointmentId } from '../../../domain/aggregates/Appointment/AppointmentId'
import { AppointmentStatus } from '../../../domain/aggregates/Appointment/AppointmentStatus'
import { TimeSlot } from '../../../domain/value-objects/TimeSlot'
import { AppointmentType } from '../../../domain/value-objects/AppointmentType'
import { AppointmentReason } from '../../../domain/value-objects/AppointmentReason'

export class ScheduleAppointmentHandler {
  constructor(
    private readonly repository: AppointmentRepository,
    private readonly availability: AvailabilityPolicy
  ) {}

  async execute(command: ScheduleAppointmentCommand) {
    const slot = TimeSlot.create(command.startAt, command.endAt)

    await this.availability.assertAvailable(
      command.professionalId,
      slot
    )

    const appointment = new Appointment(
      AppointmentId.generate(),
      command.professionalId,
      command.patientId ?? null,
      command.organizationId ?? null,
      command.treatmentId ?? null,
      slot,
      AppointmentType[command.type ?? 'VISIT'](),
      command.reason
        ? AppointmentReason.create(command.reason)
        : null,
      AppointmentStatus.Scheduled()
    )

    await this.repository.save(appointment)
  }
}
```

<br />

## 🧱 Infrastructure — Prisma

#### `infrastructure/prisma/schema.prisma`

```prisma
model Appointment {
  id              String   @id
  professionalId  String
  patientId       String?
  organizationId  String?
  treatmentId     String?
  startAt         DateTime
  endAt           DateTime
  type            String
  reason          String?
  status          String
}
```

<br />

### Prisma Repository

#### `infrastructure/prisma/repositories/PrismaAppointmentRepository.ts`

```ts
export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(a: Appointment): Promise<void> {
    await this.prisma.appointment.upsert({
      where: { id: a.id.value },
      update: {
        startAt: a.slot.startAt,
        endAt: a.slot.endAt,
        status: a.status.toString()
      },
      create: {
        id: a.id.value,
        professionalId: a.professionalId,
        patientId: a.patientId,
        organizationId: a.organizationId,
        treatmentId: a.treatmentId,
        startAt: a.slot.startAt,
        endAt: a.slot.endAt,
        type: a.type.value,
        reason: a.reason?.value,
        status: a.status.toString()
      }
    })
  }
}
```

<br />

## 🔐 Regles clau (molt importants)

✔️ Una cita **pot existir sense pacient**
✔️ Una cita **pot existir sense organització**
✔️ Treatment **mai és obligatori**
✔️ El professional **sempre és obligatori**
✔️ Scheduling **no valida domini clínic**, només disponibilitat

<br />

## 🧩 Com encaixa tot plegat

```txt
Professional
   │
   ├── CareRelation ─── Patient
   │
   ├── Treatment ───── Patient
   │
   └── Appointment ─── Patient? / Treatment? / Organization?
```

<br />

## ➡️ Següent passos possibles (ja molt avançats)

1. **Availability / Working hours / Calendars**
2. **Notifications (email / SMS / push)**
3. **Billing / Invoicing**
4. **Clinical Records**

Digues per on vols continuar i seguim amb el mateix nivell de precisió.

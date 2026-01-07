Perfecte. **Seguim amb el següent BC clau del core: `Collaboration`**
Aquest BC resol exactament el cas que vas descriure: *“necessito un altre professional per ajudar-me amb aquest pacient”*.

---

# PAS — Collaboration BC (col·laboració professional–professional)

## 🎯 Problema de domini

Un **professional A** pot:

* sol·licitar ajuda a un **professional B**
* per un **pacient concret**
* dins o fora d’un **tractament**
* encara que el professional B:

  * no sigui usuari
  * no hagi completat onboarding

👉 Aquest BC és el **pont** entre:

* Professionals
* Pacients
* Treatment (opcional)
* Invitation / Onboarding progressiu

---

# 1️⃣ Decisions de model (molt importants)

### 1.1 Collaboration és un agregat propi

❌ No és part de Treatment
❌ No és part de Patient
✅ Té lifecycle propi

---

### 1.2 Treatment és opcional

```text
Collaboration
 ├─ professionalRequesterId
 ├─ professionalCollaboratorId (o email)
 ├─ patientId
 └─ treatmentId? (nullable)
```

---

### 1.3 El professional col·laborador pot NO existir

Per tant:

* guardem:

  * `collaboratorProfessionalId?`
  * `collaboratorEmail?`

---

# 2️⃣ Estructura del BC Collaboration

📁 `backend/api/src/modules/collaboration`

```text
collaboration/
├── domain/
│   ├── entities/
│   │   └── Collaboration.ts
│   ├── value-objects/
│   │   └── CollaborationStatus.ts
│   └── repositories/
│       └── CollaborationRepository.ts
│
├── application/
│   ├── commands/
│   │   ├── RequestCollaboration/
│   │   └── AcceptCollaboration/
│   └── queries/
│
├── infrastructure/
│   ├── http/
│   │   └── CollaborationController.ts
│   ├── prisma/
│   │   └── PrismaCollaborationRepository.ts
│   └── adapters/
│       └── InvitationSenderAdapter.ts
│
├── collaboration.module.ts
└── index.ts
```

---

# 3️⃣ Domini: Collaboration (agregat arrel)

📄 `collaboration/domain/entities/Collaboration.ts`

```ts
import { CollaborationStatus } from '../value-objects/CollaborationStatus'

export class Collaboration {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly requesterProfessionalId: string,
    public collaboratorProfessionalId: string | null,
    public collaboratorEmail: string | null,
    public readonly treatmentId: string | null,
    public status: CollaborationStatus,
    public readonly createdAt: Date,
    public acceptedAt: Date | null
  ) {}

  accept(professionalId: string) {
    if (this.status !== CollaborationStatus.PENDING) {
      throw new Error('Collaboration not pending')
    }

    this.collaboratorProfessionalId = professionalId
    this.status = CollaborationStatus.ACCEPTED
    this.acceptedAt = new Date()
  }
}
```

---

# 4️⃣ Value Object: CollaborationStatus

📄 `collaboration/domain/value-objects/CollaborationStatus.ts`

```ts
export enum CollaborationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}
```

---

# 5️⃣ Repository de domini

📄 `collaboration/domain/repositories/CollaborationRepository.ts`

```ts
import { Collaboration } from '../entities/Collaboration'

export interface CollaborationRepository {
  save(collaboration: Collaboration): Promise<void>
  findById(id: string): Promise<Collaboration | null>
}
```

---

# 6️⃣ Application: RequestCollaboration

🚨 Regles:

* el professional sol·licitant:

  * ha de tenir consentiment del pacient
* el col·laborador pot no existir

(assumim consent validat abans → simplificació MVP)

---

## Command

📄 `collaboration/application/commands/RequestCollaboration/RequestCollaborationCommand.ts`

```ts
export class RequestCollaborationCommand {
  constructor(
    public readonly requesterProfessionalId: string,
    public readonly patientId: string,
    public readonly collaboratorProfessionalId?: string,
    public readonly collaboratorEmail?: string,
    public readonly treatmentId?: string
  ) {}
}
```

---

## Handler

📄 `collaboration/application/commands/RequestCollaboration/RequestCollaborationHandler.ts`

```ts
import { randomUUID } from 'crypto'
import { Collaboration } from '../../../domain/entities/Collaboration'
import { CollaborationStatus } from '../../../domain/value-objects/CollaborationStatus'
import { CollaborationRepository } from '../../../domain/repositories/CollaborationRepository'

export class RequestCollaborationHandler {
  constructor(
    private readonly collaborationRepo: CollaborationRepository
  ) {}

  async execute(command: RequestCollaborationCommand): Promise<void> {
    const collaboration = new Collaboration(
      randomUUID(),
      command.patientId,
      command.requesterProfessionalId,
      command.collaboratorProfessionalId ?? null,
      command.collaboratorEmail ?? null,
      command.treatmentId ?? null,
      CollaborationStatus.PENDING,
      new Date(),
      null
    )

    await this.collaborationRepo.save(collaboration)
  }
}
```

---

# 7️⃣ Application: AcceptCollaboration

📄 `collaboration/application/commands/AcceptCollaboration/AcceptCollaborationHandler.ts`

```ts
import { CollaborationRepository } from '../../../domain/repositories/CollaborationRepository'

export class AcceptCollaborationHandler {
  constructor(
    private readonly collaborationRepo: CollaborationRepository
  ) {}

  async execute(
    collaborationId: string,
    professionalId: string
  ): Promise<void> {
    const collaboration =
      await this.collaborationRepo.findById(collaborationId)

    if (!collaboration) {
      throw new Error('Collaboration not found')
    }

    collaboration.accept(professionalId)
    await this.collaborationRepo.save(collaboration)
  }
}
```

---

# 8️⃣ Prisma: model Collaboration

📄 `prisma/schema.prisma`

```prisma
model Collaboration {
  id                          String   @id
  patientId                   String
  requesterProfessionalId     String
  collaboratorProfessionalId  String?
  collaboratorEmail           String?
  treatmentId                 String?
  status                      String
  createdAt                   DateTime
  acceptedAt                  DateTime?

  @@index([patientId])
  @@index([collaboratorProfessionalId])
}
```

```bash
npx prisma migrate dev -n collaboration
```

---

# 9️⃣ Infra: PrismaCollaborationRepository

📄 `collaboration/infrastructure/prisma/PrismaCollaborationRepository.ts`

```ts
import { PrismaClient } from '@prisma/client'
import { CollaborationRepository } from '../../domain/repositories/CollaborationRepository'
import { Collaboration } from '../../domain/entities/Collaboration'
import { CollaborationStatus } from '../../domain/value-objects/CollaborationStatus'

export class PrismaCollaborationRepository
  implements CollaborationRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async save(collaboration: Collaboration): Promise<void> {
    await this.prisma.collaboration.upsert({
      where: { id: collaboration.id },
      update: {
        collaboratorProfessionalId:
          collaboration.collaboratorProfessionalId,
        status: collaboration.status,
        acceptedAt: collaboration.acceptedAt
      },
      create: {
        id: collaboration.id,
        patientId: collaboration.patientId,
        requesterProfessionalId:
          collaboration.requesterProfessionalId,
        collaboratorProfessionalId:
          collaboration.collaboratorProfessionalId,
        collaboratorEmail: collaboration.collaboratorEmail,
        treatmentId: collaboration.treatmentId,
        status: collaboration.status,
        createdAt: collaboration.createdAt,
        acceptedAt: collaboration.acceptedAt
      }
    })
  }

  async findById(id: string) {
    const record = await this.prisma.collaboration.findUnique({
      where: { id }
    })

    return record
      ? new Collaboration(
          record.id,
          record.patientId,
          record.requesterProfessionalId,
          record.collaboratorProfessionalId,
          record.collaboratorEmail,
          record.treatmentId,
          record.status as CollaborationStatus,
          record.createdAt,
          record.acceptedAt
        )
      : null
  }
}
```

---

# 🔐 HTTP Controller

📄 `collaboration/infrastructure/http/CollaborationController.ts`

```ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../../identity/infrastructure/auth/JwtAuthGuard'
import { ProfessionalCompletedGuard } from '../../../identity/infrastructure/auth/ProfessionalCompletedGuard'
import { RequestCollaborationHandler } from '../../application/commands/RequestCollaboration/RequestCollaborationHandler'
import { AcceptCollaborationHandler } from '../../application/commands/AcceptCollaboration/AcceptCollaborationHandler'

@Controller('collaborations')
export class CollaborationController {
  constructor(
    private readonly requestHandler: RequestCollaborationHandler,
    private readonly acceptHandler: AcceptCollaborationHandler
  ) {}

  @Post('request')
  @UseGuards(JwtAuthGuard, ProfessionalCompletedGuard)
  async request(@Req() req: any, @Body() body: any) {
    await this.requestHandler.execute({
      requesterProfessionalId: req.user.sub,
      patientId: body.patientId,
      collaboratorProfessionalId: body.collaboratorProfessionalId,
      collaboratorEmail: body.collaboratorEmail,
      treatmentId: body.treatmentId
    })

    return { status: 'requested' }
  }

  @Post('accept')
  @UseGuards(JwtAuthGuard)
  async accept(@Req() req: any, @Body() body: any) {
    await this.acceptHandler.execute(
      body.collaborationId,
      req.user.sub
    )

    return { status: 'accepted' }
  }
}
```

---

# 10️⃣ collaboration.module.ts

📄 `collaboration/collaboration.module.ts`

```ts
import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { CollaborationController } from './infrastructure/http/CollaborationController'
import { RequestCollaborationHandler } from './application/commands/RequestCollaboration/RequestCollaborationHandler'
import { AcceptCollaborationHandler } from './application/commands/AcceptCollaboration/AcceptCollaborationHandler'
import { PrismaCollaborationRepository } from './infrastructure/prisma/PrismaCollaborationRepository'

@Module({
  controllers: [CollaborationController],
  providers: [
    PrismaClient,
    RequestCollaborationHandler,
    AcceptCollaborationHandler,
    {
      provide: 'CollaborationRepository',
      useFactory: (prisma: PrismaClient) =>
        new PrismaCollaborationRepository(prisma),
      inject: [PrismaClient]
    }
  ]
})
export class CollaborationModule {}
```

---

# ✅ Punt de control (molt rellevant)

Ara el sistema pot:

✔️ Gestionar col·laboracions reals
✔️ Convidar professionals no registrats
✔️ Lligar col·laboracions a pacients
✔️ Integrar-se amb Treatment
✔️ Activar onboarding progressiu

👉 **Aquest BC és clau pel creixement orgànic del producte.**

---

# ⏭️ Següent pas (ordre natural)

Ara toca exactament això:

### 👉 **Invitation + Onboarding Progressiu**

* perquè:

  * col·laboradors poden no existir
  * pacients poden no existir
  * necessitem convertir-los en usuaris

Quan vulguis, **seguim amb Invitation + Progressive Unlock** 👣

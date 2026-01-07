Perfecte. **Seguim pas a pas**, sense avançar res que no sigui estrictament necessari.

👉 Tal com hem acordat, **ara toca Consent**
i només el **Consent mínim indispensable per MVP**.

---

# PAS SEGÜENT — Consent BC (versió MVP)

## 🎯 Problema a resoldre

* Un professional **NO pot**:

  * crear cites
  * compartir informació
  * demanar col·laboracions
    sense **consentiment explícit** del pacient

Però:

* el pacient **pot no ser usuari**
* el consentiment pot ser:

  * verbal
  * offline
  * pendent de signatura digital futura

➡️ Necessitem un **registre legal mínim**, no una firma avançada.

---

# 1️⃣ Decisió de model (important)

### ❌ NO

* consentiments genèrics
* consentiments globals
* consentiments implícits

### ✅ SÍ

Consentiment **per relació**:

> *Aquest professional pot atendre aquest pacient*

📌 El consentiment **no depèn** del tractament
📌 El tractament **vindrà després**

---

# 2️⃣ Estructura del BC Consent

📁 `backend/api/src/modules/consent`

```text
consent/
├── domain/
│   ├── entities/
│   │   └── Consent.ts
│   ├── value-objects/
│   │   └── ConsentStatus.ts
│   └── repositories/
│       └── ConsentRepository.ts
│
├── application/
│   ├── commands/
│   │   └── GrantConsent/
│   └── queries/
│
├── infrastructure/
│   ├── http/
│   │   └── ConsentController.ts
│   └── prisma/
│       └── PrismaConsentRepository.ts
│
├── consent.module.ts
└── index.ts
```

---

# 3️⃣ Domini: Consent (Agregat)

📄 `consent/domain/entities/Consent.ts`

```ts
import { ConsentStatus } from '../value-objects/ConsentStatus'

export class Consent {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly professionalId: string,
    public status: ConsentStatus,
    public readonly grantedAt: Date,
    public revokedAt: Date | null
  ) {}

  revoke() {
    if (this.status === ConsentStatus.REVOKED) return

    this.status = ConsentStatus.REVOKED
    this.revokedAt = new Date()
  }
}
```

📌 Observa:

* el consentiment és **mutable**
* no és event sourcing (encara)
* suficient per MVP

---

# 4️⃣ Value Object: ConsentStatus

📄 `consent/domain/value-objects/ConsentStatus.ts`

```ts
export enum ConsentStatus {
  GRANTED = 'GRANTED',
  REVOKED = 'REVOKED'
}
```

---

# 5️⃣ Repositori de domini

📄 `consent/domain/repositories/ConsentRepository.ts`

```ts
import { Consent } from '../entities/Consent'

export interface ConsentRepository {
  save(consent: Consent): Promise<void>
  findActive(
    patientId: string,
    professionalId: string
  ): Promise<Consent | null>
}
```

---

# 6️⃣ Application: GrantConsent (cas d’ús clau)

Aquest cas:

* s’executa **quan el professional declara que té consentiment**
* no requereix pacient registrat

---

## Command

📄 `consent/application/commands/GrantConsent/GrantConsentCommand.ts`

```ts
export class GrantConsentCommand {
  constructor(
    public readonly patientId: string,
    public readonly professionalId: string
  ) {}
}
```

---

## Handler

📄 `consent/application/commands/GrantConsent/GrantConsentHandler.ts`

```ts
import { randomUUID } from 'crypto'
import { Consent } from '../../../domain/entities/Consent'
import { ConsentStatus } from '../../../domain/value-objects/ConsentStatus'
import { ConsentRepository } from '../../../domain/repositories/ConsentRepository'

export class GrantConsentHandler {
  constructor(
    private readonly consentRepo: ConsentRepository
  ) {}

  async execute(command: GrantConsentCommand): Promise<void> {
    const existing = await this.consentRepo.findActive(
      command.patientId,
      command.professionalId
    )

    if (existing) return

    const consent = new Consent(
      randomUUID(),
      command.patientId,
      command.professionalId,
      ConsentStatus.GRANTED,
      new Date(),
      null
    )

    await this.consentRepo.save(consent)
  }
}
```

📌 Important:

* idempotent
* no duplica consentiments

---

# 7️⃣ Prisma: model de dades

📄 `prisma/schema.prisma`

```prisma
model Consent {
  id             String   @id
  patientId      String
  professionalId String
  status         String
  grantedAt      DateTime
  revokedAt      DateTime?

  @@index([patientId, professionalId])
}
```

```bash
npx prisma migrate dev -n consent
```

---

# 8️⃣ Infra: PrismaConsentRepository

📄 `consent/infrastructure/prisma/PrismaConsentRepository.ts`

```ts
import { PrismaClient } from '@prisma/client'
import { ConsentRepository } from '../../domain/repositories/ConsentRepository'
import { Consent } from '../../domain/entities/Consent'
import { ConsentStatus } from '../../domain/value-objects/ConsentStatus'

export class PrismaConsentRepository implements ConsentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(consent: Consent): Promise<void> {
    await this.prisma.consent.create({
      data: {
        id: consent.id,
        patientId: consent.patientId,
        professionalId: consent.professionalId,
        status: consent.status,
        grantedAt: consent.grantedAt,
        revokedAt: consent.revokedAt
      }
    })
  }

  async findActive(patientId: string, professionalId: string) {
    const record = await this.prisma.consent.findFirst({
      where: {
        patientId,
        professionalId,
        status: ConsentStatus.GRANTED
      }
    })

    return record
      ? new Consent(
          record.id,
          record.patientId,
          record.professionalId,
          record.status as ConsentStatus,
          record.grantedAt,
          record.revokedAt
        )
      : null
  }
}
```

---

# 9️⃣ HTTP: ConsentController

📄 `consent/infrastructure/http/ConsentController.ts`

```ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../../identity/infrastructure/auth/JwtAuthGuard'
import { ProfessionalCompletedGuard } from '../../../identity/infrastructure/auth/ProfessionalCompletedGuard'
import { GrantConsentHandler } from '../../application/commands/GrantConsent/GrantConsentHandler'

@Controller('consents')
@UseGuards(JwtAuthGuard, ProfessionalCompletedGuard)
export class ConsentController {
  constructor(
    private readonly grantConsentHandler: GrantConsentHandler
  ) {}

  @Post()
  async grant(@Req() req: any, @Body() body: any) {
    await this.grantConsentHandler.execute({
      professionalId: req.user.sub,
      patientId: body.patientId
    })

    return { status: 'granted' }
  }
}
```

---

# 🔐 Punt clau d’arquitectura (molt important)

A partir d’ara:

* **Scheduling**
* **Clinical records**
* **Col·laboracions**

👉 **HAN DE COMPROVAR CONSENT**

Això es farà amb:

* Query `HasActiveConsent`
* Guard reutilitzable (`ConsentGuard`)

(encara NO el fem)

---

# ✅ Punt de control

Ara el sistema:
✔️ té pacients
✔️ registra consentiments
✔️ suporta pacients no registrats
✔️ està legalment preparat
✔️ és extensible a firma digital

---

# ⏭️ Següent pas (ordre correcte)

Ara **sí o sí** toca:

## 👉 Scheduling / Agenda (amb enforcement de consent)

Quan vulguis, **seguim** 👣

Perfecte. **Seguim amb el BC clau que converteix el producte en un ecosistema viu**:

# PAS — Invitation + Progressive Onboarding (unlock per fases)

Aquest BC **no és accessori**:
és el que permet que **pacients i professionals no registrats entrin al sistema sense fricció**.

---

# 🎯 Problema real que resol

Tenim actors que:

* **ja participen** al sistema
* però **encara no són usuaris**

Concretament:

* professionals convidats via **Collaboration**
* pacients creats per professionals
* pacients que han donat consentiment offline

👉 Necessitem:

* convidar-los
* reconèixer-los quan entren
* desbloquejar funcionalitats progressivament

---

# 1️⃣ Concepte clau: Subjecte ≠ Usuari

### Subjecte (domain concept)

* professional
* pacient
* col·laborador
* pot existir **sense compte**

### Usuari (Identity BC)

* té login
* té credencials
* té estat d’onboarding

📌 Invitation és el **pont** entre Subjecte → Usuari

---

# 2️⃣ Decisions de disseny (molt importants)

### 2.1 Invitation és un BC propi

❌ No dins Identity
❌ No dins Collaboration
✅ Agregat independent

---

### 2.2 Una invitació:

* apunta a un **rol esperat**
* pot estar lligada a:

  * Collaboration
  * Patient
* té lifecycle propi

---

# 3️⃣ Estructura del BC Invitation

📁 `backend/api/src/modules/invitation`

```text
invitation/
├── domain/
│   ├── entities/
│   │   └── Invitation.ts
│   ├── value-objects/
│   │   ├── InvitationStatus.ts
│   │   └── InvitationRole.ts
│   └── repositories/
│       └── InvitationRepository.ts
│
├── application/
│   ├── commands/
│   │   ├── CreateInvitation/
│   │   └── AcceptInvitation/
│   └── queries/
│
├── infrastructure/
│   ├── http/
│   │   └── InvitationController.ts
│   ├── prisma/
│   │   └── PrismaInvitationRepository.ts
│   └── adapters/
│       └── TokenGeneratorAdapter.ts
│
├── invitation.module.ts
└── index.ts
```

---

# 4️⃣ Domini: Invitation (agregat arrel)

📄 `invitation/domain/entities/Invitation.ts`

```ts
import { InvitationStatus } from '../value-objects/InvitationStatus'
import { InvitationRole } from '../value-objects/InvitationRole'

export class Invitation {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: InvitationRole,
    public readonly targetId: string | null,
    public status: InvitationStatus,
    public readonly token: string,
    public readonly createdAt: Date,
    public acceptedAt: Date | null
  ) {}

  accept() {
    if (this.status !== InvitationStatus.PENDING) {
      throw new Error('Invitation not pending')
    }

    this.status = InvitationStatus.ACCEPTED
    this.acceptedAt = new Date()
  }
}
```

---

# 5️⃣ Value Objects

## InvitationStatus

📄 `invitation/domain/value-objects/InvitationStatus.ts`

```ts
export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED'
}
```

## InvitationRole

📄 `invitation/domain/value-objects/InvitationRole.ts`

```ts
export enum InvitationRole {
  PROFESSIONAL_COLLABORATOR = 'PROFESSIONAL_COLLABORATOR',
  PATIENT = 'PATIENT'
}
```

---

# 6️⃣ Repository de domini

📄 `invitation/domain/repositories/InvitationRepository.ts`

```ts
import { Invitation } from '../entities/Invitation'

export interface InvitationRepository {
  save(invitation: Invitation): Promise<void>
  findByToken(token: string): Promise<Invitation | null>
}
```

---

# 7️⃣ Application: CreateInvitation

Aquest cas d’ús:

* neix des de Collaboration o Patient
* crea un **enllaç únic**
* encara **no crea usuari**

---

📄 `invitation/application/commands/CreateInvitation/CreateInvitationHandler.ts`

```ts
import { randomUUID } from 'crypto'
import { Invitation } from '../../../domain/entities/Invitation'
import { InvitationStatus } from '../../../domain/value-objects/InvitationStatus'
import { InvitationRole } from '../../../domain/value-objects/InvitationRole'
import { InvitationRepository } from '../../../domain/repositories/InvitationRepository'

export class CreateInvitationHandler {
  constructor(
    private readonly invitationRepo: InvitationRepository
  ) {}

  async execute(
    email: string,
    role: InvitationRole,
    targetId?: string
  ): Promise<Invitation> {
    const invitation = new Invitation(
      randomUUID(),
      email,
      role,
      targetId ?? null,
      InvitationStatus.PENDING,
      randomUUID(),
      new Date(),
      null
    )

    await this.invitationRepo.save(invitation)
    return invitation
  }
}
```

---

# 8️⃣ Application: AcceptInvitation

📄 `invitation/application/commands/AcceptInvitation/AcceptInvitationHandler.ts`

```ts
import { InvitationRepository } from '../../../domain/repositories/InvitationRepository'

export class AcceptInvitationHandler {
  constructor(
    private readonly invitationRepo: InvitationRepository
  ) {}

  async execute(token: string): Promise<Invitation> {
    const invitation = await this.invitationRepo.findByToken(token)

    if (!invitation) {
      throw new Error('Invalid invitation')
    }

    invitation.accept()
    await this.invitationRepo.save(invitation)

    return invitation
  }
}
```

---

# 9️⃣ Prisma: model Invitation

📄 `prisma/schema.prisma`

```prisma
model Invitation {
  id        String   @id
  email     String
  role      String
  targetId  String?
  status    String
  token     String   @unique
  createdAt DateTime
  acceptedAt DateTime?
}
```

```bash
npx prisma migrate dev -n invitation
```

---

# 🔓 10️⃣ Progressive Unlock (clau UX + tècnica)

Ara la **part crítica**.

## 10.1 Estat d’onboarding (Identity)

```ts
enum OnboardingState {
  NONE
  BASIC
  PROFESSIONAL_COMPLETED
  PATIENT_COMPLETED
}
```

---

## 10.2 Acceptar invitació → estat parcial

| Rol convidat | Estat inicial |
| ------------ | ------------- |
| Professional | BASIC         |
| Patient      | BASIC         |

👉 L’usuari:

* pot entrar
* veu **només** el context rellevant
* NO veu tot el sistema

---

## 10.3 Guards basats en capability

```ts
@UseGuards(JwtAuthGuard, RequiresCapability('COLLABORATE'))
```

Capabilities:

* `VIEW_PATIENT`
* `CREATE_APPOINTMENT`
* `COLLABORATE`
* `ACCESS_CLINICAL_DATA`

Aquestes depenen de:

* rol
* onboardingState
* invitacions acceptades

---

# 11️⃣ HTTP Controller

📄 `invitation/infrastructure/http/InvitationController.ts`

```ts
import { Controller, Post, Body } from '@nestjs/common'
import { AcceptInvitationHandler } from '../../application/commands/AcceptInvitation/AcceptInvitationHandler'

@Controller('invitations')
export class InvitationController {
  constructor(
    private readonly acceptInvitationHandler: AcceptInvitationHandler
  ) {}

  @Post('accept')
  async accept(@Body() body: any) {
    const invitation =
      await this.acceptInvitationHandler.execute(body.token)

    return {
      status: 'accepted',
      role: invitation.role
    }
  }
}
```

---

# ✅ Punt de control (estratègic)

Ara el sistema:

✔️ Permet convidar sense registre
✔️ Captura professionals externs
✔️ Captura pacients reals
✔️ Aplica progressive unlock
✔️ Evita onboarding pesat inicial

👉 **Això és arquitectura orientada a creixement.**

---

# ⏭️ Següent pas (ordre natural)

Ara toca **baixar això a UX real**:

### 👉 UX Flows detallats:

1️⃣ Professional convidat
2️⃣ Pacient convidat
3️⃣ Unlock progressiu
4️⃣ Conversió a usuari complet

Quan vulguis, **seguim amb UX flows detallats** 👣


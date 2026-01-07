Perfecte. **Seguim sense saltar cap pas** i mantenint el fil correcte.

👉 Ara mateix tenim:

* usuaris registrats
* autenticació
* JWT
* endpoints protegibles

Però **encara no sabem QUÈ és aquest usuari dins del sistema**.
Això és el coll d’ampolla real per:

* permisos
* UX
* roadmap
* comercial

Així que toca exactament això:

# PAS SEGÜENT — ProfessionalProfile + onboarding progressiu

Aquest pas és **estructural**. Si el fem bé, tot el “progressive unlock”, col·laboracions i consentiments encaixarà després sense hacks.

---

# 🎯 Objectiu d’aquest pas

* Un `User` pot o no tenir perfil professional
* El perfil professional té **estat d’onboarding**
* El sistema pot:

  * deixar entrar parcialment
  * bloquejar accions avançades
  * guiar el següent pas

👉 **Encara NO parlem de permisos ni roles complexos**

---

# 1️⃣ Model de domini: ProfessionalProfile

📁 `identity/domain/entities/ProfessionalProfile.ts`

```ts
export enum ProfessionalOnboardingStatus {
  INVITED = 'INVITED',
  BASIC_INFO = 'BASIC_INFO',
  VERIFIED = 'VERIFIED',
  COMPLETED = 'COMPLETED'
}

export class ProfessionalProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly fullName: string | null,
    public readonly specialtyCode: string | null,
    public readonly onboardingStatus: ProfessionalOnboardingStatus,
    public readonly createdAt: Date
  ) {}

  canCreatePatients(): boolean {
    return this.onboardingStatus === ProfessionalOnboardingStatus.COMPLETED
  }
}
```

📌 Decisions clau:

* El perfil pot existir **incomplet**
* L’estat governa capacitats
* El domini ja sap dir “pots o no pots”

---

# 2️⃣ Repositori de domini

📄 `identity/domain/repositories/ProfessionalProfileRepository.ts`

```ts
import { ProfessionalProfile } from '../entities/ProfessionalProfile'

export interface ProfessionalProfileRepository {
  findByUserId(userId: string): Promise<ProfessionalProfile | null>
  save(profile: ProfessionalProfile): Promise<void>
}
```

---

# 3️⃣ Prisma: persistència

📄 `prisma/schema.prisma`

```prisma
model ProfessionalProfile {
  id               String   @id
  userId           String   @unique
  fullName         String?
  specialtyCode    String?
  onboardingStatus String
  createdAt        DateTime

  user User @relation(fields: [userId], references: [id])
}
```

```bash
npx prisma migrate dev -n professional_profile
```

---

# 4️⃣ Infra: PrismaProfessionalProfileRepository

📄 `identity/infrastructure/prisma/PrismaProfessionalProfileRepository.ts`

```ts
import { PrismaClient } from '@prisma/client'
import { ProfessionalProfile, ProfessionalOnboardingStatus } from '../../domain/entities/ProfessionalProfile'
import { ProfessionalProfileRepository } from '../../domain/repositories/ProfessionalProfileRepository'

export class PrismaProfessionalProfileRepository
  implements ProfessionalProfileRepository {

  constructor(private readonly prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<ProfessionalProfile | null> {
    const record = await this.prisma.professionalProfile.findUnique({
      where: { userId }
    })

    if (!record) return null

    return new ProfessionalProfile(
      record.id,
      record.userId,
      record.fullName,
      record.specialtyCode,
      record.onboardingStatus as ProfessionalOnboardingStatus,
      record.createdAt
    )
  }

  async save(profile: ProfessionalProfile): Promise<void> {
    await this.prisma.professionalProfile.upsert({
      where: { userId: profile.userId },
      update: {
        fullName: profile.fullName,
        specialtyCode: profile.specialtyCode,
        onboardingStatus: profile.onboardingStatus
      },
      create: {
        id: profile.id,
        userId: profile.userId,
        fullName: profile.fullName,
        specialtyCode: profile.specialtyCode,
        onboardingStatus: profile.onboardingStatus,
        createdAt: profile.createdAt
      }
    })
  }
}
```

---

# 5️⃣ Application: iniciar onboarding professional

Quan un usuari decideix “soc professional”.

---

## Command

📄 `identity/application/commands/StartProfessionalOnboarding/StartProfessionalOnboardingCommand.ts`

```ts
export class StartProfessionalOnboardingCommand {
  constructor(
    public readonly userId: string
  ) {}
}
```

---

## Handler

📄 `identity/application/commands/StartProfessionalOnboarding/StartProfessionalOnboardingHandler.ts`

```ts
import { randomUUID } from 'crypto'
import {
  ProfessionalProfile,
  ProfessionalOnboardingStatus
} from '../../../domain/entities/ProfessionalProfile'
import { ProfessionalProfileRepository } from '../../../domain/repositories/ProfessionalProfileRepository'

export class StartProfessionalOnboardingHandler {
  constructor(
    private readonly profileRepo: ProfessionalProfileRepository
  ) {}

  async execute(command: StartProfessionalOnboardingCommand): Promise<void> {
    const existing = await this.profileRepo.findByUserId(command.userId)
    if (existing) return

    const profile = new ProfessionalProfile(
      randomUUID(),
      command.userId,
      null,
      null,
      ProfessionalOnboardingStatus.BASIC_INFO,
      new Date()
    )

    await this.profileRepo.save(profile)
  }
}
```

📌 Important:

* idempotent
* permet fluxos “entra / surt / torna”

---

# 6️⃣ HTTP: exposar onboarding

📄 `identity/infrastructure/http/ProfessionalOnboardingController.ts`

```ts
import { Controller, Post, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/JwtAuthGuard'
import { StartProfessionalOnboardingHandler } from '../../application/commands/StartProfessionalOnboarding/StartProfessionalOnboardingHandler'

@Controller('professional/onboarding')
@UseGuards(JwtAuthGuard)
export class ProfessionalOnboardingController {
  constructor(
    private readonly startHandler: StartProfessionalOnboardingHandler
  ) {}

  @Post('start')
  async start(@Req() req: any) {
    await this.startHandler.execute({
      userId: req.user.sub
    })

    return { status: 'started' }
  }
}
```

---

# 7️⃣ Guards basats en onboarding (primer “progressive unlock”)

📄 `identity/infrastructure/auth/ProfessionalCompletedGuard.ts`

```ts
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { ProfessionalProfileRepository } from '../../domain/repositories/ProfessionalProfileRepository'
import { ProfessionalOnboardingStatus } from '../../domain/entities/ProfessionalProfile'

export class ProfessionalCompletedGuard implements CanActivate {
  constructor(
    private readonly profileRepo: ProfessionalProfileRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const userId = req.user.sub

    const profile = await this.profileRepo.findByUserId(userId)
    if (!profile) return false

    return profile.onboardingStatus === ProfessionalOnboardingStatus.COMPLETED
  }
}
```

👉 Aquest guard serà **la clau del sistema sencer**.

---

# 8️⃣ UX directe que això permet

Ara el frontend pot:

* saber si l’usuari:

  * no és professional
  * està a mig onboarding
  * està complet
* mostrar CTA contextuals
* desbloquejar pantalles progressivament

---

# ✅ Punt de control (molt important)

Ara ja tens:

✔️ Identitat
✔️ Autenticació
✔️ Usuari genèric
✔️ Perfil professional opcional
✔️ Estat d’onboarding
✔️ Base real de “progressive unlock”

👉 **A partir d’aquí, tot flueix naturalment.**

---

# ⏭️ Següent pas (ordre correcte)

Ara toca **Patient BC**, perquè:

* un professional incomplet **NO** pot crear pacients
* un professional complet **SÍ**
* el domini ja ho sap decidir

Opcions immediates:
1️⃣ Crear `Patient BC` (MVP real)
2️⃣ Completar onboarding (fullName + specialty)
3️⃣ Afegir invitacions professionals (pre-onboarding)
4️⃣ Introduir consentiments mínims

Digues quin i **seguim pas a pas** 👣

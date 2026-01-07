Perfecte. Aquest és **un dels BC més importants del sistema**, així que anirem **molt fins**, sense shortcuts.

<br />

<br />

# BC 4 — **Membership**

### (Professional ↔ Organization)

> Aquest BC defineix **la relació contractual / operativa** entre un professional i una organització.

És:

* el **pont entre BCs**
* on apareix l’**autorització contextual**
* la base de permisos reals

<br />

## 🎯 Responsabilitat del BC

Inclou:

* Membresia d’un professional en una organització
* Rol funcional dins l’organització
* Estat (pending, active, revoked)
* Dates d’alta / baixa
* Invitacions

No inclou:

* Identitat (IAM)
* Perfil professional
* Organització (només referències per ID)
* Permisos tècnics globals

<br />

## 🔗 Relacions entre BCs

| BC origen            | Referència       |
| -------------------- | ---------------- |
| IAM                  | `userId`         |
| Professional Profile | `professionalId` |
| Organization         | `organizationId` |

➡️ **Aquest BC és el lloc correcte per l’ACL (Access Control Layer)**

<br />

## 📦 Estructura de carpetes

```txt
membership/
├── domain/
│   ├── aggregates/
│   │   └── Membership/
│   │       ├── Membership.ts
│   │       ├── MembershipId.ts
│   │       └── MembershipStatus.ts
│   ├── value-objects/
│   │   ├── MembershipRole.ts
│   │   └── MembershipPeriod.ts
│   ├── repositories/
│   │   └── MembershipRepository.ts
│   ├── events/
│   │   ├── MemberInvited.ts
│   │   ├── MemberActivated.ts
│   │   └── MemberRevoked.ts
│   └── policies/
│       └── MembershipActivationPolicy.ts
│
├── application/
│   ├── commands/
│   │   ├── InviteMember/
│   │   ├── ActivateMember/
│   │   └── RevokeMember/
│   ├── queries/
│   │   └── GetOrganizationMembers/
│   └── dtos/
│       └── MembershipDTO.ts
│
├── infrastructure/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── repositories/
│   │       └── PrismaMembershipRepository.ts
│   └── mappers/
│       └── MembershipMapper.ts
│
└── index.ts
```

<br />

## 🧠 Domain Layer

### Aggregate Root — Membership

#### `domain/aggregates/Membership/Membership.ts`

```ts
import { MembershipId } from './MembershipId'
import { MembershipStatus } from './MembershipStatus'
import { MembershipRole } from '../../value-objects/MembershipRole'
import { MembershipPeriod } from '../../value-objects/MembershipPeriod'

export class Membership {
  constructor(
    readonly id: MembershipId,
    readonly organizationId: string,
    readonly professionalId: string,
    private role: MembershipRole,
    private status: MembershipStatus,
    private period: MembershipPeriod
  ) {}

  activate() {
    if (!this.status.canActivate()) {
      throw new Error('Membership cannot be activated')
    }
    this.status = MembershipStatus.Active()
    this.period.activateNow()
  }

  revoke() {
    this.status = MembershipStatus.Revoked()
    this.period.endNow()
  }

  isActive(): boolean {
    return this.status.isActive()
  }

  getRole(): MembershipRole {
    return this.role
  }
}
```

<br />

### MembershipStatus

#### `domain/aggregates/Membership/MembershipStatus.ts`

```ts
export class MembershipStatus {
  private constructor(
    private readonly value: 'INVITED' | 'ACTIVE' | 'REVOKED'
  ) {}

  static Invited() {
    return new MembershipStatus('INVITED')
  }

  static Active() {
    return new MembershipStatus('ACTIVE')
  }

  static Revoked() {
    return new MembershipStatus('REVOKED')
  }

  canActivate(): boolean {
    return this.value === 'INVITED'
  }

  isActive(): boolean {
    return this.value === 'ACTIVE'
  }

  toString() {
    return this.value
  }
}
```

<br />

## 🧩 Value Objects

### MembershipRole

#### `domain/value-objects/MembershipRole.ts`

```ts
export class MembershipRole {
  private constructor(
    readonly value: 'OWNER' | 'ADMIN' | 'PROFESSIONAL' | 'ASSISTANT'
  ) {}

  static Owner() {
    return new MembershipRole('OWNER')
  }

  static Admin() {
    return new MembershipRole('ADMIN')
  }

  static Professional() {
    return new MembershipRole('PROFESSIONAL')
  }

  static Assistant() {
    return new MembershipRole('ASSISTANT')
  }
}
```

<br />

### MembershipPeriod

#### `domain/value-objects/MembershipPeriod.ts`

```ts
export class MembershipPeriod {
  private constructor(
    private startAt: Date | null,
    private endAt: Date | null
  ) {}

  static invited() {
    return new MembershipPeriod(null, null)
  }

  activateNow() {
    this.startAt = new Date()
  }

  endNow() {
    this.endAt = new Date()
  }
}
```

<br />

## 📄 Repository (contracte)

#### `domain/repositories/MembershipRepository.ts`

```ts
import { Membership } from '../aggregates/Membership/Membership'

export interface MembershipRepository {
  save(membership: Membership): Promise<void>
  findByOrganization(orgId: string): Promise<Membership[]>
}
```

<br />

## 🚀 Application Layer

### Command — InviteMember

#### `application/commands/InviteMember/InviteMemberCommand.ts`

```ts
export class InviteMemberCommand {
  constructor(
    public readonly organizationId: string,
    public readonly professionalId: string,
    public readonly role: 'ADMIN' | 'PROFESSIONAL' | 'ASSISTANT'
  ) {}
}
```

#### `application/commands/InviteMember/InviteMemberHandler.ts`

```ts
import { Membership } from '../../../domain/aggregates/Membership/Membership'
import { MembershipId } from '../../../domain/aggregates/Membership/MembershipId'
import { MembershipStatus } from '../../../domain/aggregates/Membership/MembershipStatus'
import { MembershipRole } from '../../../domain/value-objects/MembershipRole'
import { MembershipPeriod } from '../../../domain/value-objects/MembershipPeriod'

export class InviteMemberHandler {
  constructor(private readonly repository: MembershipRepository) {}

  async execute(command: InviteMemberCommand) {
    const membership = new Membership(
      MembershipId.generate(),
      command.organizationId,
      command.professionalId,
      MembershipRole[command.role](),
      MembershipStatus.Invited(),
      MembershipPeriod.invited()
    )

    await this.repository.save(membership)
  }
}
```

<br />

## 🧱 Infrastructure — Prisma

#### `infrastructure/prisma/schema.prisma`

```prisma
model Membership {
  id              String   @id
  organizationId  String
  professionalId  String
  role            String
  status          String
  startAt         DateTime?
  endAt           DateTime?

  @@unique([organizationId, professionalId])
}
```

<br />

### Prisma Repository

#### `infrastructure/prisma/repositories/PrismaMembershipRepository.ts`

```ts
export class PrismaMembershipRepository implements MembershipRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(m: Membership): Promise<void> {
    await this.prisma.membership.upsert({
      where: { id: m.id.value },
      update: {
        role: m.getRole().value,
        status: m.status.toString(),
        startAt: m.period.startAt,
        endAt: m.period.endAt
      },
      create: {
        id: m.id.value,
        organizationId: m.organizationId,
        professionalId: m.professionalId,
        role: m.getRole().value,
        status: m.status.toString()
      }
    })
  }
}
```

<br />

## 🔐 Autorització contextual (clau)

A partir d’aquí:

* IAM → autentica
* Membership → autoritza **en context**

Exemple:

```txt
user X
→ professional Y
→ membership Z
→ organization A
→ role ADMIN
```

Això alimentarà:

* Policies
* Guards (NestJS)
* Scopes JWT contextuals

<br />

## ✔️ Decisions clau

* Membership com a **Aggregate Root**
* Estat + període explícits
* Un professional pot estar a múltiples organitzacions
* Rols contextuals ≠ rols IAM
* Base sòlida per ACL

<br />

## ➡️ Següent BC (ja entrem en “power features”)

Opcions recomanades:

1. **Authorization / Policy Engine** (RBAC + ABAC)
2. **Scheduling / Agenda**
3. **Patient / Client Management**

Digues quin i continuem.

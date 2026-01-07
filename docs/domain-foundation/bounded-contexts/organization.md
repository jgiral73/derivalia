Perfecte. Continuem de forma **ordenada i acumulativa**, sense saltar cap decisió prèvia.

El següent BC **estructuralment imprescindible** és:

<br />

<br />

# BC 3 — **Organization / Tenant**

> Aquest BC introdueix el **multi-tenant real**
> Defineix *on* treballen els professionals, no *qui* són ni *què* poden fer.

<br />

## 🎯 Responsabilitat del BC

Inclou:

* Organització / Centre / Clínica
* Tipus d’organització
* Estat (activa, suspesa)
* Propietari (owner)
* Configuració bàsica del tenant

No inclou:

* Membres (vindrà en un BC separat)
* Permisos
* Dades clíniques
* Facturació (possible BC futur)

<br />

## 🔗 Relacions amb altres BCs

* **IAM** → `UserId` (owner)
* **Professional Profile** → encara **NO directe**
* **Membership BC** (següent) farà el pont

➡️ Aquest BC és **context boundary claríssim**

<br />

## 📦 Estructura de carpetes

```txt
organization/
├── domain/
│   ├── aggregates/
│   │   └── Organization/
│   │       ├── Organization.ts
│   │       ├── OrganizationId.ts
│   │       └── OrganizationStatus.ts
│   ├── value-objects/
│   │   ├── OrganizationName.ts
│   │   └── OrganizationType.ts
│   ├── repositories/
│   │   └── OrganizationRepository.ts
│   ├── events/
│   │   ├── OrganizationCreated.ts
│   │   └── OrganizationActivated.ts
│   └── policies/
│       └── OrganizationActivationPolicy.ts
│
├── application/
│   ├── commands/
│   │   ├── CreateOrganization/
│   │   ├── ActivateOrganization/
│   │   └── SuspendOrganization/
│   ├── queries/
│   │   └── GetOrganization/
│   └── dtos/
│       └── OrganizationDTO.ts
│
├── infrastructure/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── repositories/
│   │       └── PrismaOrganizationRepository.ts
│   └── mappers/
│       └── OrganizationMapper.ts
│
└── index.ts
```

<br />

## 🧠 Domain Layer

### Aggregate Root — Organization

#### `domain/aggregates/Organization/Organization.ts`

```ts
import { OrganizationId } from './OrganizationId'
import { OrganizationStatus } from './OrganizationStatus'
import { OrganizationName } from '../../value-objects/OrganizationName'
import { OrganizationType } from '../../value-objects/OrganizationType'

export class Organization {
  constructor(
    readonly id: OrganizationId,
    readonly ownerUserId: string,
    private name: OrganizationName,
    private type: OrganizationType,
    private status: OrganizationStatus
  ) {}

  activate() {
    if (!this.status.canActivate()) {
      throw new Error('Organization cannot be activated')
    }
    this.status = OrganizationStatus.Active()
  }

  suspend() {
    this.status = OrganizationStatus.Suspended()
  }

  isActive(): boolean {
    return this.status.isActive()
  }
}
```

<br />

### OrganizationStatus (estat explícit)

#### `domain/aggregates/Organization/OrganizationStatus.ts`

```ts
export class OrganizationStatus {
  private constructor(
    private readonly value: 'DRAFT' | 'ACTIVE' | 'SUSPENDED'
  ) {}

  static Draft() {
    return new OrganizationStatus('DRAFT')
  }

  static Active() {
    return new OrganizationStatus('ACTIVE')
  }

  static Suspended() {
    return new OrganizationStatus('SUSPENDED')
  }

  isActive(): boolean {
    return this.value === 'ACTIVE'
  }

  canActivate(): boolean {
    return this.value === 'DRAFT'
  }

  toString() {
    return this.value
  }
}
```

<br />

## 🧩 Value Objects

#### `domain/value-objects/OrganizationName.ts`

```ts
export class OrganizationName {
  private constructor(readonly value: string) {}

  static create(value: string): OrganizationName {
    if (value.trim().length < 2) {
      throw new Error('Organization name too short')
    }
    return new OrganizationName(value)
  }
}
```

#### `domain/value-objects/OrganizationType.ts`

```ts
export class OrganizationType {
  private constructor(
    readonly value: 'CLINIC' | 'CENTER' | 'PRIVATE_PRACTICE'
  ) {}

  static Clinic() {
    return new OrganizationType('CLINIC')
  }

  static Center() {
    return new OrganizationType('CENTER')
  }

  static PrivatePractice() {
    return new OrganizationType('PRIVATE_PRACTICE')
  }
}
```

<br />

## 📄 Repository (contracte)

#### `domain/repositories/OrganizationRepository.ts`

```ts
import { Organization } from '../aggregates/Organization/Organization'
import { OrganizationId } from '../aggregates/Organization/OrganizationId'

export interface OrganizationRepository {
  save(org: Organization): Promise<void>
  findById(id: OrganizationId): Promise<Organization | null>
}
```

<br />

## 🚀 Application Layer

### Command — CreateOrganization

#### `application/commands/CreateOrganization/CreateOrganizationCommand.ts`

```ts
export class CreateOrganizationCommand {
  constructor(
    public readonly ownerUserId: string,
    public readonly name: string,
    public readonly type: 'CLINIC' | 'CENTER' | 'PRIVATE_PRACTICE'
  ) {}
}
```

#### `application/commands/CreateOrganization/CreateOrganizationHandler.ts`

```ts
import { Organization } from '../../../domain/aggregates/Organization/Organization'
import { OrganizationId } from '../../../domain/aggregates/Organization/OrganizationId'
import { OrganizationName } from '../../../domain/value-objects/OrganizationName'
import { OrganizationType } from '../../../domain/value-objects/OrganizationType'
import { OrganizationStatus } from '../../../domain/aggregates/Organization/OrganizationStatus'

export class CreateOrganizationHandler {
  constructor(private readonly repository: OrganizationRepository) {}

  async execute(command: CreateOrganizationCommand) {
    const organization = new Organization(
      OrganizationId.generate(),
      command.ownerUserId,
      OrganizationName.create(command.name),
      OrganizationType[command.type](),
      OrganizationStatus.Draft()
    )

    await this.repository.save(organization)
  }
}
```

<br />

## 🧱 Infrastructure — Prisma

#### `infrastructure/prisma/schema.prisma`

```prisma
model Organization {
  id          String @id
  ownerUserId String
  name        String
  type        String
  status      String
}
```

<br />

### Prisma Repository

#### `infrastructure/prisma/repositories/PrismaOrganizationRepository.ts`

```ts
export class PrismaOrganizationRepository implements OrganizationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(org: Organization): Promise<void> {
    await this.prisma.organization.upsert({
      where: { id: org.id.value },
      update: {
        name: org.name.value,
        type: org.type.value,
        status: org.status.toString()
      },
      create: {
        id: org.id.value,
        ownerUserId: org.ownerUserId,
        name: org.name.value,
        type: org.type.value,
        status: org.status.toString()
      }
    })
  }
}
```

<br />

## 🔁 Events

Aquest BC emet:

* `OrganizationCreated`
* `OrganizationActivated`
* `OrganizationSuspended`

➡️ El **Membership BC** els consumirà

<br />

## ✔️ Decisions clau

* Organització com a **Aggregate Root fort**
* Owner ≠ membres
* Estat explícit (lifecycle controlat)
* Preparat per SaaS multi-tenant real
* Zero dependència cap a clínic

<br />

## ➡️ Següent BC (crític)

Ara toca el **pont entre dominis**:

### 👉 **BC 4 — Membership (Professional ↔ Organization)**

Aquest BC:

* Defineix qui pertany a on
* Amb quin rol
* En quin estat

Quan vulguis, continuem amb **Membership** (és dels més delicats i interessants).

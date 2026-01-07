Perfecte. Continuo **de manera sistemàtica**, mantenint **DDD estricte**, i **cada bloc de codi va precedit del path exacte del fitxer**.

Seguim amb el BC naturalment adjacent a IAM:

<br />

<br />

# BC 2 — **Professional Profile**

> Aquest BC representa **la identitat professional** (metge, terapeuta, nutricionista, etc.)
> És **negoci pur**, separat completament d’Identity & Access.

<br />

## 🎯 Responsabilitat del BC

Inclou:

* Perfil professional
* Tipus de professional
* Estat de verificació
* Especialitats
* Relació amb l’usuari IAM (per `userId`)

No inclou:

* Login / password
* Rols tècnics
* Organitzacions (vindran després)

<br />

## 🔗 Relació amb IAM (clau DDD)

* **IAM emet**: `UserRegistered`
* **Professional Profile reacciona**: crea un perfil buit o “draft”

➡️ **No hi ha FK directa de domini**, només IDs

<br />

## 📦 Estructura de carpetes

```txt
professional-profile/
├── domain/
│   ├── aggregates/
│   │   └── Professional/
│   │       ├── Professional.ts
│   │       ├── ProfessionalId.ts
│   │       └── VerificationStatus.ts
│   ├── value-objects/
│   │   ├── FullName.ts
│   │   ├── LicenseNumber.ts
│   │   └── Specialty.ts
│   ├── repositories/
│   │   └── ProfessionalRepository.ts
│   ├── events/
│   │   ├── ProfessionalCreated.ts
│   │   └── ProfessionalVerified.ts
│   └── policies/
│       └── VerificationPolicy.ts
│
├── application/
│   ├── commands/
│   │   ├── CreateProfessionalProfile/
│   │   ├── CompleteProfessionalProfile/
│   │   └── VerifyProfessional/
│   ├── queries/
│   │   └── GetProfessionalProfile/
│   └── dtos/
│       └── ProfessionalDTO.ts
│
├── infrastructure/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── repositories/
│   │       └── PrismaProfessionalRepository.ts
│   └── mappers/
│       └── ProfessionalMapper.ts
│
└── index.ts
```

<br />

## 🧠 Domain Layer

### Aggregate Root — Professional

#### `domain/aggregates/Professional/Professional.ts`

```ts
import { ProfessionalId } from './ProfessionalId'
import { VerificationStatus } from './VerificationStatus'
import { FullName } from '../../value-objects/FullName'
import { LicenseNumber } from '../../value-objects/LicenseNumber'
import { Specialty } from '../../value-objects/Specialty'

export class Professional {
  private specialties: Specialty[] = []

  constructor(
    readonly id: ProfessionalId,
    readonly userId: string, // ve d’IAM
    private fullName: FullName | null,
    private licenseNumber: LicenseNumber | null,
    private verificationStatus: VerificationStatus
  ) {}

  completeProfile(
    fullName: FullName,
    licenseNumber: LicenseNumber,
    specialties: Specialty[]
  ) {
    this.fullName = fullName
    this.licenseNumber = licenseNumber
    this.specialties = specialties
  }

  verify() {
    if (!this.licenseNumber) {
      throw new Error('Cannot verify without license')
    }
    this.verificationStatus = VerificationStatus.Verified()
  }

  isVerified(): boolean {
    return this.verificationStatus.isVerified()
  }
}
```

<br />

### VerificationStatus (estat explícit, no boolean)

#### `domain/aggregates/Professional/VerificationStatus.ts`

```ts
export class VerificationStatus {
  private constructor(private readonly value: 'PENDING' | 'VERIFIED' | 'REJECTED') {}

  static Pending() {
    return new VerificationStatus('PENDING')
  }

  static Verified() {
    return new VerificationStatus('VERIFIED')
  }

  static Rejected() {
    return new VerificationStatus('REJECTED')
  }

  isVerified(): boolean {
    return this.value === 'VERIFIED'
  }

  toString() {
    return this.value
  }
}
```

<br />

## 🧩 Value Objects

#### `domain/value-objects/FullName.ts`

```ts
export class FullName {
  private constructor(readonly value: string) {}

  static create(value: string): FullName {
    if (value.trim().length < 3) {
      throw new Error('Invalid full name')
    }
    return new FullName(value)
  }
}
```

#### `domain/value-objects/LicenseNumber.ts`

```ts
export class LicenseNumber {
  private constructor(readonly value: string) {}

  static create(value: string): LicenseNumber {
    if (!value.match(/^[A-Z0-9-]+$/)) {
      throw new Error('Invalid license number')
    }
    return new LicenseNumber(value)
  }
}
```

#### `domain/value-objects/Specialty.ts`

```ts
export class Specialty {
  private constructor(readonly value: string) {}

  static create(value: string): Specialty {
    return new Specialty(value.toLowerCase())
  }
}
```

<br />

## 📄 Repository (contracte)

#### `domain/repositories/ProfessionalRepository.ts`

```ts
import { Professional } from '../aggregates/Professional/Professional'

export interface ProfessionalRepository {
  save(profile: Professional): Promise<void>
  findByUserId(userId: string): Promise<Professional | null>
}
```

<br />

## 🚀 Application Layer

### Command — CreateProfessionalProfile

#### `application/commands/CreateProfessionalProfile/CreateProfessionalProfileCommand.ts`

```ts
export class CreateProfessionalProfileCommand {
  constructor(public readonly userId: string) {}
}
```

#### `application/commands/CreateProfessionalProfile/CreateProfessionalProfileHandler.ts`

```ts
import { Professional } from '../../../domain/aggregates/Professional/Professional'
import { ProfessionalId } from '../../../domain/aggregates/Professional/ProfessionalId'
import { VerificationStatus } from '../../../domain/aggregates/Professional/VerificationStatus'

export class CreateProfessionalProfileHandler {
  constructor(private readonly repository: ProfessionalRepository) {}

  async execute(command: CreateProfessionalProfileCommand) {
    const profile = new Professional(
      ProfessionalId.generate(),
      command.userId,
      null,
      null,
      VerificationStatus.Pending()
    )

    await this.repository.save(profile)
  }
}
```

👉 Normalment aquest handler es crida **des d’un listener d’event** (`UserRegistered`).

<br />

## 🧱 Infrastructure — Prisma

#### `infrastructure/prisma/schema.prisma`

```prisma
model Professional {
  id                String   @id
  userId            String   @unique
  fullName          String?
  licenseNumber     String?
  verificationState String
  specialties       String[]
}
```

<br />

### Prisma Repository

#### `infrastructure/prisma/repositories/PrismaProfessionalRepository.ts`

```ts
export class PrismaProfessionalRepository implements ProfessionalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(profile: Professional): Promise<void> {
    await this.prisma.professional.upsert({
      where: { userId: profile.userId },
      update: {
        fullName: profile.fullName?.value,
        licenseNumber: profile.licenseNumber?.value,
        verificationState: profile.verificationStatus.toString(),
        specialties: profile.specialties.map(s => s.value)
      },
      create: {
        id: profile.id.value,
        userId: profile.userId,
        verificationState: profile.verificationStatus.toString(),
        specialties: []
      }
    })
  }
}
```

<br />

## 🔁 Events inter-BC

Aquest BC:

* **Consumeix**: `UserRegistered`
* **Emet**:

  * `ProfessionalCreated`
  * `ProfessionalVerified`

➡️ Aquests events seran clau per:

* Organization BC
* Scheduling
* Marketplace / Directory

<br />

## ✔️ Decisions clau

* Perfil professional ≠ usuari
* Estat explícit (no flags)
* Dades incompletes permeses
* Preparat per verificació manual o automàtica
* Totalment desacoblat d’IAM

<br />

## ➡️ Següent BC (ordre recomanat)

1. **Organization / Tenant**
2. **Membership (Professional ↔ Organization)**
3. **Authorization contextual (scopes per organització)**

Digues quin i continuem amb **el mateix nivell quirúrgic**.

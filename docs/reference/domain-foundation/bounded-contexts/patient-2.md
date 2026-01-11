Perfecte. Entrem al **PAS 4**, que és **nucli de domini pur** i condiciona Scheduling, Treatment i Derivacions.

Anirem en aquest ordre (sense saltar passos):

1️⃣ Què és **Patient BC** i què NO és
2️⃣ Decisions de model (claus)
3️⃣ Agregat `Patient`
4️⃣ Relació Professional ↔ Patient **sense tractament**
5️⃣ Tractament com agregat separat (preparació pel PAS 5)
6️⃣ Derivacions (enllaç conceptual, no implementació completa encara)

<br />

<br />

# PAS 4 — Patient BC (modelatge DDD)


## 4️⃣1️⃣ Responsabilitat del Patient BC

### ✅ El que SÍ fa

* Identitat clínica del pacient
* Dades personals
* Estat (actiu / inactiu)
* Vinculacions *clíniques* (no contractuals)

### ❌ El que NO fa

* No agenda cites
* No decideix permisos
* No gestiona professionals
* No conté tractaments

👉 **Patient NO és la relació**, és **l’entitat clínica**

<br />

## 4️⃣2️⃣ Ubicació i estructura del BC

📁 **backend/apps/api/modules/patient**

```txt
modules/patient/
├── domain/
│   ├── aggregates/
│   │   └── Patient.ts
│   ├── value-objects/
│   │   ├── PatientId.ts
│   │   ├── PersonalData.ts
│   │   └── ContactInfo.ts
│   ├── repositories/
│   │   └── PatientRepository.ts
│   └── events/
│       └── PatientCreated.ts
│
├── application/
│   ├── commands/
│   │   └── CreatePatient/
│   │       ├── CreatePatientCommand.ts
│   │       └── CreatePatientHandler.ts
│   ├── queries/
│   │   └── GetPatientById/
│   └── dtos/
│       └── PatientDTO.ts
│
├── infrastructure/
│   ├── http/
│   │   └── PatientController.ts
│   ├── prisma/
│   │   └── PrismaPatientRepository.ts
│   └── mappers/
│       └── PatientMapper.ts
│
├── patient.module.ts
└── index.ts
```

<br />

## 4️⃣3️⃣ Agregat `Patient`

📁 `domain/aggregates/Patient.ts`

```ts
import { PatientId } from '../value-objects/PatientId'
import { PersonalData } from '../value-objects/PersonalData'
import { ContactInfo } from '../value-objects/ContactInfo'

export class Patient {
  private constructor(
    public readonly id: PatientId,
    private personalData: PersonalData,
    private contactInfo: ContactInfo,
    private active: boolean
  ) {}

  static create(
    id: PatientId,
    personalData: PersonalData,
    contactInfo: ContactInfo
  ): Patient {
    return new Patient(id, personalData, contactInfo, true)
  }

  deactivate() {
    this.active = false
  }

  isActive(): boolean {
    return this.active
  }

  updateContactInfo(contactInfo: ContactInfo) {
    this.contactInfo = contactInfo
  }
}
```

🔑 Observacions clau:

* **Cap referència a professional**
* **Cap referència a organització**
* **Cap referència a tractament**

➡️ Això és intencional.

<br />

## 4️⃣4️⃣ Value Objects

### `domain/value-objects/PersonalData.ts`

```ts
export class PersonalData {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly birthDate?: Date
  ) {
    if (!firstName || !lastName) {
      throw new Error('Invalid personal data')
    }
  }
}
```

<br />

### `domain/value-objects/ContactInfo.ts`

```ts
export class ContactInfo {
  constructor(
    public readonly email?: string,
    public readonly phone?: string
  ) {}
}
```

<br />

## 4️⃣5️⃣ Repositori (port)

📁 `domain/repositories/PatientRepository.ts`

```ts
import { Patient } from '../aggregates/Patient'
import { PatientId } from '../value-objects/PatientId'

export interface PatientRepository {
  save(patient: Patient): Promise<void>
  findById(id: PatientId): Promise<Patient | null>
}
```

<br />

## 4️⃣6️⃣ Command: Create Patient

📁 `application/commands/CreatePatient/CreatePatientCommand.ts`

```ts
export class CreatePatientCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly birthDate?: Date,
    public readonly email?: string,
    public readonly phone?: string
  ) {}
}
```

<br />

📁 `application/commands/CreatePatient/CreatePatientHandler.ts`

```ts
import { PatientRepository } from '../../../domain/repositories/PatientRepository'
import { Patient } from '../../../domain/aggregates/Patient'
import { PatientId } from '../../../domain/value-objects/PatientId'
import { PersonalData } from '../../../domain/value-objects/PersonalData'
import { ContactInfo } from '../../../domain/value-objects/ContactInfo'

export class CreatePatientHandler {
  constructor(
    private readonly repository: PatientRepository
  ) {}

  async execute(cmd: CreatePatientCommand): Promise<string> {
    const patient = Patient.create(
      PatientId.generate(),
      new PersonalData(cmd.firstName, cmd.lastName, cmd.birthDate),
      new ContactInfo(cmd.email, cmd.phone)
    )

    await this.repository.save(patient)

    return patient.id.value
  }
}
```

<br />

## 4️⃣7️⃣ PUNT CLAU — Relació Professional ↔ Patient

Ara responem **directament** al teu dubte 👇

### ❓ Com vinculem professional i pacient sense tractament?

### ❌ Opció incorrecta

* Afegir `professionalId` a `Patient`
* Afegir `patients[]` a `Professional`

➡️ **Això crea acoblament estructural i temporal**

<br />

### ✅ Opció correcta (DDD)

👉 **La relació NO és ni del Patient ni del Professional**

És un **concepte propi**.

```txt
Professional ↔ Patient
        │
        ▼
   (Treatment OR CareRelation)
```

<br />

## 4️⃣8️⃣ Introduïm el concepte: `CareRelation` (important)

Encara NO el desenvolupem, però el definim:

```txt
CareRelation
- professionalId
- patientId
- organizationId? (opcional)
- startAt
- endAt? (nullable)
- status (ACTIVE | CLOSED)
```

🔑 Això permet:

* Relació sense tractament
* Històric
* Futures derivacions
* Enllaç amb Scheduling

👉 **Treatment serà una especialització d’això**

<br />

## 4️⃣9️⃣ Scheduling amb Patient (encaix)

Scheduling:

* rep `patientId?`
* rep `professionalId` (context)
* pot verificar:

  * existeix pacient?
  * existeix CareRelation activa?
  * si no, la crea implícitament (política)

➡️ **No força tractament**

<br />

## 🔟 Derivacions (avanç conceptual)

Derivació = **canvi de professional dins una CareRelation**

```txt
Patient
  └── CareRelation (Prof A) ──(deriva)──▶ CareRelation (Prof B)
```

Amb:

* motiu
* data
* origen
* destí

👉 Això viurà en un **Referral BC** o dins **Treatment**, ho decidirem després.

<br />

## ✅ Conclusions

✔️ Patient és pur i estable
✔️ Relacions NO dins Patient
✔️ Tractament ≠ relació mínima
✔️ Scheduling funciona sense tractament
✔️ Derivacions possibles i netes

<br />

## ➡️ PAS 5 (següent, molt potent)

Ara sí:

> **Treatment BC**

* Agregat temporal
* Evolució de la CareRelation
* Relació amb actes, cites, informes
* Com conviu amb Scheduling

Quan diguis, **seguim amb PAS 5**.


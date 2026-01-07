Perfecte. Abans de Scheduling, **Patient + Treatment** és exactament l’ordre correcte.
Aquí farem **disseny de domini fi**, perquè el risc de barrejar conceptes és alt.

Aniré en **4 capes clares**:

1. BC **Patient** (nucli estable)
2. Relació **Professional ↔ Patient** (sense tractament)
3. Aggregate **Treatment** (relació clínica temporal)
4. **Derivacions** (cross-org / cross-professional)

I a cada punt prendrem decisions explícites.

<br />

<br />

# BC 5 — **Patient**

## 🎯 Responsabilitat del BC

El BC Patient representa **la persona atesa**, independentment de:

* professionals
* organitzacions
* tractaments
* cites

Inclou:

* Identitat del pacient
* Dades bàsiques
* Estat
* Identificadors externs (opcional)

No inclou:

* Historial clínic (BC futur)
* Tractaments
* Cites
* Professionals

👉 **Patient és un Aggregate Root fort i estable**

<br />

## 📦 Estructura de carpetes

```txt
patient/
├── domain/
│   ├── aggregates/
│   │   └── Patient/
│   │       ├── Patient.ts
│   │       ├── PatientId.ts
│   │       └── PatientStatus.ts
│   ├── value-objects/
│   │   ├── PatientName.ts
│   │   ├── BirthDate.ts
│   │   └── ContactInfo.ts
│   ├── repositories/
│   │   └── PatientRepository.ts
│   └── events/
│       ├── PatientCreated.ts
│       └── PatientArchived.ts
│
├── application/
│   ├── commands/
│   │   ├── CreatePatient/
│   │   └── ArchivePatient/
│   ├── queries/
│   │   └── GetPatient/
│   └── dtos/
│       └── PatientDTO.ts
│
├── infrastructure/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── repositories/
│   │       └── PrismaPatientRepository.ts
│   └── mappers/
│       └── PatientMapper.ts
│
└── index.ts
```

<br />

## 🧠 Domain Layer

### Aggregate Root — Patient

#### `domain/aggregates/Patient/Patient.ts`

```ts
import { PatientId } from './PatientId'
import { PatientStatus } from './PatientStatus'
import { PatientName } from '../../value-objects/PatientName'
import { BirthDate } from '../../value-objects/BirthDate'
import { ContactInfo } from '../../value-objects/ContactInfo'

export class Patient {
  constructor(
    readonly id: PatientId,
    private name: PatientName,
    private birthDate: BirthDate | null,
    private contactInfo: ContactInfo | null,
    private status: PatientStatus
  ) {}

  archive() {
    this.status = PatientStatus.Archived()
  }

  isActive(): boolean {
    return this.status.isActive()
  }
}
```

<br />

### PatientStatus

#### `domain/aggregates/Patient/PatientStatus.ts`

```ts
export class PatientStatus {
  private constructor(
    private readonly value: 'ACTIVE' | 'ARCHIVED'
  ) {}

  static Active() {
    return new PatientStatus('ACTIVE')
  }

  static Archived() {
    return new PatientStatus('ARCHIVED')
  }

  isActive() {
    return this.value === 'ACTIVE'
  }

  toString() {
    return this.value
  }
}
```

<br />

## 🧱 Infrastructure — Prisma

#### `infrastructure/prisma/schema.prisma`

```prisma
model Patient {
  id          String @id
  name        String
  birthDate   DateTime?
  email       String?
  phone       String?
  status      String
}
```

<br />

# 🔗 Relació Professional ↔ Patient (sense tractament)

### ⚠️ Pregunta clau (i decisió)

> **Pot existir relació professional–pacient sense tractament?**

✔️ **Sí, i ha de poder existir**, perquè:

* Primera visita
* Cita administrativa
* Valoració
* Derivació rebuda
* Tractament ja tancat però relació històrica

👉 **No utilitzarem Treatment com a FK obligatòria**

---
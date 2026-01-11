Perfecte. Entrem al **PAS — Persistència real amb Prisma**, que és on molts dissenys DDD fallen si no es fa amb criteri.

Objectiu d’aquest pas:

* Traduir **agregats DDD → models SQL**
* Mantenir **BC boundaries**
* Evitar acoblament fort entre taules
* Preparar **multi-tenant + eventual consistency**

Anirem així:

1️⃣ Principis de persistència en DDD
2️⃣ Estratègia Prisma per BC
3️⃣ Models Prisma: Patient
4️⃣ Models Prisma: Treatment
5️⃣ Models Prisma: Referral
6️⃣ Models Prisma: Scheduling (Appointment)
7️⃣ Claus foranes “toves”
8️⃣ Impacte en repositoris

<br />

# Prisma ORM + DDD

<br />

## 1️⃣ Principis clau (molt important)

### ❌ Error habitual

* 1 gran `schema.prisma`
* Relacions FK entre tots els BCs
* `@relation` pertot arreu

### ✅ Enfocament correcte

* **Un schema Prisma compartit**
* **Relacions només dins del mateix BC**
* IDs d’altres BCs com `String`
* Validació creuada → Application / Events

👉 **La BD NO imposa el domini**

<br />

## 2️⃣ Ubicació del Prisma

📁 **backend/prisma**

```txt
prisma/
├── schema.prisma
└── migrations/
```

Cada BC té:

* el seu **repository Prisma**
* el seu **mapper**

<br />

## 3️⃣ Prisma — Patient

### `prisma/schema.prisma`

```prisma
model Patient {
  id          String   @id
  firstName   String
  lastName    String
  birthDate   DateTime?
  email       String?
  phone       String?
  active      Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([lastName])
}
```

🔑 Observacions:

* Cap FK
* Pacient **autònom**
* Clínic, no relacional

<br />

### Mapper

📁 `modules/patient/infrastructure/mappers/PatientMapper.ts`

```ts
export class PatientMapper {
  static toDomain(raw: any): Patient {
    return new Patient(
      PatientId.from(raw.id),
      new PersonalData(raw.firstName, raw.lastName, raw.birthDate),
      new ContactInfo(raw.email, raw.phone),
      raw.active
    )
  }

  static toPersistence(patient: Patient) {
    return {
      id: patient.id.value,
      firstName: patient.personalData.firstName,
      lastName: patient.personalData.lastName,
      birthDate: patient.personalData.birthDate,
      email: patient.contactInfo.email,
      phone: patient.contactInfo.phone,
      active: patient.isActive()
    }
  }
}
```

<br />

## 4️⃣ Prisma — Treatment

```prisma
model Treatment {
  id              String   @id
  patientId       String
  professionalId  String
  organizationId  String?
  status          String
  startAt         DateTime
  endAt           DateTime?

  createdAt       DateTime @default(now())

  @@index([patientId])
  @@index([professionalId])
}
```

🔑 Aquí:

* `patientId` és **string**
* no FK
* tractament és **històric**

<br />

## 5️⃣ Prisma — Referral

```prisma
model Referral {
  id                    String   @id
  patientId             String
  fromProfessionalId    String
  toProfessionalId      String
  organizationId        String?
  status                String
  reason                String?

  createdAt             DateTime @default(now())

  @@index([patientId])
  @@index([toProfessionalId])
}
```

👉 Cap dependència forta amb Treatment
👉 BC totalment independent

<br />

## 6️⃣ Prisma — Scheduling (Appointment)

```prisma
model Appointment {
  id              String   @id
  professionalId  String
  patientId       String?
  organizationId  String?
  treatmentId     String?

  startAt         DateTime
  endAt           DateTime
  status          String
  type            String

  createdAt       DateTime @default(now())

  @@index([professionalId, startAt])
  @@index([patientId])
}
```

🔑 Cita:

* pot existir sense pacient
* pot existir sense tractament
* és **agnòstica del domini clínic**

<br />

## 7️⃣ Claus foranes “toves” (decisió crítica)

### Per què NO FK?

* BCs independents
* Eventual consistency
* Possibilitat de:

  * arxivar
  * migrar
  * desacoblar

### Validació ON?

* Application layer
* Policies
* Event handlers

<br />

## 8️⃣ Repositori Prisma (exemple)

📁 `modules/treatment/infrastructure/prisma/PrismaTreatmentRepository.ts`

```ts
@Injectable()
export class PrismaTreatmentRepository implements TreatmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(treatment: Treatment): Promise<void> {
    await this.prisma.treatment.upsert({
      where: { id: treatment.id.value },
      update: {
        status: treatment.isActive() ? 'ACTIVE' : 'CLOSED',
        endAt: treatment.period?.endAt
      },
      create: {
        id: treatment.id.value,
        patientId: treatment.patientId,
        professionalId: treatment.professionalId,
        organizationId: treatment.organizationId,
        status: 'ACTIVE',
        startAt: treatment.period!.startAt
      }
    })
  }

  async findActiveForPatient(
    patientId: string,
    professionalId: string
  ): Promise<Treatment | null> {
    const raw = await this.prisma.treatment.findFirst({
      where: {
        patientId,
        professionalId,
        status: 'ACTIVE'
      }
    })

    return raw ? TreatmentMapper.toDomain(raw) : null
  }
}
```

<br />

## 9️⃣ Multi-tenant (preparació)

Estratègia recomanada:

* `organizationId` nullable a tots els BCs
* Context injectat
* Filtres automàtics en repositoris

```ts
where: {
  organizationId: ctx.organizationId
}
```

<br />

## ✅ Conclusions

- ✔️ Prisma no dicta el domini
- ✔️ BCs desacoblats a BD
- ✔️ Relacions per events
- ✔️ Model escalable
- ✔️ Preparat per SaaS real



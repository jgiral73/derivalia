
<br />

### 🔗 Relació Professional ↔ Patient (sense tractament)

### ⚠️ Pregunta clau (i decisió)

> **Pot existir relació professional–pacient sense tractament?**

✔️ **Sí, i ha de poder existir**, perquè:

* Primera visita
* Cita administrativa
* Valoració
* Derivació rebuda
* Tractament ja tancat però relació històrica

👉 **No utilitzarem Treatment com a FK obligatòria**

<br />

<br /> 

## BC 6 — **Care Relationship** (o Patient Assignment)

Aquest BC defineix:

> *“Aquest professional coneix / pot accedir / atén aquest pacient”*

<br />

## 📦 Estructura

```txt
care-relationship/
├── domain/
│   ├── aggregates/
│   │   └── CareRelation/
│   │       ├── CareRelation.ts
│   │       ├── CareRelationId.ts
│   │       └── CareRelationStatus.ts
│   ├── value-objects/
│   │   └── RelationScope.ts
│   ├── repositories/
│   │   └── CareRelationRepository.ts
│   └── events/
│       └── CareRelationEstablished.ts
│
├── application/
│   ├── commands/
│   │   └── AssignPatientToProfessional/
│   └── queries/
│       └── GetPatientsForProfessional/
│
├── infrastructure/
│   └── prisma/
│       ├── schema.prisma
│       └── repositories/
│           └── PrismaCareRelationRepository.ts
│
└── index.ts
```

<br />

## 🧠 Aggregate — CareRelation

#### `domain/aggregates/CareRelation/CareRelation.ts`

```ts
export class CareRelation {
  constructor(
    readonly id: CareRelationId,
    readonly professionalId: string,
    readonly patientId: string,
    readonly organizationId: string | null,
    private status: CareRelationStatus
  ) {}

  deactivate() {
    this.status = CareRelationStatus.Inactive()
  }

  isActive(): boolean {
    return this.status.isActive()
  }
}
```

👉 `organizationId` **opcional**
✔️ Permet:

* Professional privat
* Organització
* Derivació externa

<br />

## 🧱 Prisma

#### `infrastructure/prisma/schema.prisma`

```prisma
model CareRelation {
  id              String @id
  professionalId  String
  patientId       String
  organizationId  String?
  status          String

  @@unique([professionalId, patientId])
}
```

---

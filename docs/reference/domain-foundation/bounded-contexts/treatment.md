
# 🧠 Aggregate clínic — **Treatment**

Ara sí: **tractament = relació clínica activa en el temps**

<br />

## 🎯 Definició forta

> Treatment descriu:
>
> * objectiu clínic
> * responsable
> * pacient
> * període
> * estat

👉 **Treatment és opcional**
👉 **No tots els pacients tenen tractament actiu**

<br />

## 📦 Estructura

```txt
treatment/
├── domain/
│   ├── aggregates/
│   │   └── Treatment/
│   │       ├── Treatment.ts
│   │       ├── TreatmentId.ts
│   │       └── TreatmentStatus.ts
│   ├── value-objects/
│   │   ├── TreatmentPeriod.ts
│   │   └── TreatmentGoal.ts
│   ├── repositories/
│   │   └── TreatmentRepository.ts
│   └── events/
│       ├── TreatmentStarted.ts
│       └── TreatmentClosed.ts
│
├── application/
│   ├── commands/
│   │   ├── StartTreatment/
│   │   └── CloseTreatment/
│   └── queries/
│       └── GetActiveTreatmentsForPatient/
│
├── infrastructure/
│   └── prisma/
│       ├── schema.prisma
│       └── repositories/
│           └── PrismaTreatmentRepository.ts
│
└── index.ts
```

<br />

## 🧠 Aggregate Root — Treatment

#### `domain/aggregates/Treatment/Treatment.ts`

```ts
export class Treatment {
  constructor(
    readonly id: TreatmentId,
    readonly patientId: string,
    readonly professionalId: string,
    readonly organizationId: string | null,
    private goal: TreatmentGoal,
    private period: TreatmentPeriod,
    private status: TreatmentStatus
  ) {}

  close() {
    this.status = TreatmentStatus.Closed()
    this.period.endNow()
  }

  isActive(): boolean {
    return this.status.isActive()
  }
}
```

<br />

## 🧱 Prisma

#### `infrastructure/prisma/schema.prisma`

```prisma
model Treatment {
  id              String @id
  patientId       String
  professionalId  String
  organizationId  String?
  goal            String
  status          String
  startAt         DateTime
  endAt           DateTime?
}
```



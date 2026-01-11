Perfecte. **Som-hi** 🚀
Implementarem **UN BC COMPLET: `Patient`**, **pas a pas**, sense saltar-nos res i **amb estructura de carpetes + codi real**.

> Objectiu:
> Tenir un **Patient BC executable** (DDD + NestJS + Prisma) alineat amb:
>
> * Swagger
> * capabilities
> * UX flows
> * guards

---

# PAS 1 — Estructura del BC `Patient`

📁 **Ubicació**

```
backend/
└── contexts/
    └── patient/
        ├── domain/
        ├── application/
        ├── infrastructure/
        │   └── prisma/
        └── api/
```

Cada capa **té una responsabilitat clara**.

---

# PAS 2 — DOMAIN (cor del BC)

## 2.1 Aggregate Root: `Patient`

📄 `contexts/patient/domain/Patient.ts`

```ts
export class Patient {
  private constructor(
    public readonly id: string,
    private fullName: string,
    private contact?: {
      email?: string;
      phone?: string;
    },
    private linkedUserId?: string
  ) {}

  static create(props: {
    id: string;
    fullName: string;
    contact?: { email?: string; phone?: string };
  }): Patient {
    if (!props.fullName) {
      throw new Error('Patient fullName is required');
    }

    return new Patient(
      props.id,
      props.fullName,
      props.contact
    );
  }

  linkToUser(userId: string) {
    this.linkedUserId = userId;
  }

  getSnapshot() {
    return {
      id: this.id,
      fullName: this.fullName,
      contact: this.contact,
      linkedUserId: this.linkedUserId
    };
  }
}
```

📌 Notes:

* **no ORM**
* **no decorators**
* invariant simple però real
* aggregate petit (MVP-friendly)

---

## 2.2 Repository contract

📄 `contexts/patient/domain/PatientRepository.ts`

```ts
import { Patient } from './Patient';

export interface PatientRepository {
  save(patient: Patient): Promise<void>;
  findById(id: string): Promise<Patient | null>;
  findAllActive(): Promise<Patient[]>;
}
```

📌 El domini **no sap** si és Prisma, SQL, etc.

---

# PAS 3 — APPLICATION (use cases)

## 3.1 Create Patient

📄 `contexts/patient/application/CreatePatient.command.ts`

```ts
export interface CreatePatientCommand {
  fullName: string;
  email?: string;
}
```

---

📄 `contexts/patient/application/CreatePatient.handler.ts`

```ts
import { PatientRepository } from '../domain/PatientRepository';
import { Patient } from '../domain/Patient';
import { randomUUID } from 'crypto';

export class CreatePatientHandler {
  constructor(private readonly repo: PatientRepository) {}

  async execute(cmd: CreatePatientCommand): Promise<{ id: string }> {
    const patient = Patient.create({
      id: randomUUID(),
      fullName: cmd.fullName,
      contact: cmd.email ? { email: cmd.email } : undefined
    });

    await this.repo.save(patient);

    return { id: patient.id };
  }
}
```

📌 Use case:

* 1 responsabilitat
* 0 lògica HTTP
* 0 lògica DB

---

## 3.2 Get Patient

📄 `contexts/patient/application/GetPatient.query.ts`

```ts
export interface GetPatientQuery {
  id: string;
}
```

---

📄 `contexts/patient/application/GetPatient.handler.ts`

```ts
import { PatientRepository } from '../domain/PatientRepository';

export class GetPatientHandler {
  constructor(private readonly repo: PatientRepository) {}

  async execute(query: { id: string }) {
    const patient = await this.repo.findById(query.id);

    if (!patient) {
      throw new Error('Patient not found');
    }

    return patient.getSnapshot();
  }
}
```

---

# PAS 4 — INFRASTRUCTURE (Prisma)

## 4.1 Prisma schema

📄 `contexts/patient/infrastructure/prisma/schema.prisma`

```prisma
model Patient {
  id            String   @id
  fullName      String
  email         String?
  phone         String?
  linkedUserId  String?
  createdAt     DateTime @default(now())
}
```

---

## 4.2 Prisma Repository

📄 `contexts/patient/infrastructure/PrismaPatientRepository.ts`

```ts
import { PatientRepository } from '../domain/PatientRepository';
import { Patient } from '../domain/Patient';
import { PrismaClient } from '@prisma/client';

export class PrismaPatientRepository implements PatientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(patient: Patient): Promise<void> {
    const data = patient.getSnapshot();

    await this.prisma.patient.upsert({
      where: { id: data.id },
      update: {
        fullName: data.fullName,
        email: data.contact?.email
      },
      create: {
        id: data.id,
        fullName: data.fullName,
        email: data.contact?.email
      }
    });
  }

  async findById(id: string): Promise<Patient | null> {
    const row = await this.prisma.patient.findUnique({ where: { id } });
    if (!row) return null;

    return Patient.create({
      id: row.id,
      fullName: row.fullName,
      contact: {
        email: row.email ?? undefined,
        phone: row.phone ?? undefined
      }
    });
  }

  async findAllActive(): Promise<Patient[]> {
    const rows = await this.prisma.patient.findMany();

    return rows.map(r =>
      Patient.create({
        id: r.id,
        fullName: r.fullName,
        contact: { email: r.email ?? undefined }
      })
    );
  }
}
```

📌 Infra:

* adapta
* no decideix
* no valida negoci

---

# PAS 5 — API (NestJS)

## 5.1 Controller

📄 `contexts/patient/api/patient.controller.ts`

```ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreatePatientHandler } from '../application/CreatePatient.handler';
import { GetPatientHandler } from '../application/GetPatient.handler';
import { RequireCapabilities } from '../../shared/guards/require-capabilities.decorator';

@Controller('patients')
export class PatientController {
  constructor(
    private readonly createHandler: CreatePatientHandler,
    private readonly getHandler: GetPatientHandler
  ) {}

  @Post()
  @RequireCapabilities('CREATE_PATIENT')
  async create(@Body() body: { fullName: string; email?: string }) {
    return this.createHandler.execute(body);
  }

  @Get(':id')
  @RequireCapabilities('VIEW_PATIENT')
  async get(@Param('id') id: string) {
    return this.getHandler.execute({ id });
  }
}
```

---

# PAS 6 — Wiring (NestJS module)

📄 `contexts/patient/patient.module.ts`

```ts
import { Module } from '@nestjs/common';
import { PatientController } from './api/patient.controller';
import { PrismaPatientRepository } from './infrastructure/PrismaPatientRepository';
import { CreatePatientHandler } from './application/CreatePatient.handler';
import { GetPatientHandler } from './application/GetPatient.handler';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [PatientController],
  providers: [
    PrismaClient,
    {
      provide: 'PatientRepository',
      useClass: PrismaPatientRepository
    },
    {
      provide: CreatePatientHandler,
      useFactory: (repo) => new CreatePatientHandler(repo),
      inject: ['PatientRepository']
    },
    {
      provide: GetPatientHandler,
      useFactory: (repo) => new GetPatientHandler(repo),
      inject: ['PatientRepository']
    }
  ]
})
export class PatientModule {}
```

---

# ✔️ RESULTAT

En aquest punt tens:

✅ BC **Patient** complet
✅ DDD correcte
✅ Prisma funcional
✅ Guards per capabilities
✅ Swagger alineable
✅ UX flows suportats

I sobretot:

> **Cap decisió improvisada**

---

## ⏭️ Següent pas (tria)

1️⃣ Afegir **Consent BC** (per desbloquejar clínica)
2️⃣ Afegir **ClinicalRecord BC**
3️⃣ Connectar **Swagger → Frontend client**
4️⃣ Tests (unit + contract)

Digues quin i **seguim pas a pas** 💥


Perfecte. **Seguim pas a pas** i sense salts.

👉 **PAS SEGÜENT NATURAL:** implementar **Consent BC**
És imprescindible per:

* historial clínic
* col·laboracions
* autorització real (no només rols)

Ho farem **mínim però correcte**, alineat amb tot l’anterior.

---

# PAS 2 — BOUNDED CONTEXT: `Consent`

## Responsabilitat del BC

> Gestionar **autoritzacions explícites** d’un pacient cap a un professional
> amb **scope**, **temps** i **traçabilitat legal**

---

## 1️⃣ Estructura de carpetes

```
contexts/
└── consent/
    ├── domain/
    ├── application/
    ├── infrastructure/
    │   └── prisma/
    └── api/
```

---

# 2️⃣ DOMAIN

## 2.1 Aggregate Root: `Consent`

📄 `contexts/consent/domain/Consent.ts`

```ts
export type ConsentScope =
  | 'CLINICAL_VIEW'
  | 'CLINICAL_WRITE'
  | 'COLLABORATION'
  | 'BILLING';

export class Consent {
  private constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly professionalId: string,
    private readonly scopes: ConsentScope[],
    private readonly validFrom: Date,
    private readonly validTo?: Date
  ) {}

  static grant(props: {
    id: string;
    patientId: string;
    professionalId: string;
    scopes: ConsentScope[];
    validFrom: Date;
    validTo?: Date;
  }): Consent {
    if (props.scopes.length === 0) {
      throw new Error('Consent must have at least one scope');
    }

    return new Consent(
      props.id,
      props.patientId,
      props.professionalId,
      props.scopes,
      props.validFrom,
      props.validTo
    );
  }

  isActive(at: Date = new Date()): boolean {
    if (this.validTo && at > this.validTo) return false;
    return at >= this.validFrom;
  }

  allows(scope: ConsentScope): boolean {
    return this.scopes.includes(scope) && this.isActive();
  }

  getSnapshot() {
    return {
      id: this.id,
      patientId: this.patientId,
      professionalId: this.professionalId,
      scopes: this.scopes,
      validFrom: this.validFrom,
      validTo: this.validTo
    };
  }
}
```

📌 Notes:

* **Consent és first-class aggregate**
* Cap dependència d’altres BCs
* Validació mínima però real

---

## 2.2 Repository contract

📄 `contexts/consent/domain/ConsentRepository.ts`

```ts
import { Consent } from './Consent';

export interface ConsentRepository {
  save(consent: Consent): Promise<void>;
  findActive(
    patientId: string,
    professionalId: string
  ): Promise<Consent[]>;
}
```

---

# 3️⃣ APPLICATION (use cases)

## 3.1 Grant Consent

📄 `contexts/consent/application/GrantConsent.command.ts`

```ts
import { ConsentScope } from '../domain/Consent';

export interface GrantConsentCommand {
  patientId: string;
  professionalId: string;
  scopes: ConsentScope[];
  validTo?: Date;
}
```

---

📄 `contexts/consent/application/GrantConsent.handler.ts`

```ts
import { Consent } from '../domain/Consent';
import { ConsentRepository } from '../domain/ConsentRepository';
import { randomUUID } from 'crypto';

export class GrantConsentHandler {
  constructor(private readonly repo: ConsentRepository) {}

  async execute(cmd: GrantConsentCommand) {
    const consent = Consent.grant({
      id: randomUUID(),
      patientId: cmd.patientId,
      professionalId: cmd.professionalId,
      scopes: cmd.scopes,
      validFrom: new Date(),
      validTo: cmd.validTo
    });

    await this.repo.save(consent);

    return { id: consent.id };
  }
}
```

---

## 3.2 Check Consent (per guards)

📄 `contexts/consent/application/CheckConsent.service.ts`

```ts
import { ConsentRepository } from '../domain/ConsentRepository';
import { ConsentScope } from '../domain/Consent';

export class CheckConsentService {
  constructor(private readonly repo: ConsentRepository) {}

  async allows(
    patientId: string,
    professionalId: string,
    scope: ConsentScope
  ): Promise<boolean> {
    const consents = await this.repo.findActive(patientId, professionalId);
    return consents.some(c => c.allows(scope));
  }
}
```

📌 Aquest servei **s’usa des de guards**, no des de controllers.

---

# 4️⃣ INFRASTRUCTURE (Prisma)

## 4.1 Prisma schema

📄 `contexts/consent/infrastructure/prisma/schema.prisma`

```prisma
model Consent {
  id              String   @id
  patientId       String
  professionalId  String
  scopes          String   // JSON stringified
  validFrom       DateTime
  validTo         DateTime?
  createdAt       DateTime @default(now())

  @@index([patientId, professionalId])
}
```

---

## 4.2 Prisma Repository

📄 `contexts/consent/infrastructure/PrismaConsentRepository.ts`

```ts
import { ConsentRepository } from '../domain/ConsentRepository';
import { Consent, ConsentScope } from '../domain/Consent';
import { PrismaClient } from '@prisma/client';

export class PrismaConsentRepository implements ConsentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(consent: Consent): Promise<void> {
    const data = consent.getSnapshot();

    await this.prisma.consent.create({
      data: {
        id: data.id,
        patientId: data.patientId,
        professionalId: data.professionalId,
        scopes: JSON.stringify(data.scopes),
        validFrom: data.validFrom,
        validTo: data.validTo
      }
    });
  }

  async findActive(
    patientId: string,
    professionalId: string
  ): Promise<Consent[]> {
    const rows = await this.prisma.consent.findMany({
      where: {
        patientId,
        professionalId
      }
    });

    return rows.map(r =>
      Consent.grant({
        id: r.id,
        patientId: r.patientId,
        professionalId: r.professionalId,
        scopes: JSON.parse(r.scopes) as ConsentScope[],
        validFrom: r.validFrom,
        validTo: r.validTo ?? undefined
      })
    );
  }
}
```

---

# 5️⃣ API (NestJS)

## 5.1 Controller

📄 `contexts/consent/api/consent.controller.ts`

```ts
import { Controller, Post, Body } from '@nestjs/common';
import { GrantConsentHandler } from '../application/GrantConsent.handler';
import { RequireCapabilities } from '../../shared/guards/require-capabilities.decorator';

@Controller('consents')
export class ConsentController {
  constructor(private readonly grantHandler: GrantConsentHandler) {}

  @Post()
  @RequireCapabilities('GRANT_CONSENT')
  grant(@Body() body: {
    patientId: string;
    professionalId: string;
    scopes: string[];
    validTo?: Date;
  }) {
    return this.grantHandler.execute(body);
  }
}
```

---

# 6️⃣ Wiring del mòdul

📄 `contexts/consent/consent.module.ts`

```ts
import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConsentController } from './api/consent.controller';
import { PrismaConsentRepository } from './infrastructure/PrismaConsentRepository';
import { GrantConsentHandler } from './application/GrantConsent.handler';
import { CheckConsentService } from './application/CheckConsent.service';

@Module({
  controllers: [ConsentController],
  providers: [
    PrismaClient,
    {
      provide: 'ConsentRepository',
      useClass: PrismaConsentRepository
    },
    {
      provide: GrantConsentHandler,
      useFactory: repo => new GrantConsentHandler(repo),
      inject: ['ConsentRepository']
    },
    {
      provide: CheckConsentService,
      useFactory: repo => new CheckConsentService(repo),
      inject: ['ConsentRepository']
    }
  ],
  exports: [CheckConsentService]
})
export class ConsentModule {}
```

📌 **Exportem `CheckConsentService`** perquè altres BCs el puguin usar als guards.

---

# 7️⃣ Connexió amb Guards (recordatori)

En un guard clínic:

```ts
if (!await consentService.allows(
  patientId,
  professionalId,
  'CLINICAL_VIEW'
)) {
  throw new ForbiddenException('Consent required');
}
```

---

# ✔️ On som ara

Ja tens:

* ✅ `Patient BC`
* ✅ `Consent BC`
* ✅ autorització real per dades sensibles
* ✅ base per ClinicalRecord i Collaboration

A partir d’aquí **el sistema ja és clínicament vàlid**.

---

## ⏭️ Següent pas (ordre lògic)

👉 **Implementar `ClinicalRecord BC`**
(on el consentiment es fa servir de veritat)

Quan diguis **seguim**, continuem exactament així.


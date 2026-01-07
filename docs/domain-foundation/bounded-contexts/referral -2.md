Perfecte. Entenc el “**Seguim**” 🙂
Entrem al **PAS 6**, que és on el disseny deixa de ser teòric i es converteix en **ecosistema viu**.

Aquest pas és clau perquè:

* resol **derivacions**
* demostra **DDD estratègic**
* connecta BCs **sense acoblament**

Anirem ordenadament:

1️⃣ Què és una **Derivació** (model mental)
2️⃣ On viu (nou BC: Referral)
3️⃣ Agregat `Referral`
4️⃣ Events de domini
5️⃣ Reaccions entre BCs (eventual consistency)
6️⃣ Impacte en Scheduling i Treatment

<br />

# PAS 6 — Referral / Derivations BC

<br />

## 6️⃣1️⃣ Què és una derivació (en domini)

Una **derivació** NO és:

* només un canvi de professional
* només un missatge

És:

> **una decisió clínica formal de transferir la responsabilitat assistencial**

Implica:

* pacient
* professional origen
* professional destí
* (opcional) organització
* motiu
* estat

<br />

## 6️⃣2️⃣ Per què un BC separat?

❌ Posar-ho a Treatment:

* el fa massa gran
* barreja responsabilitats
* dificulta traçabilitat

✅ BC propi:

* vida pròpia
* històric
* estats
* auditable

<br />

## 6️⃣3️⃣ Estructura del Referral BC

📁 **backend/apps/api/modules/referral**

```txt
modules/referral/
├── domain/
│   ├── aggregates/
│   │   └── Referral.ts
│   ├── value-objects/
│   │   ├── ReferralId.ts
│   │   ├── ReferralStatus.ts
│   │   └── ReferralReason.ts
│   ├── repositories/
│   │   └── ReferralRepository.ts
│   └── events/
│       ├── ReferralCreated.ts
│       ├── ReferralAccepted.ts
│       └── ReferralRejected.ts
│
├── application/
│   ├── commands/
│   │   ├── CreateReferral/
│   │   ├── AcceptReferral/
│   │   └── RejectReferral/
│   ├── queries/
│   └── dtos/
│       └── ReferralDTO.ts
│
├── infrastructure/
│   ├── http/
│   │   └── ReferralController.ts
│   ├── prisma/
│   │   └── PrismaReferralRepository.ts
│   └── mappers/
│
├── referral.module.ts
└── index.ts
```

<br />

## 6️⃣4️⃣ Agregat `Referral`

📁 `domain/aggregates/Referral.ts`

```ts
import { ReferralId } from '../value-objects/ReferralId'
import { ReferralStatus } from '../value-objects/ReferralStatus'
import { ReferralReason } from '../value-objects/ReferralReason'

export class Referral {
  private constructor(
    public readonly id: ReferralId,
    public readonly patientId: string,
    public readonly fromProfessionalId: string,
    public readonly toProfessionalId: string,
    public readonly organizationId?: string,
    public readonly reason?: ReferralReason,
    private status: ReferralStatus = ReferralStatus.PENDING
  ) {}

  static create(
    id: ReferralId,
    patientId: string,
    fromProfessionalId: string,
    toProfessionalId: string,
    organizationId?: string,
    reason?: ReferralReason
  ): Referral {
    return new Referral(
      id,
      patientId,
      fromProfessionalId,
      toProfessionalId,
      organizationId,
      reason,
      ReferralStatus.PENDING
    )
  }

  accept() {
    if (this.status !== ReferralStatus.PENDING) {
      throw new Error('Referral cannot be accepted')
    }
    this.status = ReferralStatus.ACCEPTED
  }

  reject() {
    if (this.status !== ReferralStatus.PENDING) {
      throw new Error('Referral cannot be rejected')
    }
    this.status = ReferralStatus.REJECTED
  }
}
```

<br />

## 6️⃣5️⃣ Events de domini

📁 `domain/events/ReferralAccepted.ts`

```ts
export class ReferralAccepted {
  constructor(
    public readonly referralId: string,
    public readonly patientId: string,
    public readonly fromProfessionalId: string,
    public readonly toProfessionalId: string,
    public readonly organizationId?: string
  ) {}
}
```

👉 Aquests events **no coneixen qui els escolta**

<br />

## 6️⃣6️⃣ Reaccions entre BCs (Eventual Consistency)

### Quan passa això:

```txt
ReferralAccepted
```

### Volem:

1. Tancar tractament anterior
2. Crear nou tractament
3. Scheduling pugui continuar

<br />

### Handler d’event (Application layer)

📁 `modules/treatment/application/subscribers/ReferralAcceptedSubscriber.ts`

```ts
@DomainEventHandler(ReferralAccepted)
export class ReferralAcceptedSubscriber {
  constructor(
    private readonly treatmentRepository: TreatmentRepository
  ) {}

  async handle(event: ReferralAccepted) {
    const active =
      await this.treatmentRepository.findActiveForPatient(
        event.patientId,
        event.fromProfessionalId
      )

    if (active) {
      active.close('Referral accepted')
      await this.treatmentRepository.save(active)
    }

    const newTreatment = Treatment.start(
      TreatmentId.generate(),
      event.patientId,
      event.toProfessionalId,
      event.organizationId
    )

    await this.treatmentRepository.save(newTreatment)
  }
}
```

👉 **No transacció distribuïda**
👉 **Eventual consistency**

<br />

## 6️⃣7️⃣ Scheduling davant derivacions

Scheduling:

* no sap què és Referral
* només veu:

  * tractament tancat
  * tractament nou

Polítiques possibles:

* cites futures reassignades
* cites cancel·lades
* notificacions

👉 Tot via **events**

<br />

## 6️⃣8️⃣ Frontend (impacte real)

El frontend veu:

* “Derivació pendent”
* “Acceptar / rebutjar”
* Nou professional a l’agenda

**Sense conèixer el caos intern**

<br />

## ✅ Conclusions del PAS 6

✔️ Derivació = BC propi
✔️ Events desacoblen BCs
✔️ Treatment evoluciona sense dependències
✔️ Scheduling queda intacte
✔️ Model clínic realista

<br />

## ➡️ PAS 7 (si seguim)

El següent pas natural és:

> **Persistència real (Prisma) + models SQL + consistència**

Veurem:

* esquemes Prisma per Patient, Treatment, Referral, Appointment
* claus foranes “toves”
* versionat
* multi-tenant

Quan vulguis, **seguim amb PAS 7**.

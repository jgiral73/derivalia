

# PAS 9 — Testing en una arquitectura DDD real

- [1️⃣ Piràmide de tests recomanada](#1️⃣-piràmide-de-tests-recomanada)
- [2️⃣ Tests de Domini (purs, sense mocks)](#2️⃣-tests-de-domini-purs-sense-mocks)
- [3️⃣ Tests de Value Objects](#3️⃣-tests-de-value-objects)
- [4️⃣ Tests de Policies (clau!)](#4️⃣-tests-de-policies-clau)
- [5️⃣ Tests d’Application (Handlers)](#5️⃣-tests-dapplication-handlers)
- [6️⃣ Tests d’Integració (BC-level)](#6️⃣-tests-dintegració-bc-level)
- [7️⃣ Tests E2E (pocs i cars)](#7️⃣-tests-e2e-pocs-i-cars)
- [8️⃣ Errors habituals en testing DDD](#8️⃣-errors-habituals-en-testing-ddd)
- [9️⃣ Checklist final (si ho has fet bé)](#9️⃣-checklist-final-si-ho-has-fet-bé)

<br />

## Objectiu d’aquest pas

- ✔️ Testar **domini sense infraestructura**
- ✔️ Testar **policies cross-BC**
- ✔️ Testar **application sense HTTP**
- ✔️ Testar **infra sense mocks fràgils**
- ✔️ Evitar tests “acoblats al framework”

<br />

## [1️⃣ Piràmide de tests recomanada](#)

```txt
           E2E (pocs)
        ─────────────────
      Integration (BC-level)
    ───────────────────────
  Application / Policies
──────────────────────────
        Domain (molts)
```

👉 **Com més avall, més ràpid i estable**

<br />

## [2️⃣ Tests de Domini (purs, sense mocks)](#)

### Què testegem aquí

* invariants
* comportament
* errors de domini

### ❌ No testegem

* repositoris
* HTTP
* Prisma
* policies

<br />

### Exemple — `Treatment` aggregate

📁
`modules/treatment/domain/aggregates/__tests__/Treatment.spec.ts`

```ts
describe('Treatment aggregate', () => {
  it('starts active with open period', () => {
    const treatment = Treatment.start(
      TreatmentId.generate(),
      'patient-1',
      'prof-1'
    )

    expect(treatment.isActive()).toBe(true)
  })

  it('cannot be closed twice', () => {
    const treatment = Treatment.start(
      TreatmentId.generate(),
      'patient-1',
      'prof-1'
    )

    treatment.close()

    expect(() => treatment.close())
      .toThrow('Treatment already closed')
  })
})
```

🔑 Regla d’or:

> **Un test = una regla de domini**

<br />

## [3️⃣ Tests de Value Objects](#)

📁
`modules/patient/domain/value-objects/__tests__/PersonalData.spec.ts`

```ts
describe('PersonalData', () => {
  it('requires first and last name', () => {
    expect(() => new PersonalData('', 'Doe'))
      .toThrow()
  })
})
```

👉 Aquests tests **no canvien mai**

<br />

## [4️⃣ Tests de Policies (clau!)](#)

Les policies són on hi ha **complexitat real**.

### Característiques

* mocks **simples**
* només interfaces (ACLs)
* sense DB
* sense Nest

<br />

### Exemple — `CanScheduleAppointmentPolicy`

📁
`modules/scheduling/application/policies/__tests__/CanScheduleAppointmentPolicy.spec.ts`

```ts
describe('CanScheduleAppointmentPolicy', () => {
  const patientAcl = {
    exists: jest.fn()
  }

  const treatmentAcl = {
    hasCareRelation: jest.fn()
  }

  const policy = new CanScheduleAppointmentPolicy(
    patientAcl as any,
    treatmentAcl as any
  )

  it('allows appointment without patient', async () => {
    await expect(
      policy.check({ professionalId: 'prof-1' })
    ).resolves.not.toThrow()
  })

  it('rejects if patient does not exist', async () => {
    patientAcl.exists.mockResolvedValue(false)

    await expect(
      policy.check({
        professionalId: 'prof-1',
        patientId: 'patient-1'
      })
    ).rejects.toThrow('Patient does not exist')
  })
})
```

🔑 Aquest test:

* no coneix Patient BC
* no coneix Treatment BC
* només coneix **contractes**

<br />

## [5️⃣ Tests d’Application (Handlers)](#)

Aquí testegem:

* coordinació
* ús de policies
* ús de repositoris

⚠️ No testegem:

* HTTP
* Prisma

<br />

### Exemple — `ScheduleAppointmentHandler`

📁
`modules/scheduling/application/commands/ScheduleAppointment/__tests__/ScheduleAppointmentHandler.spec.ts`

```ts
describe('ScheduleAppointmentHandler', () => {
  it('creates appointment with resolved treatment', async () => {
    const repo = { save: jest.fn() }
    const canSchedule = { check: jest.fn() }
    const autoAssign = {
      resolve: jest.fn().mockResolvedValue('treatment-1')
    }

    const handler = new ScheduleAppointmentHandler(
      repo as any,
      canSchedule as any,
      autoAssign as any
    )

    await handler.execute({
      professionalId: 'prof-1',
      patientId: 'patient-1',
      startAt: new Date(),
      endAt: new Date()
    })

    expect(repo.save).toHaveBeenCalled()
  })
})
```

👉 Test ràpid, sense infra, sense DB

<br />

## [6️⃣ Tests d’Integració (BC-level)](#)

Aquí ja:

* usem Prisma
* usem DB (SQLite / Testcontainers)
* no mockegem repositoris

### Exemples típics

* crear pacient → recuperar-lo
* iniciar tractament → consultar actiu
* acceptar derivació → nou tractament creat

<br />

### Exemple — Treatment + Prisma

📁
`modules/treatment/infrastructure/__tests__/TreatmentRepository.int.spec.ts`

```ts
describe('PrismaTreatmentRepository', () => {
  it('persists and retrieves active treatment', async () => {
    const repo = new PrismaTreatmentRepository(prisma)

    const treatment = Treatment.start(
      TreatmentId.generate(),
      'patient-1',
      'prof-1'
    )

    await repo.save(treatment)

    const found =
      await repo.findActiveForPatient('patient-1', 'prof-1')

    expect(found).not.toBeNull()
  })
})
```

<br />

## [7️⃣ Tests E2E (pocs i cars)](#)

Només per:

* fluxos crítics
* integració BCs
* auth + policies + handlers

### Exemple de flux

```txt
POST /patients
POST /treatments
POST /appointments
POST /referrals
POST /referrals/{id}/accept
```

👉 3–5 tests màxim per domini

<br />

## [8️⃣ Errors habituals en testing DDD](#)

❌ Testar Prisma en tests de domini
❌ Mockar agregats
❌ Testar controllers com a unit tests
❌ Fer asserts sobre SQL
❌ Mocks massa intel·ligents

<br />

## [9️⃣ Checklist final (si ho has fet bé)](#)

✔️ El domini es pot testar sense NestJS
✔️ Les policies tenen tests propis
✔️ Els handlers no fan lògica complexa
✔️ Els repositoris es proven amb DB real
✔️ Els E2E són pocs però útils

<br />

## [🎯 Tancament del recorregut](#)

Amb això ja tens:

* DDD estratègic (BCs nets)
* DDD tàctic (aggregates, VOs, events)
* CQRS lleuger
* Eventual consistency
* Backend preparat per web + mobile
* Testing sostenible


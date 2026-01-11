Perfecte.
👉 **PAS 27 — Billing & Insurance (facturació mèdica multi-actor i future-proof)**
Aquest BC és **transversal**, però **no pot contaminar** clínica, agenda ni tenancy.

Seguim **pas a pas**, amb DDD estricte i pensant ja en **sales, derivacions i professionals múltiples**.

---

# PAS 27 — Billing & Insurance

## 27️⃣1️⃣ Reptes reals (els que has dit)

Hem de suportar **tots aquests fluxos**:

1. Professional → Pacient
2. Organització → Pacient
3. Professional → Professional (derivacions, col·laboracions)
4. Organització → Professional (nòmines, lloguer sala, % activitat)
5. (futur) Organització → Organització
6. (futur) Ús de sales / recursos

👉 Per tant:

* **No existeix “client únic”**
* **No existeix “proveïdor únic”**

---

## 27️⃣2️⃣ Principi DDD clau

> **Facturar és una relació econòmica entre dues parts en un context temporal**

👉 No depèn de:

* Patient
* Professional
* Organization

👉 Depèn de:

* **BillingParty**
* **BillingAgreement**
* **BillableItem**

---

## 27️⃣3️⃣ Nou BC: Billing

📁 `modules/billing`

```txt
billing/
├── domain/
│   ├── aggregates/
│   │   ├── Invoice.ts
│   │   └── BillingAgreement.ts
│   ├── entities/
│   │   └── InvoiceLine.ts
│   ├── value-objects/
│   │   ├── BillingParty.ts
│   │   ├── Money.ts
│   │   ├── InvoiceStatus.ts
│   │   └── BillingContext.ts
│   └── repositories/
│       └── InvoiceRepository.ts
├── application/
│   ├── commands/
│   │   ├── CreateInvoice
│   │   ├── AddInvoiceLine
│   │   ├── IssueInvoice
│   │   └── RegisterPayment
│   ├── queries/
│   │   └── GetInvoices
├── infrastructure/
│   └── prisma/
│       └── InvoiceRepositoryPrisma.ts
```

---

## 27️⃣4️⃣ Value Object — BillingParty (molt important)

📁
`modules/billing/domain/value-objects/BillingParty.ts`

```ts
export type BillingPartyType =
  | 'PATIENT'
  | 'PROFESSIONAL'
  | 'ORGANIZATION'

export class BillingParty {
  constructor(
    public readonly type: BillingPartyType,
    public readonly id: string
  ) {}
}
```

👉 **No hi ha herència**
👉 Només una referència abstracta

---

## 27️⃣5️⃣ BillingContext (per entendre el “per què”)

📁
`modules/billing/domain/value-objects/BillingContext.ts`

```ts
export type BillingContext =
  | 'APPOINTMENT'
  | 'TREATMENT'
  | 'DERIVATION'
  | 'ROOM_USAGE'
  | 'SALARY'
  | 'SERVICE'
```

👉 Això et permet:

* informes
* regles futures
* assegurances

---

## 27️⃣6️⃣ Aggregate — Invoice

📁
`modules/billing/domain/aggregates/Invoice.ts`

```ts
export class Invoice {
  private lines: InvoiceLine[] = []

  constructor(
    public readonly id: string,
    public readonly issuer: BillingParty,
    public readonly recipient: BillingParty,
    public readonly context: BillingContext,
    public status: InvoiceStatus = 'DRAFT',
    public readonly issuedAt: Date = new Date()
  ) {}

  addLine(line: InvoiceLine) {
    if (this.status !== 'DRAFT') {
      throw new Error('Cannot modify issued invoice')
    }
    this.lines.push(line)
  }

  issue() {
    if (!this.lines.length) {
      throw new Error('Invoice empty')
    }
    this.status = 'ISSUED'
  }

  total(): Money {
    return this.lines.reduce(
      (sum, l) => sum.add(l.total()),
      Money.zero()
    )
  }
}
```

---

## 27️⃣7️⃣ Entity — InvoiceLine

📁
`modules/billing/domain/entities/InvoiceLine.ts`

```ts
export class InvoiceLine {
  constructor(
    public readonly description: string,
    public readonly unitPrice: Money,
    public readonly quantity: number,
    public readonly reference?: {
      type: BillingContext
      id: string
    }
  ) {}

  total(): Money {
    return this.unitPrice.multiply(this.quantity)
  }
}
```

👉 Referència opcional:

* cita
* tractament
* ús sala
* derivació

---

## 27️⃣8️⃣ Money (VO obligatori)

📁
`modules/billing/domain/value-objects/Money.ts`

```ts
export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'EUR'
  ) {}

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Currency mismatch')
    }
    return new Money(this.amount + other.amount, this.currency)
  }

  multiply(qty: number): Money {
    return new Money(this.amount * qty, this.currency)
  }

  static zero() {
    return new Money(0)
  }
}
```

---

## 27️⃣9️⃣ Casos concrets (els teus)

### 🔹 Professional → Patient

```ts
issuer: BillingParty('PROFESSIONAL', profId)
recipient: BillingParty('PATIENT', patientId)
context: 'APPOINTMENT'
```

---

### 🔹 Organization → Professional (lloguer sala)

```ts
issuer: BillingParty('ORGANIZATION', orgId)
recipient: BillingParty('PROFESSIONAL', profId)
context: 'ROOM_USAGE'
```

---

### 🔹 Professional → Professional (derivació)

```ts
issuer: BillingParty('PROFESSIONAL', referredBy)
recipient: BillingParty('PROFESSIONAL', referredTo)
context: 'DERIVATION'
```

---

### 🔹 Organization → Patient

```ts
issuer: BillingParty('ORGANIZATION', clinicId)
recipient: BillingParty('PATIENT', patientId)
context: 'TREATMENT'
```

---

## 🔟 Persistència (Prisma)

📁 `prisma/schema.prisma`

```prisma
model Invoice {
  id              String   @id
  issuerType      String
  issuerId        String
  recipientType   String
  recipientId     String
  context         String
  status          String
  issuedAt        DateTime
}

model InvoiceLine {
  id          String   @id
  invoiceId  String
  description String
  unitAmount  Float
  quantity    Int
  currency    String
  refType     String?
  refId       String?
}
```

---

## 27️⃣11️⃣ Insurance (preparació)

👉 **Assegurances NO paguen factures**
👉 **Paguen claims**

BC futur:

* `InsuranceClaim`
* `Coverage`
* `Payer`

👉 Les factures **referencien claims**, no al revés

---

## 27️⃣12️⃣ Front-end (Ionic / Angular)

### Exemple permisos

```ts
canCreateInvoice =
  auth.hasPermission('billing.create') &&
  auth.belongsToOrganization(invoice.issuer.id)
```

```html
<app-invoice-editor *ngIf="canCreateInvoice" />
```

---

## ⚠️ Errors habituals

❌ Patient com a client únic
❌ Barrejar nòmines amb factures
❌ Hardcodejar fluxos
❌ No separar context
❌ No preparar sales

---

## ✅ Resum PAS 27

* ✔️ BC Billing independent
* ✔️ Multi-actor real
* ✔️ Preparat per sales
* ✔️ Preparat per assegurances
* ✔️ Compatible amb derivacions

---

## PAS 28 (natural)

Opcions següents:
1️⃣ **Room & Resource Management (sales, equipament)**
2️⃣ **Insurance Claims (flux complet)**
3️⃣ **Marketplace & revenue sharing**

Digues cap on vols anar i **seguim** 🚀


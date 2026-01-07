Perfecte.
👉 **PAS 20 — Clinical Records BC (Història clínica) — DDD, seguretat i traçabilitat**
Seguim **pas a pas**, amb el mateix nivell de rigor que Scheduling.

<br />

# PAS 20 — Clinical Records (EHR-lite però seriós)

## 20️⃣1️⃣ Responsabilitat del BC Clinical Records

Aquest BC **NO**:

* decideix permisos (ho fa Identity)
* envia notificacions
* gestiona agenda

Aquest BC **SÍ**:

* gestiona informació clínica
* controla versions
* assegura integritat
* manté traçabilitat mèdico-legal

<br />

## 20️⃣2️⃣ Principis clau (sanitari real)

1. **La dada clínica és immutable**
2. Sempre hi ha autor
3. Tot canvi genera nova versió
4. Mai s’esborra, només s’afegeix
5. Tot accés és auditable

<br />

## 20️⃣3️⃣ On viu això (BC propi)

📁 `modules/clinical-records`

```txt
clinical-records/
├── domain/
│   ├── aggregates/
│   │   └── ClinicalRecord.ts
│   ├── entities/
│   │   └── ClinicalEntry.ts
│   ├── value-objects/
│   │   ├── EntryType.ts
│   │   └── Author.ts
│   ├── repositories/
│   │   └── ClinicalRecordRepository.ts
├── application/
│   ├── commands/
│   │   ├── AddClinicalEntry/
│   │   └── CloseClinicalRecord/
│   ├── queries/
│   │   └── GetClinicalRecord
├── infrastructure/
│   └── prisma/
```

<br />

## 20️⃣4️⃣ Aggregate root — ClinicalRecord

📁 `modules/clinical-records/domain/aggregates/ClinicalRecord.ts`

```ts
export class ClinicalRecord {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly createdAt: Date,
    private entries: ClinicalEntry[] = [],
    public isClosed: boolean = false
  ) {}

  addEntry(entry: ClinicalEntry) {
    if (this.isClosed) {
      throw new Error('Clinical record is closed')
    }
    this.entries.push(entry)
  }

  close() {
    this.isClosed = true
  }

  getEntries(): ClinicalEntry[] {
    return [...this.entries]
  }
}
```

<br />

## 20️⃣5️⃣ Entity — ClinicalEntry (immutable)

📁 `modules/clinical-records/domain/entities/ClinicalEntry.ts`

```ts
export class ClinicalEntry {
  constructor(
    public readonly id: string,
    public readonly type: EntryType,
    public readonly content: string,
    public readonly author: Author,
    public readonly createdAt: Date
  ) {}
}
```

<br />

## 20️⃣6️⃣ Value Objects

### EntryType

📁 `modules/clinical-records/domain/value-objects/EntryType.ts`

```ts
export type EntryType =
  | 'NOTE'
  | 'DIAGNOSIS'
  | 'OBSERVATION'
  | 'PRESCRIPTION'
  | 'REPORT'
```

<br />

### Author

📁 `modules/clinical-records/domain/value-objects/Author.ts`

```ts
export class Author {
  constructor(
    public readonly professionalId: string,
    public readonly role: string
  ) {}
}
```

<br />

## 20️⃣7️⃣ Persistència (Prisma)

📁 `prisma/schema.prisma`

```prisma
model ClinicalRecord {
  id         String   @id
  patientId  String
  isClosed   Boolean
  createdAt DateTime
}

model ClinicalEntry {
  id               String   @id
  clinicalRecordId String
  type             String
  content          String
  authorId         String
  authorRole       String
  createdAt        DateTime

  @@index([clinicalRecordId])
}
```

<br />

## 20️⃣8️⃣ Command — Afegir entrada clínica

📁
`modules/clinical-records/application/commands/AddClinicalEntryHandler.ts`

```ts
export class AddClinicalEntryHandler {
  constructor(
    private readonly repo: ClinicalRecordRepository
  ) {}

  async execute(cmd: {
    recordId: string
    type: EntryType
    content: string
    authorId: string
    authorRole: string
  }) {

    const record = await this.repo.findById(cmd.recordId)
    if (!record) throw new Error('Record not found')

    const entry = new ClinicalEntry(
      uuid(),
      cmd.type,
      cmd.content,
      new Author(cmd.authorId, cmd.authorRole),
      new Date()
    )

    record.addEntry(entry)
    await this.repo.save(record)

    // Event: ClinicalEntryAdded
  }
}
```

<br />

## 20️⃣9️⃣ Autorització (clau)

Abans del command:

```ts
await authz.canAccess({
  actorId,
  permission: 'clinicalRecord.write',
  scope: new AccessScope('PATIENT', patientId),
  patientId,
  purpose: new ConsentPurpose('CARE')
})
```

👉 ClinicalRecords **no sap res** de permisos

<br />

## 21️⃣ CQRS — Read Model clínic

📁
`modules/clinical-records/read-models/ClinicalRecordRM.ts`

```ts
export interface ClinicalRecordRM {
  recordId: string
  patientId: string
  isClosed: boolean
  entries: {
    id: string
    type: EntryType
    content: string
    author: string
    createdAt: string
  }[]
}
```

<br />

## 22️⃣ Auditoria (obligatòria)

Cada:

* lectura
* escriptura
* accés d’emergència

👉 Event:

```ts
ClinicalRecordAccessed
```

<br />

## 23️⃣ Front-end (Ionic / Angular)

* vista cronològica
* només append
* bloqueig si tancat
* avisos de consentiment

```html
<app-clinical-timeline
  [entries]="record.entries">
</app-clinical-timeline>
```

<br />

## ⚠️ Errors habituals (molt greus)

❌ Permetre editar entrades
❌ Esborrar informació
❌ Barrejar permisos dins BC
❌ No versionar
❌ No auditar lectures

<br />

## ✅ Resum PAS 20

* ✔️ Aggregate immutable
* ✔️ Append-only
* ✔️ Separació permisos / domini
* ✔️ Legalment sòlid
* ✔️ Preparat per escalar

<br />

## PAS 21 (natural)

Opcions següents:
1️⃣ **Attachments & documents (PDF, imatges)**
2️⃣ **Clinical templates & forms**
3️⃣ **FHIR interoperability (light)**
4️⃣ **Billing / Insurance**

Digues cap on vols anar i **seguim**.

Perfecte.
👉 **PAS 22 — Clinical Templates & Structured Forms (dades clíniques estructurades)**
Seguim **pas a pas**, ampliant Clinical Records sense trencar immutabilitat ni DDD.

---

# PAS 22 — Clinical Templates & Forms

## 22️⃣1️⃣ Problema real

* Notes lliures ❌ (difícil d’analitzar)
* Formularis estructurats ✔️
* Versions de protocols
* Camps obligatoris
* Reutilització entre professionals
* Preparar interoperabilitat (FHIR, informes, BI)

👉 **El text lliure continua existint**
👉 Però afegim **estructura**

---

## 22️⃣2️⃣ Principis clau

1. Template ≠ Dada clínica
2. El template és **configuració**
3. Les respostes són **immutables**
4. Versionar templates
5. No editar submissions

---

## 22️⃣3️⃣ BC propi: Clinical Templates

📁 `modules/clinical-templates`

```txt
clinical-templates/
├── domain/
│   ├── aggregates/
│   │   └── ClinicalTemplate.ts
│   ├── entities/
│   │   └── TemplateField.ts
│   ├── value-objects/
│   │   ├── FieldType.ts
│   │   └── TemplateVersion.ts
│   └── repositories/
│       └── ClinicalTemplateRepository.ts
├── application/
│   ├── commands/
│   │   ├── CreateTemplate
│   │   └── PublishTemplate
│   ├── queries/
│   │   └── GetTemplate
├── infrastructure/
```

---

## 22️⃣4️⃣ Aggregate — ClinicalTemplate

📁 `modules/clinical-templates/domain/aggregates/ClinicalTemplate.ts`

```ts
export class ClinicalTemplate {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly version: TemplateVersion,
    private fields: TemplateField[],
    public published: boolean = false
  ) {}

  publish() {
    if (this.published) {
      throw new Error('Already published')
    }
    this.published = true
  }

  getFields(): TemplateField[] {
    return [...this.fields]
  }
}
```

---

## 22️⃣5️⃣ Entity — TemplateField

📁 `modules/clinical-templates/domain/entities/TemplateField.ts`

```ts
export class TemplateField {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly type: FieldType,
    public readonly required: boolean
  ) {}
}
```

---

## 22️⃣6️⃣ Value Objects

### FieldType

📁 `modules/clinical-templates/domain/value-objects/FieldType.ts`

```ts
export type FieldType =
  | 'TEXT'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'SELECT'
  | 'DATE'
```

---

### TemplateVersion

```ts
export class TemplateVersion {
  constructor(
    public readonly major: number,
    public readonly minor: number
  ) {}

  toString() {
    return `${this.major}.${this.minor}`
  }
}
```

---

## 22️⃣7️⃣ Persistència (Prisma)

📁 `prisma/schema.prisma`

```prisma
model ClinicalTemplate {
  id        String   @id
  name      String
  version   String
  published Boolean
}

model TemplateField {
  id         String   @id
  templateId String
  label      String
  type       String
  required   Boolean

  @@index([templateId])
}
```

---

## 22️⃣8️⃣ Submissions (dada clínica real)

👉 **Viu dins Clinical Records**

📁 `modules/clinical-records/domain/entities/ClinicalFormSubmission.ts`

```ts
export class ClinicalFormSubmission {
  constructor(
    public readonly id: string,
    public readonly templateId: string,
    public readonly templateVersion: string,
    public readonly answers: Record<string, any>,
    public readonly author: Author,
    public readonly createdAt: Date
  ) {}
}
```

👉 **Immutable**
👉 Referència exacta a la versió del template

---

## 22️⃣9️⃣ Afegir submission al ClinicalRecord

📁
`modules/clinical-records/application/commands/AddFormSubmissionHandler.ts`

```ts
export class AddFormSubmissionHandler {
  constructor(
    private readonly recordRepo: ClinicalRecordRepository,
    private readonly templateRepo: ClinicalTemplateRepository
  ) {}

  async execute(cmd: {
    recordId: string
    templateId: string
    answers: Record<string, any>
    authorId: string
    authorRole: string
  }) {

    const template =
      await this.templateRepo.findPublished(cmd.templateId)

    if (!template) {
      throw new Error('Template not available')
    }

    // Validació camps requerits
    for (const field of template.getFields()) {
      if (field.required && cmd.answers[field.id] === undefined) {
        throw new Error(`Missing field ${field.label}`)
      }
    }

    const record = await this.recordRepo.findById(cmd.recordId)

    record.addEntry(
      new ClinicalFormSubmission(
        uuid(),
        template.id,
        template.version.toString(),
        cmd.answers,
        new Author(cmd.authorId, cmd.authorRole),
        new Date()
      )
    )

    await this.recordRepo.save(record)
  }
}
```

---

## 23️⃣ Read Model — Formulari renderitzable

📁
`modules/clinical-templates/read-models/TemplateRM.ts`

```ts
export interface TemplateRM {
  id: string
  name: string
  version: string
  fields: {
    id: string
    label: string
    type: FieldType
    required: boolean
  }[]
}
```

---

## 24️⃣ Front-end (Ionic / Angular)

### Render dinàmic

```html
<app-dynamic-form
  [template]="template"
  (submit)="save($event)">
</app-dynamic-form>
```

👉 El front **no codifica formularis**
👉 Només interpreta metadata

---

## 25️⃣ Avantatges clau

* ✔️ Dada estructurada
* ✔️ Reutilitzable
* ✔️ Versionada
* ✔️ Preparada per FHIR
* ✔️ Analytics-friendly
* ✔️ Legalment sòlida

---

## ⚠️ Errors habituals

❌ Editar submissions
❌ Canviar template sense versionar
❌ Hardcodejar formularis
❌ Barrejar configuració i dades
❌ No validar requerits

---

## ✅ Resum PAS 22

* ✔️ Templates com a BC
* ✔️ Submissions immutables
* ✔️ Integració amb Clinical Records
* ✔️ Front-end dinàmic
* ✔️ Preparat per interoperabilitat

---

## PAS 23 (molt natural)

Opcions següents:
1️⃣ **FHIR interoperability (light)**
2️⃣ **Billing / Insurance**
3️⃣ **Observability & audit trail avançat**
4️⃣ **Multi-tenant hard isolation**

Digues cap on vols anar i **seguim**.

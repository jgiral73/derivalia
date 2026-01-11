Perfecte.
👉 **PAS 21 — Attachments & Documents (PDF, imatges, fitxers clínics)**
Seguim **pas a pas**, coherent amb Clinical Records, autorització, consentiments i auditoria.

<br />

# PAS 21 — Gestió de documents clínics

## 21️⃣1️⃣ Problema real que resolem

* Informes PDF
* Resultats de proves
* Imatges
* Documents signats
* Arxius pesats (NO a la BD)

Requisits sanitaris:

* traçabilitat
* integritat
* control d’accés
* versions
* no esborrar mai

<br />

## 21️⃣2️⃣ Principis clau (molt importants)

1. **El document NO és el contingut**
2. El BC guarda **metadades**
3. El fitxer viu a object storage (S3, GCS, MinIO…)
4. Accés sempre **signat i temporal**
5. Auditoria de cada descàrrega

<br />

## 21️⃣3️⃣ On viu això (BC propi)

📁 `modules/documents`

```txt
documents/
├── domain/
│   ├── aggregates/
│   │   └── Document.ts
│   ├── value-objects/
│   │   ├── DocumentType.ts
│   │   ├── DocumentStatus.ts
│   │   └── StorageRef.ts
│   └── repositories/
│       └── DocumentRepository.ts
├── application/
│   ├── commands/
│   │   ├── CreateDocument
│   │   └── AttachToClinicalRecord
│   ├── queries/
│   │   └── GetDocumentAccess
│   └── services/
│       └── DocumentAccessService.ts
├── infrastructure/
│   ├── storage/
│   │   └── S3StorageAdapter.ts
│   └── prisma/
```

<br />

## 21️⃣4️⃣ Aggregate root — Document

📁 `modules/documents/domain/aggregates/Document.ts`

```ts
export class Document {
  constructor(
    public readonly id: string,
    public readonly ownerPatientId: string,
    public readonly type: DocumentType,
    public readonly storage: StorageRef,
    public status: DocumentStatus,
    public readonly createdAt: Date,
    public readonly createdBy: string
  ) {}

  markAttached() {
    this.status = 'ATTACHED'
  }
}
```

<br />

## 21️⃣5️⃣ Value Objects

### DocumentType

📁 `modules/documents/domain/value-objects/DocumentType.ts`

```ts
export type DocumentType =
  | 'CLINICAL_REPORT'
  | 'LAB_RESULT'
  | 'IMAGE'
  | 'CONSENT_FORM'
```

<br />

### DocumentStatus

```ts
export type DocumentStatus =
  | 'UPLOADED'
  | 'ATTACHED'
  | 'ARCHIVED'
```

<br />

### StorageRef

📁 `modules/documents/domain/value-objects/StorageRef.ts`

```ts
export class StorageRef {
  constructor(
    public readonly bucket: string,
    public readonly path: string,
    public readonly checksum: string
  ) {}
}
```

👉 **Checksum = integritat legal**

<br />

## 21️⃣6️⃣ Persistència (Prisma)

📁 `prisma/schema.prisma`

```prisma
model Document {
  id               String   @id
  ownerPatientId   String
  type             String
  bucket           String
  path             String
  checksum         String
  status           String
  createdBy        String
  createdAt        DateTime
}
```

<br />

## 21️⃣7️⃣ Upload — flux correcte

1️⃣ Backend crea document (metadata)
2️⃣ Backend retorna **URL signada**
3️⃣ Front puja fitxer directament
4️⃣ Backend valida checksum
5️⃣ Document queda actiu

<br />

## 21️⃣8️⃣ Command — CreateDocument

📁
`modules/documents/application/commands/CreateDocumentHandler.ts`

```ts
export class CreateDocumentHandler {
  constructor(
    private readonly repo: DocumentRepository,
    private readonly storage: StorageService
  ) {}

  async execute(cmd: {
    patientId: string
    type: DocumentType
    createdBy: string
  }) {

    const ref = this.storage.prepareUpload()

    const doc = new Document(
      uuid(),
      cmd.patientId,
      cmd.type,
      ref,
      'UPLOADED',
      new Date(),
      cmd.createdBy
    )

    await this.repo.save(doc)

    return {
      documentId: doc.id,
      uploadUrl: this.storage.getSignedUploadUrl(ref)
    }
  }
}
```

<br />

## 21️⃣9️⃣ Attach a Clinical Record

📁
`modules/documents/application/commands/AttachToClinicalRecordHandler.ts`

```ts
export class AttachToClinicalRecordHandler {
  constructor(
    private readonly repo: DocumentRepository
  ) {}

  async execute(cmd: {
    documentId: string
    recordId: string
  }) {

    const doc = await this.repo.findById(cmd.documentId)
    if (!doc) throw new Error('Document not found')

    doc.markAttached()
    await this.repo.save(doc)

    // Event: DocumentAttachedToClinicalRecord
  }
}
```

<br />

## 22️⃣ Accés al document (DESCÀRREGA)

📁
`modules/documents/application/services/DocumentAccessService.ts`

```ts
export class DocumentAccessService {
  constructor(
    private readonly authz: AuthorizationService,
    private readonly storage: StorageService
  ) {}

  async getDownloadUrl(input: {
    actorId: string
    document: Document
    patientId: string
  }) {

    await this.authz.canAccess({
      actorId: input.actorId,
      permission: 'document.read',
      scope: new AccessScope('PATIENT', input.patientId),
      patientId: input.patientId,
      purpose: new ConsentPurpose('CARE')
    })

    return this.storage.getSignedDownloadUrl(
      input.document.storage
    )
  }
}
```

👉 URL **temporal** (ex: 60s)

<br />

## 23️⃣ Auditoria (obligatòria)

* upload
* attach
* download
* access denied

👉 Event:

```ts
DocumentDownloaded
```

<br />

## 24️⃣ Front-end (Ionic / Angular)

```html
<ion-button
  (click)="download(doc)"
  *ngIf="canDownload">
  Descarregar
</ion-button>
```

👉 El front **mai** veu bucket/path

<br />

## ⚠️ Errors habituals (molt greus)

❌ Guardar binaris a la BD
❌ URL pública permanent
❌ Sense checksum
❌ Sense auditoria
❌ Permetre overwrite

<br />

## ✅ Resum PAS 21

* ✔️ BC propi
* ✔️ Object storage
* ✔️ URLs signades
* ✔️ Integritat legal
* ✔️ Autorització + consentiment
* ✔️ Auditoria completa

<br />

## PAS 22 (següent, molt natural)

Opcions clau:
1️⃣ **Clinical templates & structured forms**
2️⃣ **FHIR interoperability (light)**
3️⃣ **Billing / Insurance**
4️⃣ **Observability & audit trail avançat**

Digues cap on vols anar i **seguim**.


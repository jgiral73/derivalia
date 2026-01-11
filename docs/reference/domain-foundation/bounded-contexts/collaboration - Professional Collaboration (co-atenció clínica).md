Molt bona observació — **aquest context és clau** i, efectivament, **no és ni derivació ni tractament**.
És un **quart tipus de relació professional–pacient** que mereix **BC propi**.

Seguim **pas a pas**, encaixant-ho amb tot el core que ja tenim, **sense trencar res**.

---

# PAS 29 — Professional Collaboration (co-atenció clínica)

## 29️⃣1️⃣ Delimitació del problema (important)

El que descrius **NO és**:

❌ Derivació
→ el professional NO deixa el pacient

❌ Tractament compartit clàssic
→ no hi ha canvi de responsable principal

❌ Accés lliure
→ hi ha límits, temps i especialitat

👉 **És una col·laboració clínica acotada**

---

## 29️⃣2️⃣ Definició de domini (precisa)

> **Una col·laboració és una relació temporal i finalista on un professional sol·licita a un altre suport clínic especialitzat sobre un pacient, sense cedir-ne la responsabilitat principal.**

Característiques:

* Temporal
* Amb objectiu clínic concret
* Amb especialitat explícita
* Amb consentiment del pacient
* Amb permisos limitats
* Auditada

---

## 29️⃣3️⃣ Decisions DDD clau

### ✔️ Nou BC propi

**No** dins Patient
**No** dins Clinical Records
**No** dins Scheduling

👉 BC independent: **Professional Collaboration**

---

## 29️⃣4️⃣ Estructura del BC

📁 `modules/collaboration`

```txt
collaboration/
├── domain/
│   ├── aggregates/
│   │   └── Collaboration.ts
│   ├── entities/
│   │   └── CollaborationScope.ts
│   ├── value-objects/
│   │   ├── CollaborationStatus.ts
│   │   ├── CollaborationRole.ts
│   │   ├── CollaborationPurpose.ts
│   │   └── TimeRange.ts
│   ├── repositories/
│   │   └── CollaborationRepository.ts
│   └── events/
│       ├── CollaborationRequested.ts
│       ├── CollaborationAccepted.ts
│       └── CollaborationEnded.ts
├── application/
│   ├── commands/
│   │   ├── RequestCollaboration
│   │   ├── AcceptCollaboration
│   │   └── EndCollaboration
│   ├── queries/
│   │   └── GetActiveCollaborations
├── infrastructure/
│   └── prisma/
│       └── CollaborationRepositoryPrisma.ts
```

---

## 29️⃣5️⃣ Aggregate — Collaboration

📁
`modules/collaboration/domain/aggregates/Collaboration.ts`

```ts
export class Collaboration {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly requestedBy: string,   // professionalId
    public readonly collaboratorId: string, // professionalId
    public readonly purpose: CollaborationPurpose,
    public readonly scope: CollaborationScope,
    public readonly period: TimeRange,
    public status: CollaborationStatus = 'REQUESTED'
  ) {}

  accept() {
    if (this.status !== 'REQUESTED') {
      throw new Error('Invalid state')
    }
    this.status = 'ACTIVE'
  }

  end() {
    if (this.status !== 'ACTIVE') {
      throw new Error('Only active collaborations can be ended')
    }
    this.status = 'ENDED'
  }
}
```

👉 **Responsabilitat principal NO canvia**

---

## 29️⃣6️⃣ Purpose (especialitat / motiu)

📁
`modules/collaboration/domain/value-objects/CollaborationPurpose.ts`

```ts
export class CollaborationPurpose {
  constructor(
    public readonly specialty: string, // "Addiccions"
    public readonly description?: string
  ) {}
}
```

---

## 29️⃣7️⃣ Scope (què pot fer el col·laborador)

📁
`modules/collaboration/domain/entities/CollaborationScope.ts`

```ts
export class CollaborationScope {
  constructor(
    public readonly canViewClinicalRecords: boolean,
    public readonly canAddNotes: boolean,
    public readonly canSuggestTreatment: boolean,
    public readonly canAccessForms: boolean
  ) {}
}
```

👉 Exemple:

* pot llegir historial
* pot afegir notes
* NO pot modificar diagnòstics
* NO pot facturar directament al pacient

---

## 29️⃣8️⃣ TimeRange (temporalitat obligatòria)

📁
`modules/collaboration/domain/value-objects/TimeRange.ts`

```ts
export class TimeRange {
  constructor(
    public readonly from: Date,
    public readonly to?: Date
  ) {
    if (to && to < from) {
      throw new Error('Invalid time range')
    }
  }

  isActive(date = new Date()) {
    return this.from <= date && (!this.to || date <= this.to)
  }
}
```

👉 **Cap col·laboració és indefinida per defecte**

---

## 29️⃣9️⃣ Flux complet (realista)

### 1️⃣ Terapeuta Gestalt sol·licita col·laboració

```ts
RequestCollaboration {
  patientId,
  collaboratorId,
  purpose: 'Addiccions',
  scope: {
    canViewClinicalRecords: true,
    canAddNotes: true,
    canSuggestTreatment: true
  },
  period: 3 months
}
```

→ `CollaborationRequested`

---

### 2️⃣ Especialista accepta

```ts
collaboration.accept()
```

→ `CollaborationAccepted`

---

### 3️⃣ Consentiment pacient

👉 Reutilitzem BC `Consent`

```ts
purpose: 'COLLABORATION'
scope: 'LIMITED'
```

---

### 4️⃣ Enforcement en runtime

📁
`ConsentGuard + CollaborationGuard`

```ts
canAccessClinicalRecord(user, patientId) {
  return (
    isPrimaryTherapist ||
    hasActiveCollaboration(user.id, patientId)
  )
}
```

---

## 🔟 Integració amb Clinical Records

### Notes del col·laborador

📁
`ClinicalEntry`

```ts
authorRole: 'COLLABORATOR'
collaborationId?: string
```

👉 Traçabilitat total
👉 No confusió d’autoria

---

## 29️⃣11️⃣ Integració amb Billing

Exemples:

* Professional → Professional (hores col·laboració)
* Organització → Professional

```ts
context: 'COLLABORATION'
reference: collaborationId
```

👉 El pacient **no sempre paga**

---

## 29️⃣12️⃣ Integració amb Audit

Cada accés:

```ts
purpose: 'COLLABORATION'
resource: ClinicalRecord
```

---

## ⚠️ Errors habituals (molt importants)

❌ Tractar-ho com derivació
❌ Accés il·limitat
❌ Sense límit temporal
❌ Sense consentiment explícit
❌ Sense audit diferenciat

---

## ✅ Resum PAS 29

* ✔️ BC propi i net
* ✔️ Relació professional–professional–pacient
* ✔️ Especialitat explícita
* ✔️ Permisos limitats
* ✔️ Temporal i auditable
* ✔️ Compatible amb billing, audit i consent

---

## On encaixa al roadmap

* **MVP**: col·laboracions simples ✔️
* **Scale**: xarxes de professionals
* **Ecosystem**: consultors externs, intercentres

---

### Següent pas natural

Opcions:
1️⃣ **UX flows de col·laboració (MVP)**
2️⃣ **Regles legals i consentiment específic**
3️⃣ **Col·laboració + sales + agenda compartida**

Digues quin i **seguim** 👌


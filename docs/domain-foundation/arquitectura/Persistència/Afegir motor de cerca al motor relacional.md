Molt bona pregunta — això és **arquitectura de plataforma a mig/llarg termini**, i el fet que ho pensis **ara** és exactament el que diferencia un MVP sòlid d’un que es queda encallat.

Anem **pas a pas**, des de principis fins a impacte real en DDD, infra i equips.

---

# 🧭 0. Context i decisió base

> **MariaDB continua sent la Source of Truth (SoT)**
> El motor de cerca **NO és autoritatiu**

El search engine:

* és **derivat**
* és **eventualment consistent**
* serveix **només per consulta**

---

# 🧱 1. Nova peça a l’arquitectura

Afegim un **Search BC / Search Infrastructure** (segons fase).

```text
┌───────────────┐
│  MariaDB      │  ← Source of Truth
└───────┬───────┘
        │ Domain Events
        ▼
┌──────────────────┐
│ Search Engine    │  ← Elasticsearch / OpenSearch / Meilisearch
└──────────────────┘
```

👉 **No substitueix res**, s’afegeix.

---

# 🧩 2. Impacte en DDD (molt important)

## ❌ El que NO farem

* No posar el search engine dins del domini
* No fer repositoris duals
* No consultar search engine per decisions de negoci

---

## ✅ El que SÍ farem

### Patró: **Read Model separat (CQRS light)**

* **Commands** → MariaDB
* **Queries de cerca** → Search Engine

---

# 🧠 3. Canvis a nivell de BC

## Clinical Records BC

### Abans

```text
ClinicalRecordRepository → MariaDB
```

### Després

```text
ClinicalRecordRepository → MariaDB (SoT)
ClinicalRecordSearchRepository → Search Engine (read-only)
```

👉 Són **interfaces diferents**

---

# 🧩 4. Nou subdomini: Search (tècnic)

📁 `src/search`

```text
search/
 ├─ application/
 │   ├─ index/
 │   └─ query/
 ├─ domain/
 │   └─ SearchDocument.ts
 └─ infrastructure/
     ├─ elastic/
     └─ meilisearch/
```

👉 **No és BC de negoci**, és **supporting / generic subdomain**

---

# 🔁 5. Sincronització: Domain Events

## Exemple: Clinical Record Created

### Event

📄 `clinical-records/domain/events/ClinicalRecordCreated.ts`

```ts
export class ClinicalRecordCreated {
  constructor(
    public readonly recordId: string,
    public readonly patientId: string,
    public readonly professionalId: string,
    public readonly content: string,
    public readonly createdAt: Date
  ) {}
}
```

---

### Event Handler (Search)

📄 `search/application/index/IndexClinicalRecordHandler.ts`

```ts
export class IndexClinicalRecordHandler {
  async handle(event: ClinicalRecordCreated) {
    await this.searchRepository.index({
      id: event.recordId,
      patientId: event.patientId,
      professionalId: event.professionalId,
      content: event.content,
      createdAt: event.createdAt
    });
  }
}
```

👉 **Eventual consistency assumida**

---

# 🔍 6. Model de document de cerca

📄 `search/domain/SearchDocument.ts`

```ts
export interface ClinicalRecordSearchDocument {
  id: string;
  patientId: string;
  professionalId: string;
  content: string;
  tags?: string[];
  createdAt: Date;
}
```

❗ No tot el model clínic
❗ Només el necessari per buscar

---

# 🔐 7. Seguretat i permisos (crític)

## Regla d’or

> **El search engine no decideix mai accés**

### Flux correcte

```text
Search Query
 → Search Engine (IDs)
   → Filter via MariaDB / Policy
     → Resultat final
```

O bé:

* Indexar només documents accessibles per aquell professional
* O filtrar després (més segur)

👉 En salut, **prefereix seguretat a performance**

---

# 🧪 8. UX: què veu l’usuari?

### Barra de cerca

* Cerca textual
* Filtres:

  * Pacient
  * Data
  * Professional

### Resultats

* Snippets
* Data
* Context

👉 Click → carregar detall des de MariaDB

---

# 🧠 9. Impacte en arquitectura general

## Abans (MVP)

* Monòlit modular
* MariaDB
* CQRS lleuger

## Després (Scale)

* Mateix monòlit
* Afegim Search infra
* Async events

👉 **No cal microserveis**

---

# 📈 10. Escalabilitat progressiva

| Fase      | Decisió                 |
| --------- | ----------------------- |
| MVP       | Sense search engine     |
| Scale     | Search engine read-only |
| Ecosystem | Search multi-BC         |

---

# ⚠️ Errors greus a evitar

❌ Fer del search la SoT
❌ Consultes mixtes (write + search)
❌ Saltar-se policies de domini
❌ Indexar dades sensibles innecessàries

---

# 🧭 11. Decisions recomanades (resum)

✔️ MariaDB segueix sent SoT
✔️ Search engine = read model
✔️ CQRS light
✔️ Domain Events per sync
✔️ Seguretat sempre al domini

---

## Següent pas natural

Podem seguir per:
1️⃣ **Model concret d’indexació per Clinical Records**
2️⃣ **Estratègia de permisos en search (filtering vs per-index)**
3️⃣ **Roadmap tècnic MVP → Search → AI**

Digues quin i **seguim** 🚀

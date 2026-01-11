Pregunta **excel·lent** i, sobretot, **molt perillosa** si es resol malament al principi.
Aquí és on molts productes B2B/health **es sobremodulen o es bloquegen**.

Anem **pas a pas**, amb criteri de **DDD + producte + cost operatiu**.

---

# 0️⃣ El principi rector (clau)

> **No totes les enumeracions són iguals**
> Tractar-les totes com a “configurables” és un error greu.

La pregunta correcta no és *“han de ser dinàmiques?”*
sinó:

👉 **Quin és el cost de no poder-les canviar?**

---

# 1️⃣ Classificació d’enumeracions (molt important)

Divideix-les en **4 categories clares**.

---

## 🟩 TIPUS A — Enumeracions CORE (dures)

**Exemples**

* `PatientGender`
* `ConsentStatus`
* `ProfessionalOnboardingStatus`
* `TreatmentState`

**Característiques**

* Semàntica forta de domini
* Usades en lògica crítica
* Pocs canvis en el temps

**Implementació**

```ts
export enum ConsentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REVOKED = 'REVOKED'
}
```

✔️ Compile-time safety
✔️ Simples
❌ No configurables

👉 **Aquestes NO s’han de dinamitzar mai**

---

## 🟦 TIPUS B — Enumeracions REFERENCIALS compartides

**Exemples**

* Especialitats professionals (psicologia, addiccions…)
* Tipus de document clínic
* Tipus de cita

**Característiques**

* Compartides entre tenants
* Evolucionen lentament
* No afecten lògica crítica

👉 **Aquestes són les perilloses**

---

### Implementació recomanada

📁 `reference-data` (BC de suport)

```text
reference-data/
 ├─ domain/
 │   ├─ ReferenceType.ts
 │   └─ ReferenceValue.ts
 ├─ infrastructure/
 │   └─ prisma/
 └─ application/
```

```ts
// domain/ReferenceValue.ts
export class ReferenceValue {
  constructor(
    public readonly code: string,
    public readonly label: string,
    public readonly active: boolean
  ) {}
}
```

📌 Guardades en DB
📌 Seed inicial
📌 Controlades per tu

---

### A DB

```sql
reference_values
- id
- type (SPECIALTY, DOCUMENT_TYPE)
- code
- label
- active
```

✔️ Extensibles
✔️ Compartides
✔️ Sense tocar codi

---

## 🟨 TIPUS C — Enumeracions CONFIGURABLES PER TENANT

**Exemples**

* Categories internes d’una organització
* Etiquetes
* Tipus de sala

**Característiques**

* No afecten BCs crítics
* Impacten UX
* Alta variabilitat

👉 Aquestes **sí** són configurables.

---

### Model

```sql
tenant_reference_values
- tenant_id
- type
- code
- label
- active
```

✔️ Multi-tenant
✔️ Aïllament
❌ Més complexitat

---

## 🟥 TIPUS D — Enumeracions lliures (tags)

**Exemples**

* Etiquetes clíniques
* Notes
* Metadades

👉 No són enumeracions, són **text lliure**

---

# 2️⃣ On va la lògica? (DDD pur)

## Regla d’or

> **El domini només coneix CODES, no labels**

```ts
if (professional.specialtyCode === 'ADDICTIONS') {
  ...
}
```

❌ Mai:

```ts
if (specialty.label === 'Addiccions')
```

---

# 3️⃣ Impacte real en l’arquitectura

## MVP (fase 1)

✔️ TIPUS A → enums a codi
✔️ TIPUS B → taula compartida
❌ TIPUS C → NO encara
❌ TIPUS D → només on cal

👉 Arquitectura **simple**

---

## Scale (fase 2)

✔️ Admin UI per reference-data
✔️ Cache (Redis)
✔️ Event `ReferenceValueUpdated`

---

## Ecosystem (fase 3)

✔️ Versionat de referencials
✔️ Compatibilitat enrere
✔️ Marketplace / plugins

---

# 4️⃣ Performance & cache

Referencials:

* 99% read
* Canvis rars

👉 Cache agressiu

```ts
@Cacheable('reference-values')
getByType(type: string) {}
```

---

# 5️⃣ UX i frontend

Frontend:

* Carrega referencials al login
* Guarda en store (NgRx / signals)
* Mostra label localitzat

Backend:

* Retorna `code + label`

---

# 6️⃣ Errors comuns (alerta 🚨)

❌ Fer TOT configurable
❌ Guardar labels al domini
❌ Tenir enums duplicats FE/BE
❌ Canviar enums sense migració

---

# 7️⃣ Recomanació clara per la teva plataforma

| Categoria      | Decisió                  |
| -------------- | ------------------------ |
| Estat de flux  | Enum a codi              |
| Especialitats  | Reference-data compartit |
| Tipus document | Reference-data compartit |
| Sales          | Tenant-config            |
| Etiquetes      | Text lliure              |

---

# 🧠 Conclusió

✔️ Enumeracions **sí**, però classificades
✔️ Configurables només on aporta valor
✔️ Compartides millor que per-tenant al principi
✔️ El domini només coneix `code`
✔️ MVP → simple, extensible després

---

## Següent pas possible

1️⃣ Dissenyar **Reference Data BC complet**
2️⃣ Estratègia de **versionat d’enums**
3️⃣ Migracions segures quan canvien
4️⃣ Impacte en Search indexing

Digues quin i **seguim** 🔍


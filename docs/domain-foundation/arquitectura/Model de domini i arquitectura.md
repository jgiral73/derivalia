Perfecte. A continuació tens un **one-pager d’alta densitat**, pensat **explícitament perquè una IA (o tu d’aquí 6 mesos)** pugui **reconstruir fidelment el model de BCs, l’arquitectura i els matisos funcionals**, **sense perdre res important**.

No és màrqueting. És **memòria operativa del sistema**.

---

# 🧠 ONE-PAGE — MODEL DE DOMINI I ARQUITECTURA (BCs)

## 🎯 Visió general

Plataforma clínica professional, multi-rol, amb arquitectura **DDD + BCs**, pensada per créixer de **MVP → Scale → Ecosystem**. Backend **NestJS + TypeScript**, ORM **Prisma (MariaDB source of truth)**, frontend **Ionic/Angular**. Autorització basada en **capabilities + consent + estat d’onboarding**. Frontend i backend desacoblats per contractes (Swagger).

---

## 🧩 Bounded Contexts (BCs) PRINCIPALS

### 1️⃣ Identity & Access BC

**Responsabilitat:** identitat, rols, accés, onboarding.

* **Entitats**

  * `User` (base tècnica)
  * `Professional` (amb lifecycle)
  * `Patient` (pot existir sense user)
* **Estats de Professional**

  * `INVITED` → `REGISTERED` → `ONBOARDING_INCOMPLETE` → `ACTIVE`
* **Conceptes clau**

  * Rol ≠ Capability
  * Capabilities assignades per rol + estat
  * Progressive unlock (feature flags)
* **Infra**

  * JWT
  * Guards per rol, capability i estat
* **Nota crítica**

  * Un professional/pacient pot existir **abans de ser usuari del sistema**

---

### 2️⃣ Patient BC

**Responsabilitat:** gestió de pacients com a subjecte clínic.

* **Patient**

  * Pot no tenir user associat
  * Creat per professional
  * Relacionable amb múltiples professionals
* **Relacions**

  * Amb Professional (directa o via Treatment/Collaboration)
* **Accés**

  * Sempre subjecte a Consent BC
* **No inclou**

  * Historial clínic (això és ClinicalRecord BC)

---

### 3️⃣ Consent BC (nucli de seguretat clínica)

**Responsabilitat:** autorització clínica explícita.

* **Consent**

  * Subjecte: Patient
  * Actor: Professional
  * Scope: (read/write/specific domains)
  * Time-bound (inici/fi)
* **Tipus**

  * Explicit consent
  * Derived consent (col·laboracions)
* **Ús transversal**

  * Guards clínics
  * Search
  * Clinical records
* **Invariant**

  * Sense consent → cap accés clínic

---

### 4️⃣ Onboarding & Invitation (BC lògic transversal)

**Responsabilitat:** entrada progressiva al sistema.

* **Invitation**

  * Per professionals i pacients
  * Pot apuntar a email no registrat
* **Flux**

  * Invite → Accept → Partial access → Full onboarding
* **Estats**

  * Trackejats explícitament (no implícits)
* **Objectiu**

  * Permetre col·laboracions i consentiments abans del registre complet

---

### 5️⃣ Scheduling / Agenda BC

**Responsabilitat:** temps i cites.

* **Aggregates**

  * Availability
  * Slot
  * Appointment
* **Appointment**

  * Professional ↔ Patient
  * Lifecycle (created / confirmed / cancelled / completed)
* **Notes**

  * Agenda pot ser individual o futura compartida (org/rooms)
* **Integracions**

  * Billing (origen de factures)
  * Consent (necessari per crear cites clíniques)

---

### 6️⃣ Collaboration / Derivation BC

**Responsabilitat:** treball entre professionals.

* **Use case**

  * Professional A sol·licita ajuda de B per pacient X
* **Claus**

  * No requereix que B sigui user complet
  * Genera consentiments derivats
* **Permisos**

  * Temporals
  * Scope limitat (especialitat / cas)
* **Relació**

  * Pot existir sense Treatment formal

---

### 7️⃣ Billing & Insurance BC

**Responsabilitat:** facturació flexible.

* **Invoice**

  * Line items
  * Status lifecycle
* **Actors possibles**

  * Professional → Patient
  * Professional → Professional
  * Organization → Professional
  * Organization → Patient
* **Integració**

  * Appointment → Invoice
* **Fase MVP**

  * Billing manual + status
* **Fase avançada**

  * Insurance, claims, reports

---

### 8️⃣ ClinicalRecord BC (post-MVP però previst)

**Responsabilitat:** dades clíniques.

* **ClinicalRecord**

  * Notes
  * Documents
  * Estructurat
* **Accés**

  * Sempre via Consent
* **Preparat per**

  * Search engine
  * Read models desacoblats

---

## 🏗️ Arquitectura tècnica (per BC)

Cada BC té estructura fixa:

```
/<bc-name>
  /domain
    entities
    value-objects
    aggregates
    repositories (interfaces)
  /application
    use-cases
    services
    dtos
  /infrastructure
    prisma
    repositories (impl)
    controllers
```

* **Domain**: zero dependències
* **Application**: orquestració
* **Infrastructure**: NestJS, Prisma, HTTP

---

## 🔐 Autorització (clau global)

Accés = **AND** de:

* Identity (qui és)
* Capability (què pot fer)
* Consent (sobre qui)
* Estat onboarding (si pot fer-ho ja)

Implementat amb:

* Guards composables
* Decorators semàntics
* Feature flags

---

## 🔎 Dades & Search

* MariaDB = **source of truth**
* Search engine no relacional (futur)
* Sync async via events
* ACL aplicat també a la cerca

---

## 🧠 Principis no negociables

* BCs forts, poc acoblats
* Fluxos complets > features a mitges
* Estat explícit (no màgia)
* Consent com a first-class citizen
* Tot el que toca dades clíniques passa per guards

---

## ✅ Estat final esperat (MVP Beta)

* Professionals i pacients reals
* Onboarding complet
* Agenda i cites
* Billing bàsic
* Autorització clínica robusta
* Base sòlida per escalar sense reescriure

---

Si vols, el següent pas natural és:

* convertir aquest one-pager en **prompt base per una altra IA**
* o generar un **diagrama textual BC ↔ BC**
* o congelar-lo com a **“contracte d’arquitectura”**

Digues-me com seguim.

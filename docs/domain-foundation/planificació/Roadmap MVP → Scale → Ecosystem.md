Perfecte.
👉 **PAS 28 — Roadmap MVP → Scale → Ecosystem**
Ara ja **no estem dissenyant software**, estem **dissenyant un producte que pot créixer sense reescriure’s**.

Faré això en **3 capes molt clares**:

1. MVP (Beta real llançable)
2. Scale (creixement controlat)
3. Ecosystem (plataforma)

---

# 🟢 FASE 1 — MVP / BETA (0 → 6 mesos)

## Objectiu

Llançar una **plataforma clínica usable**, compliant i amb valor immediat.

---

## 1️⃣ Dominis actius (imprescindibles)

| BC                  | Estat      |
| ------------------- | ---------- |
| Identity & Access   | ✔️ complet |
| Tenancy             | ✔️ complet |
| Patient             | ✔️ complet |
| Scheduling          | ✔️ complet |
| Clinical Records    | ✔️ complet |
| Clinical Templates  | ✔️ complet |
| Billing (bàsic)     | ✔️ complet |
| Audit & Consent     | ✔️ complet |
| FHIR export (light) | ✔️ complet |

👉 **Això és un EHR funcional**

---

## 2️⃣ Funcionalitats MVP

### Professionals

* Gestió pacients
* Agenda
* Notes clíniques
* Formularis estructurats
* Facturació bàsica
* Derivacions simples
* Export FHIR

### Organitzacions

* Multi-professional
* Control d’accés
* Audit trail
* Facturació org → pacient / professional

### Pacients (lite)

* Accés a cites
* Consentiments
* Documents

---

## 3️⃣ Decisions tècniques MVP (NO canviar després)

✔️ DDD + modular monorepo
✔️ Multi-tenant hard isolation
✔️ Audit immutable
✔️ Consent runtime
✔️ Infra cloud-native

👉 **Aquestes decisions no es toquen mai**

---

## 4️⃣ KPI MVP

* Time-to-first-note < 10 min
* Cita creada < 30s
* Zero data leaks
* Export FHIR usable
* Factura emesa < 2 min

---

# 🟡 FASE 2 — SCALE (6 → 18 mesos)

## Objectiu

Passar de producte usable a **producte robust i comercialment escalable**.

---

## 5️⃣ Dominis nous (activació progressiva)

| BC                       | Quan       |
| ------------------------ | ---------- |
| Room & Resource          | 6–9 mesos  |
| Insurance Claims         | 9–12 mesos |
| Analytics (read-only)    | 9–12 mesos |
| Payments (Stripe / SEPA) | 12 mesos   |

---

## 6️⃣ Evolució del Billing

* Claims asseguradores
* Pagaments automàtics
* Regles de repartiment (%)
* Facturació recurrent
* Lloguer sales avançat

👉 Sense tocar factures existents

---

## 7️⃣ Escalabilitat tècnica

* Read replicas
* CQRS més clar
* Async events
* Projeccions optimitzades
* Cache per tenant

---

## 8️⃣ Escalabilitat organitzativa

* Clíniques mitjanes
* Xarxes de centres
* Franquícies
* Grups hospitalaris petits

---

# 🔵 FASE 3 — ECOSYSTEM (18+ mesos)

## Objectiu

Convertir el producte en **plataforma**.

---

## 9️⃣ Nous rols

* Labs
* Asseguradores
* Terapeutes externs
* Partners tecnològics
* AI providers

---

## 🔟 Marketplace d’integracions

BC nou: `Integrations`

* Webhooks
* Apps externes
* Connectors
* API keys
* Sandboxes

---

## 11️⃣ AI assistida (sense risc legal)

* Suggeriments de notes
* Resum clínic
* Alerts (no diagnòstic)
* QA clínica interna

👉 **AI com a suport, mai com a decisió**

---

## 12️⃣ Monetització avançada

* SaaS per professional
* % per factura
* Marketplace fees
* Premium compliance
* White-label

---

# 🔐 Decisions que protegeixen el futur

✔️ Domini independent
✔️ Events immutables
✔️ Audit legal
✔️ Anti-corruption layers
✔️ Tenant hard isolation

👉 Permet:

* pivotar
* integrar
* vendre
* certificar
* escalar

---

## 🧭 Visió final

> **No estàs construint un EHR**
> Estàs construint un **sistema operatiu clínic modular**

Amb:

* Core sòlid
* Escalabilitat real
* Ecosistema possible
* Sense reescriptures

---

## Següent pas (si vols)

Opcions naturals ara:
1️⃣ **Pla de llançament Beta (operatiu + legal)**
2️⃣ **Definició de MVP UX flows clau**
3️⃣ **Checklist CTO abans de producció**

Digues quin i **seguim** 🚀

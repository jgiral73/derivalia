Perfecte. Ara entrem en **planificació de veritat d’un MVP beta clínic**, pensat per **1 persona, 12 h/setmana**, amb IA ajudant però **sense fantasies**.

Objectiu final clar:

> 🎯 **MVP Beta funcional** que permeti:

* Identity & Access (professionals + pacients)
* Onboarding full cicle de vida (invitation → progressive unlock → full user)
* Gestió de pacients
* Agenda + cites
* Billing bàsic
* Base sòlida per escalar (DDD + BCs)

---

# 📦 DEFINICIÓ D’“MVP BETA” (IMPORTANT)

Aquest MVP **NO** inclou:

* Historial clínic avançat
* Motor de cerca
* Asseguradores complexes
* Facturació fiscal avançada
* Mobile polish

**Sí que inclou**:

* Fluxos complets
* Permisos reals
* UX usable (encara que simple)
* Dades consistents

---

# ⏱️ ESTIMACIÓ GLOBAL REALISTA

| Bloc                              | Hores          |
| --------------------------------- | -------------- |
| Core ja definit (fins on som ara) | 46 h           |
| Identity & onboarding complet     | 18 h           |
| Scheduling + Appointments         | 20 h           |
| Billing MVP                       | 14 h           |
| Integració + UX backend           | 10 h           |
| Frontend MVP (Ionic/Angular)      | 24 h           |
| Ajustos, bugs, buffer             | 12 h           |
| **TOTAL**                         | **~144 hores** |

---

# 🗓️ CALENDARITZACIÓ AMB 12 H/SETMANA

👉 **Durada total: ~12 setmanes (3 mesos)**
👉 Ritme sostenible
👉 Compatible amb vida real

---

## 🟩 FASE 1 — CORE & BASE (Setmanes 1–4)

📍 **Ja planificada abans**, la resumim:

### Resultat al final setmana 4

* Identity bàsic
* Patient BC
* Consent BC
* Guards + Swagger
* Arquitectura BC clara

⏱️ **46 h**
🗓️ **4 setmanes**

---

## 🟦 FASE 2 — IDENTITY + ONBOARDING (Setmanes 5–6)

🎯 Objectiu: **usuaris reals entrant al sistema**

### Inclou

* Professional invited vs full professional
* Patient invited vs patient user
* Estat d’onboarding
* Progressive unlock

### Setmana 5 (12 h)

| Tasca                         | H |
| ----------------------------- | - |
| Professional lifecycle states | 3 |
| Invitation model (shared)     | 2 |
| Accept invitation flow        | 3 |
| Guards segons onboarding      | 2 |
| Swagger + ajustos             | 2 |

### Setmana 6 (12 h)

| Tasca                        | H |
| ---------------------------- | - |
| Patient onboarding flow      | 4 |
| Consent UX flow backend      | 2 |
| Feature flags per onboarding | 3 |
| Refactors + integració       | 3 |

✅ Usuaris incomplets
✅ Conversió cap a full users

---

## 🟨 FASE 3 — AGENDA & CITES (Setmanes 7–8)

🎯 Objectiu: **valor central del producte**

### Scheduling BC

* Availability
* Slots
* Appointments

### Setmana 7 (12 h)

| Tasca                   | H |
| ----------------------- | - |
| Scheduling domain model | 3 |
| Availability + slots    | 4 |
| Appointment aggregate   | 3 |
| Prisma + repos          | 2 |

### Setmana 8 (12 h)

| Tasca                          | H |
| ------------------------------ | - |
| Appointment lifecycle          | 4 |
| Patient ↔ Professional linking | 3 |
| Guards + permissions           | 3 |
| Swagger                        | 2 |

✅ Cites creades
✅ Relació pacient–professional

---

## 🟧 FASE 4 — BILLING MVP (Setmanes 9–10)

🎯 Objectiu: **monetització mínima**

### Inclou

* Invoice
* Line items
* Pagament manual / status

### Setmana 9 (12 h)

| Tasca                | H |
| -------------------- | - |
| Billing domain model | 3 |
| Invoice aggregate    | 4 |
| Line items           | 2 |
| Prisma + repo        | 3 |

### Setmana 10 (12 h)

| Tasca                 | H |
| --------------------- | - |
| Invoice lifecycle     | 4 |
| Appointment → invoice | 3 |
| Permissions billing   | 3 |
| Swagger + UX          | 2 |

✅ Factures generables
✅ Relació amb cites

---

## 🟥 FASE 5 — FRONTEND MVP (Setmanes 11–12)

🎯 Objectiu: **producte usable**

### Setmana 11 (12 h)

| Tasca                  | H |
| ---------------------- | - |
| Ionic/Angular setup    | 2 |
| Auth + guards FE       | 3 |
| Patients list + detail | 4 |
| Agenda simple          | 3 |

### Setmana 12 (12 h)

| Tasca              | H |
| ------------------ | - |
| Create appointment | 4 |
| Billing view       | 3 |
| Onboarding UX      | 3 |
| Polir + bugs       | 2 |

✅ UX funcional
✅ Beta presentable

---

# 🧠 CLAU ESTRATÈGICA (MOLT IMPORTANT)

> **Amb 12 h/setmana, l’única manera d’arribar-hi és:**

✔️ Backend-first
✔️ Vertical slices
✔️ UX simple però completa
❌ Zero perfeccionisme

Aquest pla és **ambiciós però viable**.

---

# 📍 RESULTAT FINAL (12 setmanes)

Tindràs:

* Plataforma clínica beta
* Fluxos complets professionals/pacients
* Agenda + cites + billing
* Arquitectura preparada per scale
* Producte **mostrable a clients reals**

---

## ⏭️ Següent pas

Puc:
1️⃣ Fer **desglossament setmana a setmana amb checklist diària**
2️⃣ Fer **arquitectura concreta del Scheduling BC**
3️⃣ Fer **definició exacta de què entra i què NO entra al MVP**
4️⃣ Ajustar això a **8 setmanes (versió més agressiva)**

Digues-me quin i **seguim** 💪

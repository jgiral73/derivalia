Perfecte. Ara fem **planificació de veritat**, no de “startup PowerPoint”.

Context assumit:

* 👤 **1 sola persona**
* ⏱️ **12 h / setmana reals** (no més)
* 🤖 **IA escrivint codi** (Cursor-style)
* 🧠 Tu decideixes arquitectura, la IA accelera implementació
* 🎯 Objectiu: **arribar exactament fins on som ara**
  (core BCs + guards + consent + swagger)

Total treball estimat (ja calculat): **~46 hores**

---

# 🗓️ PLANIFICACIÓ REALISTA (12 h/setmana)

## 📊 Resum ràpid

| Setmanes  | Hores acumulades | Estat                       |
| --------- | ---------------- | --------------------------- |
| Setmana 1 | 12 h             | Infra base                  |
| Setmana 2 | 24 h             | Patient BC                  |
| Setmana 3 | 36 h             | Consent BC                  |
| Setmana 4 | 46 h             | Integració + estabilització |

👉 **Durada total: ~4 setmanes**

---

# 📆 PLANIFICACIÓ SETMANA A SETMANA

## 🟩 SETMANA 1 — Fonaments sòlids (12 h)

🎯 Objectiu: projecte executable amb arquitectura clara

### Tasques

| Tasca                                   | H |
| --------------------------------------- | - |
| Decidir arquitectura (BCs, DDD, guards) | 3 |
| Crear repo backend (NestJS)             | 1 |
| Configurar Prisma + MariaDB             | 2 |
| Estructura carpetes BC                  | 1 |
| Auth base (JWT placeholder)             | 2 |
| Capability model + decorator            | 3 |

✅ El projecte **arrenca**
✅ No hi ha encara funcionalitat de negoci
⚠️ No tocar Patient encara

---

## 🟩 SETMANA 2 — Patient BC (12 h)

🎯 Objectiu: primer BC usable end-to-end

### Tasques

| Tasca                           | H |
| ------------------------------- | - |
| Model domini Patient            | 2 |
| Repository interface            | 1 |
| Use cases (Create / Get / List) | 3 |
| Prisma schema + repo            | 2 |
| Controller + wiring             | 3 |
| Ajustos / errors                | 1 |

✅ `POST /patients`
✅ `GET /patients/:id`
✅ Swagger visible

---

## 🟩 SETMANA 3 — Consent BC (12 h)

🎯 Objectiu: autorització clínica real

### Tasques

| Tasca                 | H |
| --------------------- | - |
| Model domini Consent  | 2 |
| Repository interface  | 1 |
| GrantConsent use case | 2 |
| CheckConsent service  | 2 |
| Prisma schema + repo  | 2 |
| Controller + wiring   | 2 |
| Ajustos               | 1 |

✅ Consent concedible
✅ Consent verificable
⚠️ Encara no integrat amb guards clínics

---

## 🟩 SETMANA 4 — Integració + qualitat (10 h)

🎯 Objectiu: base robusta per escalar

### Tasques

| Tasca                               | H |
| ----------------------------------- | - |
| Guard clínic amb Consent            | 2 |
| Integració Patient ↔ Consent        | 2 |
| Swagger complet (Patient + Consent) | 2 |
| Refactors DDD                       | 2 |
| Normalitzar errors                  | 1 |
| Revisió final + backlog següent     | 1 |

⏳ Sobren **2 h buffer**
(imprescindible amb IA)

---

# 🧠 Com treballar aquestes 12 h (clau)

**No facis sessions llargues.**

Recomanat:

* 🟦 3 sessions de **4 h**
* o 🟦 4 sessions de **3 h**

Cada sessió:

1. 15’ → què vull acabar
2. 2–3 h → implementar amb IA
3. 30’ → revisar, netejar, decidir següent pas

---

# ⚠️ Errors habituals amb 12 h/setmana

❌ Intentar avançar frontend
❌ Refactor massa aviat
❌ Tests exhaustius ara
❌ Multi-tenant complet

✔️ Només **vertical slices**

---

# 🧭 Estat al final de la setmana 4

Tindràs:

* backend net, modular
* BCs ben delimitats
* autorització clínica real
* swagger usable
* base perfecte per:

  * Scheduling
  * ClinicalRecords
  * Frontend Ionic/Angular

---

## ⏭️ Següent pas quan vulguis

Puc:
1️⃣ Planificar **de setmana 5 a MVP beta usable**
2️⃣ Estimar **temps real per frontend Ionic**
3️⃣ Dissenyar **pla comercial + tècnic paral·lel**
4️⃣ Ajustar això a **ritme irregular (caps de setmana)**

Digues-me quin i **seguim pas a pas** 🚀

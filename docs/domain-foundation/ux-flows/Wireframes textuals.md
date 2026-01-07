Perfecte. **Seguim amb el pas que toca ara mateix**.

# PAS — WIREFRAMES TEXTUALS

## alineats amb *capabilities* (no amb rols)

Això connecta definitivament:
**DDD + UX + Guards + Frontend**

No són dibuixos:
són **contractes funcionals de pantalla**.

---

## 🔑 Principi rector

> **Una pantalla no existeix si no hi ha una capability que la sostingui**

No:

* “pantalla per rol”
* “pantalla per tipus d’usuari”

Sí:

* pantalla = conjunt de capabilities actives

---

# 1️⃣ Dashboard PROFESSIONAL

### Ruta

`/app/dashboard`

### Required capability

```ts
VIEW_PATIENT
```

---

### Wireframe textual

**HEADER**

* Nom professional
* Estat compte:

  * 🟡 Perfil incomplet → CTA “Completar perfil”
  * 🟢 Actiu

---

**MAIN**

* 🔹 Pacients actius (llista resum)

  * visible si: `VIEW_PATIENT`
* 🔹 Col·laboracions pendents

  * visible si: `VIEW_COLLABORATION`
* 🔹 Properes cites

  * visible si: `SCHEDULE_APPOINTMENT`

---

**CTA visibles**

* ➕ Nou pacient
  `CREATE_PATIENT`
* ➕ Nova col·laboració
  `CREATE_COLLABORATION`

---

# 2️⃣ Fitxa PACIENT (professional)

### Ruta

`/patients/:id`

### Required capability

```ts
VIEW_PATIENT
```

---

### Wireframe

**HEADER**

* Nom pacient
* Badge consentiment:

  * ❌ No concedit
  * 🟡 Parcial
  * 🟢 Complet

---

**TABS**

#### 🧾 Resum

* sempre visible

---

#### 📄 Historial clínic

Visible si:

```ts
VIEW_CLINICAL_RECORD
```

Conté:

* notes
* informes
* adjunts

CTA:

* ✍️ Afegir nota
  `WRITE_CLINICAL_NOTE`

---

#### 🤝 Col·laboracions

Visible si:

```ts
VIEW_COLLABORATION
```

CTA:

* ➕ Convidar professional
  `CREATE_COLLABORATION`

---

#### 💰 Facturació

Visible si:

```ts
BILLING_ACCESS
```

---

# 3️⃣ Vista COL·LABORADOR (BASIC)

### Ruta

`/collaborations/:id`

### Required capability

```ts
VIEW_COLLABORATION
```

---

### Wireframe

**HEADER**

* Nom pacient (anonimitzat si cal)
* Rol:

  > “Col·laborador en curs”

---

**MAIN**

* Objectiu de la col·laboració
* Timeline d’intervencions

---

**CTA**

* 💬 Afegir comentari
  `COMMENT`
* 📎 Adjuntar informe
  `UPLOAD_REPORT`

---

🚫 **No visible**

* llista de pacients
* agenda
* billing
* cerca

---

# 4️⃣ Dashboard PACIENT (BASIC)

### Ruta

`/patient/home`

### Required capability

```ts
VIEW_OWN_DATA
```

---

### Wireframe

**HEADER**

* “Hola, [Nom]”
* Estat compte:

  * 🟡 Perfil incomplet

---

**MAIN**

* Properes cites
  `VIEW_APPOINTMENTS`
* Documents compartits
  `VIEW_DOCUMENTS`

---

**CTA**

* 📝 Donar consentiment
  (si falta)
* ⚙️ Completar perfil
  `UPGRADE_ACCOUNT`

---

# 5️⃣ Pantalla CONSENTIMENT

### Ruta

`/consents/:id`

### Required

```ts
GRANT_CONSENT
```

---

### Wireframe

**TEXT CLAR**

> “Autoritzes aquest professional a accedir a…”

Checklist:

* [ ] historial clínic
* [ ] informes
* [ ] col·laboracions

Dates:

* des de / fins a

CTA:

* ✅ Acceptar
* ❌ Rebutjar

---

# 6️⃣ Agenda / Scheduling (professional)

### Ruta

`/agenda`

### Required

```ts
SCHEDULE_APPOINTMENT
```

---

### Wireframe

**VISTA**

* setmana / dia

---

**CTA**

* ➕ Nova cita
  `CREATE_APPOINTMENT`

---

**CITA**

* pacient
* tipus
* durada
* estat

---

# 7️⃣ Pantalla BLOQUEJADA (fallback)

Quan no hi ha capability però l’usuari arriba via link directe.

### Exemple

> 🔒 Aquesta acció requereix:
>
> * completar el teu perfil professional
> * o un consentiment del pacient

CTA:

* 👉 Completar perfil
* 👉 Sol·licitar consentiment

📌 **No és error**
📌 **És guia UX**

---

# 8️⃣ Taula resum (pantalles → capabilities)

| Pantalla               | Capabilities         |
| ---------------------- | -------------------- |
| Dashboard professional | VIEW_PATIENT         |
| Fitxa pacient          | VIEW_PATIENT         |
| Historial clínic       | VIEW_CLINICAL_RECORD |
| Afegir nota            | WRITE_CLINICAL_NOTE  |
| Agenda                 | SCHEDULE_APPOINTMENT |
| Facturació             | BILLING_ACCESS       |
| Col·laboració          | VIEW_COLLABORATION   |
| Consentiments          | GRANT_CONSENT        |

---

# 9️⃣ Impacte tècnic directe

✔️ Routes amb guards
✔️ Components simples (`*ngIf can()`)
✔️ Backend coherent
✔️ UX sense sorpreses
✔️ Producte escalable per fases

---

## ⏭️ Següent pas natural (ja molt potent)

👉 **Mapar aquestes pantalles a dominis (BCs) i APIs concretes**
(quins endpoints, en quin BC, amb quins guards)

Quan diguis, **seguim**.

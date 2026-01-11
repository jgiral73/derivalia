Perfecte.
👉 **PAS 36 — Wireframes textuals alineats amb Capabilities (professional + pacient)**

Aquests wireframes **no són maquetes visuals**, sinó:

* estructura de pantalla
* zones visibles / ocultes
* comportament segons `Capability`
* coherència absoluta amb el model que ja tenim

Això permet:

* disseny UI molt ràpid
* implementació FE directa (Angular/Ionic)
* zero contradiccions amb backend

---

# 🧠 Convenció utilitzada

* `[VISIBLE IF: CAPABILITY_X]`
* `[HIDDEN IF: !CAPABILITY_X]`
* `[SOFT BLOCK]` = modal contextual
* `[READ ONLY]`

---

# 🧑‍⚕️ WIREFRAMES — PROFESSIONAL

---

## 🏠 1. Home / Dashboard Professional

### Header

* Nom professional
* Estat:

  * 🟡 Perfil bàsic
  * 🟢 Perfil complet

---

### Bloc: Agenda

* Llista de cites (avui / setmana)

[VISIBLE IF: CREATE_APPOINTMENT]

CTA:

* ➕ Nova cita

[HIDDEN IF: !CREATE_APPOINTMENT]
→ Mostrar text:

> *Completa el teu perfil per gestionar la teva agenda*

---

### Bloc: Casos assignats

* Llista de pacients on col·labora

[VISIBLE IF: VIEW_ASSIGNED_CASE]

---

### Bloc: Accions ràpides

* Crear pacient
* Facturar
* Sol·licitar col·laboració

Cada botó:

* Visible només si capability present
* Si no, **soft block**

---

## 📅 2. Agenda

### Vista setmanal

[VISIBLE IF: CREATE_APPOINTMENT]

* Click en slot → crear cita

[HIDDEN IF: !CREATE_APPOINTMENT]
→ Missatge informatiu:

> *L’agenda s’activarà quan completis el teu perfil*

---

## 👤 3. Vista Pacient (Professional)

### Header

* Nom pacient
* Estat consentiments (icona)

---

### Tabs

#### Tab: Context

* Dades bàsiques
* Professionals implicats

[VISIBLE ALWAYS]

---

#### Tab: Notes clíniques

[VISIBLE IF: WRITE_CLINICAL_NOTE]

* Llista notes
* CTA: ➕ Nova nota

[READ ONLY IF: !WRITE_CLINICAL_NOTE]

---

#### Tab: Documents

[VISIBLE IF: VIEW_ASSIGNED_CASE]

* Documents compartits

---

#### Tab: Col·laboració

[VISIBLE IF: REQUEST_COLLABORATION]

* Llista col·laboradors
* CTA: ➕ Convidar professional

[HIDDEN IF: !REQUEST_COLLABORATION]

---

## 📝 4. Crear Nota Clínica

### Editor

* Text lliure
* Templates (si n’hi ha)

[VISIBLE IF: WRITE_CLINICAL_NOTE]

---

### Guardar

* Autosave
* Tancar sessió

---

## 💸 5. Facturació

### Llista factures

[VISIBLE IF: ISSUE_INVOICE]

* Estat
* Import

---

### CTA

* ➕ Nova factura

[SOFT BLOCK IF: !ISSUE_INVOICE]
Modal:

> *Completa la verificació professional per poder facturar*

---

# 🧍‍♂️ WIREFRAMES — PACIENT

---

## 🏠 6. Home Pacient

### Header

* Nom
* Missatge:

  * *Accés actiu*
  * *Accés opcional*

---

### Bloc: Properes cites

[VISIBLE IF: VIEW_OWN_DATA]

* Data
* Professional

---

### Bloc: Documents

[VISIBLE IF: VIEW_OWN_DATA]

* Informes compartits

---

### Bloc: Consentiments

[VISIBLE IF: MANAGE_CONSENTS]

CTA:

* Gestionar

---

## 🛡️ 7. Gestió de Consentiments

### Llista

Cada consentiment:

* Tipus
* Qui
* Fins quan
* Estat

---

### Accions

* Revocar
* Limitar durada
* Veure historial

[VISIBLE IF: MANAGE_CONSENTS]

---

## 📩 8. Landing Invitació (Pacient / Professional)

### Header

* Qui convida
* Per què

---

### Contingut

* Què podrà fer
* Què NO podrà fer
* Durada

---

### CTA

* Acceptar
* Rebutjar

[NO LOGIN REQUIRED]

---

# 🔒 9. Soft Block — patró reutilitzable

### Modal genèric

🔒 *Funcionalitat no activa*

Text:

> *Per accedir a aquesta funció, cal completar el teu perfil.*

CTA:

* Completar perfil
* Més informació

👉 **Mai error dur**

---

# 🧠 10. Traçabilitat directa

| Pantalla      | Capability            |
| ------------- | --------------------- |
| Crear cita    | CREATE_APPOINTMENT    |
| Escriure nota | WRITE_CLINICAL_NOTE   |
| Facturar      | ISSUE_INVOICE         |
| Col·laborar   | REQUEST_COLLABORATION |
| Veure dades   | VIEW_OWN_DATA         |
| Consentiments | MANAGE_CONSENTS       |

---

# 🧭 Resum executiu

✔️ Cap pantalla “buida”
✔️ Tot està governat per `Capability`
✔️ El FE és predictible
✔️ El BE és autoritat
✔️ UX coherent amb domini

---

## Següent pas natural

Ara tens **tres camins molt sòlids**:
1️⃣ **Model Prisma complet (taules + enums + relacions)**
2️⃣ **Checklist legal / GDPR per MVP**
3️⃣ **Backlog tècnic per Sprint 1–2 (BE + FE)**

Digues quin i **seguim** 🚀


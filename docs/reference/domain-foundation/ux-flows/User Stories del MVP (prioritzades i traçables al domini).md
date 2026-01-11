Perfecte.
👉 **PAS 31 — User Stories del MVP (prioritzades i traçables al domini)**
Ara convertim els **UX flows** en **treball executable** (producte + enginyeria), amb criteris clars d’acceptació.

---

# 🧩 Estructura de les user stories

Per a cada story:

* **Rol**
* **Objectiu**
* **Valor**
* **Criteris d’acceptació**
* **BC implicats**
* **Prioritat**

---

## 🔥 EPIC 1 — Onboarding & Primer valor

### US-01 — Alta professional ràpida

**Com a** professional
**Vull** crear el meu compte i començar a treballar
**Per** aportar valor en minuts

**Acceptació**

* Registre + login en <2 min
* Perfil mínim (nom, especialitat)
* Accés directe a agenda buida

**BC**: Identity, Professional, Tenancy
**Prioritat**: P0

---

### US-02 — Crear primera cita

**Com a** professional
**Vull** crear una cita ràpidament
**Per** començar a atendre

**Acceptació**

* Data/hora
* Pacient nou o existent
* Confirmació immediata

**BC**: Scheduling, Patient
**Prioritat**: P0

---

## 🧠 EPIC 2 — Sessió clínica (core)

### US-03 — Veure context del pacient

**Com a** professional
**Vull** veure el context clínic abans de la sessió
**Per** prendre millors decisions

**Acceptació**

* Dades bàsiques
* Alertes
* Historial resumit

**BC**: Patient, Clinical Records
**Prioritat**: P0

---

### US-04 — Escriure nota clínica

**Com a** professional
**Vull** registrar notes de sessió
**Per** documentar l’atenció

**Acceptació**

* Editor simple
* Autosave
* Immutabilitat post-guardat

**BC**: Clinical Records, Audit
**Prioritat**: P0

---

### US-05 — Formulari estructurat (opcional)

**Com a** professional
**Vull** omplir un formulari estructurat
**Per** estandarditzar dades

**Acceptació**

* Selecció de template
* Validació camps requerits
* Associació a la sessió

**BC**: Clinical Templates, Clinical Records
**Prioritat**: P1

---

## 🤝 EPIC 3 — Col·laboració clínica

### US-06 — Sol·licitar col·laboració

**Com a** professional responsable
**Vull** demanar ajuda a un especialista
**Per** millorar l’atenció del pacient

**Acceptació**

* Selecció professional
* Motiu / especialitat
* Permisos clars
* Durada definida

**BC**: Collaboration, Consent
**Prioritat**: P1

---

### US-07 — Acceptar/rebutjar col·laboració

**Com a** professional convidat
**Vull** decidir si col·laboro
**Per** controlar la meva responsabilitat

**Acceptació**

* Veure motiu i permisos
* Acceptar o rebutjar
* Sense accés clínic previ

**BC**: Collaboration, Audit
**Prioritat**: P1

---

## 💸 EPIC 4 — Facturació bàsica

### US-08 — Crear factura de sessió

**Com a** professional
**Vull** crear una factura ràpidament
**Per** cobrar el servei

**Acceptació**

* Dades pre-emplenades
* Editar línies
* Emissió en 1 clic

**BC**: Billing, Scheduling
**Prioritat**: P0

---

### US-09 — Veure factures

**Com a** emissor o receptor
**Vull** consultar factures
**Per** tenir control econòmic

**Acceptació**

* Llistat filtrable
* Estat (draft/issued/paid)

**BC**: Billing
**Prioritat**: P1

---

## 🛡️ EPIC 5 — Consentiment & seguretat

### US-10 — Gestionar consentiments (pacient)

**Com a** pacient
**Vull** veure i gestionar consentiments
**Per** controlar les meves dades

**Acceptació**

* Llista clara
* Activar / revocar
* Efecte immediat

**BC**: Consent, Audit
**Prioritat**: P0

---

### US-11 — Bloqueig per manca de consentiment

**Com a** sistema
**Vull** bloquejar accés sense consentiment
**Per** complir la normativa

**Acceptació**

* Error clar
* Cap dada exposada
* Event d’audit

**BC**: Consent, Audit
**Prioritat**: P0

---

## 📦 EPIC 6 — Observabilitat mínima

### US-12 — Audit trail intern

**Com a** organització
**Vull** veure qui ha accedit a dades
**Per** complir legalment

**Acceptació**

* Llistat d’events
* Filtre per pacient
* Read-only

**BC**: Audit
**Prioritat**: P1

---

# 🧮 Priorització resum

| Prioritat | Stories                       |
| --------- | ----------------------------- |
| **P0**    | US-01, 02, 03, 04, 08, 10, 11 |
| **P1**    | US-05, 06, 07, 09, 12         |
| **P2**    | Tot el que no està aquí       |

👉 Amb **P0 + alguns P1** ja pots **llançar Beta**

---

# 🛠️ Traducció a planificació

* **Sprint 1**: Onboarding + Agenda + Pacients
* **Sprint 2**: Sessió clínica + Notes
* **Sprint 3**: Facturació + Consentiments
* **Sprint 4**: Col·laboració + Audit

⏱️ 6–8 setmanes Beta realista

---

## Següent pas natural

Opcions:
1️⃣ **Wireframes textuals pantalla a pantalla (MVP)**
2️⃣ **Checklist de Beta Launch (legal, tècnic, operatiu)**
3️⃣ **Backlog tècnic per sprint (tasks d’enginyeria)**

Digues quin i **seguim** 🚀


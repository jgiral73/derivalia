Perfecte. **Seguim amb el pas següent, natural i necessari**.

# PAS — MAPAR WIREFRAMES → BOUNDED CONTEXTS + APIs

Ara convertim:

> pantalles + capabilities
> en
> **endpoints concrets, BC responsables i guards**

Això és el que et permet **implementar de veritat** sense improvisar.

---

## 🔑 Principi arquitectònic

> **Una pantalla pot consumir múltiples BCs**
> però **cada acció pertany a un sol BC**

No fem:

* “BC de pantalles”
* “BC frontend-driven”

---

# 1️⃣ Dashboard PROFESSIONAL

### Pantalla

`/app/dashboard`

### Dades que mostra

* pacients
* cites
* col·laboracions

### BCs implicats

| Dada            | BC                |
| --------------- | ----------------- |
| Pacients        | **Patient**       |
| Cites           | **Scheduling**    |
| Col·laboracions | **Collaboration** |

---

### APIs

#### Patient BC

```
GET /patients?active=true
Capability: VIEW_PATIENT
```

#### Scheduling BC

```
GET /appointments?mine=true&from=today
Capability: SCHEDULE_APPOINTMENT
```

#### Collaboration BC

```
GET /collaborations?status=PENDING
Capability: VIEW_COLLABORATION
```

📌 El frontend **agrega**, el backend **no barreja BCs**.

---

# 2️⃣ Fitxa PACIENT (professional)

### Pantalla

`/patients/:id`

### BCs implicats

| Secció           | BC             |
| ---------------- | -------------- |
| Dades bàsiques   | Patient        |
| Historial clínic | ClinicalRecord |
| Consentiments    | Consent        |
| Col·laboracions  | Collaboration  |
| Facturació       | Billing        |

---

### APIs

#### Patient

```
GET /patients/:id
Capability: VIEW_PATIENT
```

---

#### ClinicalRecord

```
GET /patients/:id/records
Capability: VIEW_CLINICAL_RECORD
Guard: ConsentGuard
```

```
POST /patients/:id/notes
Capability: WRITE_CLINICAL_NOTE
```

---

#### Consent

```
GET /patients/:id/consents
POST /patients/:id/consents
Capability: GRANT_CONSENT
```

---

#### Collaboration

```
GET /patients/:id/collaborations
POST /patients/:id/collaborations
Capability: CREATE_COLLABORATION
```

---

#### Billing

```
GET /patients/:id/invoices
Capability: BILLING_ACCESS
```

---

# 3️⃣ Vista COL·LABORACIÓ

### Pantalla

`/collaborations/:id`

### BC responsable

👉 **Collaboration** (owner clar)

---

### APIs

```
GET /collaborations/:id
Capability: VIEW_COLLABORATION
```

```
POST /collaborations/:id/comments
Capability: COMMENT
```

```
POST /collaborations/:id/reports
Capability: UPLOAD_REPORT
```

📌 **No accedeix directament a Patient BC**
Tot ve contextualitzat via la col·laboració.

---

# 4️⃣ Dashboard PACIENT

### Pantalla

`/patient/home`

### BCs implicats

| Dada          | BC             |
| ------------- | -------------- |
| Cites         | Scheduling     |
| Documents     | ClinicalRecord |
| Consentiments | Consent        |

---

### APIs

#### Scheduling

```
GET /appointments?patient=me
Capability: VIEW_APPOINTMENTS
```

---

#### ClinicalRecord

```
GET /my/records
Capability: VIEW_OWN_RECORDS
```

---

#### Consent

```
GET /my/consents
POST /my/consents
Capability: GRANT_CONSENT
```

---

# 5️⃣ Agenda / Scheduling (professional)

### Pantalla

`/agenda`

### BC

👉 **Scheduling**

---

### APIs

```
GET /appointments?professional=me&range=week
Capability: SCHEDULE_APPOINTMENT
```

```
POST /appointments
Capability: CREATE_APPOINTMENT
```

```
PATCH /appointments/:id
Capability: MODIFY_APPOINTMENT
```

---

# 6️⃣ Facturació (Billing & Insurance)

### Pantalla

`/billing`

### BC

👉 **Billing**

---

### APIs (flexibles per futur)

```
GET /invoices?issuedBy=me
Capability: BILLING_ACCESS
```

```
POST /invoices
Capability: CREATE_INVOICE
```

```
GET /invoices/:id
Capability: VIEW_INVOICE
```

📌 El model ja admet:

* professional → pacient
* professional → professional
* organització → pacient
* organització → professional

---

# 7️⃣ Errors → UX coherent

| Codi | Motiu                | UX                  |
| ---- | -------------------- | ------------------- |
| 403  | Falta capability     | Pantalla bloquejada |
| 412  | Onboarding incomplet | CTA completar       |
| 410  | Invitació caducada   | Sol·licitar nova    |
| 409  | Conflicte estat      | Refrescar           |

---

# 8️⃣ Taula resum (pantalla → BC owner)

| Pantalla               | BC principal   |
| ---------------------- | -------------- |
| Dashboard professional | Patient        |
| Fitxa pacient          | Patient        |
| Historial clínic       | ClinicalRecord |
| Col·laboració          | Collaboration  |
| Agenda                 | Scheduling     |
| Facturació             | Billing        |
| Consentiments          | Consent        |

---

# 9️⃣ Què tenim ara (important)

En aquest punt:

* ✔️ UX definida
* ✔️ BCs clars
* ✔️ APIs contractades
* ✔️ Guards definits
* ✔️ Escalable per fases

👉 **Ja pots començar a picar codi sense redissenyar res**

---

## ⏭️ Següent pas (encara més executable)

Et proposo continuar amb **UN d’aquests** (ordre recomanat):

1️⃣ **Contractes OpenAPI per BC (swagger-first)**
2️⃣ **Model DDD detallat d’un BC clau (Patient o Scheduling)**
3️⃣ **Estructura real del repo backend (NestJS) carpeta a carpeta**
4️⃣ **Estratègia multi-tenant (organitzacions, professionals, pacients)**

Digues quin i **seguim**.

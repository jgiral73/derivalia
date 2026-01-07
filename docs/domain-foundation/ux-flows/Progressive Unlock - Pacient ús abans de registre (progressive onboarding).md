Perfecte. **Seguim exactament on toca** i amb el mateix nivell de detall.

# PAS SEGÜENT — UX FLOWS DETALLATS

## “PACIENT — ús abans de registre (progressive onboarding)”

Aquest és **l’altre pilar crític** del sistema.
Si això no està ben resolt, tot el model de consentiments, col·laboracions i dades cau.

---

# 🎯 Objectiu del flow pacient

Permetre que:

* un **professional creï un pacient**
* el pacient **pugui interactuar**
* **abans** de ser usuari registrat
* sense violar:

  * RGPD
  * consentiments
  * traçabilitat

---

# 1️⃣ Escenari inicial

* Professional crea un **Patient**
* El pacient:

  * **NO és User**
  * **NO té credencials**
  * existeix com a **Subject clínic**

```ts
Patient {
  id
  fullName
  contact: { email?, phone? }
  linkedUserId?: UserId
}
```

📌 Punt clau:

> *Patient ≠ User*

---

# 2️⃣ Primer contacte amb el pacient

El professional pot:

* enviar **invitació**
* o continuar treballant **sense invitació**

📌 El sistema **no obliga** a registrar el pacient.

---

# 3️⃣ Invitació al pacient (soft)

### Missatge:

> “El teu professional t’ha convidat a accedir al teu espai de salut”

Inclou:

* link únic
* context:

  * nom del professional
  * propòsit (veure cites / documents)

CTA:
👉 Accedir

---

# 4️⃣ Accés pacient sense compte (BASIC)

En clicar:

* es crea:

```ts
User {
  role: PATIENT
  onboardingState: BASIC
}
```

* s’enllaça:

```ts
Patient.linkedUserId = user.id
```

📌 No password encara
📌 Sessió temporal / magic link

---

# 5️⃣ Vista inicial pacient (BASIC)

Pantalla:

> “Benvingut/da”

Mostra:

* properes cites
* documents compartits
* missatges del professional

🚫 No mostra:

* historial complet
* exportació
* cerca
* billing avançat

---

# 6️⃣ Consentiments mínims (obligatori)

Abans de qualsevol acció sensible:

Modal:

> “Autoritzes l’accés a les teves dades per aquest professional?”

✔️ Consentiment específic
✔️ Data
✔️ Scope

```ts
Consent {
  patientId
  grantedToProfessionalId
  scope
  validFrom
}
```

📌 Sense aquest consentiment:

* només lectura molt limitada

---

# 7️⃣ Onboarding progressiu pacient

### Step 1 — Identitat

* nom complet
* data naixement

👉 desbloqueja:

* historial

---

### Step 2 — Contacte

* email
* telèfon

👉 desbloqueja:

* notificacions
* recordatoris

---

### Step 3 — Compte complet (opcional)

* password
* 2FA (futur)

```ts
onboardingState = COMPLETED
```

---

# 8️⃣ Nudges (mai bloqueig)

Exemples:

* abans de descarregar informes:

  > “Completa el teu perfil per descarregar documents oficials”
* abans de facturació:

  > “Activa el teu compte per rebre factures”

---

# 9️⃣ States + Guards (tècnic)

### Patient access guard

```ts
canViewClinicalRecord(user, patient) {
  return consent.exists &&
         consent.scope.includes('CLINICAL_VIEW')
}
```

---

### Capability matrix pacient

| Feature           | BASIC | COMPLETED |
| ----------------- | ----- | --------- |
| View appointments | ✅     | ✅         |
| View docs         | ⚠️    | ✅         |
| Download          | ❌     | ✅         |
| Billing           | ❌     | ✅         |

---

# 10️⃣ Casos especials (reals)

### Pacient no vol registrar-se mai

✔️ Totalment vàlid
✔️ Professional pot continuar treballant
✔️ Accés pacient via comunicació externa

---

### Canvi de professional

* consentiment nou
* no es “transfereix” automàticament

---

# 11️⃣ Impacte en el model DDD (resum)

| Context         | Impacte                     |
| --------------- | --------------------------- |
| Identity        | User ≠ Patient              |
| Consent         | First-class aggregate       |
| Collaboration   | Sempre professional-centric |
| Clinical Record | Sempre Patient-centric      |

---

# ⏭️ Següent pas natural

👉 **Traduir aquests flows (Professional + Patient)** a:
1️⃣ **Feature flags**
2️⃣ **Guards d’API**
3️⃣ **Guards de Front-end (Angular/Ionic)**

Quan diguis, **seguim**.

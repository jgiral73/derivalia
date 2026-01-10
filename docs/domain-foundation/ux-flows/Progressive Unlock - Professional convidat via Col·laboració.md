Perfecte. **Seguim amb el següent pas natural** després del domini i dels flows conceptuals:

# PAS — UX FLOWS DETALLATS (textuals)

## “Professional convidat via Col·laboració”

Això és el que **realment farà servir el producte**.
Baixem de l’arquitectura a l’ús real.

<br />

# 🎯 Objectiu del flow

Convertir:

> *Professional extern convidat per col·laborar en un pacient*
> en:
> *Usuari professional actiu, amb onboarding progressiu i mínima fricció*

Sense:

* ❌ formularis llargs d’entrada
* ❌ bloquejar l’acció clínica
* ❌ perdre el context del pacient

<br />

# 1️⃣ Escenari inicial

* **Professional A** (usuari actiu)
* crea una **Col·laboració** sobre un pacient
* introdueix:

  * email del professional B
  * especialitat requerida
  * motiu de la col·laboració

➡️ Sistema:

* crea `Collaboration`
* crea `Invitation`
* envia enllaç únic (email / WhatsApp / SMS futur)

<br />

# 2️⃣ Entrada al sistema (no usuari)

### Pantalla: “Has estat convidat a col·laborar”

**Contingut:**

* Nom del professional que convida
* Rol esperat:

  > “Col·laborador en el cas del pacient X”
* CTA principal:
  👉 **Acceptar col·laboració**
* CTA secundari:
  👉 Veure què implica (info)

📌 **No demanem registre encara**

<br />

# 3️⃣ Acceptar invitació (estat BASIC)

Acció:

* click a “Acceptar”

Sistema:

* valida token
* crea **User (identity)**
* estat:

  ```ts
  onboardingState = BASIC
  ```
* assigna capability mínima:

  * `VIEW_COLLABORATION`
  * `COMMENT`
  * `UPLOAD_REPORT`

<br />

# 4️⃣ Primera sessió (BASIC MODE)

### Header limitat

* nom
* badge:

  > “Perfil incomplet”

### Pantalla principal

> “Estàs col·laborant en aquest cas”

Mostra:

* resum del pacient (anonimitzat)
* objectiu de la col·laboració
* timeline de comentaris

🚫 No mostra:

* agenda
* altres pacients
* cerca global
* billing

<br />

# 5️⃣ Nudges UX (no bloquejants)

En punts clau apareixen **nudges**:

### Exemples:

* abans d’escriure informe llarg:

  > “Completa el teu perfil per adjuntar informes clínics signats”
* abans de programar sessió:

  > “Activa el teu compte professional”

Botó:
👉 Completar perfil (opcional)

<br />

# 6️⃣ Onboarding progressiu (modal)

### Step 1 — Dades mínimes

* Nom complet
* Especialitat principal
* Nº col·legiat (opcional al principi)

👉 desbloqueja:

* informes formals
* firma clínica

<br />

### Step 2 — Identitat professional

* Document acreditatiu
* País / regulació

👉 desbloqueja:

* sessions
* historial complet

<br />

### Step 3 — Activació total

* Acceptació de termes
* Consentiments legals

```ts
onboardingState = PROFESSIONAL_COMPLETED
```

🎉 Missatge:

> “Compte professional activat”

<br />

# 7️⃣ Conversió silenciosa (clau comercial)

📌 **No hi ha moment de “registre dur”**

L’usuari:

* ja està treballant
* ja té valor
* ja ha invertit temps

➡️ El “registre” és només:

> *formalitzar una relació ja existent*

<br />

# 8️⃣ Estados + Guards (tècnic)

### Identity.User

```ts
User {
  id
  email
  onboardingState
  roles: ['PROFESSIONAL']
}
```

<br />

### Capability Matrix

| Capability         | BASIC | COMPLETED |
| ------------------ | ----- | --------- |
| View collaboration | ✅     | ✅         |
| Comment            | ✅     | ✅         |
| Upload reports     | ⚠️    | ✅         |
| Access patients    | ❌     | ✅         |
| Billing            | ❌     | ✅         |

<br />

# 9️⃣ Error cases (reals)

### Invitació expirada

Pantalla:

> “Aquesta invitació ha caducat”

CTA:
👉 Sol·licitar nova invitació

<br />

### Email diferent

> “Aquest enllaç està associat a un altre correu”

Opcions:

* continuar (canvi explícit)
* cancel·lar

<br />

# 10️⃣ Per què aquest flow és fort

✔️ clínicament usable
✔️ comercialment eficient
✔️ legalment controlat
✔️ tècnicament net (states + guards)
✔️ evita fricció inicial

Això **no és un onboarding**,
és **una captació natural**.

<br />

# ⏭️ Següent pas (encara més baix nivell)

👉 **Mateix exercici però per PACIENT**
(fluxos reals, consentiments, ús abans de registre)

Quan diguis, seguim.

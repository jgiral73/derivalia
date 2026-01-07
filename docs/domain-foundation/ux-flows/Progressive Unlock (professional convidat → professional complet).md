Perfecte.
👉 **PAS 33 — UX Flows detallats del “Progressive Unlock” (professional convidat → professional complet)**

Ara dissenyem **exactament**:

* què veu l’usuari
* quan ho veu
* què està bloquejat
* com el guiem **sense fricció ni pressió**

Això és **product design de nivell alt**.

---

# 🧠 Principi rector

> **L’usuari no “fa onboarding” — desbloqueja capacitats quan les necessita**

Cap checklist obligatòria.
Cap mur inicial.
Tot **contextual**.

---

# 🧩 1. Mapa d’estats i capacitats

| Estat              | Capacitats visibles    |
| ------------------ | ---------------------- |
| **INVITED**        | Landing invitació      |
| **CLAIMED**        | Acceptar col·laboració |
| **MINIMAL_ACTIVE** | Treballar en el cas    |
| **FULLY_VERIFIED** | Ús complet             |

---

# 🔁 FLOW 0 — Estat `INVITED` (fora del sistema)

📩 Email / missatge

CTA:

> **Veure invitació**

👉 No és onboarding.
👉 És **context**.

---

# 🔓 FLOW 1 — Acceptar invitació (CLAIMED)

### Pantalla: *Invitation Landing*

**Veu:**

* Qui convida
* Especialitat
* Motiu general
* Permisos sol·licitats
* Durada

**Accions:**

* Acceptar
* Rebutjar

👉 Cap fricció
👉 Cap login

---

### Transició

```text
INVITED → CLAIMED
```

---

# 🟡 FLOW 2 — MINIMAL_ACTIVE (valor immediat)

### Primera entrada al sistema

🎉 *Benvingut, estàs col·laborant en un cas*

---

## Pantalla: *Cas assignat*

**Visible**

* Context mínim del pacient
* Professional responsable
* Objectiu de la col·laboració
* Accions permeses

**Accions disponibles**

* Escriure nota
* Veure documents permesos
* Missatgeria segura

---

## Indicador discret de progrés

🟡 Badge:

> *Perfil bàsic actiu*

🔓 Tooltip:

> *Completa el teu perfil per desbloquejar més funcionalitats*

---

# 🚫 FLOW 3 — Intent d’acció bloquejada (moment clau)

Exemples:

* “Crear pacient”
* “Crear cita”
* “Facturar”

---

### UX Pattern: **Soft block**

No error.
No frustració.

---

### Modal contextual

> 🔒 *Aquesta funció requereix completar el teu perfil professional*
> ⏱️ *Temps estimat: 2 minuts*
> 🎯 *Desbloquejaràs: agenda, pacients, facturació*

CTA:

> **Completar perfil**

---

# 🧩 FLOW 4 — Onboarding modular (desbloqueig)

### Mòdul 1 — Perfil professional (obligatori)

**Pantalla**

* Especialitat
* Idioma
* Acceptació termes professionals

👉 Enviar

🔓 **Desbloqueja**

* Crear pacients
* Crear cites

---

### Transició

```text
MINIMAL_ACTIVE → (encara) MINIMAL_ACTIVE+
```

*(capacitats augmentades, però no verificat)*

---

### Mòdul 2 — Verificació (opcional MVP)

* Nº col·legiat
* País

🔓 **Desbloqueja**

* Facturació
* Col·laboracions com a sol·licitant

---

### Transició

```text
→ FULLY_VERIFIED
```

---

# 🟢 FLOW 5 — Estat FULLY_VERIFIED

🎉 Missatge subtil:

> *Perfil complet! Ja pots gestionar els teus propis pacients.*

---

### Nova Home

* Agenda pròpia
* Pacients
* Col·laboracions
* Factures

👉 Ja no és “convidat”
👉 És **professional actiu**

---

# 🧭 6. Triggers intel·ligents (clau de conversió)

| Acció usuari       | Trigger                 |
| ------------------ | ----------------------- |
| Escriu 1a nota     | Suggerir perfil complet |
| 2a col·laboració   | Proposar verificació    |
| Intenta crear cita | Obrir mòdul perfil      |
| Facturar           | Demanar verificació     |

👉 No per temps.
👉 Per **intenció**.

---

# 🧪 7. Copy UX (importantíssim)

❌ “Completa l’onboarding”
❌ “Perfil incomplet”

✅ “Desbloqueja X”
✅ “Activa aquesta funció”

---

# 📊 8. Mesura (KPIs clau)

* % Acceptació invitacions
* Temps fins a MINIMAL_ACTIVE
* % que desbloquegen perfil
* % FULLY_VERIFIED
* Temps mitjà per mòdul

👉 Ajustem el producte amb dades reals

---

# 🧠 9. Errors a evitar (alerta)

❌ Mostrar checklist llarg
❌ Forçar verificació prematura
❌ Bloquejar sense explicar valor
❌ Notificacions agressives

---

# 🧭 10. Resum executiu

✔️ Valor immediat
✔️ Fricció controlada
✔️ Onboarding com a conseqüència
✔️ Creixement orgànic
✔️ Model alineat amb DDD

---

## Següent pas natural

Ara podem:
1️⃣ **Dissenyar els mateixos flows per PACIENT**
2️⃣ **Traduir aquests flows a Guards i Feature Flags**
3️⃣ **Wireframes textuals pantalla a pantalla**

Digues quin i **seguim** 🚀

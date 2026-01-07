Perfecte.
👉 **PAS 34 — UX Flows de “Progressive Unlock” per PACIENT**
Aquí el repte és encara més delicat: **confiança, legalitat i zero fricció**.

Anirem **molt alineats** amb el que ja hem fet amb professionals, però **no simètric** (els pacients no “treballen”, **reben cura**).

---

# 🧠 Principis específics per pacient

1. **El pacient no ha de “gestionar el sistema”**
2. **Mai obligar a registrar-se**
3. **Control explícit del consentiment**
4. **Accés progressiu, no tècnic**
5. **Llenguatge no clínic**

---

# 🧩 1. Estats del pacient (model mental + domini)

## Model recomanat

```text
Patient
- id
- userId?            ← opcional
- onboardingStatus:
    UNCLAIMED
    CLAIMED
    ACTIVE
```

### Significat

| Estat         | Què vol dir               |
| ------------- | ------------------------- |
| **UNCLAIMED** | Creat pel professional    |
| **CLAIMED**   | Ha acceptat accés digital |
| **ACTIVE**    | Usa l’app amb normalitat  |

---

# 🔁 FLOW 0 — Pacient creat pel professional

🎯 El pacient **no sap res del sistema encara**

* Professional registra dades mínimes
* Consentiment **registrat pel professional**
* El sistema **no envia res automàticament**

👉 Respecte absolut

---

# 🔓 FLOW 1 — Invitació suau (opcional)

### Trigger habitual

* Després de 1a sessió
* Quan hi ha documents
* Quan hi ha col·laboració

---

### Canal

* SMS / Email
* Missatge empàtic

Exemple:

> *El teu professional t’ofereix accés segur a la teva informació.*

CTA:

> **Accedir de forma segura**

---

# 🟡 FLOW 2 — Landing de confiança (sense login)

### Objectiu

✔️ Seguretat
✔️ Control
✔️ Cap obligació

---

### Contingut visible

* Qui convida (professional)
* Què podrà veure
* Què NO veurà
* Drets del pacient

---

### CTA

* Acceptar accés
* No ara

👉 **No passa res si diu no**

---

# 🔑 FLOW 3 — Claim Identity (CLAIMED)

Només si accepta:

### UX

* Magic link
* Confirmació simple
* Cap password inicial

---

### Transició

```text
UNCLAIMED → CLAIMED
```

---

# 🟢 FLOW 4 — ACTIVE (accés progressiu)

### Home pacient (minimal)

**Veu:**

* Properes cites
* Professional(s)
* Documents compartits
* Consentiments actius

❌ No veu:

* Notes internes
* Judicis clínics
* Dades d’altres professionals

---

# 🔒 FLOW 5 — Desbloqueig per intenció

Exemples:

| Acció                   | UX                  |
| ----------------------- | ------------------- |
| Veure document          | OK                  |
| Gestionar consentiments | OK                  |
| Exportar dades          | Demanar confirmació |
| Revocar accés           | Sempre permès       |

---

### Modal de control

> *Estàs a punt de canviar qui pot accedir a la teva informació*

✔️ Clar
✔️ Reversible
✔️ Auditable

---

# 🧭 6. Copy UX (ultra important)

❌ “Perfil incomplet”
❌ “Has de crear un compte”

✅ “Accés opcional”
✅ “Tu decideixes”
✅ “Controla la teva informació”

---

# ⚖️ 7. Consentiment visible i entenedor

### Pantalla: *Els meus consentiments*

* Atenció clínica
* Col·laboració
* Compartició

Cada un amb:

* Qui
* Per què
* Fins quan
* Revocar

👉 El pacient **entén i controla**

---

# 📊 8. Mesura (KPIs)

* % pacients que accepten accés
* Temps fins CLAIMED
* % que activen ACTIVE
* % que gestionen consentiments

👉 Sense pressionar conversió

---

# 🧠 9. Errors greus a evitar

❌ Forçar registre
❌ Notificacions constants
❌ Mostrar llenguatge clínic
❌ Disseny fred / tècnic

---

# 🧭 10. Resum executiu

✔️ El pacient pot existir sense usuari
✔️ L’accés digital és opcional
✔️ Control total del consentiment
✔️ Progressiu, humà i segur
✔️ Compliment legal natural

---

## Següent pas natural

Ara tenim:

* Professionals (progressive unlock)
* Pacients (progressive trust)

Opcions:
1️⃣ **Traduir aquests flows a feature flags + guards**
2️⃣ **Wireframes textuals pacient (pantalla a pantalla)**
3️⃣ **Checklist legal + GDPR per MVP**

Digues quin i **seguim** 🚀

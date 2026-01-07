Molt bona pregunta — aquí estem afinant **el pont entre “ús puntual amb valor” i “usuari professional plenament actiu”**, que és exactament on molts productes fallen.

Anem **ordenadament**: estat, flux, i captació definitiva.

---

## 1️⃣ Com sabem que NO ha completat l’onboarding professional?

### Sí: **necessitem estat explícit**

Però **no un estat binari** (“registrat / no registrat”), sinó **progressiu**.

### Model recomanat (Identity + Professional)

#### `User`

```ts
User {
  id
  email
  status: ACTIVE | INVITED | DISABLED
}
```

#### `Professional`

```ts
Professional {
  id
  userId
  onboardingStatus:
    | INVITED
    | CLAIMED
    | MINIMAL_ACTIVE
    | FULLY_VERIFIED
  verifiedAt?
}
```

### Significat dels estats

| Estat              | Què vol dir                               |
| ------------------ | ----------------------------------------- |
| **INVITED**        | Existeix com a referència, no ha acceptat |
| **CLAIMED**        | Ha acceptat invitació i creat user        |
| **MINIMAL_ACTIVE** | Pot col·laborar en un cas concret         |
| **FULLY_VERIFIED** | Professional complet, ús lliure           |

👉 **Aquest `onboardingStatus` és la clau**

---

## 2️⃣ Què pot fer el professional en cada estat?

### 🟡 MINIMAL_ACTIVE (després de col·laboració)

✔️ Veure el cas assignat
✔️ Escriure notes limitades
✔️ Comunicar-se amb el professional responsable

❌ Crear pacients
❌ Crear cites
❌ Facturar
❌ Iniciar col·laboracions
❌ Accés global al sistema

👉 **Valor immediat, risc mínim**

---

### 🟢 FULLY_VERIFIED

✔️ Tot el que el sistema ofereix
✔️ Responsabilitat clínica completa
✔️ Autonomia total

---

## 3️⃣ Hi ha un flux secundari d’onboarding?

👉 **Sí, però NO intrusiu ni bloquejant**

### Principi clau

> *L’usuari no ha de “fer onboarding”, ha de “desbloquejar capacitats”*

---

### UX pattern recomanat: **Progressive Unlock**

#### Indicador discret però constant

* Banner no intrusiu
* Barra de progrés
* CTA contextual

Exemple:

> 🔓 *Completa el teu perfil per crear els teus propis pacients*

---

## 4️⃣ Què inclou l’onboarding “major”?

### Mòduls (no tots obligats de cop)

1. **Dades professionals**

   * Especialitats
   * Nº col·legiat (si aplica)
2. **Acceptació de termes professionals**
3. **Configuració bàsica**

   * Agenda
   * Disponibilitat
4. **Opcional (post-MVP)**

   * Pagaments
   * Organització

👉 Cada pas **desbloqueja funcionalitats concretes**

---

## 5️⃣ Com sabem QUAN empènyer l’usuari?

🎯 **No per temps, sinó per comportament**

### Triggers intel·ligents

* Ha escrit notes → oferir crear pacient propi
* Ha rebut 2 col·laboracions → suggerir perfil complet
* Intenta acció bloquejada → explicar valor

Exemple:

> *Per crear la teva pròpia cita, completa el teu perfil professional (1 minut)*

---

## 6️⃣ Estratègia de captació definitiva (producte + comercial)

### El que NO fem

❌ “Completa el teu perfil ara”
❌ Emails genèrics
❌ Paywalls prematurs

---

### El que SÍ fem (molt potent)

#### A) Captació basada en valor real

* Ja ha treballat amb un pacient
* Ja ha col·laborat
* Ja ha escrit notes

👉 **El cost de canvi ja és alt**

---

#### B) Conversió natural a “owner”

Moment clau:

> *Vols gestionar els teus propis pacients?*

Aquest és el **punt de conversió real**.

---

#### C) Model comercial net

* Col·laborar = gratuït
* Ser professional actiu = pla base

📈 Això:

* No frena col·laboracions
* Monetitza ús real

---

## 7️⃣ Visió global del funnel

```text
Invitació
 → Acceptació
   → Valor immediat (cas)
     → Fricció funcional controlada
       → Onboarding progressiu
         → Professional complet
```

---

## 8️⃣ Regles d’or (per no equivocar-nos)

1. **L’estat governa permisos**
2. **Cap bloqueig sense explicació**
3. **Valor abans de registre complet**
4. **Conversió basada en acció real**
5. **Onboarding com a conseqüència, no prerequisit**

---

## 9️⃣ Decisió recomanada (resum)

✔️ Sí, `onboardingStatus` explícit
✔️ Sí, accés progressiu
✔️ Sí, flux secundari no bloquejant
✔️ Conversió basada en intents reals
✔️ Col·laboració com a canal de growth principal

---

### Següent pas (quan vulguis)

Ara tenim el terreny net per:
1️⃣ **Model DDD detallat de Consent + Invitation (amb estats)**
2️⃣ **Permisos dinàmics basats en onboardingStatus**
3️⃣ **Wireframes UX d’aquest onboarding progressiu**

Digues quin i **seguim** 💥

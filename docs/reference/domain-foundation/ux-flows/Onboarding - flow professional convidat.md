Perfecte. Aquest és **un dels moments més importants del producte**:
si aquí l’experiència falla, **perds conversió, confiança i viralitat**.
Anem **molt fi**, pas a pas, amb mirada **UX + domini + legal + growth**.

---

# 🧭 Context del flow

> Professional A (usuari actiu)
> convida Professional B (encara no usuari)
> a col·laborar en un pacient concret.

🎯 Objectiu del sistema:

* Convertir Professional B en **usuari actiu**
* **Sense exposar dades clíniques abans d’hora**
* Amb **valor immediat**
* Sense fricció ni desconfiança

---

# 🧱 Principis de disseny (no negociables)

1. **Zero dades sensibles abans d’acceptar**
2. **Context clar abans de registrar-se**
3. **Un sol camí, sense bifurcacions**
4. **Valor abans de credencials**
5. **Temps total < 2 minuts**

---

# 🔁 Flow complet d’onboarding (professional convidat)

## 0️⃣ Trigger inicial (fora de l’app)

📩 **Email / SMS / WhatsApp**

Contingut:

* Qui convida (nom real)
* Especialitat
* Motiu general (no clínic)
* CTA clar

Exemple:

> *La Marta Puig (Terapeuta Gestalt) t’ha convidat a col·laborar en un cas relacionat amb addiccions.*

👉 Botó: **“Veure invitació”**

---

## 1️⃣ Landing de la invitació (sense login)

🎯 Objectiu: **confiança + context**

### Contingut visible

* Foto / nom professional A
* Especialitats
* Tipus de col·laboració
* Durada prevista
* Permisos sol·licitats (resum)

❌ NO mostrar:

* Nom del pacient
* Historial
* Documents

---

### CTA possibles

* ✅ Acceptar invitació
* ❌ Rebutjar

👉 **Encara no cal compte**

---

## 2️⃣ Acceptació → Claim Identity

Només si accepta:

### UX

* Formulari ultra curt:

  * Nom
  * Cognoms
  * Email (pre-emplenat)
* CTA: **“Confirmar i continuar”**

👉 Aquí es crea el `User`

---

## 3️⃣ Verificació lleugera

📧 Magic link (recomanat)

* Evita passwords
* Millora conversió
* Ideal per professionals

---

## 4️⃣ Completar perfil mínim

🎯 Només el necessari per ser responsable clínic

### Camps

* Especialitat
* Número col·legiat (opcional en MVP)
* Idioma

👉 Es crea / reclama el `Professional`

---

## 5️⃣ Acceptació explícita de responsabilitat

Pantalla molt important (legal + confiança):

> *Acceptes col·laborar en aquest cas sota les següents condicions…*

* Permisos concedits
* Durada
* Límit d’accés
* Consentiment actiu del pacient

- ✔️ Checkbox obligatori
- ✔️ Event d’audit

---

## 6️⃣ Accés inicial (controlat)

🎉 Benvinguda!

### Vista inicial

* Cas assignat
* Context mínim del pacient
* Accions permeses

- ❌ No accés global
- ❌ No historial complet

---

# 🧠 Model mental del professional convidat

- ✔️ “Sé per què estic aquí”
- ✔️ “No estic exposat legalment”
- ✔️ “Veig valor immediat”
- ✔️ “No m’han fet crear un compte abans d’hora”

---

# 🧩 Relació amb el domini (resum)

| Moment UX         | Entitat            |
| ----------------- | ------------------ |
| Invitació enviada | Collaboration      |
| Landing           | Invitation         |
| Acceptació        | Invitation + Audit |
| Claim identity    | User               |
| Perfil            | Professional       |
| Activació         | Collaboration      |

---

# 🚀 Impacte en creixement

📈 **Cada col·laboració =**

* Lead qualificat
* Context real
* Valor immediat

📈 **Conversió estimada**:

* Invitació genèrica: ~20–30%
* Invitació contextual (així): **50–70%**

---

# ⚠️ Errors típics a evitar

- ❌ Demanar password massa aviat
- ❌ Mostrar dades clíniques abans d’acceptar
- ❌ Formularis llargs
- ❌ Onboarding genèric
- ❌ Obligar a descarregar app abans de veure res

---

# 🧭 Decisió de producte (recomanada)

- ✔️ Invitació contextual
- ✔️ Acceptar abans de registrar-se
- ✔️ Magic link
- ✔️ Perfil mínim
- ✔️ Accés progressiu

---

## Següent pas natural

Ara sí, amb aquest context clar, opcions:
- 1️⃣ **Model DDD detallat de Consent + Invitation**
- 2️⃣ **UX equivalent per pacient convidat**
- 3️⃣ **Esquema legal-responsabilitats (qui pot fer què)**

Digues quin i **seguim** 🚀


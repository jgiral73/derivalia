Molt bona pregunta — això és **clau de producte, domini i creixement**, no només tècnica.
Anem **pas a pas**, separant **model**, **UX**, **legal** i **estratègia comercial**, però amb una **decisió coherent única**.

---

# 🧠 El problema real (ben formulat)

Tens **3 tipus d’identitats diferents** que NO s’han de confondre:

1. **Persona real** (pacient / professional)
2. **Entitat de domini** (Patient, Professional)
3. **Usuari del sistema** (User / Identity)

👉 El conflicte apareix quan **assumim erròniament** que:

> “tota persona ha de ser usuari del sistema”

❌ Això és fals en salut
❌ I comercialment mata la conversió

---

# 🧩 PRINCIPI CLAU (decisió fonamental)

> **Una persona pot existir al sistema sense tenir compte d’usuari**

A partir d’aquí, tot encaixa.

---

# 🧱 1. Separació clara de conceptes (DDD)

## Identity BC

```text
User
- id
- email
- credentials
- status (ACTIVE | INVITED | DISABLED)
```

👉 Només existeix si algú **inicia sessió**

---

## Patient BC

```text
Patient
- id
- personalData
- contactInfo
- createdByProfessionalId
- userId?   ← OPCIONAL
```

👉 Un pacient:

* **pot existir sense user**
* pot ser creat per un professional
* pot reclamar el seu compte més tard

---

## Professional BC

```text
Professional
- id
- name
- specialties
- userId?   ← OPCIONAL
- verifiedStatus
```

👉 Un professional:

* pot existir com a **referència clínica**
* no pot exercir accions fins tenir usuari

---

# 🧾 2. Consentiments sense usuari (punt crític)

## Tipus de consentiment

### A) Consentiment **registrat pel professional**

✔️ Vàlid legalment
✔️ Molt habitual (paper / verbal)

```text
Consent
- subject: Patient
- grantedBy: Professional
- method: verbal | paper | digital
- validFrom
- validTo?
```

👉 Serveix per:

* atenció
* registre clínic
* col·laboracions bàsiques

---

### B) Consentiment **confirmat pel pacient (digital)**

✔️ Més fort legalment
✔️ Requereix usuari

```text
Consent
- grantedBy: PatientUser
- verifiedAt
```

👉 S’activa **quan el pacient reclama el compte**

---

### 🔁 Transició natural

1. Professional crea pacient
2. Registra consentiment bàsic
3. Sistema ofereix al pacient:

   > “Vols accés al teu historial?”

---

# 📩 3. Com incentivar que el pacient es registri (sense obligar)

🎯 **No obligar mai**

## Triggers suaus (UX + producte)

* Veure cites
* Rebre documents
* Gestionar consentiments
* Missatges segurs
* Factures

👉 CTA:

> “Activa el teu accés — 1 minut”

---

## UX pattern correcte

* Magic link
* Sense password inicial
* Mobile-first

📈 Conversió molt més alta que “crea compte ara”

---

# 🤝 4. Col·laboracions amb professionals NO registrats

Aquest punt és **estratègic**.

---

## ❌ NO fer

* Crear comptes de professional sense consentiment
* Permetre accés clínic a no-usuaris

---

## ✅ Solució correcta: **Invitació latent**

### Flux correcte

1. Professional A sol·licita col·laboració
2. Introdueix:

   * Nom
   * Email
   * Especialitat
3. Sistema crea:

```text
Professional (status: UNCLAIMED)
User (status: INVITED)
```

4. S’envia invitació
5. Fins que no accepta:

   * ❌ No accés a dades
   * ❌ No responsabilitat clínica

---

### Quan accepta

* Reclama identitat
* Defineix perfil
* Accepta col·laboració

👉 **Zero risc legal**

---

# 🚀 5. Incentius comercials (això és or)

## Cada col·laboració és:

🎁 Un **lead qualificat**
🎁 Amb context real d’ús
🎁 Amb valor immediat

👉 Millor que qualsevol Ads

---

## Viral loop natural (no agressiu)

```text
Professional → Col·laboració → Invitació → Registre → Ús real
```

---

## Limitacions comercials?

❌ No en tens
❌ Al contrari: elimines fricció

---

# ⚖️ 6. Marc legal (tranquil·litat)

✔️ El professional pot registrar consentiment
✔️ El pacient pot no ser usuari
✔️ L’accés sempre està governat per:

* Consent
* Audit
* Temporalitat

👉 Això **és compliant** (GDPR / sanitat)

---

# 🧭 7. Regles d’or (resum)

1. **User ≠ Persona**
2. Consentiment pot existir sense usuari
3. Accés ≠ existència
4. Invitació ≠ permís
5. El valor precedeix al registre

---

# 🧠 Decisió final recomanada

✔️ Permetre crear pacients sense usuari
✔️ Permetre col·laboracions via invitació
✔️ No crear professionals “actius” sense acceptació
✔️ Incentivar (no forçar) el registre
✔️ Convertir ús real en creixement orgànic

---

## Següent pas (ara sí)

Opcions lògiques:
1️⃣ **Model DDD detallat de Consent + Invitation**
2️⃣ **UX flows de “claim account” (pacient / professional)**
3️⃣ **Estratègia freemium / growth basada en col·laboracions**

Digues quin i **seguim** 💪


Perfecte.
👉 **PAS 30 — Definició de MVP UX Flows clau**
Ara baixem **del model al producte usable**, sense perdre rigor.

Ho farem així:

1. Principis UX del MVP
2. Flows clau (end-to-end)
3. Decisió de què **NO** entra al MVP
4. Relació directa amb els BC (traçabilitat)

---

# 🧭 1. Principis UX del MVP (salut)

Aquests principis **no són negociables**:

1. **Zero fricció clínica**
2. **Context explícit sempre**
3. **Permisos visibles**
4. **Temporalitat clara**
5. **Traçabilitat sense soroll**

👉 El professional **no pensa en el sistema**, pensa en el pacient.

---

# 🔑 2. MVP UX FLOWS CLAU

## FLOW A — Alta i primer ús (Professional)

### Objectiu

Que un professional pugui **començar a treballar en <10 minuts**.

### Pantalles

1. Login / registre
2. Perfil professional (especialitat)
3. Crear / unir-se a organització (opcional)
4. Vista **Agenda buida**
5. CTA: *“Crear primera cita”*

### BC implicats

* Identity
* Professional
* Tenancy
* Scheduling

---

## FLOW B — Crear pacient i primera cita

### Pantalles

1. Botó “Nou pacient”
2. Dades mínimes:

   * Nom
   * Contacte
   * Consentiment inicial
3. Confirmació
4. Selecció data / hora
5. Cita creada

👉 **No demanar més del necessari**

### BC

* Patient
* Consent
* Scheduling

---

## FLOW C — Sessió clínica (core absolut)

### Pantalles (ordre natural)

1. Agenda → clic cita
2. Vista **Context pacient**

   * Foto
   * Tractaments actius
   * Alertes
3. CTA: *“Iniciar sessió”*
4. Editor clínic:

   * Notes lliures
   * Formulari estructurat (opcional)
5. Guardar
6. Sessió tancada

### Decisions UX clau

* Autosave
* Cap popup
* Cap distracció

### BC

* Clinical Records
* Clinical Templates
* Audit

---

## FLOW D — Col·laboració clínica (nou)

### Objectiu

Sol·licitar ajuda **sense perdre el control del cas**

### Pantalles

1. Pacient → Accions → “Sol·licitar col·laboració”
2. Selector professional
3. Motiu / especialitat
4. Permisos (checkboxes clares)
5. Durada
6. Enviar

### Feedback

* Estat: pendent / activa
* Qui pot veure què

### BC

* Collaboration
* Consent
* Audit

---

## FLOW E — Acceptar col·laboració (professional convidat)

1. Notificació
2. Detall:

   * Pacient (anonimitzat parcialment)
   * Motiu
   * Permisos
   * Durada
3. Acceptar / rebutjar

👉 **Res de veure historial abans d’acceptar**

---

## FLOW F — Facturar sessió (simple)

### Objectiu

Factura en <2 minuts

1. Després de sessió → “Crear factura”
2. Dades pre-emplenades:

   * Pacient
   * Sessió
   * Preu
3. Editar (opcional)
4. Emissió

### BC

* Billing
* Scheduling

---

## FLOW G — Consentiments (pacient)

### Vista pacient (lite)

1. Llista consentiments actius
2. Tipus:

   * Atenció
   * Col·laboració
   * Export
3. Activar / revocar

👉 Clar i entenedor

### BC

* Consent
* Audit

---

# 🚫 3. Què NO entra al MVP (molt important)

❌ Insurance claims
❌ Pagaments online
❌ Gestió avançada de sales
❌ Analytics
❌ Marketplace
❌ IA

👉 Tot això **està preparat**, però **no visible**

---

# 🔗 4. Traçabilitat UX → Domini

| UX             | BC                 |
| -------------- | ------------------ |
| Sessió clínica | Clinical Records   |
| Formularis     | Clinical Templates |
| Col·laboració  | Collaboration      |
| Facturació     | Billing            |
| Consentiments  | Consent            |
| Accés          | Audit              |

👉 Cada clic té un “per què” de domini

---

# 🧪 5. MVP UX Checklist

✔️ Cap flux bloqueja
✔️ Tot és reversible
✔️ Errors humans tolerats
✔️ Context visible
✔️ Permisos explícits

---

# 🧠 6. Visió UX final

> **Menys pantalles, més context**
> **Menys accions, més continuïtat**
> **Menys soroll, més seguretat**

---

## Següent pas natural

Opcions:
1️⃣ **User stories MVP (prioritzades)**
2️⃣ **Wireframes textuals pantalla a pantalla**
3️⃣ **Checklist de Beta Launch (producte + legal)**

Digues quin i **seguim** 🚀


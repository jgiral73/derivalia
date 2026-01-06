# Guia d’aterratge al projecte

> Aquest document és el **punt d’entrada oficial** al projecte, pensat tant per a persones com per a IA. Si només llegeixes un fitxer abans de començar, que sigui aquest.

<br />

## 1. Què és aquest projecte (en una frase)

Una plataforma modular orientada a professionals de la salut i el benestar que permet **gestionar relacions clíniques complexes** (pacients, col·laboracions entre professionals, agenda, facturació, consentiments) mitjançant un **model de domini explícit**, evolutiu i governant la UX.

<br />

## 2. Com està pensat aquest repositori

Aquest no és un repositori centrat en pantalles ni en CRUDs, sinó en **domini**.

Principis clau:

* El **domini governa** l’arquitectura, la UX i els permisos
* Els **Bounded Contexts** són la unitat real de disseny
* Els estats són **explícits**, no booleans
* El sistema està pensat per créixer: MVP → scale → ecosystem

Tot el codi, decisions i UX deriven d’aquests principis.

<br />

## 3. Com llegir la documentació (ordre mínim recomanat)

Si ets humà o IA i vols entendre el projecte sense perdre matisos:

1. `guia-aterratge.md` ← (ets aquí)
2. `product-vision.md`
3. `glossary.md`
4. `bounded-contexts.md`
5. `core-domain-bc.md`
6. `api-backend.md`
7. `actor-lifecycles.md`
8. `permissions-and-ux.md`
9. `use-cases-mvp.md`
10. `architecture-decisions.md`

⚠️ **No saltis el glossari**: molts conceptes tenen significat de domini específic.

<br />

## 4. Com pensar el sistema (model mental)

### 4.1 Actors no són usuaris

* *Usuari* = identitat tècnica (login)
* *Actor* = rol de domini (Professional, Pacient, Organització)

Un mateix usuari pot representar múltiples actors en diferents estats.

<br />

### 4.2 Relacions abans que entitats

El sistema no gira només al voltant de pacients o professionals, sinó de:

* Relacions terapèutiques
* Col·laboracions
* Consentiments
* Derivacions

Moltes entitats només tenen sentit **en relació amb una altra**.

<br />

### 4.3 Estats reals, no flags

Exemple ❌:

```ts
isActive: boolean
```

Exemple ✅:

```ts
enum ProfessionalLifecycleState {
  INVITED,
  REGISTERED,
  ONBOARDED_PARTIAL,
  ONBOARDED_FULL,
  SUSPENDED
}
```

Els estats expliquen el negoci i governen la UX.

<br />

## 5. Què pots fer segons el teu objectiu

### 🔧 Vull programar backend

* Llegeix: `bounded-contexts.md` + `core-domain-bc.md`
* Respecta les capes: domain / application / infrastructure
* No introdueixis lògica de domini fora del domain

<br />

### 🎨 Vull treballar la UX / front-end

* Llegeix: `permissions-and-ux.md` + `actor-lifecycles.md`
* No dedueixis permisos: **consumeix-los**
* La UI s’adapta a l’estat, no a rols fixes

<br />

### 🧠 Sóc una IA assistint el desenvolupament

* Aquest projecte assumeix que **col·labores escrivint codi**
* Has de preservar:

  * invariants de domini
  * noms i significat del glossari
  * separació de BCs
* En cas de dubte, prioritza:

  1. `core-domain-bc.md`
  2. `product-vision.md`

<br />

## 6. Què NO és aquest projecte

* ❌ No és un simple gestor de cites
* ❌ No és un CRM mèdic clàssic
* ❌ No és un monòlit de permisos hardcodejats

És un **sistema viu**, basat en relacions, estats i confiança progressiva.

Per més informació, llegeix `no-goals.md`

<br />

## 7. Regla d’or

> Si una decisió de codi, UX o arquitectura **no es pot explicar amb el domini**, probablement és incorrecta.

<br />

Fi de la guia. A partir d’aquí, continua amb `product-vision.md`.

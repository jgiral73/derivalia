# Lifecycle d’actors (estats reals, no booleans)

[Principis generals](#principis-generals) |
[Actor: Professional](#actor-professional) |
[Actor: Patient](#actor-patient) |
[Actor: Organization](#actor-organization) |
[Transicions (regla crítica)](#transicions-regla-crítica) |
[Impacte en permisos i UX](#impacte-en-permisos-i-ux) |
[Nota final per IA](#nota-final-per-ia) |

<br />

Aquest document descriu **els cicles de vida reals dels actors del sistema**, amb estats explícits i transicions controlades.

És fonamental perquè:

* el domini **no es pot modelar amb booleans** (active / inactive)
* humans i IA entenguin **què pot fer un actor en cada moment**
* UX, permisos i backend estiguin alineats

> Regla d’or: **l’estat d’un actor determina les seves capacitats**, però mai per si sol — sempre combinat amb consentiments.

<br />

## [Principis generals](#)

1. Un actor pot existir **abans** de ser usuari

2. L’onboarding és **progressiu**, no bloquejant

3. Els estats són **explícits i persistits**

4. Les transicions són governades pel domini, no per la UI

<br />

## [Actor: Professional](#)

### Visió humana

Un professional pot entrar al sistema perquè:

* algú el convida a col·laborar
* crea el seu compte
* s’uneix a una organització

No tots aquests camins són iguals.

<br />

### ProfessionalStatus (estat canònic)

```
NON_EXISTENT
   ↓ (invitation)
INVITED
   ↓ (accept invitation)
PARTIAL_ONBOARDING
   ↓ (complete mandatory steps)
ACTIVE
   ↓ (violation / admin action)
SUSPENDED
```

<br />

### Estats detallats

| |  |  |
|:-----------------|:-----------|:-----------|
| *INVITED* | El professional existeix com a entitat<br /> de domini però no té compte complet.  <br /> (*Ex*: un especialista convidat per ajudar en un cas concret) | **Pot fer**:<br /> - Acceptar una col·laboració <br /> - Veure informació molt limitada <br /> **No pot fer**: <br /> - Accedir lliurement a pacients <br /> - Crear pacients |
| *PARTIAL_ONBOARDING* | Ha creat usuari i ha acceptat termes bàsics, <br />però no ha completat dades legals/professionals. <br /> (*Ex*: un professional que entra només per ajudar puntualment)| **Pot fer**: <br /> - Col·laborar segons consentiments <br /> - Accedir només a l’scope autoritzat  <br /> **No pot fer**: <br /> - Facturar <br /> - Crear col·laboracions pròpies | 
| *ACTIVE* | Professional completament donat d’alta. | **Pot fer**:<br /> - Crear pacients <br /> - Gestionar agenda <br /> - Facturar <br /> - Sol·licitar col·laboracions | 
| *SUSPENDED* | Accés bloquejat per motius legals o administratius. | **Clau**: No elimina dades ni relacions. | 

<br />

## [Actor: Patient](#)

### Visió humana

Un pacient sovint **no vol una app** al principi. El sistema ha de funcionar igual.

<br />

### PatientStatus

```
NON_EXISTENT
   ↓ (created by professional)
CREATED_BY_PROFESSIONAL
   ↓ (invitation sent)
INVITED
   ↓ (accept invitation)
ACTIVE
   ↓ (end of relation)
ARCHIVED
```

<br />

### Estats detallats

| |  |  |
|:-----------------|:-----------|:-----------|
| *CREATED_BY_PROFESSIONAL* | El pacient existeix només com a registre clínic. | **Clau**: Els consentiments poden existir fora del sistema (paper, verbal). |
| *INVITED* | S’ha convidat el pacient a registrar-se. | **Pot fer**:<br /> - Acceptar consentiments digitals |
| *ACTIVE* | Pacient amb usuari actiu. | **Pot fer**: <br /> - Veure part del seu historial <br /> - Gestionar consentiments| 
| *ARCHIVED* | Relació clínica finalitzada. | **Clau**: Les dades no s’esborren.| 


<br />

## [Actor: Organization](#)

### Notes clau

* Les organitzacions no tenen onboarding clínic
* El seu estat afecta **delegació i billing**

### OrganizationStatus

* ACTIVE
* SUSPENDED

<br />

## [Transicions (regla crítica)](#)

Les transicions:

* no són lliures
* no les decideix el frontend
* estan implementades com a **use cases de domini**

Exemple:

* `acceptProfessionalInvitation()`
* `completeProfessionalOnboarding()`

<br />

## [Impacte en permisos i UX](#)

> Estat ≠ permís

Permisos reals =

* estat actor
* consentiments actius
* scopes
* temps

La UI **no mostra** accions impossibles.

<br />

## [Nota final per IA](#)

Quan generis codi:

* no assumeixis `isActive = true`
* consulta sempre l’estat
* valida transicions

Aquest document és part del Core Domain.


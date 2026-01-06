# Bounded Contexts – Visió Global i Disseny Detallat

[Visió global del sistema](#1-visió-global-del-sistema) |
[Arquitectura comuna per Bounded Context](#2-arquitectura-comuna-per-bounded-context) |
[Identity & Access BC](#3-identity-access-bc) |
[Patient BC](#4-patient-bc) |
[Consent BC (nucli de seguretat clínica)](#5-consent-bc-nucli-de-seguretat-clínica) |
[Invitation & Onboarding (BC transversal)](#6-invitation-&-onboarding-bc-transversal) |
[Scheduling / Agenda BC](#7-scheduling-agenda-bc) |
[Collaboration & Derivation BC](#8-collaboration-&-derivation-bc) |
[Billing & Insurance BC](#9-billing-&-insurance-bc) |
[ClinicalRecord BC (previst)](#10-clinicalrecord-bc-previst) |
[Autorització global (resum)](#11-autorització-global-resum) |
[Notes per IA / reconstrucció](#12-notes-per-ia-reconstrucció) |


<br />

> **Propòsit del document**
>
> Aquest document descriu **pas a pas, amb detall exhaustiu**, el disseny dels *Bounded Contexts (BC)* del projecte. Està pensat:
>
> * perquè **persones** entenguin el perquè de cada decisió
> * perquè una **IA** pugui reconstruir el model sense perdre funcionalitats, matisos ni invariants
>
> És una combinació de:
>
> * visió de producte
> * memòria d’arquitectura
> * contracte de domini

<br />

## [1. Visió global del sistema](#)

Plataforma clínica professional orientada a **professionals de la salut**, amb suport per:

* identitat i accés
* gestió de pacients
* consentiment clínic explícit
* agenda i cites
* col·laboració entre professionals
* facturació flexible

Arquitectura basada en:

* **DDD (estratègic + tàctic)**
* **Bounded Contexts forts**
* **NestJS + TypeScript**
* **Prisma + MariaDB** (source of truth)
* **Ionic/Angular** al frontend

Principi fonamental:

> ❗ *Cap accés a dades clíniques sense consentiment explícit i verificable.*

<br />

## [2. Arquitectura comuna per Bounded Context](#)

Tots els BC segueixen exactament la mateixa estructura:

```
/<bounded-context>
  /domain
    /entities
    /value-objects
    /aggregates
    /repositories (interfaces)
  /application
    /use-cases
    /services
    /dtos
  /infrastructure
    /prisma
    /repositories (impl)
    /controllers
```

### Responsabilitats per capa

* **Domain**

  * Regles de negoci
  * Invariants
  * Zero dependències tècniques

* **Application**

  * Orquestració de casos d’ús
  * Coordinació entre agregats

* **Infrastructure**

  * Persistència (Prisma)
  * HTTP (NestJS controllers)
  * Detalls tècnics

<br />

## [3. Identity & Access BC](#)

### Responsabilitat

Gestió d’identitat, rols, capacitats i estat d’onboarding.

### Conceptes clau

* **User**: identitat tècnica (login)
* **Professional**: identitat clínica
* **Patient**: subjecte clínic (pot existir sense user)

Un professional o pacient **pot existir al sistema abans d’estar registrat**.

### Lifecycle del Professional

```
INVITED → REGISTERED → ONBOARDING_INCOMPLETE → ACTIVE
```

Aquest estat:

* controla quines funcionalitats estan disponibles
* s’utilitza en guards i feature flags

### Rol vs Capability

* **Rol**: categoria (PROFESSIONAL, ADMIN…)
* **Capability**: acció concreta (CREATE_PATIENT, VIEW_BILLING…)

Les capabilities:

* depenen del rol
* depenen de l’estat d’onboarding

### Exemple (conceptual)

```ts
@RequireCapabilities('PATIENT_CREATE')
@Post()
createPatient() {}
```

<br />

## [4. Patient BC](#)

### Responsabilitat

Gestió del pacient com a **subjecte clínic**, no com a usuari.

### Característiques

* Pot no tenir compte d’usuari
* Pot ser creat per un professional
* Pot estar vinculat a múltiples professionals

### Important

> ❗ El Patient BC **no** dona accés clínic.
> Tot accés passa sempre pel **Consent BC**.

<br />

## [5. Consent BC (nucli de seguretat clínica)((#)

### Responsabilitat

Controlar **qui pot accedir a què**, sobre quin pacient i durant quant temps.

### Consent

Atributs clau:

* `patientId`
* `professionalId`
* `scope` (read, write, domains específics)
* `validFrom` / `validTo`

### Invariant fonamental

```
Sense consent vàlid → cap accés clínic
```

### Ús transversal

* Guards HTTP
* Clinical records
* Search
* Col·laboracions

<br />

## [6. Invitation & Onboarding (BC transversal)((#)

### Problema que resol

* Professionals que volen col·laborar amb altres professionals
* Pacients creats abans de tenir compte d'usuari al sistema

### Invitation

* Pot apuntar a un email no registrat
* Genera un flux d’onboarding progressiu

### Progressive Unlock

Funcionalitats disponibles segons estat:

* INVITED → només acceptar
* REGISTERED → info mínima
* ONBOARDING_INCOMPLETE → funcionalitat limitada
* ACTIVE → accés complet

<br />

## [7. Scheduling / Agenda BC](#)

### Responsabilitat

Gestió del temps clínic.

### Aggregates

* Availability
* Slot
* Appointment

### Appointment

Relació:

```
Professional ↔ Patient
```

Lifecycle:

```
CREATED → CONFIRMED → CANCELLED / COMPLETED
```

### Integracions

* Requereix consent
* Origina billing

<br />

## [8. Collaboration & Derivation BC](#)

### Responsabilitat

Permetre que un professional col·labori amb un altre sobre un pacient.

### Exemple

> Terapeuta Gestalt demana ajuda a especialista en addiccions.

### Característiques

* Professional col·laborador pot no ser user complet
* Genera consentiments derivats
* Permisos temporals i amb scope limitat

<br />

## [9. Billing & Insurance BC](#)

### Responsabilitat

Facturació flexible entre múltiples actors.

### Actors possibles

* Professional → Patient
* Professional → Professional
* Organization → Professional
* Organization → Patient

### MVP

* Invoice
* Line items
* Status manual

### Fase avançada

* Insurance
* Claims
* Reports

<br />

## [10. ClinicalRecord BC (previst)((#)

### Responsabilitat

Dades clíniques estructurades.

### Contingut

* Notes
* Documents
* Registres clínics

### Accés

Sempre via Consent BC.

Preparat per:

* read models
* motor de cerca no relacional

<br />

## [11. Autorització global (resum)((#)

Accés =

```
Identity
AND Capability
AND Consent
AND Onboarding State
```

Implementat amb:

* Guards composables
* Decorators semàntics
* Feature flags

<br />

## [12. Notes per IA / reconstrucció](#)

Quan una IA llegeixi aquest document ha de:

1. Crear BCs independents
2. Respectar estrictament els límits de responsabilitat
3. No barrejar consent amb identity
4. Tractar onboarding com estat explícit
5. Considerar el consent com first-class citizen

Aquest document és el **contracte de domini** del projecte.

# Architecture Decisions (ADR)

[Principi rector](#1-principi-rector) |
[Arquitectura general](#2-arquitectura-general) |
[Backend framework](#3-backend-framework) |
[Persistència](#4-persistència) |
[Identificadors](#5-identificadors) |
[Estats explícits](#6-estats-explícits) |
[Permisos i autorització](#7-permisos-i-autorització) |
[Frontend](#8-frontend) |
[Onboarding i invitacions](#9-onboarding-i-invitacions) |
[Cerca i escalabilitat futura](#10-cerca-i-escalabilitat-futura) |
[MVP vs futur](#11-mvp-vs-futur) |
[Regla de resolució de conflictes](#12-regla-de-resolució-de-conflictes) |

<br />

Aquest document recull les **decisions arquitectòniques conscients** del projecte, el seu raonament de domini i les alternatives descartades. Serveix tant per humans com per IA per entendre *per què el sistema és així*.

<br />

## [1. Principi rector](#)

> **El domini governa l’arquitectura, no al revés.**

Qualsevol decisió tècnica ha de ser explicable en termes de:

* relacions de domini
* estats dels actors
* evolució MVP → scale → ecosystem

Si una decisió només es justifica per comoditat tècnica, es considera sospitosa.

<br />

## [2. Arquitectura general](#)

### Decisió

Arquitectura **modular per Bounded Contexts**, amb inspiració **DDD + Hexagonal (Clean Architecture)**.

Cada BC:

* és conceptualment independent
* pot evolucionar a servei separat en el futur
* conté les seves pròpies capes

```
/<bc-name>
  /domain
  /application
  /infrastructure
```

### Alternatives descartades

* Monòlit per capes globals (massa acoblament)
* Microserveis prematurs (cost operatiu excessiu per MVP)

<br />

## [3. Backend framework](#)

### Decisió

**NestJS + TypeScript** com a base del backend.

### Justificació

* Facilita modularitat per BC
* DI clara per separar domain/application
* Bona integració amb testing i Swagger

### Alternatives descartades

* Express pur (massa llibertat, risc d’arquitectura anàrquica)
* Frameworks opinats full-stack (massa acoblament amb frontend)

<br />

## [4. Persistència](#)

### Decisió

* **MariaDB** com a *source of truth* relacional
* ORM: **Prisma** (infraestructura)

El domini **no depèn** de l’ORM.

### Justificació de domini

* Relacions fortes (facturació, cites, consentiments)
* Necessitat de transaccions clares

### Alternatives descartades

* NoSQL com a base principal (massa risc d’inconsistència)

<br />

## [5. Identificadors](#)

### Decisió

Ús d’**identificadors string (UUID/ULID)** a nivell de domini.

### Justificació

* Eviten col·lisions entre BCs
* Faciliten integració futura i events
* Cost de rendiment assumible per MVP

La possible optimització (IDs numèrics interns) queda relegada a infraestructura.

<br />

## [6. Estats explícits](#)

### Decisió

Modelar **estats reals** amb enums / value objects, mai booleans.

### Exemple

```ts
enum PatientLifecycleState {
  CREATED_BY_PROFESSIONAL,
  INVITED,
  REGISTERED,
  CONSENT_PENDING,
  ACTIVE,
  ARCHIVED
}
```

### Impacte

* UX governada per estat
* Permisos derivats, no hardcodejats

<br />

## [7. Permisos i autorització](#)

### Decisió

* Autorització **basada en capacitats**, no en rols estàtics
* El backend exposa *què pot fer* l’actor en el seu estat actual

### Justificació

* Suporta onboarding progressiu
* Evita duplicació de lògica al frontend

<br />

## [8. Frontend](#)

### Decisió

Frontend (web + mobile) **agnòstic de domini**, consumidor de capacitats.

### Justificació

* La UI no decideix regles
* El backend governa fluxos

### Alternatives descartades

* RBAC al frontend
* Feature flags només client-side

<br />

## [9. Onboarding i invitacions](#)

### Decisió

* Permetre crear actors **no registrats** (professionals, pacients)
* Estat = INVITED fins a completar onboarding

### Justificació

Reflecteix la realitat del negoci i redueix fricció comercial.

<br />

## [10. Cerca i escalabilitat futura](#)

### Decisió

* Preparar arquitectura per **search engine no relacional**
* MariaDB continua sent source of truth

### Estratègia

* Projeccions async
* Lectures desacoblades

<br />

## [11. MVP vs futur](#)

### Decisió

No sobrearquitecturar el MVP.

Només s’implementa ara:

* el que afecta directament el core-domain
* el que desbloqueja fluxos reals d’ús

La resta queda documentada però no implementada.

<br />

## [12. Regla de resolució de conflictes](#)

En cas de conflicte entre documents:

1. `product-vision.md`
2. `core-domain-bc.md`
3. Aquest document

<br />

Fi del document.


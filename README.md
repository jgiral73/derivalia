# Derivalia

Plataforma Modular Backend & Frontend

[Visió general del projecte](#1-visió-general-del-projecte) |
[Objectius de negoci](#2-objectius-de-negoci) |
[Arquitectura global](#3-arquitectura-global) |
[Organització del monorepo](#4-organització-del-monorepo) |
[Backend](#5-backend) |
[Frontend](#6-frontend-apps-frontend) |
[WebSocket](#7-websocket-apps-websocket) |
[Shared Kernel](#8-shared-kernel-packages-shared-kernel) |
[Infraestructura i configuració](#9-infraestructura-i-configuració) |
[Guia per a IA](#10-guia-per-a-ia) |
[Estat del projecte](#11-estat-del-projecte) |
[Filosofia](#12-filosofia) |

<br />


## [1. Visió general del projecte](#derivalia)

**Derivalia** és una plataforma tecnològica modular dissenyada amb una arquitectura orientada a domini (DDD), pensada per evolucionar de forma incremental, mantenible i escalable.

El projecte es construeix com un **monorepo** que conté diverses aplicacions independents però coordinades:

* `apps/api` → Backend principal (API REST)
* `apps/frontend` → Aplicació frontend (SPA / Web App)
* `apps/websocket` → Servei de comunicació en temps real

L’objectiu principal és crear una base sòlida que permeti:

* encapsular correctament la lògica de negoci
* minimitzar l’acoblament entre dominis
* facilitar el treball assistit per IA (IDE-driven development)

<br />

## [2. Objectius de negoci](#derivalia)

La plataforma resol un conjunt de problemes de negoci complexos mitjançant:

* Separació clara de responsabilitats
* Evolució independent de funcionalitats
* Integració controlada entre dominis
* Preparació per a escenaris futurs (nous canals, nous productes, escalar equips)

Els objectius clau són:

* **Sostenibilitat tècnica** a llarg termini
* **Time-to-market** ràpid sense deute tècnic
* **Claredat conceptual** del domini

<br />

## [3. Arquitectura global](#derivalia)

### 3.1 Estil arquitectònic

El projecte segueix una combinació de:

* **Domain-Driven Design (DDD)**

  * Estratègic (Bounded Contexts, relacions)
  * Tàctic (Aggregates, Entities, Value Objects)
* **Arquitectura Hexagonal / Clean Architecture**
* **CQRS lleuger**
* **Eventual Consistency** entre dominis

Cap capa depèn d’una capa inferior per la seva lògica de negoci.

<br />

## [4. Organització del monorepo](#derivalia)

```
/
├─ apps/
│  ├─ api/
│  │  ├─ src/
│  │  │  ├─ bounded-contexts/
│  │  │  ├─ shared/
│  │  │  └─ main.ts
│  │  └─ prisma/
│  ├─ frontend/
│  │  ├─ src/
│  │  └─ public/
│  └─ websocket/
│     └─ src/
├─ packages/
│  └─ shared-kernel/
├─ docs/
└─ README.md
```

<br />

<!-- ## [5. Backend – `apps/api`](#derivalia) -->
## [5. Backend](#derivalia)

### `apps/api`

### 5.1 Stack tecnològic

* Node.js
* TypeScript
* NestJS
* ORM: Prisma
* Base de dades: MariaDB


### 5.2 DDD dins del backend

El backend està organitzat per **Bounded Contexts**. Cada BC:

* Té el seu propi model de domini
* Exposa la seva API
* Gestiona la seva persistència
* Publica i consumeix events

#### Estructura típica d’un BC

```
bounded-context-x/
├─ domain/
│  ├─ entities/
│  ├─ value-objects/
│  ├─ aggregates/
│  ├─ events/
│  ├─ repositories/
│  └─ services/
├─ application/
│  ├─ commands/
│  ├─ queries/
│  ├─ handlers/
│  └─ dtos/
├─ infrastructure/
│  ├─ persistence/
│  ├─ orm/
│  └─ messaging/
└─ interface/
   └─ http/
```


### 5.3 CQRS lleuger

* **Commands**: modifiquen estat
* **Queries**: només lectura
* No es dupliquen models innecessàriament


### 5.4 Events i integració

* Domain Events interns
* Integration Events entre BCs
* Sense dependències directes entre dominis

<br />

## [6. Frontend](#derivalia)

### `apps/frontend`

### 6.1 Rol

El frontend:

* Consumeix l’API REST
* No conté lògica de negoci crítica
* Reflecteix l’Ubiquitous Language definit al backend

### 6.2 Principis

* Separació entre UI i serveis
* Models alineats amb DTOs
* Preparat per canvis de domini

<br />

## [7. WebSocket](#derivalia)

### `apps/websocket`

### 7.1 Responsabilitat

Servei dedicat a:

* Comunicació en temps real
* Subscripcions a events
* Notificacions

### 7.2 Integració

* Consumeix events del backend
* No accedeix directament al domini

<br />

## [8. Shared Kernel](#derivalia)

### `packages/shared-kernel`

Conté:

* Tipus compartits estrictament necessaris
* Events comuns
* Contracts estables

⚠️ No conté lògica de negoci.

<br />

## [9. Infraestructura i configuració](#derivalia)

### 9.1 Variables d’entorn

Exemple:

```
DATABASE_URL="mysql://user:password@host:3306/db"
```

Cada app gestiona el seu propi `.env`.

<br />

## [10. Guia per a IA](#derivalia)

Aquest repositori està dissenyat perquè una IA pugui:

* Entendre el domini abans de generar codi
* Dissenyar BCs de forma independent
* Respectar l’arquitectura existent

### Regles clau per a la IA

* No barrejar dominis
* No compartir models interns
* No posar lògica de negoci a controllers
* Prioritzar claredat sobre rapidesa

<br />

## [11. Estat del projecte](#derivalia)

* Arquitectura definida
* BCs en fase de disseny detallat
* Desenvolupament iteratiu per sprints

<br />

## [12. Filosofia](#derivalia)

> "Primer el domini, després el codi, finalment el framework."

Aquest README és el punt d’entrada únic per entendre **què és Derivalia, com està pensat i com s’ha de construir**.

Per a més informació consultar els següents documents de la carpeta `/docs`:

📚 Ordre recomanat de lectura (de més conceptual → més operacional)

<br /> *Nivell 0 · Aterrament ràpid*
  
  1. `guia-aterratge.md`: Què és aquest projecte, com llegir-lo i com pensar-lo.

<br /> *Nivell 1 · Visió i llenguatge*
  
  2. `product-vision.md`: Per què existeix el producte i quins principis no es negocien.
  
  3. `glossary.md`: Vocabulari controlat. Evita malentesos humans/IA des del principi.

<br /> *Nivell 2 · Domini i arquitectura conceptual*
  
  4. `bounded-contexts.md`: Descripció extensiva de cada BC (què conté i què NO).
  
  5. `core-domain-bc.md`: El cor del negoci: regles, invariants i decisions crítiques.
  
  6. `api-backend.md`: Vista sistèmica: descriu en detall el backend API del projecte.

<br /> *Nivell 3 · Dinàmica del domini*
  
  7. `actor-lifecycles.md`: Estats reals dels actors (no flags), transicions i significat.
  
  8. `permissions-and-ux.md`: Com el domini governa la UX. Del backend a la interfície.

<br /> *Nivell 4 · Execució MVP*
  
  9. `use-cases-mvp.md`: Què ha de funcionar a la beta i en quin ordre.

<br /> *Nivell 5 · Decisions estructurals*
  
  10. `architecture-decisions.md`: Decisions preses, alternatives descartades i per què.

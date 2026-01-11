# API Backend — Derivalia

[Rol de l’API dins la plataforma](#1-rol-de-lapi-dins-la-plataforma) |
[Stack tecnològic](#2-stack-tecnològic) |
[Principis irrenunciables](#3-principis-irrenunciables) |
[Organització del codi](#4-organització-del-codi) |
[Estructura interna d’un Bounded Context](#5-estructura-interna-dun-bounded-context) |
[CQRS dins l’API](#6-cqrs-dins-lapi) |
[Events](#7-events) |
[Gestió d’errors](#8-gestió-derrors) |
[Persistència i ORM](#9-persistència-i-orm) |
[Configuració i entorn](#10-configuració-i-entorn) |
[Testing (principis)](#11-testing-principis) |
[Guia estricta per a IA](#12-guia-estricta-per-a-ia) |
[Estat actual](#13-estat-actual) |
[Filosofia](#filosofia) |

<br />

Aquest document descriu en detall el **backend API** del projecte **Derivalia**.

És el **manual operatiu** perquè qualsevol desenvolupador o IA pugui:

* entendre com està construït el backend
* dissenyar i implementar nous Bounded Contexts
* mantenir la coherència amb DDD i l’arquitectura definida

<br />


## [1. Rol de l’API dins la plataforma](#)

L’API és el **nucli executable del domini**. És l’únic lloc on:

* viu la lògica de negoci
* s’apliquen invariants
* es decideixen transicions d’estat

Altres apps (frontend, websocket) **no contenen domini**: només consumeixen l’API o els seus events.

<br />

## [2. Stack tecnològic](#)

* **Runtime**: Node.js
* **Llenguatge**: TypeScript (strict)
* **Framework**: NestJS
* **Arquitectura**: DDD + Hexagonal / Clean Architecture
* **Persistència**: Prisma
* **Base de dades**: MariaDB / MySQL

<br />

## [3. Principis irrenunciables](#)

1. El domini no depèn del framework
2. Cap BC coneix la implementació d’un altre BC
3. No hi ha lògica de negoci a:

   * Controllers
   * DTOs
   * ORM entities
4. Els use cases viuen a l’Application Layer
5. Els events governen la integració

<br />

## [4. Organització del codi](#)

```
apps/api/src/
├─ bounded-contexts/
│  ├─ <bounded-context-name>/
│  │  ├─ domain/
│  │  ├─ application/
│  │  ├─ infrastructure/
│  │  └─ interface/
│  └─ ...
├─ shared/
│  ├─ domain/
│  ├─ application/
│  └─ infrastructure/
└─ main.ts
```

<br />

## [5. Estructura interna d’un Bounded Context](#)

### 5.1 Domain Layer

Responsable de:

* regles de negoci
* invariants
* modelatge del domini

Inclou:

```
domain/
├─ aggregates/
├─ entities/
├─ value-objects/
├─ events/
├─ repositories/
└─ services/
```

**Regles**

* Zero imports de NestJS
* Zero imports d’ORM

<br />

### 5.2 Application Layer

Responsable de:

* orquestrar casos d’ús
* coordinar agregats
* publicar events

Inclou:

```
application/
├─ commands/
├─ queries/
├─ handlers/
├─ dtos/
└─ mappers/
```

**Notes**

* Aquí s’aplica CQRS lleuger
* No conté regles de negoci complexes

<br />

### 5.3 Infrastructure Layer

Responsable de:

* persistència
* implementacions tècniques
* integracions

Inclou:

```
infrastructure/
├─ persistence/
├─ orm/
├─ messaging/
└─ config/
```

**Notes**

* Implementa repositoris del domini
* Converteix dades ↔ domini

<br />

### 5.4 Interface Layer

Responsable de:

* exposar l’API REST
* validar entrades
* retornar respostes

Inclou:

```
interface/
└─ http/
   ├─ controllers/
   ├─ requests/
   └─ responses/
```

<br />

## [6. CQRS dins l’API](#)

* **Commands**

  * creen o modifiquen estat
  * poden generar events

* **Queries**

  * només lectura
  * poden usar models optimitzats

No es creen models duplicats si no aporten valor.

<br />

## [7. Events](#)

### 7.1 Domain Events

* Interns al BC
* Expressen fets de negoci

### 7.2 Integration Events

* Exposats a altres BCs
* Contractes estables

<br />

## [8. Gestió d’errors](#)

* Errors de domini → excepcions semàntiques
* Errors tècnics → adaptats a HTTP

Mai es filtra una excepció d’infraestructura directament.

<br />

## [9. Persistència i ORM](#)

* L’ORM és un detall d’implementació
* Les entitats ORM **no són** entities de domini
* Els repositoris del domini defineixen el contracte

<br />

## [10. Configuració i entorn](#)

Variables d’entorn típiques:

```
DATABASE_URL=mysql://user:password@host:3306/db
NODE_ENV=development
```

Cada BC pot tenir configuració pròpia si cal.

<br />

## [11. Testing (principis)](#)

* Tests de domini sense framework
* Tests d’Application Layer amb mocks
* Infra testejada amb integració

<br />

## [12. Guia estricta per a IA](#)

Quan generis codi dins `apps/api`:

* Llegeix aquest README
* Respecta el BC Map i els ADR
* Dissenya abans d’implementar
* Mai barregis capes

Si hi ha dubtes conceptuals:

* **atura’t i pregunta**

<br />

## [13. Estat actual](#)

* Estructura definida
* BCs pendents d’implementació seqüencial

<br />

## [Filosofia](#)

> "El backend és una expressió executable del domini, no un CRUD sofisticat."


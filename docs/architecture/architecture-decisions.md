# Architecture Decision Records (ADR)

[Monorepo com a estratègia de base](#adr-01-monorepo-com-a-estratègia-de-base) | 
[Domain-Driven Design com a nucli conceptual](#adr-02-domain-driven-design-com-a-nucli-conceptual) | 
[Arquitectura Hexagonal i Clean Architecture](#adr-03-arquitectura-hexagonal-i-clean-architecture) | 
[NestJS com a framework backend](#adr-04-nestjs-com-a-framework-backend) | 
[CQRS lleuger](#adr-05-cqrs-lleuger) | 
[Eventual Consistency entre Bounded Contexts](#adr-06-eventual-consistency-entre-bounded-contexts) | 
[Domain Events vs Integration Events](#adr-07-domain-events-vs-integration-events) | 
[Persistència per BC](#adr-08-persistència-per-bc) | 
[Shared Kernel mínim](#adr-09-shared-kernel-mínim) | 
[Frontend sense lògica de domini](#adr-10-frontend-sense-lògica-de-domini) | 
[WebSocket com a servei separat](#adr-11-websocket-com-a-servei-separat) | 
[Desenvolupament assistit per IA](#adr-12-desenvolupament-assistit-per-ia) | 

<br />

Aquest document recull les **decisions arquitectòniques clau** del projecte **Derivalia**, amb l’objectiu de:

* preservar el raonament darrere de cada decisió
* facilitar l’onboarding (humà i IA)
* evitar regressions conceptuals amb el temps

Cada decisió inclou el **context**, la **decisió presa** i les **conseqüències**.

<br />


## [ADR-01. Monorepo com a estratègia de base](#architecture-decision-records-adr)

### Context

El projecte inclou múltiples aplicacions (API, frontend, websocket) i codi compartit. Es vol:

* coherència arquitectònica
* visibilitat global del domini
* facilitar el treball assistit per IA

### Decisió

Utilitzar un **monorepo** amb separació per aplicacions (`apps/*`) i paquets compartits (`packages/*`).

### Conseqüències

* ✅ Visió global del sistema
* ✅ Refactors transversals més segurs
* ⚠️ Cal disciplina per evitar dependències incorrectes

<br />

## [ADR-02. Domain-Driven Design com a nucli conceptual](#architecture-decision-records-adr)

### Context

El domini és complex i evolutiu. L’arquitectura ha de resistir canvis de negoci sense refactors massius.

### Decisió

Adoptar **DDD estratègic i tàctic** com a fonament:

* Bounded Contexts explícits
* Ubiquitous Language
* Modelatge del domini abans que el codi

### Conseqüències

* ✅ Codi alineat amb el negoci
* ✅ Millor comunicació entre stakeholders
* ⚠️ Major inversió inicial de disseny

<br />

## [ADR-03. Arquitectura Hexagonal i Clean Architecture](#architecture-decision-records-adr)

### Context

Es vol evitar l’acoblament del domini a frameworks, bases de dades o protocols.

### Decisió

Aplicar **Hexagonal / Clean Architecture**:

* El domini no depèn de cap tecnologia
* NestJS actua com a infraestructura

### Conseqüències

* ✅ Domini testejable i estable
* ✅ Facilitat per canviar ORM o transport
* ⚠️ Més capes i fitxers

<br />

## [ADR-04. NestJS com a framework backend](#architecture-decision-records-adr)

### Context

Cal un framework madur per TypeScript que suporti modularitat i DI.

### Decisió

Utilitzar **NestJS**, restringint-lo a:

* Controllers
* Modules
* Providers d’infraestructura

### Conseqüències

* ✅ Productivitat i estructura
* ⚠️ Risc d’“anèmia de domini” si s’abusa del framework

<br />

## [ADR-05. CQRS lleuger](#architecture-decision-records-adr)

`CQRS`: *Command Query Responsibility Segregation*

### Context

No totes les operacions tenen els mateixos requisits de lectura i escriptura.

### Decisió

Adoptar **CQRS lleuger**:

* Commands per modificar estat
* Queries per lectura
* Sense separar bases de dades

### Conseqüències

* ✅ Claredat de casos d’ús
* ✅ Sense sobreenginyeria

<br />

## [ADR-06. Eventual Consistency entre Bounded Contexts](#architecture-decision-records-adr)

### Context

Els BCs no han d’estar fortament acoblats ni compartir transaccions.

### Decisió

* Comunicació entre BCs via **events**
* Sense transaccions distribuïdes

### Conseqüències

* ✅ Escalabilitat i independència
* ⚠️ Complexitat en gestió d’estats intermedis

<br />

## [ADR-07. Domain Events vs Integration Events](#architecture-decision-records-adr)

### Context

Cal distingir esdeveniments interns dels exposats a altres Bounded Contexts.

### Decisió

* **Domain Events**: interns al BC
* **Integration Events**: contractes entre BCs

### Conseqüències

* ✅ Control de dependències
* ✅ Possibilitat d’ACL

<br />

## [ADR-08. Persistència per BC](#architecture-decision-records-adr)

### Context

Cada Bounded Context té necessitats pròpies de dades.

### Decisió

* Cada BC gestiona els seus repositoris
* ORM com a detall d’infraestructura

### Conseqüències

* ✅ Autonomia del BC
* ⚠️ Possibles duplicacions de dades

<br />

## [ADR-09. Shared Kernel mínim](#architecture-decision-records-adr)

### Context

Alguns conceptes són realment compartits, però el risc d’acoblament és alt.

### Decisió

Crear un **Shared Kernel** molt restringit:

* Tipus
* Events comuns
* Contracts estables

### Conseqüències

* ✅ Evita duplicació absurda
* ⚠️ Qualsevol canvi és crític

<br />

## [ADR-10. Frontend sense lògica de domini](#architecture-decision-records-adr)

### Context

El domini ha de tenir una única font de veritat.

### Decisió

* El frontend consumeix DTOs
* No reimplementa regles de negoci

### Conseqüències

* ✅ Domini centralitzat
* ✅ Menys inconsistències

<br />

## [ADR-11. WebSocket com a servei separat](#architecture-decision-records-adr)

### Context

La comunicació en temps real no ha de contaminar el domini.

### Decisió

Crear un servei **websocket** independent que:

* consumeix events
* notifica clients

### Conseqüències

* ✅ Escalabilitat
* ✅ Aïllament del domini

<br />

## [ADR-12. Desenvolupament assistit per IA](#architecture-decision-records-adr)

### Context

El projecte es desenvolupa amb suport intensiu d’IA a l’IDE.

### Decisió

* README i ADR com a font de veritat
* Regles explícites per a IA
* Bounded Contexts dissenyats seqüencialment

### Conseqüències

* ✅ Coherència arquitectònica
* ⚠️ Cal mantenir documentació viva

<br />

## Estat

Aquest document és **viu**.

Qualsevol decisió arquitectònica rellevant:

* s’ha d’afegir com un nou ADR (*Architecture Decision Record*)
* no s’ha de modificar retroactivament sense motiu justificat


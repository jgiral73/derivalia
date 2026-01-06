# Guia d’aterratge al projecte — següents passos coherents

## Objectiu del document

Aquest document existeix perquè **una persona humana o una IA** puguin arribar al projecte, entendre **què ja està decidit**, **què no**, i **com continuar desenvolupant sense trencar el model**.

És una guia pedagògica, no normativa, però marca el camí recomanat.

<br />

## Ordre mental recomanat (abans d’escriure codi)

1. Entendre **el problema humà** que resol el producte
2. Entendre **el Core Domain** (ja definit)
3. Entendre **com cooperen els BCs**
4. Entendre **com es tradueix això a codi i UX**

Si aquest ordre es trenca, el projecte deriva cap a solucions tècniques sense coherència clínica ni legal.

<br />

A partir d’ara, l’ordre coherent és:

1. ✅ Core Domain (ja fet)
1. 🔜 Glossari de domini (evitar ambigüitats humans/IA)
1. 🔜 Context Map DDD (estratègia global)
1. 🔜 Lifecycle d’actors (estats reals, no booleans)
1. 🔜 Permisos ↔ UX (com el domini governa la interfície)
1. 🔜 Use cases MVP (on el codi comença a ser inevitable)

<br />

## 1. Glossari de domini (pas obligatori)

### Per què?

Humans i IA fallen quan **una mateixa paraula significa coses diferents**.

### Exemple humà

* “Pacient” no és necessàriament usuari registrat
* “Professional” pot existir abans de fer onboarding
* “Col·laboració” no implica accés total

### Acció recomanada

Crear un document `docs/glossary.md` amb:

* Termes
* Definició curta
* Exemple real
* Contraexemple

<br />

## 2. Context Map DDD (estratègic)

### Què cal documentar

Un diagrama clar (Mermaid o ASCII) amb:

* Core Domain
* Supporting Domains
* Generic Domains
* Relacions (upstream / downstream)

### Exemple conceptual

```
[Identity] --> [Consent & Collaboration] --> [Scheduling]
                       |
                       v
                  [Clinical Records]
```

### Acció recomanada

Crear `docs/context-map.md`

<br />

## 3. Lifecycle dels actors (model mental)

### Actors clau

* Professional
* Patient
* Organization

### Exemple humà (Professional)

1. No existeix
2. Existeix com a entitat convidada
3. Accepta col·laboració
4. Fa onboarding parcial
5. Fa onboarding complet
6. Esdevé professional actiu

Això **no és un booleà**. És una màquina d’estats.

### Acció

Document `docs/actor-lifecycles.md`

<br />

## 4. Traducció a permisos i UX (pont crític)

### Principi clau

> L’usuari no veu funcions: veu **possibilitats**.

### Exemple humà

Un professional pot:

* veure un pacient
* però no editar-lo
* però sí escriure notes
* però només durant 30 dies

Això és:

* consentiment
* temporal
* contextual

### Acció

Document `docs/permissions-and-ux.md`

<br />

## 5. Estructura de projectes (on va cada cosa)

### Backend

* Monorepo
* Un BC = una carpeta
* Capes clares: domain / application / infrastructure

### Frontend (Ionic/Angular)

* No replica BCs
* Consumeix capabilities
* Usa guards + feature flags

### Exemple

```
apps/api
  /scheduling
  /patients
  /billing

apps/mobile
  /features/agenda
  /features/patients
```

<br />

## 6. Com ha de treballar una IA dins el projecte

### Regles d’or

* No crear entitats noves sense BC
* No saltar-se el Core Domain
* No assumir que un usuari és actiu

### Prompt base recomanat

> “Implementa aquest cas d’ús respectant els BCs existents, els lifecycles definits i els invariants de consentiment.”

<br />

## 7. Proper pas realista

El següent document que **realment desbloqueja codi** és:

➡️ `docs/use-cases-mvp.md`

Amb:

* Casos d’ús prioritaris
* Actors
* Preconditions
* Resultat esperat

<br />

## Missatge final (important)

Aquest projecte no falla per complexitat tècnica.
Falla si:

* es perd el model
* es banalitzen els consentiments
* es tracta la salut com un CRUD

Aquesta documentació existeix per evitar-ho.

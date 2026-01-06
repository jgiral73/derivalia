# Product Vision

[Problema que resol el producte](#2-problema-que-resol-el-producte) |
[Qui serveix el producte (actors)](#3-qui-serveix-el-producte-actors) |
[Principis de producte (no negociables)](#4-principis-de-producte-no-negociables) |
[Què ÉS el MVP](#5-què-és-el-mvp) |
[Què NO és el producte (encara)](#6-què-no-és-el-producte-encara) |
[Relació amb la resta de documents](#7-relació-amb-la-resta-de-documents) |
[Visió a llarg termini (sense compromís d’abast)](#8-visió-a-llarg-termini-sense-compromís-dabast) |
[Frase resum (per humans i IA)](#9-frase-resum-per-humans-i-ia) |

<br />


Aquest document defineix **la visió de producte** del projecte: per què existeix, quin problema resol, per a qui, i quins principis governen totes les decisions de domini, UX i arquitectura.

És el document **més estratègic** del conjunt. No entra en detalls tècnics ni d’implementació, però fixa els límits dins dels quals tots els altres documents tenen sentit.

Ha de ser llegible tant per humans com per IA, i serveix com a *north star* quan apareguin dubtes o decisions ambigües.

<br />

## [1. Problema que resol el producte](#)

Actualment, la relació entre **professionals de la salut / benestar** i **pacients** està fragmentada:

* sistemes d’agenda desacoblats del context clínic
* historials clínics dispersos, poc estructurats o no cercables
* processos d’onboarding lents i manuals
* billing separat de la realitat assistencial
* experiències d’usuari poc alineades amb la maduresa real de cada actor

El producte neix per **unificar aquests fluxos** sota un mateix model de domini, mantenint:

* rigor clínic
* flexibilitat multi-tenant
* evolució progressiva dels actors

<br />

## [2. Qui serveix el producte (actors)](#)

### 2.1 Pacient

Persona que rep atenció.

Necessita:

* gestionar cites
* tenir continuïtat assistencial
* entendre el seu procés sense complexitat tècnica

No és un usuari “expert”. La UX ha d’estar **governada pel seu estat vital i relacional**, no per permisos arbitraris.

### 2.2 Professional

Persona que ofereix serveis clínics o de benestar.

Pot estar en múltiples estats:

* interessat
* en onboarding
* validat
* operatiu

La plataforma **no assumeix competència plena inicial**. El sistema acompanya el professional fins a la maduresa.

### 2.3 Sistema / Plataforma

Actor implícit que:

* governa estats
* valida transicions
* desbloqueja capacitats

<br />

## [3. Principis de producte (no negociables)](#)

### 3.1 El domini governa la UX

La interfície **no decideix** què es pot fer.

La UX és una projecció de:

* estats del domini
* permisos derivats
* lifecycle real dels actors

### 3.2 Progressive unlock

Cap actor veu tot el sistema des del primer dia.

Les capacitats s’activen quan:

* l’actor ha arribat a un estat vàlid
* el sistema pot garantir coherència i seguretat

### 3.3 Source of Truth relacional

* MariaDB és el *source of truth*
* qualsevol motor de cerca o projecció és derivada

No hi ha duplicació semàntica.

### 3.4 Pensat per humans + IA

El projecte està dissenyat perquè:

* humans el puguin entendre
* una IA pugui continuar el desenvolupament sense perdre matisos

Per això:

* documents explícits
* vocabulari controlat
* decisions traçables

<br />

## [4. Què ÉS el MVP](#)

El MVP permet:

* identitat i autenticació
* onboarding complet de professionals
* gestió de pacients
* agenda i cites
* billing bàsic
* historials clínics estructurats (no encara intel·ligents)

Amb:

* fluxos complets
* estats reals
* UX coherent

<br />

## [5. Què NO és el producte (encara)](#)

* no és un marketplace massiu
* no és un EHR hospitalari complet
* no és una eina d’analytics avançada
* no és una plataforma de contingut

Això protegeix el focus.

<br />

## [6. Relació amb la resta de documents](#)

Aquest document:

* dona context a `core-domain-bc.md`
* justifica `use-cases-mvp.md`
* explica per què existeixen `actor-lifecycles.md` i `permissions-and-ux.md`

Si hi ha conflicte entre documents:
👉 **aquest document té prioritat conceptual**.

<br />

## [7. Visió a llarg termini (sense compromís d’abast)](#)

A llarg termini, el producte podria evolucionar cap a:

* cerques clíniques avançades
* assistència intel·ligent al professional
* integracions externes

Però només si:

* el core-domain es manté coherent
* els estats continuen sent explícits

<br />

## [8. Frase resum (per humans i IA)](#)

> Una plataforma que acompanya professionals i pacients al llarg del seu lifecycle real, on el domini governa la UX i el sistema creix només quan els actors estan preparats.

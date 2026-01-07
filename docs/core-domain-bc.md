# Core Domain – Relacions clíniques i col·laboratives

[Què és realment el core-domain](#1-què-és-realment-el-core-domain) |
[Bounded Contexts prioritaris](#2-bounded-contexts-prioritaris) |
[Actors essencials del model](#3-actors-essencials-del-model) |
[Relacions com a primera classe](#4-relacions-com-a-primera-classe) |
[Consent / Conformitat (nucli absolut)](#5-consent-conformitat-nucli-absolut) |
[Col·laboració professional (core-domain pur)](#6-col·laboració-professional-core-domain-pur) |
[Onboarding progressiu com a conseqüència del domini](#7-onboarding-progressiu-com-a-conseqüència-del-domini) |
[Regles no negociables del core-domain](#8-regles-no-negociables-del-core-domain) |
[Com protegir el core-domain](#9-com-protegir-el-core-domain) |
[Prioritat documental](#10-prioritat-documental) |

<br />

Aquest document defineix **què és essencial i no negociable** en el negoci. Si només un Bounded Context pogués existir, seria aquest.

<br />

## [1. Què és realment el core-domain](#)

El core-domain **NO** és:

* l’agenda
* la facturació
* els historials clínics
* l’aplicació mòbil o web

El core-domain és:

> **La gestió de relacions clíniques i col·laboratives basades en confiança, consentiment i responsabilitat professional**, al llarg del temps.

Tot la resta (agenda, billing, UX, permisos) existeix **per servir aquest nucli**.

<br />

## [2. Bounded Contexts prioritaris](#)

El core-domain travessa principalment aquests BCs (en ordre de prioritat):

1. **Identity & Actors**
2. **Patient**
3. **Professional Collaboration**
4. **Consent / Conformitat**

Scheduling, Billing, Documents i Search **no són core**, sinó *supporting / generic subdomains*.

<br />

## [3. Actors essencials del model](#)

### 3.1 Professional

**Professional** és l’actor central del sistema.

No és:

* només un usuari
* només un proveïdor de serveis

És:

* un actor amb **responsabilitat legal i ètica**
* amb una o més especialitats
* que pot iniciar relacions clíniques i col·laboracions

Responsabilitats clau:

* crear pacients (encara no registrats)
* sol·licitar consentiments
* iniciar col·laboracions
* assumir o delegar responsabilitats

<br />

### 3.2 Pacient

El **Pacient** és un actor sobirà.

Pot existir en diferents formes:

* creat per un professional
* convidat però no registrat
* registrat com a usuari

Principi clau:

> El pacient **existeix abans** que l’usuari.

El sistema mai pot assumir control sobre el pacient sense consentiment explícit.

<br />

## [4. Relacions com a primera classe](#)

### 4.1 Relació professional–pacient

No és un simple link.

És una relació amb:

* inici
* estat
* responsabilitats
* límits temporals

Aquesta relació pot existir:

* amb o sense tractament formal
* amb o sense organització

<br />

### 4.2 Tractament (agregat opcional)

**Tractament** descriu:

* una relació terapèutica activa
* en un període de temps
* amb un objectiu clínic

No totes les relacions tenen tractament.

Això permet:

* primeres visites
* consultes puntuals
* derivacions

<br />

## [5. Consent / Conformitat (nucli absolut)](#)

Sense consentiment **no existeix relació legítima**.

### 5.1 Consentiment

El consentiment:

* és explícit
* és revocable
* és contextual (per relació, no global)

No és:

* implícit
* permanent
* transferible

<br />

### 5.2 Conformitat

La **conformitat** és la materialització formal del consentiment:

* acceptació de col·laboració
* acceptació de tractament
* acceptació de compartició d’informació

És traçable i auditable.

<br />

## [6. Col·laboració professional (core-domain pur)](#)

La col·laboració:

* sempre gira al voltant d’un pacient
* pot ser sol·licitada abans que l’altre professional estigui registrat
* té un àmbit (especialitat, objectiu)

No és simètrica:

* qui sol·licita manté la responsabilitat principal

<br />

## [7. Onboarding progressiu com a conseqüència del domini](#)

L’onboarding no és una feature d’UX, sinó una conseqüència directa del core-domain.

Actors poden:

* existir sense usuari
* operar parcialment
* desbloquejar capacitats segons estat

<br />

## [8. Regles no negociables del core-domain](#)

1. Cap relació sense consentiment
2. Cap consentiment fora de context
3. Cap col·laboració sense pacient
4. Cap responsabilitat implícita
5. Cap acció crítica sense traçabilitat

<br />

## [9. Com protegir el core-domain](#)

* El core-domain **no depèn** de UI, ORM ni framework
* Qualsevol canvi ha de justificar-se aquí
* Si una feature no toca aquest document, probablement no és core

<br />

## [10. Prioritat documental](#)

En cas de conflicte:

1. `product-vision.md`
2. **aquest document**
3. `non-goals.md`

<br />

Fi del document.

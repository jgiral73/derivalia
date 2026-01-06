
# Domain Invariants


[Invariants fonamentals (core-domain)](#1-invariants-fonamentals-core-domain) | 
[Invariants sobre col·laboracions](#2-invariants-sobre-collaboracions) | 
[Invariants sobre actors i estats](#3-invariants-sobre-actors-i-estats) | 
[Invariants temporals](#4-invariants-temporals) | 
[Invariants d’arquitectura (derivades del domini)](#5-invariants-darquitectura-derivades-del-domini) | 
[Com utilitzar aquest document](#6-com-utilitzar-aquest-document) | 
[Prioritat documental](#7-prioritat-documental) | 

<br />

> Aquest document defineix les **regles absolutes i no negociables del domini**. Si una invariant es viola, el sistema està incorrecte encara que “funcioni”.

Aquestes invariants són **independents de tecnologia, UX o implementació** i han de ser respectades per humans i IA.

<br />

## [1. Invariants fonamentals (core-domain)](#)

### I-01 · No existeix relació clínica sense consentiment

Cap relació **Professional ↔ Pacient** és legítima sense un consentiment explícit i contextual.

* No hi ha consentiment implícit
* No hi ha consentiment global
* No hi ha herència automàtica de consentiments

<br />

### I-02 · Tot consentiment és contextual i revocable

Un consentiment:

* està lligat a una relació concreta
* pot ser revocat en qualsevol moment
* la revocació té efectes immediats sobre capacitats

<br />

### I-03 · Cap acció crítica sense traçabilitat

Qualsevol acció que impliqui:

* dades clíniques
* responsabilitat professional
* compartició d’informació

ha de ser:

* atribuïble a un actor
* registrada en el temps
* auditable

<br />

### I-04 · El pacient és actor sobirà

* El pacient existeix independentment del sistema
* El sistema no pot actuar en nom del pacient sense autorització
* La manca de registre **no elimina** drets del pacient

<br />

## [2. Invariants sobre col·laboracions](#)

### I-05 · No hi ha col·laboració sense pacient

Tota col·laboració professional:

* fa referència a **un pacient concret**
* té un objectiu clínic o d’acompanyament

No existeixen col·laboracions genèriques.

<br />

### I-06 · La responsabilitat no és simètrica

En una col·laboració:

* el professional sol·licitant manté la responsabilitat principal
* el col·laborador té responsabilitat limitada i contextual

<br />

### I-07 · Cap col·laboració sense conformitat

Una col·laboració només és activa quan:

* el professional convidat accepta (conformitat)
* el pacient autoritza la participació

<br />

## [3. Invariants sobre actors i estats](#)

### I-08 · Els estats governen capacitats

* Les capacitats **deriven de l’estat**, no del rol
* No hi ha permisos hardcodejats

Si l’estat canvia, les capacitats canvien.

<br />

### I-09 · No hi ha accions fora del lifecycle

Cap actor pot executar una acció:

* incompatible amb el seu estat actual
* que salti etapes del lifecycle

<br />

## [4. Invariants temporals](#)

### I-10 · El temps importa

* Relacions, consentiments i col·laboracions tenen inici i fi
* Cap relació és assumida com a eterna

<br />

## [5. Invariants d’arquitectura (derivades del domini)](#)

### I-11 · El domini no depèn d’infraestructura

* El core-domain no coneix ORM, DB ni framework
* Qualsevol dependència cap avall viola el model

<br />

### I-12 · El frontend no decideix regles

* La UI no infereix permisos
* La UI consumeix capacitats

<br />

## [6. Com utilitzar aquest document](#)

Abans de:

* escriure codi
* afegir una feature
* acceptar una integració

Verifica:

> Alguna invariant pot quedar violada?

Si sí → **aturar i redissenyar**.

<br />

## [7. Prioritat documental](#)

En cas de conflicte:

1. `product-vision.md`
2. `core-domain-bc.md`
3. **aquest document**

<br />

Fi del document.

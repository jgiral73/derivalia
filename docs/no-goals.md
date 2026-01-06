# Non-goals del projecte

> Aquest document defineix **explícitament què NO és ni serà** aquest projecte, almenys en el seu nucli. És tan important com els objectius, perquè evita deriva funcional, sobreenginyeria i males decisions (humanes o d’IA).

<br />

## 1. Principi general

> **Si una funcionalitat no reforça el core-domain ni les relacions clíniques, és candidata a ser un non-goal.**

Aquest document té prioritat quan apareixen dubtes del tipus:

* “Ja que hi som, també podríem…”
* “Això ho fan altres plataformes…”

<br />

## 2. Non-goals de producte

### 2.1 No és un EHR complet (Electronic Health Record)

* ❌ No pretén substituir sistemes hospitalaris
* ❌ No cobreix protocols clínics oficials complets
* ❌ No modela tota la història mèdica longitudinal d’un pacient

👉 El focus és **la relació terapèutica i col·laborativa**, no l’historial mèdic universal.

<br />

### 2.2 No és un CRM genèric

* ❌ No hi ha pipelines de vendes
* ❌ No hi ha scoring comercial
* ❌ No hi ha automatitzacions de màrqueting

Les relacions no són oportunitats comercials.

<br />

### 2.3 No és una xarxa social

* ❌ No hi ha feed públic
* ❌ No hi ha likes, follows o comentaris oberts
* ❌ No hi ha discovery social o viralitat

La confiança professional és **selectiva i contextual**, no social.

<br />

## 3. Non-goals de domini

### 3.1 No hi ha rols globals rígids

* ❌ No existeix un RBAC clàssic (ADMIN / USER / etc.)
* ❌ No hi ha permisos hardcodejats per tipus d’usuari

Els permisos **emergeixen de l’estat i la relació**.

<br />

### 3.2 No hi ha “pacient propietat del sistema”

* ❌ El sistema no assumeix control total sobre dades del pacient
* ❌ No hi ha ús secundari de dades fora del consentiment explícit

El pacient és **actor sobirà**, encara que no estigui registrat.

<br />

### 3.3 No hi ha automatització clínica decisional

* ❌ No es fan diagnòstics automàtics
* ❌ No es recomanen tractaments
* ❌ No hi ha IA clínica prescriptiva

El sistema **suporta**, no substitueix, el criteri professional.

<br />

## 4. Non-goals tècnics

### 4.1 No hi ha microserveis prematurs

* ❌ No es fragmenta el sistema abans de necessitat real
* ❌ No hi ha complexitat operativa innecessària

Els BCs són modulars però desplegats conjuntament en MVP.

<br />

### 4.2 No hi ha optimització prematura

* ❌ No es prioritza rendiment sobre claredat de domini
* ❌ No s’optimitzen queries abans de tenir ús real

La claredat del model és prioritària.

<br />

### 4.3 No hi ha lògica de domini al frontend

* ❌ El frontend no decideix permisos
* ❌ El frontend no infereix estats

La UI **consumeix capacitats**, no regles.

<br />

## 5. Non-goals d’UX

### 5.1 No es força onboarding complet upfront

* ❌ No hi ha formularis llargs obligatoris a l’inici
* ❌ No es bloqueja l’ús per manca de dades no crítiques

L’onboarding és **progressiu i contextual**.

<br />

### 5.2 No hi ha “one-size-fits-all”

* ❌ No totes les pantalles són accessibles a tothom
* ❌ No tots els actors veuen el mateix

La UX reflecteix estat i relació.

<br />

## 6. Com utilitzar aquest document

Abans de:

* afegir una feature
* acceptar una petició comercial
* implementar una optimització

Pregunta’t:

> Això entra en algun non-goal?

Si la resposta és sí → **no s’implementa** (o es documenta com a futur possible fora del core).

<br />

## 7. Prioritat documental

En cas de conflicte:

1. `product-vision.md`
2. `core-domain-bc.md`
3. `non-goals.md`

<br />

Fi del document.

# Use Cases MVP

[Objectiu del document](#objectiu-del-document) |
[Criteris de selecció MVP](#criteris-de-selecció-mvp) |
[Actors involucrats](#actors-involucrats) |
[UC-01. Registre bàsic de professional](#uc-01-registre-bàsic-de-professional) |
[UC-02. Crear pacient (sense usuari)](#uc-02-crear-pacient-sense-usuari) |
[UC-03. Invitar pacient a la plataforma](#uc-03-invitar-pacient-a-la-plataforma) |
[UC-04. Crear cita (agenda)](#uc-04-crear-cita-agenda) |
[UC-05. Sol·licitar col·laboració](#uc-05-sol·licitar-col·laboració) |
[UC-06. Acceptar col·laboració](#uc-06-acceptar-col·laboració) |
[UC-07. Accedir a dades clíniques (limitades)](#uc-07-accedir-a-dades-clíniques-limitades) |
[UC-08. Escriure nota clínica](#uc-08-escriure-nota-clínica) |
[UC-09. Completar onboarding professional](#uc-09-completar-onboarding-professional) |
[UC-10. Facturar pacient](#uc-10-facturar-pacient) |
[UC-11. Revocar consentiment](#uc-11-revocar-consentiment) |
[Fora de MVP (explicitat)](#fora-de-mvp-explicitat) |
[Nota final](#nota-final) |

<br />

Aquest document defineix **els casos d’ús mínims però complets** necessaris per llançar una **beta funcional** de la plataforma.

Conté: 

- criteris clars de què és i què no és MVP
- actors i estats implícits
- use cases numerats, traçables i accionables
- alineació domini ↔ aplicació ↔ UX

És el document que connecta:

* Domini (què està permès)
* Aplicació (què s’implementa)
* UX (què veu l’usuari)

👉 Si un cas d’ús no és aquí, **no és MVP**.

`MVP` = *Minimum Viable Product* (mínim producte viable)

<br />

## [Criteris de selecció MVP](#)

Un cas d’ús entra al MVP si:

* Genera valor clínic immediat
* Respecta el Core Domain
* Permet onboarding progressiu
* No requereix dominis futurs (sales, search avançat, ecosystem)

<br />

## [Actors involucrats](#)

* Professional (en diversos estats)
* Patient (amb o sense usuari)
* Organization (opcional)

<br />

## [UC-01. Registre bàsic de professional](#)

**Actor principal**: Professional

**Precondicions**

* No existeix o està INVITED

**Flux principal**

1. Introdueix email i dades bàsiques
2. Accepta termes mínims
3. Es crea usuari

**Resultat**

* Professional en estat PARTIAL_ONBOARDING

**Notes UX**

* No es demanen dades fiscals
* Missatge clar: “Pots començar, completaràs després”

<br />

## [UC-02. Crear pacient (sense usuari)](#)

**Actor principal**: Professional (ACTIVE)

**Precondicions**

* Professional ACTIVE

**Flux principal**

1. Professional crea pacient amb dades mínimes
2. Es registra consentiment inicial (fora sistema o verbal)

**Resultat**

* Patient en estat CREATED_BY_PROFESSIONAL

**Notes UX**

* No s’obliga a convidar el pacient

<br />

## [UC-03. Invitar pacient a la plataforma](#)

**Actor principal**: Professional

**Precondicions**

* Patient CREATED_BY_PROFESSIONAL

**Flux principal**

1. Enviament invitació (email/SMS)
2. Pacient accepta

**Resultat**

* Patient passa a ACTIVE
* Consentiments digitals registrats

<br />

## [UC-04. Crear cita (agenda)](#)

**Actor principal**: Professional

**Precondicions**

* Professional ACTIVE
* Relació amb pacient existent

**Flux principal**

1. Selecciona pacient
2. Selecciona data/hora
3. Desa cita

**Resultat**

* Cita creada

<br />

## [UC-05. Sol·licitar col·laboració](#)

**Actor principal**: Professional

**Precondicions**

* Professional ACTIVE
* Pacient amb consentiment

**Flux principal**

1. Selecciona pacient
2. Indica especialitat requerida
3. Introdueix email del col·laborador

**Resultat**

* Collaboration en estat REQUESTED
* Professional convidat creat (INVITED)

<br />

## [UC-06. Acceptar col·laboració](#)

**Actor principal**: Professional convidat

**Precondicions**

* Collaboration REQUESTED

**Flux principal**

1. Accepta invitació
2. Crea usuari mínim

**Resultat**

* Collaboration ACTIVE
* Accés temporal segons scope

<br />

## [UC-07. Accedir a dades clíniques (limitades)](#)

**Actor principal**: Professional col·laborador

**Precondicions**

* Consentiment actiu
* Temporalitat vàlida

**Flux principal**

1. Accedeix al pacient
2. Visualitza notes autoritzades

**Resultat**

* Accés concedit
* Audit log registrat

<br />

## [UC-08. Escriure nota clínica](#)

**Actor principal**: Professional

**Precondicions**

* Consentiment write actiu

**Flux principal**

1. Escriu nota
2. Desa

**Resultat**

* Nota associada al pacient

<br />

## [UC-09. Completar onboarding professional](#)

**Actor principal**: Professional

**Precondicions**

* PARTIAL_ONBOARDING

**Flux principal**

1. Introdueix dades professionals i fiscals
2. Validació

**Resultat**

* Professional passa a ACTIVE

<br />

## [UC-10. Facturar pacient](#)

**Actor principal**: Professional

**Precondicions**

* Professional ACTIVE
* Dades fiscals completes

**Flux principal**

1. Crea factura
2. Assigna pacient

**Resultat**

* Factura creada

<br />

## [UC-11. Revocar consentiment](#)

**Actor principal**: Patient o Professional autoritzat

**Precondicions**

* Consentiment actiu

**Flux principal**

1. Revoca consentiment

**Resultat**

* Accés immediatament retirat
* UX actualitzada

<br />

## [Fora de MVP (explicitat)](#)

* Cerca avançada
* Gestió de sales
* Assegurances complexes
* Ecosistema d’extensions

<br />

## [Nota final](#)

Aquest document és la **llista de veritat del MVP**.

Qualsevol funcionalitat nova:

* s’afegeix aquí
* o no entra al MVP


# Domain Commands

[Principis generals dels commands](#1-principis-generals-dels-commands) |
[Identity & Actors BC](#2-identity-&-actors-bc) |
[Professional BC](#3-professional-bc) |
[Patient BC](#4-patient-bc) |
[Consent / Conformitat BC (CORE)](#5-consent-conformitat-bc-core) |
[Professional Collaboration BC (CORE)](#6-professional-collaboration-bc-core) |
[Treatment BC (opcional)](#7-treatment-bc-opcional) |
[Scheduling BC (supporting)](#8-scheduling-bc-supporting) |
[Billing & Insurance BC (supporting)](#9-billing-&-insurance-bc-supporting) |
[Commands explícitament prohibits](#10-commands-explícitament-prohibits) |
[Traçabilitat amb invariants](#11-traçabilitat-amb-invariants) |
[Prioritat documental](#12-prioritat-documental) |

<br />

Aquest document llista els **commands legítims del domini**, agrupats per **Bounded Context (BC)**. Un command representa una **intenció explícita** que pot modificar l’estat del sistema, sempre respectant els invariants del domini.

Cap command és neutre: tots tenen **precondicions**, **efectes** i **responsabilitat**.

<br />

## [1. Principis generals dels commands](#)

* Un command:

  * expressa una **intenció de negoci** (no una acció tècnica)
  * valida invariants abans de mutar estat
  * pot fallar per raons de domini (no tècniques)

* Un command:

  * **no retorna dades** (això és feina de queries)
  * retorna com a màxim un `Result` / `DomainError`

* Si una acció no pot ser expressada com a command, probablement:

  * no és de domini
  * o viola un invariant

<br />

## [2. Identity & Actors BC](#)

### Commands

* `RegisterUser`
* `AuthenticateUser`
* `LinkUserToActor`

### Notes de domini

* Registrar un usuari **no crea automàticament** un actor
* Els actors poden existir sense usuari

<br />

## [3. Professional BC](#)

### Commands

* `CreateProfessional`
* `InviteProfessional`
* `CompleteProfessionalOnboarding`
* `UpdateProfessionalProfile`
* `SuspendProfessional`

### Notes de domini

* Un professional pot existir en estat `INVITED`
* L’onboarding és progressiu

<br />

## [4. Patient BC](#)

### Commands

* `CreatePatient`
* `InvitePatient`
* `RegisterPatientUser`
* `ArchivePatient`

### Notes de domini

* El pacient pot existir sense usuari
* Arxivar no és esborrar

<br />

## [5. Consent / Conformitat BC (CORE)](#)

### Commands

* `RequestConsent`

* `GrantConsent`

* `RevokeConsent`

* `RequestConformity`

* `AcceptConformity`

* `RejectConformity`

### Notes de domini

* Cap consentiment és global
* Revocar consentiment té efectes immediats

<br />

## [6. Professional Collaboration BC (CORE)](#)

### Commands

* `RequestCollaboration`
* `AcceptCollaboration`
* `RejectCollaboration`
* `EndCollaboration`

### Notes de domini

* Tota col·laboració referencia un pacient
* La responsabilitat no és simètrica

<br />

## [7. Treatment BC (opcional)](#)

### Commands

* `StartTreatment`
* `EndTreatment`
* `UpdateTreatmentScope`

### Notes de domini

* No totes les relacions tenen tractament

<br />

## [8. Scheduling BC (supporting)](#)

### Commands

* `CreateAvailability`
* `ScheduleAppointment`
* `RescheduleAppointment`
* `CancelAppointment`

### Notes de domini

* El scheduling **serveix** relacions existents

<br />

## [9. Billing & Insurance BC (supporting)](#)

### Commands

* `CreateInvoice`
* `IssueInvoice`
* `RegisterPayment`
* `CancelInvoice`

### Notes de domini

* La facturació no defineix la relació

<br />

## [10. Commands explícitament prohibits](#)

Aquests commands **NO** existeixen perquè violarien invariants:

* `CreateGlobalConsent`
* `SharePatientDataWithoutConsent`
* `AutoAcceptCollaboration`
* `GrantPermissionsDirectly`

<br />

## [11. Traçabilitat amb invariants](#)

Tot command ha de poder respondre:

* Quina invariant valida?
* Quin estat muta?
* Quin actor n’és responsable?

Si no pot respondre-ho → no és un command vàlid.

<br />

## [12. Prioritat documental](#)

En cas de conflicte:

1. `product-vision.md`
2. `core-domain-bc.md`
3. `domain-invariants.md`
4. **aquest document**

<br />

Fi del document.

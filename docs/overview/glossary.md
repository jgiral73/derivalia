# Glossari de domini

[Actor](#actor) | 
[Professional](#professional) | 
[Patient (Pacient)](#patient-pacient) | 
[Organization (Organització)](#organization-organització) | 
[Usuari (User)](#usuari-user) | 
[Onboarding](#onboarding) | 
[Consent (Consentiment)](#consent-consentiment) | 
[Authorization (Autorització)](#authorization-autorització) | 
[Permission / Capability](#permission-capability) | 
[Temporal Permission](#temporal-permission) | 
[Collaboration (Col·laboració)](#collaboration-col·laboració) | 
[Treatment (Tractament)](#treatment-tractament) | 
[Referral / Derivation (Derivació)](#referral-derivation-derivació) | 
[Clinical Record](#clinical-record) | 
[Scope](#scope) | 
[Audit Log](#audit-log) | 
[Progressive Unlock](#progressive-unlock) | 
[Source of Truth](#source-of-truth) | 
[Nota final per humans i IA](#nota-final-per-humans-i-ia) | 

<br />

> <br />
>
> Objectiu: evitar ambigüitats entre humans i IA. Cada terme del domini té **un significat únic**, un **exemple real** i, quan cal, un **contraexemple**.
>
> Aquest glossari és **normatiu**: si una paraula s’utilitza fora d’aquest significat, el model es trenca.
>
> Està pensat explícitament per:
> 
> - 🧠 alinear humans i IA en el mateix model mental
> - 🧱 protegir el Core Domain de derives semàntiques
> - 🔁 evitar que el projecte es converteixi en un CRUD ambigu
>
> #### Per què aquest glossari és especialment sòlid:
> 
> - Cada terme té:
>   - definició única
>   - exemple humà real
>   - contraexemple quan cal
> - Distingeix clarament:
>   - actor vs usuari
>   - pacient sistema vs persona
>   - col·laboració vs derivació
> - Fa explícites coses que sovint es donen per suposades (i són la font de bugs greus).
>
> #### Aquest document ja pot ser utilitzat:
> 
> - com a input directe per una IA generant codi
> - com a referència per product / UX
> - com a contracte semàntic entre BCs
>
> <br />


<br />
<br />


## [Actor](#)

**Definició**
Qualsevol entitat que pot interactuar amb el sistema o ser subjecte de permisos, consentiments o relacions.

**Tipus**

* Professional
* Patient
* Organization

**Exemple humà**
Un terapeuta, una pacient o una clínica.

**Contraexemple**
Un usuari tècnic del sistema (admin IT) **no** és un actor de domini clínic.

<br />

## [Professional](#)

**Definició**
Actor que ofereix serveis clínics o sanitaris (teràpia, medicina, suport especialitzat).

**Important**
Un professional pot existir al sistema **sense tenir onboarding complet**.

**Estats típics**

* INVITED
* PARTIAL_ONBOARDING
* ACTIVE

**Exemple humà**
Un psicòleg convidat per col·laborar en un cas, que encara no ha completat el registre.

**Contraexemple**
Un professional amb email però sense cap relació clínica activa **no té accés a pacients**.

<br />

## [Patient (Pacient)](#)

**Definició**
Persona sobre la qual existeix informació clínica o relació terapèutica.

**Important**
Un pacient **no és necessàriament un usuari registrat**.

**Estats típics**

* CREATED_BY_PROFESSIONAL
* INVITED
* ACTIVE
* ARCHIVED

**Exemple humà**
Una pacient creada manualment pel terapeuta després d’una primera visita presencial.

**Contraexemple**
Un usuari registrat a l’app que **no té cap relació clínica** no és pacient.

<br />

## [Organization (Organització)](#)

**Definició**
Entitat legal o funcional que agrupa professionals (clínica, centre, equip).

**Exemple humà**
Una clínica privada amb diversos terapeutes i sales.

**Contraexemple**
Un grup informal de WhatsApp entre professionals **no** és una organització.

<br />

## [Usuari (User)](#)

**Definició**
Identitat tècnica que pot autenticar-se al sistema.

**Important**
Usuari ≠ Actor.

* Un actor pot existir sense usuari
* Un usuari pot existir sense rol clínic

**Exemple humà**
Un pacient que encara no ha acceptat la invitació no és usuari.

<br />

## [Onboarding](#)

**Definició**
Procés progressiu mitjançant el qual un actor adquireix capacitats dins el sistema.

**Clau**
No és tot-o-res.

**Exemple humà**
Un professional pot col·laborar en un cas abans de completar el seu perfil fiscal.

<br />

## [Consent (Consentiment)](#)

**Definició**
Autorització explícita, traçable i revocable que permet accés o acció sobre dades o relacions clíniques.

**Característiques**

* Explícit
* Temporal
* Revocable
* Versionat

**Exemple humà**
Una pacient autoritza un segon professional a accedir a part del seu historial durant 30 dies.

**Contraexemple**
Treballar sobre un pacient només perquè és “del mateix centre”.

<br />

## [Authorization (Autorització)](#)

**Definició**
Aplicació tècnica d’un o més consentiments actius.

**Nota**
L’autorització **no existeix sense consentiment**.

<br />

## [Permission / Capability](#)

**Definició**
Acció concreta que un actor pot realitzar en un context determinat.

**Exemples**

* view_patient_history
* write_clinical_note
* invite_collaborator

**Clau**
Les capabilities són **derivades**, no assignades manualment.

<br />

## [Temporal Permission](#)

**Definició**
Permís limitat en el temps.

**Exemple humà**
Accés concedit només durant la durada d’un tractament.

<br />

## [Collaboration (Col·laboració)](#)

**Definició**
Relació entre professionals per treballar conjuntament sobre un pacient concret.

**Important**
No implica accés total ni indefinit.

**Exemple humà**
Un terapeuta principal demana suport puntual a un especialista en addiccions.

<br />

## [Treatment (Tractament)](#)

**Definició**
Agregat que descriu una relació clínica formal entre un professional i un pacient durant un període.

**Clau**

* És opcional
* No totes les col·laboracions impliquen tractament

<br />

## [Referral / Derivation (Derivació)](#)

**Definició**
Acció mitjançant la qual un professional deriva un pacient (o part del cas) a un altre professional.

**Diferència amb col·laboració**

* Derivació: transferència
* Col·laboració: treball conjunt

<br />

## [Clinical Record](#)

**Definició**
Qualsevol informació clínica estructurada o no estructurada sobre un pacient.

**Exemples**

* Notes
* Diagnòstics
* Informes

<br />

## [Scope](#)

**Definició**
Delimitació precisa de què cobreix un consentiment o permís.

**Exemples**

* Només lectura
* Només notes
* Només billing

<br />

## [Audit Log](#)

**Definició**
Registre immutable d’accions rellevants del sistema.

**Exemple humà**
Qui ha accedit a l’historial d’una pacient i quan.

<br />

## [Progressive Unlock](#)

**Definició**
Estratègia UX on les funcionalitats es desbloquegen segons estat, consentiments i confiança.

**Exemple humà**
No pots facturar fins que no completes dades fiscals.

<br />

## [Source of Truth](#)

**Definició**
Sistema que conté la veritat definitiva d’un tipus de dada.

**En aquest projecte**

* MariaDB → dades clíniques i relacionals

<br />

## [Nota final per humans i IA](#)

Si un terme no és en aquest glossari:

* **No l’inventis**
* **Pregunta o defineix-lo abans**

Aquest glossari protegeix el Core Domain.


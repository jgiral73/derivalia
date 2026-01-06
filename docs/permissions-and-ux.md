# Permisos ↔ UX

[Objectiu del document](#objectiu-del-document) |
[Principi base: l’usuari no veu permisos, veu possibilitats](#principi-base-lusuari-no-veu-permisos-veu-possibilitats) |
[Model mental canònic](#model-mental-canònic) |
[Exemple humà complet](#exemple-humà-complet) |
[Tipus de permisos](#tipus-de-permisos) |
[Com NO s’ha de fer (anti-patterns)](#com-no-sha-de-fer-anti-patterns) |
[Patró: Capability-driven UI](#patró-capability-driven-ui) |
[Progressive Unlock a UX](#progressive-unlock-a-ux) |
[Errors típics d’IA (i com evitar-los)](#errors-típics-dia-i-com-evitar-los) |
[Checklist abans de crear una pantalla](#checklist-abans-de-crear-una-pantalla) |
[Nota final](#nota-final) |

<br />

#### Com el domini governa la interfície

>  ### Per què aquest document és clau (i no opcional)
> 
> Aquest és el pont crític del projecte:
>   - El Core Domain defineix la veritat
>   - Els lifecycles defineixen quan
>   - Els consentiments defineixen sobre què
>   - Aquest document defineix què veu i què pot fer l’usuari
> 
> Si aquest pont no existeix:
>   - la UX inventa regles
>   - el frontend pren decisions que no li pertoquen
>   - la IA genera pantalles “boniques” però il·legals
> 
> Què queda ja perfectament establert
>   - La UI és capability-driven, no role-driven
>   - Els permisos no es calculen al frontend
>   - La temporalitat és visible a la UX
>   - El “no mostrar” és una decisió de producte, no un error

<br /> 

## [Objectiu del document](#)

Aquest document explica **com els conceptes de domini (estat, consentiments, scopes, temps)** es tradueixen en:

* què veu l’usuari
* què pot fer
* què ni tan sols se li mostra

És un document clau perquè:

* UX no inventi regles
* Backend no delegui decisions al frontend
* IA no generi pantalles o accions il·legals

> Principi fonamental: **la UI no concedeix permisos, només reflecteix capacitats reals**.

<br />

## [Principi base: l’usuari no veu permisos, veu possibilitats](#)

Els humans no pensen en:

* scopes
* rols
* policies

Pensen en:

* “puc fer això?”
* “per què no ho veig?”

La UX ha de respondre a això sense exposar complexitat.

<br />

## [Model mental canònic](#)

Les **capabilities visibles** són sempre el resultat de:

```
Capability = f(
  ActorState,
  Consentiments actius,
  Scope,
  Temporalitat,
  Context (pacient / organització)
)
```

Cap d’aquests factors per si sol és suficient.

<br />

## [Exemple humà complet](#)

### Context

* Professional A (ACTIVE)
* Professional B (PARTIAL_ONBOARDING)
* Pacient X

La pacient X:

* ha donat consentiment a A
* A ha convidat B com a col·laborador
* consentiment vàlid durant 14 dies
* només per notes clíniques (read/write)

### Resultat UX

**Professional B veu:**

* El pacient X a la seva llista
* Les notes clíniques
* Un banner: “Accés temporal fins DD/MM”

**Professional B NO veu:**

* Historial complet
* Billing
* Botó “invitar col·laborador”

La UX **no explica permisos**, mostra límits naturals.

<br />

## [Tipus de permisos](#)

### 1. Permisos estructurals (estat)

Deriven de l’estat de l’actor.

Exemples:

* Un professional INVITED no pot crear pacients
* Un pacient no ACTIVE no veu el portal pacient

Aquests permisos:

* són globals
* no depenen de pacients concrets

<br />

### 2. Permisos contextuals (consentiments)

Deriven d’un consentiment específic.

Exemples:

* Veure notes d’un pacient concret
* Escriure informes durant un tractament

Aquests permisos:

* són per pacient
* tenen scope
* tenen data de caducitat

<br />

### 3. Permisos temporals

Tot accés és temporal per defecte.

UX ha de:

* mostrar caducitat
* anticipar pèrdua d’accés

Exemple humà:

> “Aquest accés finalitza en 3 dies”

<br />

## [Com NO s’ha de fer (anti-patterns)](#)

- ❌ Mostrar botons desactivats sense explicació
- ❌ Basar la UX només en rols
- ❌ Assumir que ACTIVE = accés total
- ❌ Decidir permisos només al frontend

<br />

## [Patró: Capability-driven UI](#)

### Backend

Exposeix un endpoint canònic:

```
GET /me/capabilities
```

Resposta exemple:

```json
{
  "canCreatePatient": true,
  "canInviteCollaborator": false,
  "canBill": false,
  "patientAccess": {
    "patientId": "p123",
    "canReadNotes": true,
    "canWriteNotes": true,
    "expiresAt": "2026-02-01"
  }
}
```

<br />

### Frontend (Ionic / Angular)

* Guards de rutes
* Condicions de renderitzat

Exemple conceptual:

```
*ngIf="capabilities.canInviteCollaborator"
```

La UI **no recalcula res**.

<br />

## [Progressive Unlock a UX](#)

### Exemple professional

1. Registre bàsic → pot col·laborar
2. Perfil complet → pot crear pacients
3. Dades fiscals → pot facturar

Cada pas desbloqueja pantalles, no només botons.

<br />

## [Errors típics d’IA (i com evitar-los)](#)

* Assumir rol = permisos
* Generar pantalles que l’usuari mai pot veure
* Ometre la temporalitat

👉 Solució: sempre consumir capabilities del backend.

<br />

## [Checklist abans de crear una pantalla](#)

* Quin actor la veu?
* En quin estat?
* Sobre quin pacient?
* Amb quin consentiment?
* Durant quant temps?

Si no pots respondre aquestes preguntes, **no facis la pantalla**.

<br />

## [Nota final](#)

Aquest document és el pont crític entre:

* Core Domain
* Arquitectura
* UX

Si aquest pont es trenca, el producte perd coherència.

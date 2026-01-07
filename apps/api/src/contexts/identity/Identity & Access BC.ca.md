# Identity & Access BC

## Visio general
Identity & Access gestiona el cicle de vida de la identitat tecnica d'usuari, l'assignacio de rols i els conjunts de permisos sense assumir logica clinica ni de col.laboracio. Emmet esdeveniments de domini d'identitat i no consulta bases de dades d'altres BCs.

## Responsabilitats
- Cicle de vida de la identitat d'usuari (registered, active, disabled, archived)
- Estat d'identitat independent de l'autenticacio
- Assignacio de rols i conjunts de permisos
- Activar/desactivar/arxivar comptes
- Emissio d'esdeveniments de domini d'identitat

## Abast
Dins de l'abast:
- Agregat User
- Rols i permisos com a conceptes explicits
- Transicions d'estat del cicle de vida d'identitat
- Esdeveniments de domini d'identitat

Fora d'abast:
- Protocols d'autenticacio (OAuth/JWT/etc.)
- Aspectes UI
- Dades de pacient i logica de col.laboracio clinica
- Logica de consentiment
- Agenda, facturacio, fluxos d'onboarding

## Model de domini
### Agregats
- User

### Entitats
- Role

### Objectes de valor
- UserId
- Email
- PasswordHash
- RoleName
- PermissionCode
- PermissionSet
- ActorReference
- UserState

## Mapatge de comandes i esdeveniments
- RegisterUser -> UserRegistered
- AuthenticateUser -> UserAuthenticated
- LinkUserToActor -> RoleAssigned, UserLinkedToActor, AccountEnabled (si es dispara l'activacio)
- AssignRoleToUser -> RoleAssigned, AccountEnabled (si es dispara l'activacio)
- DisableAccount -> AccountDisabled
- EnableAccount -> AccountEnabled
- ArchiveAccount -> AccountArchived

## Proposta d'estructura de carpetes
```
apps/api/src/contexts/identity/
  domain/
    aggregates/
    entities/
    value-objects/
    events/
    errors/
    repositories/
    services/
  application/
    commands/
    services/
  infraestructure/
    repositories/
    services/
```

## Notes
- Els agregats protegeixen invariants (p. ex. un usuari actiu requereix almenys un rol).
- Els comptes deshabilitats no poden emetre esdeveniments de negoci.
- Les transicions d'estat son explicites i controlades dins l'agregat.

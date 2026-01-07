# Identity & Access BC

## Overview
Identity & Access manages the technical user identity lifecycle, role assignment, and permission sets without owning clinical or collaboration logic. It emits identity domain events and never queries other bounded context databases.

## Responsibilities
- User identity lifecycle (registered, active, disabled, archived)
- Authentication-independent identity state
- Role assignment and permission sets
- Account enable/disable/archive
- Emission of identity domain events

## Boundary
In scope:
- User aggregate
- Roles and permissions as explicit concepts
- Identity lifecycle state transitions
- Identity domain events

Out of scope:
- Authentication protocols (OAuth/JWT/etc.)
- UI concerns
- Patient data and clinical collaboration logic
- Consent logic
- Scheduling, billing, onboarding flows

## Domain Model
### Aggregates
- User

### Entities
- Role

### Value Objects
- UserId
- Email
- PasswordHash
- RoleName
- PermissionCode
- PermissionSet
- ActorReference
- UserState

## Commands and Events Mapping
- RegisterUser -> UserRegistered
- AuthenticateUser -> UserAuthenticated
- LinkUserToActor -> RoleAssigned, UserLinkedToActor, AccountEnabled (if activation is triggered)
- AssignRoleToUser -> RoleAssigned, AccountEnabled (if activation is triggered)
- DisableAccount -> AccountDisabled
- EnableAccount -> AccountEnabled
- ArchiveAccount -> AccountArchived

## Folder Structure Proposal
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
- Aggregates protect invariants (e.g., active users require at least one role).
- Disabled accounts cannot emit business events.
- State transitions are explicit and controlled in the aggregate.

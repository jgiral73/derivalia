# Bounded Context Interactions

This is the current interaction map between implemented BCs.

## Identity -> Actors

- Identity links users to actors via `UserActorLink`.
- Identity does not query other BC databases.

## Professional / Patient

- Professional and Patient aggregates exist independently from Identity.
- User links are created via Identity commands.

## Consent

- Consent authorizes access to patient data and collaboration scope.
- Scheduling and Collaboration rely on Consent enforcement at runtime.

## Scheduling

- Uses professionalId and patientId references.
- Validates that referenced actors exist via repositories (no cross-BC DB reads).

## Treatment

- Links patient and professional in a time-bounded relationship.
- Does not replace consent; consent remains required for access.

## Organization

- Owns tenant lifecycle and ownerUserId.
- Membership BC will later connect professionals to organizations.

## Collaboration

- Links requester professional, collaborator (id or email), and patient.
- Optional treatmentId for contextual collaboration.

## Interaction principles

- No BC queries another BC database directly.
- References are ids only; existence is checked via repository adapters where needed.
- Domain events are emitted by the owning BC only.

# Bounded Contexts (current state)

This document reflects the BCs implemented in the codebase today and the ones
planned but not yet implemented.

## Implemented

- Identity & Access
  - User lifecycle, roles, permissions, account state
  - Link to actors (patient/professional/organization)
- Patient
  - Patient aggregate, lifecycle, invitations, archive
- Professional
  - Professional profile, onboarding, lifecycle
- Consent
  - Consent + conformity, legal traceability, consent lifecycle
- Organization
  - Tenant/organization aggregate, lifecycle, owner
- Collaboration
  - Professional-professional collaboration over a patient
  - Purpose, scope, and time-bounded access
- Scheduling
  - Slots and appointments with consent enforcement
- Treatment
  - Treatment lifecycle and relationship period

## Planned / referenced

- Membership (professional <-> organization)
- Billing & Insurance
- Clinical Records
- Notifications
- Documents
- Audit / Compliance

## Shared architecture

All BCs follow hexagonal structure:

```
<bc>/
  domain/
  application/
  infraestructure/
```

Domain protects invariants; application orchestrates commands; infrastructure
handles persistence and HTTP.

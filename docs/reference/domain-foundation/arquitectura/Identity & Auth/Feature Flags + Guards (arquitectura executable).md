Perfecte.
👉 **PAS 35 — Traducció dels UX flows a Feature Flags + Guards (arquitectura executable)**

Aquí convertim **intencions UX** en **regles tècniques clares**, perquè:

* el front-end sàpiga **què mostrar**
* el back-end decideixi **què permetre**
* el domini segueixi sent **l’única font de veritat**

Ho farem **per capes** i **amb carpetes/fitxers concrets**, tal com has demanat des del principi.

---

# 🧭 1. Principi arquitectònic clau

> **Els permisos no són rols fixes → són capacitats dinàmiques**

I depenen de:

* estat d’onboarding
* context (pacient, col·laboració)
* consentiment
* temps

Això es materialitza amb:

* **Feature Flags (what can I see?)**
* **Guards / Policies (what can I do?)**

---

# 🧩 2. Model comú: Capability / Feature Flag

📁 `src/auth/domain`

---

## 2.1 Enum de capacitats del sistema

📄 `auth/domain/Capability.ts`

```ts
export enum Capability {
  VIEW_ASSIGNED_CASE = 'VIEW_ASSIGNED_CASE',
  WRITE_CLINICAL_NOTE = 'WRITE_CLINICAL_NOTE',

  CREATE_PATIENT = 'CREATE_PATIENT',
  CREATE_APPOINTMENT = 'CREATE_APPOINTMENT',
  ISSUE_INVOICE = 'ISSUE_INVOICE',

  REQUEST_COLLABORATION = 'REQUEST_COLLABORATION',

  VIEW_OWN_DATA = 'VIEW_OWN_DATA',
  MANAGE_CONSENTS = 'MANAGE_CONSENTS'
}
```

👉 Aquest enum és **compartit backend ↔ frontend**

---

# 🧠 3. Feature Flags Resolver (domini pur)

📁 `src/auth/domain`

---

## 3.1 `CapabilityResolver`

📄 `auth/domain/CapabilityResolver.ts`

```ts
import { Capability } from './Capability';
import { ProfessionalOnboardingStatus } from '../../professional/domain/ProfessionalOnboardingStatus';
import { PatientOnboardingStatus } from '../../patient/domain/PatientOnboardingStatus';

export class CapabilityResolver {
  static forProfessional(
    onboardingStatus: ProfessionalOnboardingStatus
  ): Capability[] {
    switch (onboardingStatus) {
      case ProfessionalOnboardingStatus.MINIMAL_ACTIVE:
        return [
          Capability.VIEW_ASSIGNED_CASE,
          Capability.WRITE_CLINICAL_NOTE
        ];

      case ProfessionalOnboardingStatus.FULLY_VERIFIED:
        return [
          Capability.VIEW_ASSIGNED_CASE,
          Capability.WRITE_CLINICAL_NOTE,
          Capability.CREATE_PATIENT,
          Capability.CREATE_APPOINTMENT,
          Capability.ISSUE_INVOICE,
          Capability.REQUEST_COLLABORATION
        ];

      default:
        return [];
    }
  }

  static forPatient(
    onboardingStatus: PatientOnboardingStatus
  ): Capability[] {
    if (onboardingStatus === PatientOnboardingStatus.ACTIVE) {
      return [
        Capability.VIEW_OWN_DATA,
        Capability.MANAGE_CONSENTS
      ];
    }
    return [];
  }
}
```

👉 **No depèn d’HTTP, ni de JWT, ni de NestJS**

---

# 🎛️ 4. Exposar feature flags al Front-end

📁 `src/auth/application`

---

## 4.1 Query: `GetMyCapabilitiesQuery`

📄 `auth/application/GetMyCapabilitiesQuery.ts`

```ts
export class GetMyCapabilitiesQuery {
  constructor(public readonly userId: string) {}
}
```

---

## 4.2 Handler

📄 `auth/application/GetMyCapabilitiesHandler.ts`

```ts
import { CapabilityResolver } from '../domain/CapabilityResolver';

export class GetMyCapabilitiesHandler {
  async execute(user): Promise<string[]> {
    if (user.professional) {
      return CapabilityResolver.forProfessional(
        user.professional.onboardingStatus
      );
    }

    if (user.patient) {
      return CapabilityResolver.forPatient(
        user.patient.onboardingStatus
      );
    }

    return [];
  }
}
```

---

## 4.3 Endpoint

📄 `auth/infrastructure/http/AuthController.ts`

```ts
@Get('me/capabilities')
getCapabilities(@CurrentUser() user) {
  return this.queryBus.execute(
    new GetMyCapabilitiesQuery(user.id)
  );
}
```

---

# 🎨 5. Ús al Front-end (Angular / Ionic)

### Exemple d’ús

```ts
if (capabilities.includes('CREATE_APPOINTMENT')) {
  showCreateAppointmentButton();
}
```

👉 El FE **no decideix permisos**, només mostra o no UI

---

# 🔐 6. Guards al Backend (NestJS)

📁 `src/auth/infrastructure/guards`

---

## 6.1 Decorator

📄 `auth/infrastructure/guards/RequireCapability.ts`

```ts
export const RequireCapability = (capability: Capability) =>
  SetMetadata('capability', capability);
```

---

## 6.2 Guard

📄 `auth/infrastructure/guards/CapabilityGuard.ts`

```ts
@Injectable()
export class CapabilityGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const capability = this.reflector.get<Capability>(
      'capability',
      context.getHandler()
    );

    const user = context.switchToHttp().getRequest().user;

    return user.capabilities.includes(capability);
  }
}
```

---

## 6.3 Exemple d’ús

📄 `scheduling/infrastructure/http/SchedulingController.ts`

```ts
@Post()
@UseGuards(CapabilityGuard)
@RequireCapability(Capability.CREATE_APPOINTMENT)
createAppointment() {
  // ...
}
```

---

# 🧠 7. Guards contextualitzats (col·laboració)

📁 `src/collaboration/application/policies`

---

## 7.1 Policy

📄 `collaboration/application/policies/CollaborationAccessPolicy.ts`

```ts
export class CollaborationAccessPolicy {
  static canWriteNote(collaboration, professional) {
    return (
      collaboration.status === 'ACTIVE' &&
      collaboration.permissions.canWriteNotes &&
      professional.onboardingStatus !== 'INVITED'
    );
  }
}
```

👉 Aquí entra:

* estat
* permisos
* temps
* consentiment

---

# 🧩 8. Resultat final (arquitectura neta)

✔️ UX governa visibilitat
✔️ Backend governa accions
✔️ Domini governa regles
✔️ Estat governa permisos
✔️ Tot auditable

---

# 🧭 9. Flux resumit

```text
User → Capabilities API → Front-end (UI)
     → Capability Guard → Backend
     → Policy → Domini
```

---

## Següent pas natural

Ara podem:
1️⃣ **Wireframes textuals alineats amb capabilities**
2️⃣ **Model Prisma complet (taules + enums)**
3️⃣ **Testing d’aquest model (unit + integration)**

Digues quin i **seguim** 🚀


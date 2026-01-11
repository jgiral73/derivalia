Perfecte. **Seguim baixant un nivell més**, ara ja no és UX sinó **arquitectura executable**.

# PAS — TRADUIR UX FLOWS → FEATURE FLAGS + GUARDS

(Backend + Frontend)

Això és el que farà que **el sistema compleixi el que hem dissenyat**.

---

# 1️⃣ Principi clau (abans del codi)

> **No autoritzem per rol.
> Autoritzem per CAPABILITY activa en aquell moment.**

Els rols **només assignen potencial**.
Els **estats + consentiments + temps** activen capacitats.

---

# 2️⃣ Model mental final

```text
User
 ├─ roles (PROFESSIONAL / PATIENT)
 ├─ onboardingState
 └─ capabilities (dinàmiques)

Consent
 ├─ scope
 ├─ validFrom / validTo
 └─ grantedTo
```

---

# 3️⃣ Feature Flags (domini conceptual)

No són flags tècnics tipus LaunchDarkly.
Són **capacitats de negoci**.

### Exemple

```ts
export enum Capability {
  VIEW_PATIENT = 'VIEW_PATIENT',
  VIEW_CLINICAL_RECORD = 'VIEW_CLINICAL_RECORD',
  WRITE_CLINICAL_NOTE = 'WRITE_CLINICAL_NOTE',
  SCHEDULE_APPOINTMENT = 'SCHEDULE_APPOINTMENT',
  BILLING_ACCESS = 'BILLING_ACCESS'
}
```

---

# 4️⃣ Resolució de capabilities (Backend)

📁 `contexts/identity/application/CapabilityResolver.ts`

```ts
resolveFor(user: User, context: Context): Capability[] {
  const caps: Capability[] = [];

  if (user.role === 'PROFESSIONAL') {
    caps.push(Capability.VIEW_PATIENT);

    if (user.onboardingState === 'COMPLETED') {
      caps.push(
        Capability.SCHEDULE_APPOINTMENT,
        Capability.BILLING_ACCESS
      );
    }
  }

  if (context.consent?.allows('CLINICAL_VIEW')) {
    caps.push(Capability.VIEW_CLINICAL_RECORD);
  }

  return caps;
}
```

📌 Important:

* **capabilities calculades per request**
* sensibles a context (patient, time, consent)

---

# 5️⃣ Guards d’API (NestJS)

📁 `shared/guards/capability.guard.ts`

```ts
@Injectable()
export class CapabilityGuard implements CanActivate {
  constructor(private resolver: CapabilityResolver) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const required = this.reflector.get<Capability[]>('capabilities');
    const user = req.user;

    const caps = this.resolver.resolveFor(user, req.context);

    return required.every(c => caps.includes(c));
  }
}
```

---

### Ús en controller

📁 `contexts/clinical/api/clinical.controller.ts`

```ts
@UseGuards(CapabilityGuard)
@RequireCapabilities(Capability.WRITE_CLINICAL_NOTE)
@Post(':patientId/notes')
createNote() {}
```

---

# 6️⃣ Guards Frontend (Angular / Ionic)

📁 `app/guards/capability.guard.ts`

```ts
canActivate(route: ActivatedRouteSnapshot) {
  const required = route.data['capabilities'];
  return this.capabilityService.has(required);
}
```

### Routing

```ts
{
  path: 'billing',
  canActivate: [CapabilityGuard],
  data: { capabilities: [Capability.BILLING_ACCESS] }
}
```

---

# 7️⃣ UI Progressive Unlock

### Exemple component

```html
<button *ngIf="can('WRITE_CLINICAL_NOTE')">
  Afegir nota clínica
</button>
```

📌 UX:

* no veus el botó → no existeix
* zero frustració

---

# 8️⃣ Temporals i excepcions (clau clínica)

### Permís temporal

```ts
TemporaryPermission {
  capability
  grantedTo
  expiresAt
}
```

Exemple:

> col·laborador pot escriure durant 7 dies

Guard:

```ts
if (tempPermission.isActive()) allow();
```

---

# 9️⃣ Errors clars (no genèrics)

| Cas                  | Resposta                |
| -------------------- | ----------------------- |
| Falta consentiment   | 403 + codi              |
| Onboarding incomplet | 412 Precondition Failed |
| Invitació caducada   | 410 Gone                |

---

# 10️⃣ Resultat final

✔️ UX coherent
✔️ Backend segur
✔️ Frontend alineat
✔️ Escalable
✔️ Auditable

I sobretot:

> **la lògica de negoci no està duplicada**

---

# ⏭️ Següent pas natural

👉 **Wireframes textuals alineats amb capabilities**
(pantalla per pantalla, què es veu i per què)

Quan vulguis, **seguim**.


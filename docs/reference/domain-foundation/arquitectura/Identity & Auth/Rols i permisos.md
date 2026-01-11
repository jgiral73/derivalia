Perfecte. Ho farem **end-to-end**, amb una visió **DDD + NestJS + Angular/Ionic**, separant clarament:

1. **Model de roles i permisos (domini)**
2. **Autenticació vs Autorització**
3. **Com s’exposa l’autorització a l’API**
4. **Com el front-end decideix què mostrar / permetre**
5. **Exemples reals (backend + frontend)**
6. **Errors habituals a evitar**

Anem **pas a pas**, com demanes.

<br />

# 1️⃣ Model conceptual: Roles ≠ Permisos

## Principi clau (importantíssim)

> **Els permisos són del domini, els roles són una abstracció d’UX / organització**

### Exemple en salut

**Permisos (fine-grained, estables):**

* `patient.read`
* `patient.write`
* `appointment.create`
* `appointment.cancel`
* `treatment.close`
* `referral.accept`

**Roles (composicions):**

* `ADMIN`
* `PROFESSIONAL`
* `ASSISTANT`
* `RECEPTION`

👉 Un role **només és un conjunt de permisos**

<br />

# 2️⃣ On viu això en DDD?

👉 **Identity & Access BC**

📁 `modules/identity`

```txt
identity/
├── domain/
│   ├── aggregates/
│   │   └── User.ts
│   ├── value-objects/
│   │   ├── Role.ts
│   │   └── Permission.ts
│   └── services/
│       └── AuthorizationService.ts
├── application/
├── infrastructure/
```

<br />

## 2.1️⃣ Permission (Value Object)

📁 `modules/identity/domain/value-objects/Permission.ts`

```ts
export class Permission {
  private constructor(public readonly value: string) {}

  static from(value: string): Permission {
    if (!value.includes('.')) {
      throw new Error('Invalid permission format')
    }
    return new Permission(value)
  }
}
```

<br />

## 2.2️⃣ Role (Value Object)

📁 `modules/identity/domain/value-objects/Role.ts`

```ts
export class Role {
  constructor(
    public readonly name: string,
    private readonly permissions: Permission[]
  ) {}

  has(permission: Permission): boolean {
    return this.permissions.some(p => p.value === permission.value)
  }

  getPermissions(): string[] {
    return this.permissions.map(p => p.value)
  }
}
```

<br />

## 2.3️⃣ User aggregate

📁 `modules/identity/domain/aggregates/User.ts`

```ts
export class User {
  constructor(
    public readonly id: string,
    private roles: Role[]
  ) {}

  hasPermission(permission: Permission): boolean {
    return this.roles.some(role => role.has(permission))
  }

  allPermissions(): string[] {
    return [...new Set(
      this.roles.flatMap(r => r.getPermissions())
    )]
  }
}
```

👉 El domini **no sap res d’HTTP ni JWT**

<br />

# 3️⃣ Backend: com protegim endpoints (NestJS)

## 3.1️⃣ JWT payload (mínim però suficient)

❌ No:

* carregar tota la BD
* recalcular permisos a cada request

✅ Sí:

* incloure **permissions resolts**

```json
{
  "sub": "user-1",
  "org": "org-1",
  "permissions": [
    "patient.read",
    "appointment.create",
    "treatment.close"
  ]
}
```

<br />

## 3.2️⃣ Decorator de permisos

📁 `common/auth/permissions.decorator.ts`

```ts
import { SetMetadata } from '@nestjs/common'

export const PERMISSIONS_KEY = 'permissions'
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)
```

<br />

## 3.3️⃣ Guard d’autorització

📁 `common/auth/permissions.guard.ts`

```ts
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required =
      this.reflector.get<string[]>(
        PERMISSIONS_KEY,
        ctx.getHandler()
      )

    if (!required) return true

    const request = ctx.switchToHttp().getRequest()
    const userPermissions: string[] =
      request.user.permissions

    return required.every(p =>
      userPermissions.includes(p)
    )
  }
}
```

<br />

## 3.4️⃣ Ús a un controller

📁 `modules/patient/api/PatientController.ts`

```ts
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('patients')
export class PatientController {

  @Get(':id')
  @RequirePermissions('patient.read')
  getPatient() {}

  @Post()
  @RequirePermissions('patient.write')
  createPatient() {}
}
```

👉 L’endpoint **declara la seva política**

<br />

# 4️⃣ Front-end: què mostrar i què permetre

## Principi clau (molt important)

> **El front-end MAI decideix seguretat, només UX**

El backend **sempre valida**.
El front-end només:

* amaga botons
* bloqueja fluxos
* evita errors inútils

<br />

# 5️⃣ Front-end (Angular / Ionic)

## 5.1️⃣ AuthState (centralitzat)

📁 `src/app/auth/auth.state.ts`

```ts
export interface AuthUser {
  id: string
  permissions: string[]
}

@Injectable({ providedIn: 'root' })
export class AuthState {
  private user$ = new BehaviorSubject<AuthUser | null>(null)

  setUser(user: AuthUser) {
    this.user$.next(user)
  }

  has(permission: string): boolean {
    return !!this.user$.value?.permissions.includes(permission)
  }

  permissions(): string[] {
    return this.user$.value?.permissions ?? []
  }
}
```

<br />

## 5.2️⃣ Directiva estructural `*hasPermission`

📁 `src/app/auth/has-permission.directive.ts`

```ts
@Directive({ selector: '[hasPermission]' })
export class HasPermissionDirective {
  @Input('hasPermission') permission!: string

  constructor(
    private auth: AuthState,
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef
  ) {}

  ngOnInit() {
    if (this.auth.has(this.permission)) {
      this.vcr.createEmbeddedView(this.tpl)
    }
  }
}
```

<br />

## 5.3️⃣ Ús en plantilla

```html
<button
  *hasPermission="'appointment.create'"
  (click)="createAppointment()">
  Nova cita
</button>

<app-treatment-close
  *hasPermission="'treatment.close'">
</app-treatment-close>
```

<br />

# 6️⃣ Protecció de rutes (Angular Router)

📁 `auth/permission.guard.ts`

```ts
@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private auth: AuthState) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const required = route.data['permission']
    return this.auth.has(required)
  }
}
```

```ts
{
  path: 'patients/:id',
  component: PatientDetailPage,
  canActivate: [PermissionGuard],
  data: { permission: 'patient.read' }
}
```

<br />

# 7️⃣ Quins components s’han de mostrar?

### Exemples clars

| Component          | Permís               |
| ------------------ | -------------------- |
| Crear pacient      | `patient.write`      |
| Veure pacient      | `patient.read`       |
| Crear cita         | `appointment.create` |
| Cancel·lar cita    | `appointment.cancel` |
| Tancar tractament  | `treatment.close`    |
| Acceptar derivació | `referral.accept`    |

👉 **Cada component declara el seu permís**

<br />

# 8️⃣ Errors habituals (molt freqüents)

❌ Basar-se en `role === 'ADMIN'` al front
❌ Duplicar lògica de permisos front/back
❌ No incloure permisos al JWT
❌ Confiar en el front-end
❌ Components “intel·ligents” amb ifs complexos

<br />

# 9️⃣ Resum mental (important)

* **Permisos** → llenguatge del domini
* **Roles** → configuració
* **Backend** → enforcement
* **Frontend** → experiència
* **Endpoints** → declaren permisos
* **Components** → visibles segons permisos

<br />

## Següent pas natural (si vols)

➡️ **RBAC multi-organització + permisos contextuals**

* mateix usuari, diferents permisos segons org
* professionals externs
* derivacions amb permisos temporals

Quan vulguis, **seguim**.


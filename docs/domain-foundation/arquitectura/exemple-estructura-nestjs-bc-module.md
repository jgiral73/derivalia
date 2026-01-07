Perfecte. **Pas a pas, sense saltar res.**
Comencem pel **PAS 1**, que és la base de tot el que vindrà després.

<br />

# PAS 1 — On s’ubica un BC dins el backend (NestJS)

Agafem **Scheduling** com a exemple, però això aplica **a tots els BCs**.

<br />

## 1️⃣ Context general del backend

Estem en un **modular monolith** amb NestJS.

```txt
backend/
└── apps/
    └── api/
        ├── main.ts
        ├── app.module.ts
        └── modules/
            └── scheduling/
```

👉 **Cada BC és un mòdul NestJS independent**

<br />

## 2️⃣ Estructura EXACTA d’un BC dins `modules/`

### `modules/scheduling/`

```txt
modules/scheduling/
├── domain/
│   ├── aggregates/
│   ├── value-objects/
│   ├── repositories/
│   ├── services/
│   └── events/
│
├── application/
│   ├── commands/
│   ├── queries/
│   └── dtos/
│
├── infrastructure/
│   ├── http/
│   │   ├── SchedulingController.ts
│   │   └── SchedulingRoutes.ts
│   ├── prisma/
│   │   └── PrismaAppointmentRepository.ts
│   └── mappers/
│
├── scheduling.module.ts
└── index.ts
```

🔑 **Només `infrastructure` coneix NestJS**

<br />

## 3️⃣ El fitxer clau: `scheduling.module.ts`

Aquest fitxer:

* connecta capes
* injecta dependències
* exposa controllers

### `modules/scheduling/scheduling.module.ts`

```ts
import { Module } from '@nestjs/common'
import { SchedulingController } from './infrastructure/http/SchedulingController'
import { ScheduleAppointmentHandler } from './application/commands/ScheduleAppointment/ScheduleAppointmentHandler'
import { PrismaAppointmentRepository } from './infrastructure/prisma/PrismaAppointmentRepository'
import { AvailabilityPolicy } from './domain/services/AvailabilityPolicy'

@Module({
  controllers: [SchedulingController],
  providers: [
    // Application
    ScheduleAppointmentHandler,

    // Domain services
    AvailabilityPolicy,

    // Repositories
    {
      provide: 'AppointmentRepository',
      useClass: PrismaAppointmentRepository
    }
  ]
})
export class SchedulingModule {}
```

👉 **Aquí es “cosien” les capes**, però:

* `domain` no sap res de Nest
* `application` no sap res de Prisma

<br />

## 4️⃣ Com entra això a l’aplicació principal

### `apps/api/app.module.ts`

```ts
@Module({
  imports: [
    SchedulingModule,
    PatientModule,
    TreatmentModule,
    MembershipModule,
    OrganizationModule
  ]
})
export class AppModule {}
```

👉 Aquí només hi ha **composició**, no lògica.

<br />

## 5️⃣ PAS 1 — conclusió (important)

✔️ Cada BC = **1 mòdul NestJS**
✔️ Cada mòdul encapsula **domain + application + infrastructure**
✔️ Només `infrastructure` depèn de NestJS
✔️ El frontend **no entra aquí**

<br />

## ➡️ PAS 2 (següent, molt natural)

Ara que sabem **on viu el BC**, el següent pas és:

👉 **Com surt cap al frontend?**

* Controller
* DTO
* Endpoint
* Contracte HTTP

Si estàs d’acord, al **PAS 2**:

> construïm **SchedulingController + DTOs** i veiem exactament què consumeix Ionic/Angular.

Quan diguis, continuem amb el **PAS 2**.

Perfecte. Seguim **PAS A PAS**, sense pressa i sense barrejar capes.

<br />

# PAS 2 — Com surt un BC cap al frontend (HTTP API)

Ara respondrem exactament a:

> **Com consumeix Ionic / Angular el BC Scheduling?**

La resposta és:
👉 **només a través de Controllers + DTOs (Application layer)**

<br />

## 2️⃣1️⃣ Flux complet (visió ràpida)

```txt
Ionic / Angular
   ↓ HTTP (JSON)
SchedulingController  (infrastructure/http)
   ↓ DTO → Command
Application Handler
   ↓
Domain (validacions + regles)
   ↓
Repository (interface)
   ↓
Prisma (infra)
```

👉 El frontend **no veu res més**

<br />

## 2️⃣2️⃣ On viu el Controller

📁 **Backend**

```txt
modules/scheduling/infrastructure/http/
├── SchedulingController.ts
└── SchedulingRoutes.ts (opcional)
```

Només aquesta carpeta:

* coneix NestJS
* coneix HTTP
* coneix decorators (`@Controller`, `@Post`…)

<br />

## 2️⃣3️⃣ DTOs (contracte amb frontend)

📁 **Application layer**

```txt
modules/scheduling/application/dtos/
├── ScheduleAppointmentDTO.ts
├── AppointmentResponseDTO.ts
└── AgendaItemDTO.ts
```

👉 **Això és el contracte API**

<br />

### `application/dtos/ScheduleAppointmentDTO.ts`

```ts
export class ScheduleAppointmentDTO {
  professionalId!: string
  startAt!: string // ISO date
  endAt!: string   // ISO date

  patientId?: string
  organizationId?: string
  treatmentId?: string

  type?: 'VISIT' | 'FOLLOW_UP' | 'ASSESSMENT' | 'ADMIN'
  reason?: string
}
```

🔑 Decisions importants:

* Dates en **ISO string**
* Tipus simples
* Sense Value Objects
* Sense lògica

<br />

## 2️⃣4️⃣ Controller

📁 `modules/scheduling/infrastructure/http/SchedulingController.ts`

```ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common'
import { ScheduleAppointmentHandler } from '../../application/commands/ScheduleAppointment/ScheduleAppointmentHandler'
import { ScheduleAppointmentDTO } from '../../application/dtos/ScheduleAppointmentDTO'
import { ScheduleAppointmentCommand } from '../../application/commands/ScheduleAppointment/ScheduleAppointmentCommand'

@Controller('appointments')
export class SchedulingController {
  constructor(
    private readonly scheduleHandler: ScheduleAppointmentHandler
  ) {}

  @Post()
  async schedule(@Body() dto: ScheduleAppointmentDTO) {
    await this.scheduleHandler.execute(
      new ScheduleAppointmentCommand(
        dto.professionalId,
        new Date(dto.startAt),
        new Date(dto.endAt),
        dto.patientId,
        dto.organizationId,
        dto.treatmentId,
        dto.type,
        dto.reason
      )
    )

    return { status: 'ok' }
  }
}
```

👉 El controller:

* **no valida domini**
* **no coneix Prisma**
* només transforma **DTO → Command**

<br />

## 2️⃣5️⃣ Queries (lectura)

Ara lectura d’agenda (molt habitual al frontend).

<br />

### DTO de resposta

📁 `application/dtos/AgendaItemDTO.ts`

```ts
export class AgendaItemDTO {
  id!: string
  startAt!: string
  endAt!: string
  patientId?: string
  status!: string
  type!: string
}
```

<br />

### Query Handler

📁 `application/queries/GetAgendaForProfessional/GetAgendaForProfessionalHandler.ts`

```ts
export class GetAgendaForProfessionalHandler {
  constructor(
    private readonly repository: AppointmentRepository
  ) {}

  async execute(
    professionalId: string,
    from: Date,
    to: Date
  ): Promise<AgendaItemDTO[]> {
    const appointments =
      await this.repository.findForProfessional(
        professionalId,
        from,
        to
      )

    return appointments.map(a => ({
      id: a.id.value,
      startAt: a.slot.startAt.toISOString(),
      endAt: a.slot.endAt.toISOString(),
      patientId: a.patientId ?? undefined,
      status: a.status.toString(),
      type: a.type.value
    }))
  }
}
```

👉 **Lectura = DTO directe**, sense Command

<br />

### Endpoint GET

📁 `infrastructure/http/SchedulingController.ts`

```ts
@Get('agenda')
async getAgenda(
  @Query('professionalId') professionalId: string,
  @Query('from') from: string,
  @Query('to') to: string
) {
  return this.getAgendaHandler.execute(
    professionalId,
    new Date(from),
    new Date(to)
  )
}
```

<br />

## 2️⃣6️⃣ Què veu el frontend (Ionic / Angular)

### API disponible

```http
POST /api/appointments
GET  /api/appointments/agenda?professionalId=...&from=...&to=...
```

<br />

## 2️⃣7️⃣ Frontend Ionic / Angular

📁 `libs/api/scheduling.api.ts`

```ts
@Injectable({ providedIn: 'root' })
export class SchedulingApi {
  constructor(private http: HttpClient) {}

  schedule(dto: ScheduleAppointmentDTO) {
    return this.http.post('/api/appointments', dto)
  }

  getAgenda(
    professionalId: string,
    from: string,
    to: string
  ) {
    return this.http.get<AgendaItemDTO[]>(
      '/api/appointments/agenda',
      { params: { professionalId, from, to } }
    )
  }
}
```

👉 El frontend:

* **no sap què és un Appointment**
* **no sap què és un Aggregate**
* només treballa amb DTOs

<br />

## 2️⃣8️⃣ PAS 2 — conclusions clau

- ✔️ El BC s’exposa només via Controllers
- ✔️ DTOs = contracte estable
- ✔️ Domain mai surt fora
- ✔️ Application tradueix intenció
- ✔️ Frontend totalment desacoblat

<br />

<br />

## ➡️ PAS 3 (següent, molt important)

Ara toca el punt crític que tothom acaba barrejant:

👉 **Com entra l’usuari autenticat (IAM + Membership) dins el Scheduling?**

* JWT
* context d’organització
* professional actiu
* guards

Si estàs d’acord, al **PAS 3**:

> construïm **AuthGuard + MembershipGuard + ContextResolver**

i veuràs com tot el DDD que hem fet **cobra sentit real**.

Perfecte. **Aprofundim de veritat**.
Ara entrarem en una de les peces més delicades d’una plataforma DDD real: **context d’usuari, BCs separats i col·laboració sense acoblament**.

<br />

<br />

# PAS 3 — Context d’usuari, IAM i relació entre BCs

Objectiu d’aquest pas:

> **Scheduling NO ha de conèixer Identity, Membership ni Organization**,
> però **necessita saber “qui actua” i “en quin context”**.

Això és DDD pur.

<br />

## 3️⃣1️⃣ Problema real a resoldre

Quan arriba una request:

```http
POST /appointments
Authorization: Bearer eyJ...
```

Necessitem saber:

* 👤 **qui és l’usuari**
* 🎓 **quin professional actua**
* 🏢 **en quina organització (si n’hi ha)**
* 🔒 **si té permisos**

⚠️ **Scheduling no ha de resoldre això**

<br />

## 3️⃣2️⃣ BCs implicats

```txt
Identity BC     → usuari autenticat
Membership BC   → rols, relació amb orgs
Organization BC → context organitzatiu
Scheduling BC   → només agenda
```

👉 La clau és **no creuar dependències directes**

<br />

## 3️⃣3️⃣ Solució DDD: Request Context + ACL

### Patró utilitzat

* **Anti-Corruption Layer**
* **Request Context**
* **Guards NestJS**

<br />

## 3️⃣4️⃣ RequestContext (objecte compartit)

📁 `shared/context/RequestContext.ts`

```ts
export class RequestContext {
  constructor(
    public readonly userId: string,
    public readonly professionalId?: string,
    public readonly organizationId?: string,
    public readonly roles: string[] = []
  ) {}

  isInOrganization(): boolean {
    return !!this.organizationId
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role)
  }
}
```

👉 Aquest objecte:

* **no és domain**
* **no és application**
* és infraestructura transversal

<br />

## 3️⃣5️⃣ Com s’omple el RequestContext

### 1️⃣ JWT Auth Guard (Identity BC)

📁 `shared/auth/JwtAuthGuard.ts`

```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

El JWT conté:

```json
{
  "sub": "user-123",
  "professionalId": "prof-456"
}
```

<br />

### 2️⃣ Membership Guard (Membership BC)

📁 `shared/auth/MembershipGuard.ts`

```ts
@Injectable()
export class MembershipGuard implements CanActivate {
  constructor(
    private readonly membershipAcl: MembershipAcl
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest()
    const user = req.user

    const membership =
      await this.membershipAcl.resolveMembership(user.sub)

    req.context = new RequestContext(
      user.sub,
      user.professionalId,
      membership.organizationId,
      membership.roles
    )

    return true
  }
}
```

🔑 **Aquí està l’ACL**

<br />

## 3️⃣6️⃣ Anti-Corruption Layer (ACL)

📁 `modules/scheduling/infrastructure/acl/MembershipAcl.ts`

```ts
export interface MembershipAcl {
  resolveMembership(
    userId: string
  ): Promise<{
    organizationId?: string
    roles: string[]
  }>
}
```

📁 `modules/scheduling/infrastructure/acl/HttpMembershipAcl.ts`

```ts
@Injectable()
export class HttpMembershipAcl implements MembershipAcl {
  async resolveMembership(userId: string) {
    // REST call / internal service / DB read
    return {
      organizationId: 'org-123',
      roles: ['PROFESSIONAL']
    }
  }
}
```

👉 **Scheduling NO sap què és Membership internament**

<br />

## 3️⃣7️⃣ Ús del context al Controller

📁 `modules/scheduling/infrastructure/http/SchedulingController.ts`

```ts
@Post()
@UseGuards(JwtAuthGuard, MembershipGuard)
async schedule(
  @Body() dto: ScheduleAppointmentDTO,
  @Req() req: any
) {
  const context: RequestContext = req.context

  if (!context.professionalId) {
    throw new ForbiddenException()
  }

  await this.scheduleHandler.execute(
    new ScheduleAppointmentCommand(
      context.professionalId,
      new Date(dto.startAt),
      new Date(dto.endAt),
      dto.patientId,
      context.organizationId,
      dto.treatmentId,
      dto.type,
      dto.reason
    )
  )

  return { status: 'ok' }
}
```

👉 **El professionalId NO ve del frontend**
👉 **L’organizationId NO ve del frontend**

🔒 Seguretat + coherència de domini

<br />

## 3️⃣8️⃣ Impacte real al domini

El **domain** rep:

* professionalId **garantit**
* organizationId **opcional**
* patientId **opcional**

I pot aplicar regles com:

* cites personals vs organització
* límits per org
* visibilitat

<br />

## 3️⃣9️⃣ Conclusions del PAS 3

✔️ Scheduling no depèn de Identity
✔️ Membership entra via ACL
✔️ Context resolt a infra
✔️ Domain net i pur
✔️ Frontend simplificat i segur

<br />

## ➡️ PAS 4 (on tot explota positivament)

Ara ja podem entrar fort en:

> **Patient BC + Treatment BC + Derivacions**

I respondre:

* Com vinculem professional ↔ pacient?
* Tractament com agregat temporal
* Relació sense tractament
* Derivacions entre professionals i orgs

👉 Al **PAS 4** començarem amb **Patient BC (model + agregats + repositoris)**
i veuràs com encaixa *perfectament* amb Scheduling.

Quan vulguis, **seguim**.

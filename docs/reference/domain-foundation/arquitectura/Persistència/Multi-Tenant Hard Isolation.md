Perfecte.
👉 **PAS 25 — Multi-tenant hard isolation (clíniques, professionals i escales)**
Aquest pas és **estructural**: garanteix seguretat, escalabilitat i viabilitat comercial.

Seguim **pas a pas**, coherent amb tot el que ja hem construït (DDD, audit, consentiment, FHIR).

---

# PAS 25 — Multi-Tenant Hard Isolation

## 25️⃣1️⃣ Què volem dir exactament amb *hard isolation*

NO volem només:

* `organizationId` a totes les taules ❌ (soft-tenant)

SÍ volem:

* Separació clara de dades
* Zero fuites entre organitzacions
* Possibilitat de:

  * DB per tenant
  * Schema per tenant
  * o Row Level Security

👉 **La decisió no afecta el domini**

---

## 25️⃣2️⃣ Principi DDD clau

> **El tenant NO és un concepte de domini clínic**
> És un **context operacional**

👉 El domini parla de:

* Patient
* Professional
* Treatment
* Appointment

👉 La infraestructura s’encarrega de:

* “on” es guarden
* “per qui” són visibles

---

## 25️⃣3️⃣ On viu el concepte Tenant

📁 `modules/tenancy`

```txt
tenancy/
├── domain/
│   └── value-objects/
│       └── TenantId.ts
├── application/
│   ├── context/
│   │   └── TenantContext.ts
│   └── resolvers/
│       └── TenantResolver.ts
├── infrastructure/
│   ├── prisma/
│   │   └── PrismaTenantClientFactory.ts
│   └── http/
│       └── TenantMiddleware.ts
```

---

## 25️⃣4️⃣ TenantId (Value Object)

📁 `modules/tenancy/domain/value-objects/TenantId.ts`

```ts
export class TenantId {
  constructor(public readonly value: string) {
    if (!value) {
      throw new Error('TenantId required')
    }
  }
}
```

---

## 25️⃣5️⃣ Resolució del tenant (request)

📁
`modules/tenancy/application/resolvers/TenantResolver.ts`

```ts
export class TenantResolver {
  resolve(req): TenantId {

    // Exemples
    if (req.headers['x-tenant-id']) {
      return new TenantId(req.headers['x-tenant-id'])
    }

    if (req.user?.organizationId) {
      return new TenantId(req.user.organizationId)
    }

    throw new Error('Tenant not resolved')
  }
}
```

---

## 25️⃣6️⃣ TenantContext (scoped per request)

📁
`modules/tenancy/application/context/TenantContext.ts`

```ts
export class TenantContext {
  private static tenant: TenantId

  static set(tenant: TenantId) {
    this.tenant = tenant
  }

  static get(): TenantId {
    if (!this.tenant) {
      throw new Error('TenantContext not initialized')
    }
    return this.tenant
  }
}
```

👉 En NestJS → `REQUEST` scope

---

## 25️⃣7️⃣ Middleware HTTP

📁
`modules/tenancy/infrastructure/http/TenantMiddleware.ts`

```ts
@Injectable()
export class TenantMiddleware implements NestMiddleware {

  constructor(
    private readonly resolver: TenantResolver
  ) {}

  use(req, res, next) {
    const tenant = this.resolver.resolve(req)
    TenantContext.set(tenant)
    next()
  }
}
```

---

## 25️⃣8️⃣ Estratègies d’aïllament (infra)

### Opció A — DB per tenant (TOP)

* ✔️ màxima seguretat
* ✔️ complir HIPAA
* ❌ més cost

```ts
new PrismaClient({
  datasources: {
    db: {
      url: process.env[`DATABASE_URL_${tenant.value}`]
    }
  }
})
```

---

### Opció B — Schema per tenant (Postgres)

```sql
SET search_path TO tenant_abc;
```

✔️ molt bona
✔️ menys cost
⚠️ migrations més complexes

---

### Opció C — Row Level Security (RLS)

```sql
CREATE POLICY tenant_isolation
ON patients
USING (tenant_id = current_setting('app.tenant_id'));
```

✔️ bona
⚠️ fàcil d’errar
⚠️ menys explícita

---

## 25️⃣9️⃣ Prisma Tenant Client Factory

📁
`modules/tenancy/infrastructure/prisma/PrismaTenantClientFactory.ts`

```ts
export class PrismaTenantClientFactory {

  create(): PrismaClient {
    const tenant = TenantContext.get()

    return new PrismaClient({
      datasources: {
        db: {
          url: getDatabaseUrlForTenant(tenant.value)
        }
      }
    })
  }
}
```

👉 Injectat a tots els repositoris

---

## 🔟 Repositoris (exemple)

📁
`modules/patient/infrastructure/PatientRepositoryPrisma.ts`

```ts
export class PatientRepositoryPrisma {

  constructor(
    private readonly prisma: PrismaClient
  ) {}

  findById(id: string) {
    return this.prisma.patient.findUnique({ where: { id } })
  }
}
```

👉 El repo **no sap res del tenant**

---

## 25️⃣11️⃣ Front-end (Ionic / Angular)

### Tenant resolution

* Subdomini: `clinic-a.app.com`
* Header: `x-tenant-id`
* Token JWT conté `organizationId`

👉 El FE **no decideix**, només transmet

---

## 25️⃣12️⃣ Relació amb derivacions

✔️ Derivació entre tenants:

* Snapshot mínim
* Consentiment explícit
* Audit trail
* Event `PatientReferredOut`

👉 **Mai accés directe cross-tenant**

---

## ⚠️ Errors habituals

❌ Tenant com a entity de domini
❌ `organizationId` a tot arreu
❌ Repositoris conscients del tenant
❌ Compartir DB sense RLS
❌ Derivacions amb accés viu

---

## ✅ Resum PAS 25

* ✔️ Tenant fora del domini
* ✔️ Aïllament fort
* ✔️ Repositoris nets
* ✔️ Preparat per escalar
* ✔️ Compliment legal

---

## PAS 26 — TANCAMENT DEFINITIU

Opcions finals:
1️⃣ **Billing & insurance (facturació mèdica)**
2️⃣ **Deployment & compliance (GDPR, HIPAA, ISO 27001)**
3️⃣ **Roadmap MVP → scale → ecosystem**

Digues quin i **seguim** 🚀


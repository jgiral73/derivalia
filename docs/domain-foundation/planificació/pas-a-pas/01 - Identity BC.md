# 📍 On som exactament

Hem fet (conceptualment):

* Monorepo
* Backend NestJS creat
* MariaDB + Prisma
* Estructura DDD definida
* MVP clar

👉 **Ara toca començar a IMPLEMENTAR**, no debatrem més arquitectura global.

---

# PAS 1 — Crear el primer BC REAL: Identity

Aquest pas és **imprescindible** perquè tot el demés (pacients, professionals, cites, consentiments) depèn d’això.

---

## 1️⃣ Crear l’estructura del BC Identity

📁 `backend/api/src/modules/identity`

```text
identity/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   └── repositories/
│
├── application/
│   ├── commands/
│   │   └── RegisterUser/
│   └── queries/
│
├── infrastructure/
│   ├── http/
│   │   └── AuthController.ts
│   ├── prisma/
│   │   └── PrismaUserRepository.ts
│   └── auth/
│       └── JwtService.ts
│
├── identity.module.ts
└── index.ts
```

👉 Encara no hi ha res dins, només carpetes.

---

## 2️⃣ Model mínim de domini: User

### 📄 `identity/domain/entities/User.ts`

```ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly createdAt: Date
  ) {}
}
```

📌 Decisions conscients:

* `id` és string
* no roles
* no estat complex
* no perfil professional encara

---

## 3️⃣ Value Object Email

### 📄 `identity/domain/value-objects/Email.ts`

```ts
export class Email {
  private constructor(public readonly value: string) {}

  static create(value: string): Email {
    if (!value.includes('@')) {
      throw new Error('Invalid email')
    }
    return new Email(value.toLowerCase())
  }
}
```

👉 **Comencem a protegir el domini**, sense exagerar.

---

## 4️⃣ Contracte del repositori (DDD pur)

### 📄 `identity/domain/repositories/UserRepository.ts`

```ts
import { User } from '../entities/User'

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  save(user: User): Promise<void>
}
```

📌 El domini:

* **no sap Prisma**
* **no sap SQL**
* només sap què necessita

---

# PAS 2 — Application layer: Register User

Ara implementem **el primer cas d’ús real**.

---

## 5️⃣ Command

### 📄 `identity/application/commands/RegisterUser/RegisterUserCommand.ts`

```ts
export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}
```

---

## 6️⃣ Command Handler

### 📄 `identity/application/commands/RegisterUser/RegisterUserHandler.ts`

```ts
import { UserRepository } from '../../../domain/repositories/UserRepository'
import { Email } from '../../../domain/value-objects/Email'
import { User } from '../../../domain/entities/User'
import { randomUUID } from 'crypto'
import * as bcrypt from 'bcrypt'

export class RegisterUserHandler {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const email = Email.create(command.email)

    const existing = await this.userRepo.findByEmail(email.value)
    if (existing) {
      throw new Error('User already exists')
    }

    const hash = await bcrypt.hash(command.password, 10)

    const user = new User(
      randomUUID(),
      email.value,
      hash,
      new Date()
    )

    await this.userRepo.save(user)
  }
}
```

👉 Aquí **hi ha lògica**, però:

* no hi ha HTTP
* no hi ha Prisma
* no hi ha JWT

---

# PAS 3 — Infraestructura: Prisma

Ara baixem al món real.

---

## 7️⃣ Model Prisma

📄 `backend/api/prisma/schema.prisma`

```prisma
model User {
  id            String   @id
  email         String   @unique
  passwordHash String
  createdAt     DateTime
}
```

```bash
npx prisma migrate dev -n identity_user
```

---

## 8️⃣ Implementació del repositori

### 📄 `identity/infrastructure/prisma/PrismaUserRepository.ts`

```ts
import { PrismaClient } from '@prisma/client'
import { UserRepository } from '../../domain/repositories/UserRepository'
import { User } from '../../domain/entities/User'

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } })
    if (!record) return null

    return new User(
      record.id,
      record.email,
      record.passwordHash,
      record.createdAt
    )
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt
      }
    })
  }
}
```

---

# PAS 4 — HTTP: exposar el cas d’ús

---

## 9️⃣ Controller

### 📄 `identity/infrastructure/http/AuthController.ts`

```ts
import { Body, Controller, Post } from '@nestjs/common'
import { RegisterUserHandler } from '../../application/commands/RegisterUser/RegisterUserHandler'
import { RegisterUserCommand } from '../../application/commands/RegisterUser/RegisterUserCommand'

@Controller('auth')
export class AuthController {
  constructor(private readonly registerHandler: RegisterUserHandler) {}

  @Post('register')
  async register(@Body() body: any) {
    const command = new RegisterUserCommand(
      body.email,
      body.password
    )

    await this.registerHandler.execute(command)

    return { status: 'ok' }
  }
}
```

👉 DTOs simples ara, ja els tiparem després.

---

## 🔟 identity.module.ts (cosint-ho tot)

### 📄 `identity/identity.module.ts`

```ts
import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AuthController } from './infrastructure/http/AuthController'
import { RegisterUserHandler } from './application/commands/RegisterUser/RegisterUserHandler'
import { PrismaUserRepository } from './infrastructure/prisma/PrismaUserRepository'

@Module({
  controllers: [AuthController],
  providers: [
    PrismaClient,
    RegisterUserHandler,
    {
      provide: 'UserRepository',
      useFactory: (prisma: PrismaClient) =>
        new PrismaUserRepository(prisma),
      inject: [PrismaClient]
    }
  ]
})
export class IdentityModule {}
```

---

# PAS 5 — Connectar-ho a l’app

📄 `app.module.ts`

```ts
@Module({
  imports: [
    IdentityModule
  ]
})
export class AppModule {}
```

---

# ✅ Punt de control (molt important)

Ara mateix ja pots:

* Arrencar l’API
* Fer `POST /auth/register`
* Crear usuaris a DB
* Tenir domini net
* Tenir base per JWT, roles, onboarding

👉 **Això és un MVP tècnic real**, no fum.

---

# ⏭️ Següent pas (tria un)

Ara, de manera natural, toca:

1️⃣ **Login + JWT**
2️⃣ **ProfessionalProfile (onboarding)**
3️⃣ **Patient BC**
4️⃣ **Guards d’autorització mínims**

Digues quin i **seguim pas a pas, escrivint codi** 👣

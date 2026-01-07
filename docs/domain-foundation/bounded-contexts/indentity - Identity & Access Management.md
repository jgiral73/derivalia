Perfecte. Continuem **directament** a partir del disseny general que ja havíem establert i baixem **al detall del model de dades + DDD per BC**, amb estructura clara de carpetes i responsabilitats.

Comencem pel **BC d’Identity & Access (IAM)** — el “Identity & (ara no recordo)” és gairebé segur **Identity & Access Management**, i encaixa perfectament com a primer BC fundacional.

<br />

## BC 1 — Identity & Access (IAM)

### 🎯 Responsabilitat del BC

Aquest BC **no coneix el negoci clínic**, només identitat, autenticació i autorització. És un *Identity & Access Management* (IAM).

Inclou:

* Identitat d’usuari
* Credencials
* Rols i permisos
* Contextos d’accés (tenant / organització)
* Sessions / tokens (conceptualment)

**No inclou:**

* Perfil professional
* Dades mèdiques
* Lògica de col·laboració
  (Això viurà en altres BCs)

<br />

## 📦 Estructura de carpetes (DDD + Hexagonal)

```txt
identity-access/
├── domain/
│   ├── aggregates/
│   │   └── User/
│   │       ├── User.ts
│   │       ├── UserId.ts
│   │       ├── Email.ts
│   │       └── PasswordHash.ts
│   ├── entities/
│   │   ├── Role.ts
│   │   └── Permission.ts
│   ├── value-objects/
│   │   ├── RoleName.ts
│   │   └── PermissionCode.ts
│   ├── repositories/
│   │   └── UserRepository.ts
│   ├── services/
│   │   └── PasswordPolicy.ts
│   └── events/
│       ├── UserRegistered.ts
│       └── UserRoleAssigned.ts
│
├── application/
│   ├── commands/
│   │   ├── RegisterUser/
│   │   │   ├── RegisterUserCommand.ts
│   │   │   └── RegisterUserHandler.ts
│   │   └── AssignRoleToUser/
│   ├── queries/
│   │   └── GetUserAuthContext/
│   └── dtos/
│       └── UserDTO.ts
│
├── infrastructure/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── repositories/
│   │       └── PrismaUserRepository.ts
│   ├── auth/
│   │   └── JwtTokenService.ts
│   └── mappers/
│       └── UserMapper.ts
│
└── index.ts
```

<br />

## 🧠 Model de domini (nucli)

### Aggregate Root: **User**

#### `User.ts`

```ts
export class User {
  private roles: Role[] = []

  constructor(
    readonly id: UserId,
    readonly email: Email,
    private passwordHash: PasswordHash,
    private active: boolean = true
  ) {}

  assignRole(role: Role) {
    if (this.roles.some(r => r.equals(role))) return
    this.roles.push(role)
  }

  deactivate() {
    this.active = false
  }

  isActive(): boolean {
    return this.active
  }

  getRoles(): Role[] {
    return [...this.roles]
  }
}
```

👉 **Invariants importants**

* Email únic
* Password mai en clar
* Un usuari pot existir sense rols (pending setup)

<br />

### Value Objects clau

#### `Email.ts`

```ts
export class Email {
  private constructor(readonly value: string) {}

  static create(value: string): Email {
    if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error('Invalid email')
    }
    return new Email(value.toLowerCase())
  }
}
```

#### `PasswordHash.ts`

```ts
export class PasswordHash {
  private constructor(readonly value: string) {}

  static fromHashed(value: string): PasswordHash {
    return new PasswordHash(value)
  }
}
```

<br />

### Entitats secundàries

#### `Role.ts`

```ts
export class Role {
  constructor(
    readonly id: string,
    readonly name: RoleName,
    readonly permissions: Permission[]
  ) {}

  equals(other: Role): boolean {
    return this.id === other.id
  }
}
```

<br />

## 📄 Repository (contracte de domini)

#### `UserRepository.ts`

```ts
export interface UserRepository {
  save(user: User): Promise<void>
  findByEmail(email: Email): Promise<User | null>
  findById(id: UserId): Promise<User | null>
}
```

👉 **El domini no sap què és Prisma, SQL ni JWT**

<br />

## 🚀 Application Layer (CQRS lleuger)

### Command: RegisterUser

```ts
export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly plainPassword: string
  ) {}
}
```

#### Handler

```ts
export class RegisterUserHandler {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordPolicy: PasswordPolicy
  ) {}

  async execute(command: RegisterUserCommand) {
    const email = Email.create(command.email)

    if (await this.users.findByEmail(email)) {
      throw new Error('User already exists')
    }

    const hash = await this.passwordPolicy.hash(command.plainPassword)

    const user = new User(
      UserId.generate(),
      email,
      PasswordHash.fromHashed(hash)
    )

    await this.users.save(user)
  }
}
```

<br />

## 🧱 Infrastructure (Prisma)

### `schema.prisma`

```prisma
model User {
  id        String   @id
  email     String   @unique
  password  String
  active    Boolean
  roles     UserRole[]
}

model Role {
  id          String @id
  name        String @unique
  permissions RolePermission[]
}

model UserRole {
  userId String
  roleId String

  user User @relation(fields: [userId], references: [id])
  role Role @relation(fields: [roleId], references: [id])

  @@id([userId, roleId])
}
```

<br />

## 🔌 Mapper Infra → Domini

```ts
export class UserMapper {
  static toDomain(raw: PrismaUser): User {
    return new User(
      new UserId(raw.id),
      Email.create(raw.email),
      PasswordHash.fromHashed(raw.password),
      raw.active
    )
  }
}
```

<br />

## 🔁 Events (pont cap a altres BCs)

Aquest BC **emetrà events**, però no consumirà domini clínic.

Exemples:

* `UserRegistered`
* `UserRoleAssigned`

Aquests events:

* Poden ser escoltats per **Professional Profile BC**
* O **Organization / Tenant BC**

<br />

## ✔️ Decisions clau de disseny (importants)

* IAM és **BC core tècnic**, no de negoci
* Model molt estable
* Altíssim reús
* Cap dependència cap a altres BCs
* Preparat per multi-tenant (en el següent pas)

<br />

## ➡️ Següent pas proposat

Si et sembla bé, el següent BC lògic seria un d’aquests (tria ordre):

1. **Professional Profile** (identitat de metge/terapeuta)
2. **Organization / Tenant**
3. **Authorization avançada (scopes + contextos)**

Quan diguis quin, continuem **amb el mateix nivell de detall**.

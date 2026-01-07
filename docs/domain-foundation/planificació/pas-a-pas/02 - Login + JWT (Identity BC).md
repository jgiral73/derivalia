Perfecte. **Seguim exactament on érem**, sense salts.

👉 **Següent pas natural:**
un usuari ja es pot registrar, però **no pot entrar al sistema**.
Això fa inútil tot el que vingui després (onboarding, pacient, cites).

Així que ara toca:

# PAS SEGÜENT — Login + JWT (Identity BC)

Ho farem **mínim, net i extensible**.
Sense roles encara. Sense permisos. Només **identitat autenticada**.

---

## 🎯 Objectiu d’aquest pas

* `POST /auth/login`
* Retornar `accessToken`
* Tenir `req.user` disponible als endpoints protegits

---

# PAS 1 — Afegir capacitat de login al domini (mínima)

👉 **Important:**
La validació de password **NO és domini pur**, és application/auth.
El domini només té dades.

No toquem `User`.

---

# PAS 2 — Application: LoginUser

## 1️⃣ Command

📄 `identity/application/commands/LoginUser/LoginUserCommand.ts`

```ts
export class LoginUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}
```

---

## 2️⃣ Resultat del login (contracte simple)

📄 `identity/application/commands/LoginUser/LoginResult.ts`

```ts
export class LoginResult {
  constructor(
    public readonly accessToken: string
  ) {}
}
```

---

## 3️⃣ Handler

📄 `identity/application/commands/LoginUser/LoginUserHandler.ts`

```ts
import { UserRepository } from '../../../domain/repositories/UserRepository'
import { LoginUserCommand } from './LoginUserCommand'
import { LoginResult } from './LoginResult'
import * as bcrypt from 'bcrypt'
import { JwtService } from '../../auth/JwtService'

export class LoginUserHandler {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(command.email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const valid = await bcrypt.compare(
      command.password,
      user.passwordHash
    )

    if (!valid) {
      throw new Error('Invalid credentials')
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email
    })

    return new LoginResult(token)
  }
}
```

📌 Decisions conscients:

* Error genèric (no filtrar info)
* Payload JWT mínim
* `sub = user.id` (estàndard)

---

# PAS 3 — Infraestructura: JWT

Ara implementem **l’adaptador**, no el domini.

---

## 4️⃣ JwtService (wrapper)

📄 `identity/infrastructure/auth/JwtService.ts`

```ts
import * as jwt from 'jsonwebtoken'

export class JwtService {
  private readonly secret = process.env.JWT_SECRET || 'dev-secret'
  private readonly expiresIn = '1d'

  sign(payload: any): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn
    })
  }

  verify(token: string): any {
    return jwt.verify(token, this.secret)
  }
}
```

👉 Wrapper propi = fàcil canviar lib més endavant.

---

# PAS 4 — Exposar login per HTTP

## 5️⃣ Controller: afegim endpoint

📄 `identity/infrastructure/http/AuthController.ts`

```ts
import { Body, Controller, Post } from '@nestjs/common'
import { LoginUserHandler } from '../../application/commands/LoginUser/LoginUserHandler'
import { LoginUserCommand } from '../../application/commands/LoginUser/LoginUserCommand'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginHandler: LoginUserHandler
  ) {}

  @Post('login')
  async login(@Body() body: any) {
    const result = await this.loginHandler.execute(
      new LoginUserCommand(body.email, body.password)
    )

    return result
  }
}
```

Resposta:

```json
{
  "accessToken": "eyJhbGciOi..."
}
```

---

# PAS 5 — Guard global d’autenticació

Ara necessitem **protegir endpoints**.

---

## 6️⃣ AuthGuard

📄 `identity/infrastructure/auth/JwtAuthGuard.ts`

```ts
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { JwtService } from './JwtService'

export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']

    if (!authHeader) return false

    const [, token] = authHeader.split(' ')
    if (!token) return false

    try {
      const payload = this.jwtService.verify(token)
      request.user = payload
      return true
    } catch {
      return false
    }
  }
}
```

---

## 7️⃣ Exemple d’endpoint protegit

📄 `patient/infrastructure/http/PatientController.ts`

```ts
@UseGuards(JwtAuthGuard)
@Get()
async list(@Req() req: any) {
  const userId = req.user.sub
  ...
}
```

---

# PAS 6 — Connectar providers (IdentityModule)

Actualitzem:

📄 `identity/identity.module.ts`

```ts
@Module({
  controllers: [AuthController],
  providers: [
    PrismaClient,
    JwtService,
    LoginUserHandler,
    RegisterUserHandler,
    {
      provide: 'UserRepository',
      useFactory: (prisma: PrismaClient) =>
        new PrismaUserRepository(prisma),
      inject: [PrismaClient]
    }
  ],
  exports: [JwtService]
})
export class IdentityModule {}
```

---

# ✅ Punt de control (important)

Ara ja tens:

✔️ Registre
✔️ Login
✔️ JWT
✔️ Endpoints protegits
✔️ Base per permisos, onboarding i multi-rol

👉 **Ja pots construir la resta de la plataforma amb seguretat.**

---

# ⏭️ Següent pas (l’ordre correcte)

Ara toca **exactament això**:

### ➡️ PAS SEGÜENT RECOMANAT

**ProfessionalProfile + onboardingStatus**

Perquè:

* roles encara no
* permisos encara no
* però necessitem saber **qui és realment professional**

Opcions següents:
1️⃣ Crear `ProfessionalProfile` (onboarding mínim)
2️⃣ Crear `Patient BC`
3️⃣ Afegir `onboardingStatus` + guards
4️⃣ Afegir invitacions / col·laboracions (pre-onboarding)

Digues quin i **seguim escrivint codi** 👣

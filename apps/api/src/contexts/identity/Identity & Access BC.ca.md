# Identity & Access BC

## Visio general
Identity & Access gestiona el cicle de vida de la identitat tecnica d'usuari, l'assignacio de rols i els conjunts de permisos sense assumir logica clinica ni de col.laboracio. Emmet esdeveniments de domini d'identitat i no consulta bases de dades d'altres BCs.

Exemple minim de flux (registre + rol + activacio automatica).

`contexts/identity/infraestructure/http/IdentityController.ts`
```typescript
@Controller('identity')
export class IdentityController {

  @Post('register')
  async register(@Body() body: RegisterUserRequestDto) {
    const command = new RegisterUserCommand(body.email, body.password);
    await this.registerUserHandler.execute(command);
    return { status: 'ok' };
  }

  @Post('authenticate')
  async authenticate(@Body() body: AuthenticateUserRequestDto) {
    const command = new AuthenticateUserCommand(body.email, body.password);
    await this.authenticateUserHandler.execute(command);
    return { status: 'ok' };
  }
}
```


`contexts/identity/application/commands/RegisterUser/RegisterUserHandler.ts`
```typescript
export class RegisterUserHandler {
  
  async execute(command: RegisterUserCommand): Promise<void> {
    const email = Email.create(command.email);
    const existing = await this.users.findByEmail(email);

    if (existing) {
      throw new UserAlreadyExistsError();
    }

    const hash = await this.passwordPolicy.hash(command.plainPassword);
    const user = User.register(UserId.fromString(randomUUID()), email, hash);

    await this.users.save(user);
    await this.eventPublisher.publish(user.pullDomainEvents());
  }
}
```

`contexts/identity/application/commands/AuthenticateUser/AuthenticateUserHandler.ts`
```typescript
export class AuthenticateUserHandler {

  async execute(command: AuthenticateUserCommand): Promise<void> {
    const email = Email.create(command.email);
    const user = await this.users.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const valid = await this.passwordPolicy.verify(
      command.plainPassword,
      user.getPasswordHash(),
    );

    if (!valid) {
      throw new InvalidCredentialsError();
    }

    user.authenticate();
    await this.eventPublisher.publish(user.pullDomainEvents());
  }
}
```

## Responsabilitats
- Cicle de vida de la identitat d'usuari (registered, active, disabled, archived)
- Estat d'identitat independent de l'autenticacio
- Assignacio de rols i conjunts de permisos
- Activar/desactivar/arxivar comptes
- Emissio d'esdeveniments de domini d'identitat

## Abast
Dins de l'abast:
- Agregat User
- Rols i permisos com a conceptes explicits
- Transicions d'estat del cicle de vida d'identitat
- Esdeveniments de domini d'identitat

Fora d'abast:
- Protocols d'autenticacio (OAuth/JWT/etc.)
- Aspectes UI
- Dades de pacient i logica de col.laboracio clinica
- Logica de consentiment
- Agenda, facturacio, fluxos d'onboarding

## Model de domini
### Agregats
- User

### Entitats
- Role

### Objectes de valor
- UserId
- Email
- PasswordHash
- RoleName
- PermissionCode
- PermissionSet
- ActorReference
- UserState

## Mapatge de comandes i esdeveniments
- RegisterUser -> UserRegistered
- AuthenticateUser -> UserAuthenticated
- LinkUserToActor -> RoleAssigned, UserLinkedToActor, AccountEnabled (si es dispara l'activacio)
- AssignRoleToUser -> RoleAssigned, AccountEnabled (si es dispara l'activacio)
- DisableAccount -> AccountDisabled
- EnableAccount -> AccountEnabled
- ArchiveAccount -> AccountArchived

Exemple d'handler pragmatic (registre).
Fitxer: `apps/api/src/contexts/identity/application/commands/RegisterUser/RegisterUserHandler.ts`
Classe: `RegisterUserHandler`
```typescript
const email = Email.create(command.email);
const existing = await users.findByEmail(email);
if (existing) throw new UserAlreadyExistsError();

const hash = await passwordPolicy.hash(command.plainPassword);
const user = User.register(UserId.fromString(randomUUID()), email, hash);

await users.save(user);
await publisher.publish(user.pullDomainEvents());
```

## Proposta d'estructura de carpetes
```
apps/api/src/contexts/identity/
  domain/
    aggregates/
    entities/
    value-objects/
    events/
    errors/
    repositories/
    services/
  application/
    commands/
    services/
  infraestructure/
    repositories/
    services/
```

## Notes
- Els agregats protegeixen invariants (p. ex. un usuari actiu requereix almenys un rol).
- Els comptes deshabilitats no poden emetre esdeveniments de negoci.
- Les transicions d'estat son explicites i controlades dins l'agregat.

Exemple d'event immutable.
Fitxer: `apps/api/src/contexts/identity/domain/events/AccountDisabled.ts`
Classe: `AccountDisabled`
```typescript
export class AccountDisabled implements DomainEvent {
  readonly eventName = 'AccountDisabled';
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly reason?: string,
  ) {
    this.occurredOn = new Date();
  }
}
```

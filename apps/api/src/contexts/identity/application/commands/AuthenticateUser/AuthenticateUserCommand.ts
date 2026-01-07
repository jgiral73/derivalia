export class AuthenticateUserCommand {
  constructor(
    public readonly email: string,
    public readonly plainPassword: string,
  ) {}
}

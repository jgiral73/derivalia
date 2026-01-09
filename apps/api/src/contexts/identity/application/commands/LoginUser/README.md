# LoginUser

Aquest handler existeix per casos d'entrada a l'aplicacio on cal emetre un
token JWT per al client. Es diferencia d'`AuthenticateUserHandler`, que nomes
valida credencials sense generar cap token.

## Per que separar-los

- `AuthenticateUserHandler`: validar credencials abans d'una accio sensible
  dins d'una sessio ja autenticada (p. ex. canviar email o vincular un actor).
  No cal generar un JWT nou.
- `LoginUserHandler`: inici de sessio des d'un client (Postman/app). Cal
  generar un JWT per reutilitzar-lo en peticions posteriors.

## Exemple de flux (amb token)

1) El client fa login amb email i contrasenya.
2) `LoginUserHandler` valida credencials i demana un token a `JwtService`.
3) El client rep el JWT i el fa servir a les seguents peticions.

## Exemple de flux (sense token)

1) L'usuari ja esta autenticat i vol fer una accio sensible.
2) L'app demana revalidar la contrasenya.
3) `AuthenticateUserHandler` valida credencials i no emet cap token.

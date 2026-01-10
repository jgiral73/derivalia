# Unit tests - API (guio)

## Objectiu

Definir una base clara i repetible per a tests unitaris dels BCs a l'API.

## Tecnologies acordades

- Runner: Jest
- TypeScript: ts-jest
- Nest testing: @nestjs/testing
- HTTP tests (quan calgui): supertest

## Estructura d'arxius

Tests dins `apps/api/src` (perque Jest te `rootDir: src`).

Patro recomanat:

- Domini: al costat del fitxer que es prova
  - `.../value-objects/<Name>.spec.ts`
  - `.../aggregates/<Name>.spec.ts`
- Application:
  - `.../commands/<Command>/<Handler>.spec.ts`

## Naming

- Fitxers: `*.spec.ts`
- Descripcions: nom de classe o cas d'us

## Roadmap pas a pas

1) Verificar tooling
   - `npm test` des de `apps/api`
2) Domini
   - Value Objects (validacions, errors)
   - Aggregates (transicions d'estat, invariants)
3) Application
   - Command handlers amb repositoris mock
   - Assegurar events publicats
4) BC per BC
   - Identity BC
   - Patient BC
5) Refinar
   - Afegir casos negatius
   - Cobertura per errors de domini

## Exemple base de mocks

```ts
const repo = { findById: jest.fn(), save: jest.fn() };
const publisher = { publish: jest.fn() };
```

## Execucio

```bash
cd apps/api
npm test
```

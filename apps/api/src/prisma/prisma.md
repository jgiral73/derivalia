# Prisma

Mantindre sincronitzat:
```bash
npx prisma generate
```

Canvis normals:
```bash
prisma migrate dev
```

Canvi ràpid sense migració:
```bash
prisma db push (només dev)
```

Producció:
```bash
prisma migrate deploy
```

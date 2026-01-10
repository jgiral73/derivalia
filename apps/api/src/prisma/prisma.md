# Prisma

Quan apareixen errors del tipus:
```
Module '"@prisma/client"' has no exported member '...'. ts(2305)
```

Cal sincronitzar els canvis amb els tipus del projecte:
> Els tipus es guarden a [`apps/api/node_modules/.prisma/client/index.d.ts`](../../node_modules/.prisma/client/index.d.ts)
```bash
cd apps/api
npx prisma generate --config prisma.config.ts
```

Canvis normals:
```bash
npx prisma migrate dev
```

Canvi ràpid sense migració:
> Només dev
```bash
cd apps/api
npx prisma db push --schema src/prisma
```

Si dona un error pq no troba la variable d'environment `DATABASE_URL`, podem utilitzar `PowerShell` per passar-li en dues línies, la primera per establir el valor de la variable d'entorn `$dev`.

> Només des de `PowerShell`
```bash
$env:DATABASE_URL="mysql://my_project_admin:my_project_password@80.80.80.80:3306/my_db_dev"
npx prisma db push --schema src/prisma
```

si tot va bé s'obté una resposta com la següent:
```bash
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from src/prisma.
Datasource "db": MySQL database "my_db_dev" at "80.80.80.80:3306"

Your database is now in sync with your Prisma schema. Done in 729ms
```

Producció:
```bash
npx prisma migrate deploy
```

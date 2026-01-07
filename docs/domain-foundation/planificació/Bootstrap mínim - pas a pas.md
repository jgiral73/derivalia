Perfecte. Ho farem **com si partíssim literalment de zero**, sense servidor, sense repos, sense decisions preses.
Objectiu: **posar les bases correctes per l’MVP**, sense sobrearquitectura però sense hipotecar el futur.

Anirem **numerats**, cada pas amb:

* 🎯 objectiu
* ❓ decisions mínimes
* ✅ resultat esperat

---

# PAS 0 — Aclarir QUÈ vols llançar (abans de tocar res tècnic)

🎯 **Objectiu**
Definir l’abast mínim real de l’MVP (no el somni).

**Resposta mínima (mentalment, no cal escriure-la)**

* Professionals poden:

  * donar-se d’alta
  * crear pacients
  * gestionar cites
* Pacients:

  * poden acceptar consentiments
* No:

  * search avançat
  * billing complex
  * IA
  * multi-país

👉 **Sense això, qualsevol decisió tècnica és soroll**

---

# PAS 1 — Crear el repositori (abans del servidor)

🎯 **Objectiu**
Tenir **un únic repositori** amb estructura clara.

📁 Repositori: `health-platform` (nom provisional)

```text
health-platform/
├── backend/
├── frontend/
└── docs/
```

❓ Decisions

* Monorepo: **SÍ**
* Microserveis: **NO**

✅ Resultat

* Un sol repo
* Història neta
* Facilitat d’equip

---

# PAS 2 — Backend: bootstrap mínim (local)

🎯 **Objectiu**
Tenir una API que aixequi localment.

### 2.1 Crear backend NestJS

```bash
cd backend
npx @nestjs/cli new api
```

Opcions:

* package manager: el que facis servir habitualment
* TypeScript: sí
* ESLint: sí

Estructura inicial:

```text
backend/api/
├── src/
├── package.json
└── tsconfig.json
```

✅ Resultat

* `npm run start:dev` funciona
* API escolta a `localhost:3000`

---

# PAS 3 — Base de dades local (abans del cloud)

🎯 **Objectiu**
Tenir DB local idèntica a producció.

### 3.1 Docker Compose (mínim)

📁 `backend/docker-compose.yml`

```yaml
version: '3.8'
services:
  mariadb:
    image: mariadb:11
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: platform
    ports:
      - "3306:3306"
```

```bash
docker compose up -d
```

❓ Decisions

* MariaDB: **sí**
* Cloud DB: **encara no**

✅ Resultat

* DB corrent
* Accessible localment

---

# PAS 4 — ORM i esquema base

🎯 **Objectiu**
Tenir esquema versionable des del dia 1.

### 4.1 Instal·lar Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

📁 `backend/api/prisma/schema.prisma`

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

`.env`

```env
DATABASE_URL="mysql://root:root@localhost:3306/platform"
```

✅ Resultat

* Prisma connecta
* `npx prisma migrate dev` funciona (encara sense models)

---

# PAS 5 — Definir l’estructura DDD (sense implementar res)

🎯 **Objectiu**
Fixar **l’esquelet** abans del contingut.

📁 `backend/api/src/modules`

```text
modules/
├── identity/
├── patient/
├── scheduling/
├── consent/
└── reference-data/
```

Cada mòdul:

```text
patient/
├── domain/
├── application/
├── infrastructure/
├── patient.module.ts
└── index.ts
```

👉 **Encara buits**

✅ Resultat

* Arquitectura clara
* No improvisació després

---

# PAS 6 — Autenticació mínima (sense permisos avançats)

🎯 **Objectiu**
Poder identificar usuaris.

### Decisions mínimes

* Auth: JWT
* Proveïdor: propi (email + password)
* OAuth: **no ara**

### Implementar:

* `Identity BC`
* Entitat `User`
* Login / register

👉 Sense roles encara, només:

```ts
userId
email
```

✅ Resultat

* Token JWT
* `req.user.id` disponible

---

# PAS 7 — Professional onboarding mínim

🎯 **Objectiu**
Que un usuari pugui esdevenir professional.

### Model mínim

```text
User
 └── ProfessionalProfile (optional)
```

Campos mínims:

* name
* specialtyCode
* onboardingStatus

❓ Decisió clau

* Un usuari pot existir sense perfil professional → **sí**

✅ Resultat

* Progressive onboarding possible

---

# PAS 8 — Patient BC (abans de Scheduling)

🎯 **Objectiu**
Permetre crear pacients NO registrats.

### Model

* Patient
* createdByProfessionalId
* optional userId (null)

👉 Aquí ja prepares:

* consentiments
* invitacions futures

✅ Resultat

* Professional pot treballar encara que el pacient no sigui usuari

---

# PAS 9 — Scheduling mínim

🎯 **Objectiu**
Fer cites simples.

* Appointment
* professionalId
* patientId
* datetime
* status

❌ Sense sales
❌ Sense recurrència
❌ Sense col·laboracions

✅ Resultat

* Valor immediat MVP

---

# PAS 10 — Primer deploy (només quan tot això funciona)

🎯 **Objectiu**
No tocar cloud fins que:

* backend funciona local
* DB estable
* MVP clar

### Recomanació

* VPS simple (Hetzner / Scaleway)
* Docker
* 1 instància API
* 1 DB gestionada o container

---

# RESUM EXECUTIU

**Ordre correcte (no el canviïs):**

1️⃣ Definir MVP real
2️⃣ Monorepo
3️⃣ Backend local
4️⃣ DB local
5️⃣ Prisma
6️⃣ Estructura DDD
7️⃣ Auth mínima
8️⃣ Professional
9️⃣ Patient
🔟 Scheduling

---

## Següent pas (triem un)

Puc:

* baixar **encara més al detall** (començar PAS 1 amb comandes exactes)
* entrar en **PAS 6 (Identity BC)** amb codi real
* fer **checklist de “ready to deploy”**
* o **mapa d’errors típics del primer mes**

Digues quin i **seguim pas a pas** 👣

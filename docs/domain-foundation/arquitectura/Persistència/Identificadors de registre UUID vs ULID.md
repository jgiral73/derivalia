Pregunta **clau**. Això no és una decisió estètica, és **estratègica** i té impacte real en **rendiment, escalabilitat, seguretat i arquitectura futura**.

Anem **ordenats**, de més fonamental a més pragmàtic.

---

# 1️⃣ Quines opcions reals tenim

En un sistema com el teu (salut, col·laboració, ecosistema):

| Opció             | Exemple                                |
| ----------------- | -------------------------------------- |
| INT autoincrement | `123456`                               |
| BIGINT            | `9876543210`                           |
| UUID v4 (string)  | `550e8400-e29b-41d4-a716-446655440000` |
| UUID v7           | temporal, ordenable                    |
| ULID              | `01HZX…`                               |
| Snowflake         | `18446744073709551615`                 |

👉 El debat real és **INT/BIGINT vs identificadors distribuïts**

---

# 2️⃣ Rendiment pur: la veritat incòmoda

### Sí, tens raó:

* **INT / BIGINT**:

  * menys bytes
  * indexos més petits
  * joins lleugerament més ràpids

### Però el context importa:

| Escenari               | Impacte real                |
| ---------------------- | --------------------------- |
| Taules petites         | Irrellevant                 |
| Taules grans (milions) | +5–15% diferència           |
| Consultes simples      | negligible                  |
| Queries complexes      | dominades per IO, no per PK |

👉 En MariaDB moderna **no és el coll d’ampolla principal**.

---

# 3️⃣ El problema real dels INT en el teu domini

## ❌ Coupling fortíssim

* IDs exposats al frontend
* Facilita **IDOR attacks**
* Impossible federar dades
* Dificulta events async
* Complica import/export

---

## ❌ Micro-problemes acumulatius

* Migrations entre entorns
* Seed de dades
* Sync amb search engine
* Integracions futures (asseguradores, APIs)

---

# 4️⃣ Per què he usat `string` als exemples

Perquè **no tots els string IDs són iguals**.

❗ **NO recomano UUID v4 clàssic** en MariaDB per volum alt.

### Recomanació realista:

## 🥇 UUID v7 o ULID

| Característica | UUID v7            | ULID     |
| -------------- | ------------------ | -------- |
| Ordenable      | ✅                  | ✅        |
| Timestamp      | ✅                  | ✅        |
| Entropy        | bona               | bona     |
| Index friendly | molt millor que v4 | molt bo  |
| Standard       | RFC nova           | de-facto |

👉 Això **redueix molt** el problema d’indexació.

---

# 5️⃣ Comparativa real de costos

| Tipus   | Bytes | Ordenació  | Fragmentació |
| ------- | ----- | ---------- | ------------ |
| INT     | 4     | seqüencial | mínima       |
| BIGINT  | 8     | seqüencial | mínima       |
| UUID v4 | 16    | aleatòria  | **alta**     |
| UUID v7 | 16    | temporal   | baixa        |
| ULID    | 16    | temporal   | baixa        |

👉 El problema no és el *string*, és l’**aleatorietat**.

---

# 6️⃣ FK i joins: on sí que importa

En **taules molt calentes**:

* Appointments
* Clinical Records
* Events

Aquí tens **dues estratègies bones**.

---

## Estratègia A — UUID com PK, BIGINT intern (híbrid)

```sql
id BIGINT AUTO_INCREMENT PRIMARY KEY
public_id CHAR(26) UNIQUE -- ULID
```

* FK internes → BIGINT
* APIs → `public_id`

👉 Complexitat mitjana, rendiment òptim

---

## Estratègia B — Tot UUID v7 / ULID

```sql
id CHAR(26) PRIMARY KEY
```

* Més net
* Menys mapping
* Rendiment acceptable fins a desenes de milions

👉 La que encaixa millor amb DDD + events

---

# 7️⃣ DDD i events: aquí guanyen els string IDs

* Domain Events viatgen millor
* No depenen de DB
* No hi ha col·lisions entre BCs
* Facilitats per async + eventual consistency

---

# 8️⃣ Search engine & integracions

Search engines:

* treballen millor amb **string IDs**
* no necessiten mapping
* menys errors d’offset

---

# 9️⃣ Què recomano per la teva plataforma

### 🎯 Decisió equilibrada

| Context       | Decisió               |
| ------------- | --------------------- |
| Core BCs      | UUID v7 o ULID        |
| Domain events | string                |
| Search index  | string                |
| APIs          | string                |
| MariaDB       | CHAR(26) o BINARY(16) |

👉 **No INT exposats**

---

# 🔧 10️⃣ Optimització MariaDB concreta

Si vols anar fi:

```sql
id BINARY(16) PRIMARY KEY
```

* Guardes UUID v7 binari
* Index molt eficient
* API continua exposant string

---

# 🧠 11️⃣ Conclusió honesta

✔️ Sí, els INT són més ràpids en benchmarks
✔️ No, **no és el coll d’ampolla real**
✔️ Els costos arquitectònics d’INT són més alts
✔️ UUID v7 / ULID resolen el problema principal
✔️ Per salut + ecosistema → **string IDs guanyen**

---

## Següent debat possible

1️⃣ Estratègia concreta: **ULID vs UUID v7**
2️⃣ Model de PK/FK per Clinical Records
3️⃣ Impacte en sharding futur
4️⃣ Estratègia de soft-delete + audit

Digues quin i **seguim** 💡

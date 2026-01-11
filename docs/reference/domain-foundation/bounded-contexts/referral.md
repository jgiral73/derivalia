
## BC 7 — **Referral / Derivacions**

Inclou:

* origen
* destí
* pacient
* estat
* notes

<br />

#### `referral/domain/aggregates/Referral/Referral.ts`

```ts
export class Referral {
  constructor(
    readonly id: ReferralId,
    readonly patientId: string,
    readonly fromProfessionalId: string,
    readonly toProfessionalId: string | null,
    readonly toOrganizationId: string | null,
    private status: ReferralStatus
  ) {}

  accept() {
    this.status = ReferralStatus.Accepted()
  }

  reject() {
    this.status = ReferralStatus.Rejected()
  }
}
```

👉 Quan s’accepta:

* es crea **CareRelation**
* opcionalment **Treatment**

<br />

## 🧩 Resum de decisions importants

✔️ Patient és independent
✔️ Professional ↔ Patient **sense tractament possible**
✔️ Treatment és **opcional i temporal**
✔️ Organization és **opcional** a tots els nivells clínics
✔️ Derivació és un BC propi (no un flag)

<br />

## ➡️ Ara sí, següent pas natural

👉 **Scheduling / Agenda**

Ara ja podem:

* cites amb pacient
* cites sense pacient
* cites amb o sense organització
* cites dins o fora d’un tractament

Quan vulguis, entrem a **Scheduling amb aquest mateix nivell**.


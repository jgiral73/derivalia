Perfecte.
👉 **PAS 26 — Deployment, Security & Compliance (GDPR / HIPAA / ISO-ready)**
Aquest pas **tanca l’arquitectura end-to-end**: del domini al runtime productiu.

Seguim **pas a pas**, sense teoria innecessària.

---

# PAS 26 — Deployment & Compliance-by-design

## 26️⃣1️⃣ Objectius reals

* Complir **GDPR** (UE)
* Estar preparats per **HIPAA** (US)
* Bases per **ISO 27001**
* Zero acoblaments al domini
* Traçabilitat + seguretat + escalabilitat

👉 **Compliance és arquitectura**, no paperwork.

---

## 26️⃣2️⃣ Capes afectades

| Capa           | Impacte            |
| -------------- | ------------------ |
| Domain         | ❌ cap              |
| Application    | ✔️ policies        |
| Infrastructure | ✔️ fort            |
| DevOps         | ✔️ crític          |
| Front-end      | ✔️ control d’accés |

---

## 26️⃣3️⃣ Estructura de projecte (final)

```txt
apps/
├── api/
│   ├── src/
│   │   ├── modules/
│   │   ├── config/
│   │   │   ├── security.config.ts
│   │   │   ├── compliance.config.ts
│   │   │   └── retention.config.ts
│   │   ├── main.ts
│   │   └── bootstrap.ts
│   └── Dockerfile
├── web/
│   └── ionic-angular/
├── mobile/
│   └── ionic-angular
infra/
├── terraform/
├── kubernetes/
└── secrets/
```

---

## 26️⃣4️⃣ Configuració de seguretat (centralitzada)

📁 `apps/api/src/config/security.config.ts`

```ts
export const securityConfig = {
  jwt: {
    expiresIn: '15m',
    refreshExpiresIn: '30d'
  },
  encryption: {
    algorithm: 'aes-256-gcm'
  },
  password: {
    minLength: 12
  }
}
```

👉 **Cap secret aquí**
👉 Només polítiques

---

## 26️⃣5️⃣ Dades sensibles — Encryption at rest

### Exemple: Clinical content

📁
`modules/clinical-records/infrastructure/EncryptedField.ts`

```ts
export class EncryptedField {

  static encrypt(value: string): string {
    // KMS / Vault
    return encryptWithKey(value)
  }

  static decrypt(value: string): string {
    return decryptWithKey(value)
  }
}
```

📁
`ClinicalEntryRepositoryPrisma.ts`

```ts
content: EncryptedField.encrypt(entry.content)
```

👉 GDPR Art. 32
👉 HIPAA §164.312(a)

---

## 26️⃣6️⃣ Data retention & right to be forgotten

📁
`apps/api/src/config/retention.config.ts`

```ts
export const retentionPolicies = {
  audit: '10y',
  clinicalRecords: '20y',
  logs: '30d'
}
```

---

### Pseudonimització (GDPR)

📁
`modules/patient/application/commands/AnonymizePatient.ts`

```ts
patient.anonymize()

this.eventBus.publish(
  new PatientAnonymizedEvent(patient.id)
)
```

👉 Les dades clíniques **no s’eliminen**
👉 Es trenquen referències personals

---

## 26️⃣7️⃣ Consent enforcement (runtime)

📁
`modules/consent/application/services/ConsentGuard.ts`

```ts
canAccess(input: {
  actorId: string
  patientId: string
  purpose: AccessPurpose
}) {
  return this.repo.hasValidConsent(input)
}
```

📁
`ClinicalRecordController.ts`

```ts
await this.consentGuard.canAccess({
  actorId: user.id,
  patientId,
  purpose: 'CARE'
})
```

👉 Compliance **en temps d’execució**

---

## 26️⃣8️⃣ Audit immutable (legal-grade)

✔️ Append-only
✔️ Clock server-side
✔️ Hash chain (opcional)

📁
`AuditEventRepository.ts`

```ts
store(event) {
  return this.prisma.auditEvent.create({
    data: {
      ...event,
      hash: this.hash(event)
    }
  })
}
```

---

## 26️⃣9️⃣ Infrastructure — Kubernetes

📁 `infra/kubernetes/api-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: api
          image: app/api:latest
          envFrom:
            - secretRef:
                name: api-secrets
```

✔️ Auto-scale
✔️ Zero downtime
✔️ Isolació per entorn

---

## 26️⃣10️⃣ Secrets (NO en codi)

* Vault
* AWS Secrets Manager
* GCP Secret Manager

```ts
process.env.DB_ENCRYPTION_KEY
```

---

## 26️⃣11️⃣ Front-end (Ionic / Angular)

### Feature flags + permisos

```ts
canViewClinical =
  auth.hasPermission('clinical.read') &&
  auth.hasConsent('CARE')
```

```html
<app-clinical-record *ngIf="canViewClinical" />
```

👉 El FE **no força res**
👉 El BE **sempre valida**

---

## ⚠️ Errors habituals

❌ Compliance com a document
❌ Validar consentiment només al FE
❌ Logs com a audit
❌ Secrets en `.env` versionat
❌ Esborrar dades clíniques

---

## ✅ Resum PAS 26

* ✔️ Compliance-by-design
* ✔️ Seguretat runtime
* ✔️ GDPR / HIPAA-ready
* ✔️ Deploy escalable
* ✔️ Domini intacte

---

## 🔚 PAS 27 — TANCAMENT ESTRATÈGIC

Últimes opcions (recomanat):
1️⃣ **Roadmap MVP → scale → ecosystem**
2️⃣ **Marketplace d’integracions (labs, asseguradores)**
3️⃣ **AI assistida (notes, suggeriments clínics)**

Digues quin i **seguim** 💥

Perfecte.
👉 **PAS 23 — FHIR interoperability (light, pragmàtica i segura)**
Seguim **pas a pas**, sense convertir la plataforma en un EHR monolític però deixant-la **preparada per interoperar**.

---

# PAS 23 — FHIR (Fast Healthcare Interoperability Resources)

## 23️⃣1️⃣ Objectiu realista

NO volem:

* implementar tot FHIR ❌
* substituir el nostre domini ❌

SÍ volem:

* exportar dades clíniques
* integrar-nos amb tercers
* complir estàndards
* evitar lock-in

👉 **FHIR com a llenguatge d’intercanvi, no com a model intern**

---

## 23️⃣2️⃣ Principi fonamental (molt important)

> **El domini NO és FHIR**
> **FHIR és una capa d’anti-corruption**

---

## 23️⃣3️⃣ On viu FHIR (arquitectura)

📁 `modules/fhir`

```txt
fhir/
├── domain/
│   └── value-objects/
│       └── FhirResourceType.ts
├── application/
│   ├── mappers/
│   │   ├── PatientToFhirMapper.ts
│   │   ├── AppointmentToFhirMapper.ts
│   │   └── ClinicalRecordToFhirMapper.ts
│   ├── services/
│   │   └── FhirExportService.ts
│   └── queries/
│       └── ExportPatientBundle
├── api/
│   └── FhirController.ts
```

👉 **No Prisma aquí**
👉 Només transformació

---

## 23️⃣4️⃣ Recursos FHIR que cobrirem (subset)

| Intern          | FHIR                  |
| --------------- | --------------------- |
| Patient         | Patient               |
| Appointment     | Appointment           |
| ClinicalEntry   | Observation           |
| Diagnosis       | Condition             |
| Form submission | QuestionnaireResponse |
| Document        | DocumentReference     |

👉 Suficient per:

* interoperar
* informes
* derivacions

---

## 23️⃣5️⃣ Value Object — FHIR Resource Type

📁 `modules/fhir/domain/value-objects/FhirResourceType.ts`

```ts
export type FhirResourceType =
  | 'Patient'
  | 'Appointment'
  | 'Observation'
  | 'Condition'
  | 'QuestionnaireResponse'
  | 'DocumentReference'
```

---

## 23️⃣6️⃣ Mapper — Patient → FHIR Patient

📁
`modules/fhir/application/mappers/PatientToFhirMapper.ts`

```ts
export class PatientToFhirMapper {
  static map(patient: Patient) {
    return {
      resourceType: 'Patient',
      id: patient.id,
      name: [{
        use: 'official',
        text: patient.fullName
      }],
      gender: patient.gender,
      birthDate: patient.birthDate.toISOString().split('T')[0]
    }
  }
}
```

👉 Mapping explícit
👉 Cap dependència inversa

---

## 23️⃣7️⃣ Mapper — Appointment → FHIR Appointment

📁
`modules/fhir/application/mappers/AppointmentToFhirMapper.ts`

```ts
export class AppointmentToFhirMapper {
  static map(appt: Appointment) {
    return {
      resourceType: 'Appointment',
      id: appt.id,
      status: 'booked',
      start: appt.startsAt.toISOString(),
      end: appt.endsAt.toISOString(),
      participant: [
        {
          actor: { reference: `Patient/${appt.patientId}` },
          status: 'accepted'
        }
      ]
    }
  }
}
```

---

## 23️⃣8️⃣ Mapper — ClinicalEntry → Observation

📁
`modules/fhir/application/mappers/ClinicalRecordToFhirMapper.ts`

```ts
export class ClinicalRecordToFhirMapper {
  static mapEntry(entry: ClinicalEntry) {

    return {
      resourceType: 'Observation',
      id: entry.id,
      status: 'final',
      code: {
        text: entry.type
      },
      valueString: entry.content,
      effectiveDateTime: entry.createdAt.toISOString()
    }
  }
}
```

---

## 23️⃣9️⃣ Export com Bundle

📁
`modules/fhir/application/services/FhirExportService.ts`

```ts
export class FhirExportService {
  exportPatientBundle(input: {
    patient: Patient
    appointments: Appointment[]
    entries: ClinicalEntry[]
    documents: Document[]
  }) {

    return {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [
        { resource: PatientToFhirMapper.map(input.patient) },
        ...input.appointments.map(a => ({
          resource: AppointmentToFhirMapper.map(a)
        })),
        ...input.entries.map(e => ({
          resource: ClinicalRecordToFhirMapper.mapEntry(e)
        }))
      ]
    }
  }
}
```

---

## 🔟 Endpoint FHIR (controlat)

📁 `modules/fhir/api/FhirController.ts`

```ts
@Get('/Patient/:id/$export')
async exportPatient(
  @Param('id') patientId: string,
  @Req() req
) {

  await authz.canAccess({
    actorId: req.user.id,
    permission: 'fhir.export',
    scope: new AccessScope('PATIENT', patientId),
    patientId,
    purpose: new ConsentPurpose('CARE')
  })

  return this.fhirExportService.exportPatientBundle(
    await this.loadPatientData(patientId)
  )
}
```

👉 **No és un servidor FHIR públic**
👉 És un endpoint d’export

---

## 24️⃣ Consentiment específic FHIR

👉 Nou purpose:

```ts
purpose: 'INTEROPERABILITY'
```

👉 El pacient pot:

* permetre CARE
* negar EXPORT

---

## 25️⃣ Seguretat (molt important)

* No PII extra
* No notes internes si no toca
* Logs d’export
* Rate limit
* Watermark legal

---

## ⚠️ Errors habituals

❌ Usar FHIR com a model intern
❌ Implementar tot FHIR
❌ Exposar endpoints oberts
❌ No versionar mapping
❌ Ignorar consentiment

---

## ✅ Resum PAS 23

* ✔️ FHIR com a capa d’intercanvi
* ✔️ Anti-corruption layer
* ✔️ Subset pragmàtic
* ✔️ Consentiment explícit
* ✔️ Preparat per integracions

---

## PAS 24 (tancament plataforma)

Opcions finals:
1️⃣ **Billing / Insurance**
2️⃣ **Multi-tenant hard isolation**
3️⃣ **Observability & audit trail avançat**
4️⃣ **Deployment & compliance (HIPAA/GDPR)**

Digues cap on vols anar i **seguim**.


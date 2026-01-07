Perfecte. **Seguim amb Swagger / OpenAPI**, però ho farem **bé i pas a pas**, alineat amb tot el que ja hem decidit (DDD, BCs, capabilities, UX).

No farem “swagger decoratiu”.
Farem **contractes de domini executables**.

---

# PAS — API CONTRACTS (OpenAPI / Swagger)

## enfoc *BC-first*, *capability-aware*

---

## 0️⃣ Principi clau (molt important)

> **Swagger no és documentació**
> **Swagger és el contracte entre BCs i Frontend**

Per tant:

* 1 Swagger **per BC**
* No “mega swagger”
* No endpoints barrejats

---

# 1️⃣ Estructura recomanada

```text
backend/
├── contexts/
│   ├── patient/
│   │   ├── api/
│   │   │   ├── patient.openapi.yaml
│   │   │   └── patient.controller.ts
│   │   └── domain/
│   ├── scheduling/
│   │   └── api/
│   │       └── scheduling.openapi.yaml
│   ├── collaboration/
│   ├── clinical-record/
│   ├── consent/
│   └── billing/
└── shared/
    └── openapi/
        └── common-schemas.yaml
```

📌 **Un BC = un OpenAPI**

---

# 2️⃣ Convencions globals (shared)

📁 `shared/openapi/common-schemas.yaml`

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

  schemas:
    ErrorResponse:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
```

---

# 3️⃣ Patient BC — OpenAPI

📁 `contexts/patient/api/patient.openapi.yaml`

```yaml
openapi: 3.0.3
info:
  title: Patient BC API
  version: 1.0.0

security:
  - bearerAuth: []

paths:

  /patients:
    get:
      summary: List active patients
      tags: [Patient]
      x-capabilities-required:
        - VIEW_PATIENT
      responses:
        '200':
          description: List of patients
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/PatientSummary'

    post:
      summary: Create patient
      tags: [Patient]
      x-capabilities-required:
        - CREATE_PATIENT
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePatientRequest'
      responses:
        '201':
          description: Patient created

  /patients/{id}:
    get:
      summary: Get patient detail
      tags: [Patient]
      x-capabilities-required:
        - VIEW_PATIENT
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PatientDetail'
```

---

### Schemas

```yaml
components:
  schemas:

    PatientSummary:
      type: object
      properties:
        id:
          type: string
        fullName:
          type: string
        consentStatus:
          type: string
          enum: [NONE, PARTIAL, FULL]

    PatientDetail:
      allOf:
        - $ref: '#/components/schemas/PatientSummary'
        - type: object
          properties:
            birthDate:
              type: string
              format: date
            contact:
              type: object
              properties:
                email:
                  type: string
                phone:
                  type: string

    CreatePatientRequest:
      type: object
      required: [fullName]
      properties:
        fullName:
          type: string
        email:
          type: string
```

📌 **Observa**:

* no hi ha lògica
* només contracte
* capability declarada explícitament

---

# 4️⃣ Scheduling BC — OpenAPI

📁 `contexts/scheduling/api/scheduling.openapi.yaml`

```yaml
openapi: 3.0.3
info:
  title: Scheduling BC API
  version: 1.0.0

security:
  - bearerAuth: []

paths:

  /appointments:
    get:
      summary: List appointments
      tags: [Scheduling]
      x-capabilities-required:
        - SCHEDULE_APPOINTMENT
      parameters:
        - in: query
          name: range
          schema:
            type: string
            enum: [day, week, month]
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Appointment'

    post:
      summary: Create appointment
      tags: [Scheduling]
      x-capabilities-required:
        - CREATE_APPOINTMENT
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateAppointmentRequest'
      responses:
        '201':
          description: Created
```

---

### Appointment schema

```yaml
components:
  schemas:
    Appointment:
      type: object
      properties:
        id:
          type: string
        patientId:
          type: string
        startsAt:
          type: string
          format: date-time
        endsAt:
          type: string
          format: date-time
        status:
          type: string
          enum: [SCHEDULED, CANCELLED, COMPLETED]
```

---

# 5️⃣ Capability-aware Swagger → codi

Aquest `x-capabilities-required` **no és decoratiu**.

El pots usar per:

* generar guards automàtics
* validar implementació
* generar documentació frontend

### Exemple NestJS

```ts
@RequireCapabilities('VIEW_PATIENT')
@Get()
listPatients() {}
```

---

# 6️⃣ Integració Swagger central (opcional)

Pots:

* exposar **un swagger per BC**
* o un agregador només per dev

```ts
SwaggerModule.setup('/swagger/patient', app, patientDoc);
SwaggerModule.setup('/swagger/scheduling', app, schedulingDoc);
```

---

# 7️⃣ Beneficis immediats

✔️ Frontend sap EXACTAMENT què pot cridar
✔️ Guards coherents
✔️ Backends desacoblats
✔️ Test contract-first
✔️ Fàcil escalar BCs

---

# 8️⃣ Errors i respostes normalitzades

```yaml
'403':
  description: Missing capability
  content:
    application/json:
      schema:
        $ref: 'common-schemas.yaml#/components/schemas/ErrorResponse'
```

---

# 9️⃣ On som ara

En aquest punt ja tens:

* UX definida
* BCs definits
* APIs contractades
* Guards clars
* Swagger executable

👉 **Això és suficient per començar implementació real**

---

## ⏭️ Següent pas (ordre recomanat)

1️⃣ **Implementar UN BC complet (Patient)**

* domain
* application
* infrastructure (Prisma)
* controller

2️⃣ **Generar clients frontend a partir del swagger**

3️⃣ **Tests contract-first**

Digues quin i **seguim** 🔥

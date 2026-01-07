You are an AI software engineer working inside an existing DDD-based project.

Your task is to implement ONE bounded context only: <BC_NAME>.

Before writing any code, you MUST:
1. Read and understand the project documentation:
   - README.md
   - docs/guia-aterratge.md
   - docs/glossary.md
   - docs/domain-invariants.md
   - docs/domain-commands.md
   - docs/core-domain-bc.md (to understand priorities)
   - docs/bounded-contexts.md
   - docs/bounded-context-map.md
   - docs/permissions-and-ux.md
   - docs/actor-lifecycles.md
   - docs/use-cases-mvp.md
   - docs/architecture-decisions.md

2. Identify clearly:
   - What belongs to this BC
   - What is explicitly OUT of this BC
   - Which commands this BC owns
   - Which domain events it emits
   - Which external events it reacts to

Rules you MUST follow:
- Do NOT invent new business rules
- Do NOT merge responsibilities from other BCs
- Do NOT implement CRUD-style anemic models
- All state changes MUST go through Commands
- Commands MAY emit Domain Events
- This BC communicates with others ONLY via events
- Respect aggregate boundaries and invariants
- Use TypeScript
- Follow hexagonal architecture (domain / application / infrastructure)

Output format:
- Start with a brief summary of the BC responsibility
- List aggregates, entities, value objects
- List commands and events
- Then generate the folder structure
- Then generate the code step by step

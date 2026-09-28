# SmartREST - Hono Edition

SmartREST Hono is a template to create REST API microservices using Node.js and Bun in TypeScript.

It uses:

* Bun package manager & runtime
* Hono framework
* Drizzle ORM
* Embedded SQLite (`bun:sqlite`)
* Zod Types & Schemas
* Swagger UI & OpenAPI 3.0 Spec
* Pino Structured Logger & HTTP Logging Middleware

## Agents Guidelines

* Keep TypeScript files as small as possible
* `package.json` is the single source of truth for the application version and metadata
* Use Zod validation whenever needed (method input, API input, DTOs)
* Use the following namespaces:
  * `controller` - HTTP controllers, endpoints, and route management
  * `model` - Drizzle ORM table models and relations
  * `dao` - Database Access Objects for queries and data manipulation
  * `service` - Business logic, validation rules, and database seeding
  * `dto` - Zod schemas, TypeScript types, and JSON DTO mapping functions
  * `utils` - Utilities like logger, HTTP middleware, string, and date utilities
* Write unit tests for all models, services, DAOs, and controllers using `bun:test`

## Header

Every new file must have this header:

```typescript
/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */
```
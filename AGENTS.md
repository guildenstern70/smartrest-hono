# SmartREST - Hono Edition

SmartREST Hono is a template to create REST API microservices using Node.js in TypeScript.

It uses:

* Bun package manager
* Hono framework
* Drizzle ORM
* Zod Types
* Swagger UI
* Embedded SQLite

## Agents Guideline

* Keep TypeScript files as small as possible
* Use Zod validation whenever needed (method input, API input)
* Use the following namespace:
  * controller - put here controllers and http management
  * model - put model entities here
  * dao - put here logic about search in the database
  * service - here is the business logic
  * dto - put here the mapping between model entities and JSON DTOs
  * utils - utilities like string and date utilities


## Header

Every new file must have this header:

```
/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */
```
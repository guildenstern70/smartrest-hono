/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui'

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'SmartREST - Hono Edition API',
    version: '1.0.0',
    description: 'REST API microservice built with Hono, Drizzle ORM, Zod, and SQLite.',
  },
  servers: [
    {
      url: '/',
      description: 'Current environment server',
    },
  ],
  tags: [
    {
      name: 'Persons',
      description: 'Operations related to Persons',
    },
    {
      name: 'Phones',
      description: 'Operations related to Phone numbers',
    },
  ],
  paths: {
    '/api/persons': {
      get: {
        tags: ['Persons'],
        summary: 'Get all persons',
        description: 'Retrieves a list of all persons along with their associated phone numbers.',
        responses: {
          '200': {
            description: 'List of persons',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/PersonWithPhones' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Persons'],
        summary: 'Create a person',
        description: 'Creates a new person along with 1 or 2 phone numbers.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatePersonWithPhones' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Person created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PersonWithPhones' },
              },
            },
          },
          '400': {
            description: 'Validation error (e.g. invalid phone count or missing fields)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/persons/{id}': {
      get: {
        tags: ['Persons'],
        summary: 'Get a person by ID',
        description: 'Retrieves a specific person and their phone numbers by their unique ID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Numeric ID of the person',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Person details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PersonWithPhones' },
              },
            },
          },
          '404': {
            description: 'Person not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Persons'],
        summary: 'Edit a person',
        description: 'Updates specified attributes of a person.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Numeric ID of the person to update',
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdatePerson' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Person updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PersonWithPhones' },
              },
            },
          },
          '404': {
            description: 'Person not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid update payload or ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Persons'],
        summary: 'Delete a person',
        description: 'Deletes a person and cascades deletion to their phone numbers.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Numeric ID of the person to delete',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Person deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Person deleted successfully' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Person not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/persons/seed': {
      post: {
        tags: ['Persons'],
        summary: 'Seed the database',
        description: 'Initializes the database schema and seeds 10 persons and 15 phone numbers.',
        responses: {
          '200': {
            description: 'Seeding completed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Database seeded successfully' },
                    personsCreated: { type: 'integer', example: 10 },
                    phonesCreated: { type: 'integer', example: 15 },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/phones': {
      get: {
        tags: ['Phones'],
        summary: 'Get all phones',
        description: 'Retrieves a list of all phone numbers in the database.',
        responses: {
          '200': {
            description: 'List of phones',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Phone' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Phones'],
        summary: 'Add a phone to an existing person',
        description: 'Adds a new phone number to an existing person (enforcing max 2 phones per person).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddPhone' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Phone created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Phone' },
              },
            },
          },
          '400': {
            description: 'Validation error, person not found, or person already has 2 phones',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/phones/search': {
      get: {
        tags: ['Phones'],
        summary: 'Search phone number',
        description: 'Looks up phone numbers matching query and retrieves the person who owns each number.',
        parameters: [
          {
            name: 'query',
            in: 'query',
            required: true,
            description: 'Phone number or substring to search for',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Matching phones with owner person details',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/PhoneWithPerson' },
                },
              },
            },
          },
          '400': {
            description: 'Missing query parameter',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/phones/lookup/{number}': {
      get: {
        tags: ['Phones'],
        summary: 'Lookup phone by exact number',
        description: 'Looks up a specific phone number and retrieves the person who owns it.',
        parameters: [
          {
            name: 'number',
            in: 'path',
            required: true,
            description: 'Exact phone number string',
            schema: { type: 'string' },
          },
          {
            name: 'prefix',
            in: 'query',
            required: false,
            description: 'Optional country/area prefix',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Phone and owner person found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PhoneWithPerson' },
              },
            },
          },
          '404': {
            description: 'Phone number not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Phone: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          personId: { type: 'integer', example: 1 },
          prefix: { type: 'string', example: '+1' },
          phoneNumber: { type: 'string', example: '555-0101' },
          description: { type: 'string', example: 'Personal Mobile' },
        },
        required: ['id', 'personId', 'prefix', 'phoneNumber', 'description'],
      },
      CreatePhone: {
        type: 'object',
        properties: {
          prefix: { type: 'string', example: '+1' },
          phoneNumber: { type: 'string', example: '555-0101' },
          description: { type: 'string', example: 'Personal Mobile' },
        },
        required: ['prefix', 'phoneNumber', 'description'],
      },
      AddPhone: {
        type: 'object',
        properties: {
          personId: { type: 'integer', example: 1 },
          prefix: { type: 'string', example: '+1' },
          phoneNumber: { type: 'string', example: '555-0101' },
          description: { type: 'string', example: 'Personal Mobile' },
        },
        required: ['personId', 'prefix', 'phoneNumber', 'description'],
      },
      Person: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Alice' },
          surname: { type: 'string', example: 'Smith' },
          address: { type: 'string', example: '123 Maple Street, Springfield' },
          birthday: { type: 'string', example: '1985-04-12' },
          gender: { type: 'string', example: 'F' },
        },
        required: ['id', 'name', 'surname', 'address', 'birthday', 'gender'],
      },
      PersonWithPhones: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Alice' },
          surname: { type: 'string', example: 'Smith' },
          address: { type: 'string', example: '123 Maple Street, Springfield' },
          birthday: { type: 'string', example: '1985-04-12' },
          gender: { type: 'string', example: 'F' },
          phones: {
            type: 'array',
            items: { $ref: '#/components/schemas/Phone' },
          },
        },
        required: ['id', 'name', 'surname', 'address', 'birthday', 'gender', 'phones'],
      },
      PhoneWithPerson: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          personId: { type: 'integer', example: 1 },
          prefix: { type: 'string', example: '+1' },
          phoneNumber: { type: 'string', example: '555-0101' },
          description: { type: 'string', example: 'Personal Mobile' },
          person: { $ref: '#/components/schemas/Person' },
        },
        required: ['id', 'personId', 'prefix', 'phoneNumber', 'description', 'person'],
      },
      CreatePersonWithPhones: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Alice' },
          surname: { type: 'string', example: 'Smith' },
          address: { type: 'string', example: '123 Maple Street, Springfield' },
          birthday: { type: 'string', example: '1985-04-12' },
          gender: { type: 'string', example: 'F' },
          phones: {
            type: 'array',
            minItems: 1,
            maxItems: 2,
            items: { $ref: '#/components/schemas/CreatePhone' },
          },
        },
        required: ['name', 'surname', 'address', 'birthday', 'gender', 'phones'],
      },
      UpdatePerson: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Alice Updated' },
          surname: { type: 'string', example: 'Smith' },
          address: { type: 'string', example: '456 New Road, Springfield' },
          birthday: { type: 'string', example: '1985-04-12' },
          gender: { type: 'string', example: 'F' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Invalid request payload' },
        },
        required: ['error'],
      },
    },
  },
}

export const swaggerController = () => {
  const app = new Hono()

  // OpenAPI JSON specification endpoint
  app.get('/doc', (c) => {
    return c.json(openApiSpec)
  })

  // OpenAPI JSON download endpoint
  app.get('/doc/download', (c) => {
    c.header('Content-Disposition', 'attachment; filename="openapi.json"')
    return c.json(openApiSpec)
  })

  // Swagger UI documentation page
  app.get('/swagger', swaggerUI({ url: '/doc' }))
  app.get('/docs', swaggerUI({ url: '/doc' }))

  return app
}

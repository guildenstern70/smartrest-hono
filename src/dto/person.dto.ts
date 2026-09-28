/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { z } from 'zod'
import { Person, Phone } from '../model'
import { createPhoneSchema, phoneSchema, toPhoneDto, CreatePhoneDto, PhoneDto } from './phone.dto'

export const createPersonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  address: z.string().min(1, 'Address is required'),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in YYYY-MM-DD format'),
  gender: z.string().min(1, 'Gender is required'),
})

export const personSchema = createPersonSchema.extend({
  id: z.number().int().positive(),
})

export const createPersonWithPhonesSchema = createPersonSchema.extend({
  phones: z
    .array(createPhoneSchema)
    .min(1, 'A person must have at least 1 phone number')
    .max(2, 'A person can have at most 2 phone numbers'),
})

export const personWithPhonesSchema = personSchema.extend({
  phones: z.array(phoneSchema),
})

export const updatePersonSchema = createPersonSchema.partial()

export type CreatePersonDto = z.infer<typeof createPersonSchema>
export type UpdatePersonDto = z.infer<typeof updatePersonSchema>
export type PersonDto = z.infer<typeof personSchema>
export type CreatePersonWithPhonesDto = z.infer<typeof createPersonWithPhonesSchema>
export type PersonWithPhonesDto = z.infer<typeof personWithPhonesSchema>

export const toPersonDto = (person: Person): PersonDto => ({
  id: person.id,
  name: person.name,
  surname: person.surname,
  address: person.address,
  birthday: person.birthday,
  gender: person.gender,
})

export const toPersonWithPhonesDto = (
  person: Person & { phones?: Phone[] }
): PersonWithPhonesDto => ({
  ...toPersonDto(person),
  phones: (person.phones || []).map(toPhoneDto),
})

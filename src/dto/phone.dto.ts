/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { z } from 'zod'
import { Phone } from '../model'

export const createPhoneSchema = z.object({
  prefix: z.string().min(1, 'Prefix is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  description: z.string().min(1, 'Description is required'),
})

export const phoneSchema = createPhoneSchema.extend({
  id: z.number().int().positive(),
  personId: z.number().int().positive(),
})

export const addPhoneSchema = createPhoneSchema.extend({
  personId: z.number().int().positive('Person ID must be a positive number'),
})

export type CreatePhoneDto = z.infer<typeof createPhoneSchema>
export type AddPhoneDto = z.infer<typeof addPhoneSchema>
export type PhoneDto = z.infer<typeof phoneSchema>

export interface PhoneWithPersonDto extends PhoneDto {
  person: {
    id: number
    name: string
    surname: string
    address: string
    birthday: string
    gender: string
  }
}

export const toPhoneDto = (phone: Phone): PhoneDto => ({
  id: phone.id,
  personId: phone.personId,
  prefix: phone.prefix,
  phoneNumber: phone.phoneNumber,
  description: phone.description,
})

export const toPhoneWithPersonDto = (
  phone: Phone & { person: { id: number; name: string; surname: string; address: string; birthday: string; gender: string } }
): PhoneWithPersonDto => ({
  ...toPhoneDto(phone),
  person: {
    id: phone.person.id,
    name: phone.person.name,
    surname: phone.person.surname,
    address: phone.person.address,
    birthday: phone.person.birthday,
    gender: phone.person.gender,
  },
})

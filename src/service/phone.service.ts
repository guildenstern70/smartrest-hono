/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { PersonDao, PhoneDao } from '../dao'
import {
  addPhoneSchema,
  AddPhoneDto,
  PhoneDto,
  PhoneWithPersonDto,
  toPhoneDto,
  toPhoneWithPersonDto,
} from '../dto'

export class PhoneService {
  constructor(
    private phoneDao: PhoneDao = new PhoneDao(),
    private personDao: PersonDao = new PersonDao()
  ) {}

  async addPhoneToPerson(input: AddPhoneDto): Promise<PhoneDto> {
    const validated = addPhoneSchema.parse(input)

    const person = await this.personDao.findById(validated.personId)
    if (!person) {
      throw new Error(`Person with id ${validated.personId} does not exist`)
    }

    const currentCount = await this.phoneDao.countByPersonId(validated.personId)
    if (currentCount >= 2) {
      throw new Error(`Person with id ${validated.personId} already has the maximum of 2 phone numbers`)
    }

    const created = await this.phoneDao.create({
      personId: validated.personId,
      prefix: validated.prefix,
      phoneNumber: validated.phoneNumber,
      description: validated.description,
    })

    return toPhoneDto(created)
  }

  async searchPhonesWithPerson(query: string): Promise<PhoneWithPersonDto[]> {
    if (!query || query.trim().length === 0) {
      return []
    }
    const results = await this.phoneDao.findByNumberWithPerson(query.trim())
    return results
      .filter((r) => r.person !== null)
      .map((r) => toPhoneWithPersonDto(r as any))
  }

  async findExactPhoneWithPerson(phoneNumber: string, prefix?: string): Promise<PhoneWithPersonDto | null> {
    const result = await this.phoneDao.findExactWithPerson(phoneNumber, prefix)
    if (!result || !result.person) {
      return null
    }
    return toPhoneWithPersonDto(result as any)
  }

  async getAllPhones(): Promise<PhoneDto[]> {
    const all = await this.phoneDao.findAll()
    return all.map(toPhoneDto)
  }

  async getPhonesByPersonId(personId: number): Promise<PhoneDto[]> {
    const phones = await this.phoneDao.findByPersonId(personId)
    return phones.map(toPhoneDto)
  }
}

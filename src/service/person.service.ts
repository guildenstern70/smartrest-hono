/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { PersonDao, PhoneDao } from '../dao'
import {
  createPersonWithPhonesSchema,
  createPhoneSchema,
  updatePersonSchema,
  CreatePersonWithPhonesDto,
  CreatePhoneDto,
  UpdatePersonDto,
  PersonWithPhonesDto,
  toPersonWithPhonesDto,
} from '../dto'

export class PersonService {
  constructor(
    private personDao: PersonDao = new PersonDao(),
    private phoneDao: PhoneDao = new PhoneDao()
  ) {}

  async createPersonWithPhones(input: CreatePersonWithPhonesDto): Promise<PersonWithPhonesDto> {
    const validated = createPersonWithPhonesSchema.parse(input)

    const person = await this.personDao.create({
      name: validated.name,
      surname: validated.surname,
      address: validated.address,
      birthday: validated.birthday,
      gender: validated.gender,
    })

    const phoneInserts = validated.phones.map((p) => ({
      personId: person.id,
      prefix: p.prefix,
      phoneNumber: p.phoneNumber,
      description: p.description,
    }))

    const phones = await this.phoneDao.createMany(phoneInserts)

    return toPersonWithPhonesDto({
      ...person,
      phones,
    })
  }

  async addPhoneToPerson(personId: number, phoneInput: CreatePhoneDto) {
    const validated = createPhoneSchema.parse(phoneInput)
    const person = await this.personDao.findById(personId)
    if (!person) {
      throw new Error(`Person with id ${personId} not found`)
    }

    const currentCount = await this.phoneDao.countByPersonId(personId)
    if (currentCount >= 2) {
      throw new Error(`Person with id ${personId} already has the maximum of 2 phone numbers`)
    }

    return this.phoneDao.create({
      personId,
      prefix: validated.prefix,
      phoneNumber: validated.phoneNumber,
      description: validated.description,
    })
  }

  async getPersonById(id: number): Promise<PersonWithPhonesDto | null> {
    const person = await this.personDao.findByIdWithPhones(id)
    if (!person) return null
    return toPersonWithPhonesDto(person)
  }

  async getAllPersons(): Promise<PersonWithPhonesDto[]> {
    const persons = await this.personDao.findAllWithPhones()
    return persons.map(toPersonWithPhonesDto)
  }

  async updatePerson(id: number, input: UpdatePersonDto): Promise<PersonWithPhonesDto | null> {
    const validated = updatePersonSchema.parse(input)
    const existing = await this.personDao.findById(id)
    if (!existing) {
      return null
    }

    await this.personDao.update(id, validated)
    return this.getPersonById(id)
  }

  async deletePerson(id: number): Promise<boolean> {
    const existing = await this.personDao.findById(id)
    if (!existing) {
      return false
    }
    return this.personDao.deleteById(id)
  }

  async getPersonCount(): Promise<number> {
    return this.personDao.count()
  }

  async getPhoneCount(): Promise<number> {
    return this.phoneDao.count()
  }
}

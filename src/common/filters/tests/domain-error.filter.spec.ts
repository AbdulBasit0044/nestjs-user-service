/* eslint-disable import/first */
jest.mock('@common/constants', () => {
  return {
    IS_PROD: true
  }
})

import { Test } from '@nestjs/testing'
import { ArgumentsHost } from '@nestjs/common'
import { createMock } from '@golevelup/nestjs-testing'
import { UnauthenticatedError } from '@common/errors'
import { DomainErrorFilter } from '../domain-error.filter'

describe('DomainErrorFilter', () => {
  let domainErrorFilter: DomainErrorFilter

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [DomainErrorFilter]
    }).compile()

    domainErrorFilter = await module.get(DomainErrorFilter)
  })

  it('should be defined', () => {
    expect(domainErrorFilter).toBeDefined()
  })

  describe('catch', () => {
    it('should return domain error', () => {
      const jsonSpy = jest.fn()
      const statusSpy = jest.fn()
      const host = createMock<ArgumentsHost>({
        switchToHttp: () => ({
          getResponse: () => ({
            json: jsonSpy,
            status: statusSpy.mockReturnValue({ json: jsonSpy })
          })
        })
      })
      const error = new UnauthenticatedError()
      domainErrorFilter.catch(error, host)
      expect(statusSpy).toBeCalledWith(401)
      expect(jsonSpy).toBeCalledWith(error)
    })
  })
})

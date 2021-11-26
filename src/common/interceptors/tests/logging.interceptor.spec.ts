/* eslint-disable import/first */
jest.mock('@common/logger', () => ({
  logError: jest.fn(),
  logInfo: jest.fn()
}))

import { ExecutionContext } from '@nestjs/common'
import { createMock } from '@golevelup/nestjs-testing'
import { throwError } from 'rxjs'
import { generateId } from '@common/utils'
import { ObjectNotFoundError } from '@common/errors'
import * as Logger from '@common/logger'
import { LoggingInterceptor } from '../logging.interceptor'

const nextError = {
  handle: () => throwError(() => new ObjectNotFoundError({ field: 'id', objectType: 'User' }))
}

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor

  beforeEach(() => {
    interceptor = new LoggingInterceptor()
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  describe('log the request/error info', () => {
    it('should log for http', () => {
      const context = createMock<ExecutionContext>({
        getHandler: () => ({ name: 'getUserById' }),
        getType: () => 'http',
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-service': 'User'
            },
            params: {
              id: generateId()
            }
          })
        })
      })

      const logInfoSpy = jest.spyOn(Logger, 'logInfo')
      const logErrorSpy = jest.spyOn(Logger, 'logError')

      return new Promise<void>(done => {
        interceptor.intercept(context, nextError).subscribe({
          error: () => {
            expect(logInfoSpy).toHaveBeenCalled()
            expect(logInfoSpy.mock.calls[0][0]).toHaveProperty('serviceName', 'User')

            expect(logErrorSpy).toHaveBeenCalled()
            expect(logErrorSpy.mock.calls[0][0]).toHaveProperty('serviceName', 'User')

            done()
          }
        })
      })
    })

    it('should has serviceName as an empty string', () => {
      const context = createMock<ExecutionContext>({
        getHandler: () => ({ name: 'getUserById' }),
        getType: () => 'rpc',
        switchToRpc: () => ({
          getContext: () => ({
            get: () => undefined
          }),
          getData: () => ({ id: generateId() })
        })
      })

      const logInfoSpy = jest.spyOn(Logger, 'logInfo')

      return new Promise<void>(done => {
        interceptor.intercept(context, nextError).subscribe({
          error: () => {
            expect(logInfoSpy.mock.calls[0][0]).toHaveProperty('serviceName', '')
            done()
          }
        })
      })
    })

    it('should log for grpc', () => {
      const context = createMock<ExecutionContext>({
        getHandler: () => ({ name: 'getUserById' }),
        getType: () => 'rpc',
        switchToRpc: () => ({
          getContext: () => ({
            get: () => ['User']
          }),
          getData: () => ({ id: generateId() })
        })
      })

      const logInfoSpy = jest.spyOn(Logger, 'logInfo')
      const logErrorSpy = jest.spyOn(Logger, 'logError')

      return new Promise<void>(done => {
        interceptor.intercept(context, nextError).subscribe({
          error: () => {
            expect(logInfoSpy).toHaveBeenCalled()
            expect(logInfoSpy.mock.calls[0][0]).toHaveProperty('serviceName', 'User')

            expect(logErrorSpy).toHaveBeenCalled()
            expect(logErrorSpy.mock.calls[0][0]).toHaveProperty('serviceName', 'User')

            done()
          }
        })
      })
    })
  })
})

import { ExecutionContext } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { RpcException } from '@nestjs/microservices'
import { createMock } from '@golevelup/nestjs-testing'
import faker from 'faker'
import moment from 'moment'
import { BadRequestError } from '@common/errors'
import { generateSecret, generateSignature, newObjectId } from '@common/utils'
import { CreateAclUseCase, GetAclByServiceAndClientIdUseCase } from '@modules/acl/use-cases'
import { AclService } from '@modules/acl/services/acl.service'
import { createTestAcl } from '@modules/acl/fixtures'
import { AclStatus } from '@modules/acl/models'
import { AclGuard } from '../acl.guard'

const serviceName = faker.company.companyName()
const secret = generateSecret()

describe('AclGuard', () => {
  let guard: AclGuard
  let aclService: AclService

  const aclObject = createTestAcl({ service: serviceName, secret })
  const { client_id: clientId } = aclObject

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AclGuard,
        AclService,
        {
          provide: CreateAclUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(aclObject)
          }
        },
        {
          provide: GetAclByServiceAndClientIdUseCase,
          useValue: {
            execute: jest
              .fn()
              .mockImplementation(({ service }: any) =>
                service === aclObject.service ? aclObject : null
              )
          }
        }
      ]
    }).compile()

    guard = await module.get(AclGuard)
    aclService = await module.get(AclService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })

  describe('acl for http', () => {
    it('should throw bad request error if metadata is missing', async () => {
      const context = createMock<ExecutionContext>({
        getType: () => 'http',
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
            body: {}
          })
        })
      })
      await expect(guard.canActivate(context)).rejects.toThrowError(
        new BadRequestError({ message: 'Metadata is not sufficient!' })
      )
    })

    it('should work correctly for valid metadata', async () => {
      const now = Date.now().toString()
      const context = createMock<ExecutionContext>({
        getType: () => 'http',
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-fireflies-service': serviceName,
              'x-fireflies-signature': generateSignature(clientId, secret, now, {}),
              'x-fireflies-request-timestamp': now
            },
            body: {}
          })
        })
      })
      await expect(guard.canActivate(context)).resolves.toBeTruthy()
    })

    it('should throw error if message appears to have been sent more than 5 mins ago', async () => {
      const past = moment().subtract(6, 'minutes').toDate().getMilliseconds().toString()
      const context = createMock<ExecutionContext>({
        getType: () => 'http',
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-fireflies-service': serviceName,
              'x-fireflies-signature': generateSignature(clientId, secret, past, {}),
              'x-fireflies-request-timestamp': past
            },
            body: {}
          })
        })
      })
      await expect(guard.canActivate(context)).rejects.toThrowError(
        new BadRequestError({ message: 'Message appears to have been sent more than 5 mins ago' })
      )
    })

    it('should throw error passed signature is invalid', async () => {
      const now = Date.now().toString()
      const context = createMock<ExecutionContext>({
        getType: () => 'http',
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-fireflies-service': serviceName,
              'x-fireflies-signature': generateSignature(
                clientId,
                secret,
                'some-other-signature',
                {}
              ),
              'x-fireflies-request-timestamp': now
            },
            body: {}
          })
        })
      })
      await expect(guard.canActivate(context)).rejects.toThrowError(
        new BadRequestError({ message: 'Signature verification failed!' })
      )
    })

    it('should throw error if passed service has no access', async () => {
      const now = Date.now().toString()
      const context = createMock<ExecutionContext>({
        getType: () => 'http',
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-fireflies-service': 'unknown-service',
              'x-fireflies-signature': generateSignature(clientId, secret, now, {}),
              'x-fireflies-request-timestamp': now
            },
            body: {}
          })
        })
      })
      await expect(guard.canActivate(context)).rejects.toThrowError(
        new BadRequestError({ message: 'Invalid service access' })
      )
    })

    it('should throw error client id passed is revoked', async () => {
      const now = Date.now().toString()
      jest
        .spyOn(aclService, 'getAclByServiceAndClientId')
        .mockResolvedValueOnce({ ...aclObject, status: AclStatus.REVOKED })
      const context = createMock<ExecutionContext>({
        getType: () => 'http',
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-fireflies-service': serviceName,
              'x-fireflies-signature': generateSignature(clientId, secret, now, {}),
              'x-fireflies-request-timestamp': now
            },
            body: {}
          })
        })
      })
      await expect(guard.canActivate(context)).rejects.toThrowError(
        new BadRequestError({ message: 'Client has been revoked!' })
      )
    })
  })

  describe('acl for rpc', () => {
    const payload = { id: newObjectId() }
    it('should throw bad request error if metadata is missing', async () => {
      const context = createMock<ExecutionContext>({
        getType: () => 'rpc',
        switchToRpc: () => ({
          getContext: () => ({
            internalRepr: new Map()
          }),
          getData: () => payload
        })
      })
      await expect(guard.canActivate(context)).rejects.toThrowError(
        new RpcException({ message: 'Metadata is not sufficient!' })
      )
    })

    it('should work correctly if all metadata passed is valid', async () => {
      const now = Date.now().toString()
      const context = createMock<ExecutionContext>({
        getType: () => 'rpc',
        switchToRpc: () => ({
          getContext: () => ({
            internalRepr: new Map<string, string[]>([
              ['x-fireflies-service', [serviceName]],
              ['x-fireflies-signature', [generateSignature(clientId, secret, now, payload)]],
              ['x-fireflies-request-timestamp', [now]]
            ])
          }),
          getData: () => payload
        })
      })
      await expect(guard.canActivate(context)).resolves.toBeTruthy()
    })

    it('should throw error if message appears to have been sent more than 5 mins ago', async () => {
      const past = moment().subtract(6, 'minutes').toDate().getMilliseconds().toString()
      const context = createMock<ExecutionContext>({
        getType: () => 'rpc',
        switchToRpc: () => ({
          getContext: () => ({
            internalRepr: new Map<string, string[]>([
              ['x-fireflies-service', [serviceName]],
              ['x-fireflies-signature', [generateSignature(clientId, secret, past, payload)]],
              ['x-fireflies-request-timestamp', [past]]
            ])
          }),
          getData: () => payload
        })
      })
      await expect(guard.canActivate(context)).rejects.toThrowError(
        new BadRequestError({ message: 'Message appears to have been sent more than 5 mins ago' })
      )
    })

    it('should throw error for invalid signature', async () => {
      const now = Date.now().toString()
      const context = createMock<ExecutionContext>({
        getType: () => 'rpc',
        switchToRpc: () => ({
          getContext: () => ({
            internalRepr: new Map<string, string[]>([
              ['x-fireflies-service', [serviceName]],
              [
                'x-fireflies-signature',
                [generateSignature(clientId, secret, 'invalid-signature', payload)]
              ],
              ['x-fireflies-request-timestamp', [now]]
            ])
          }),
          getData: () => payload
        })
      })
      await expect(guard.canActivate(context)).rejects.toThrowError(
        new BadRequestError({ message: 'Signature verification failed!' })
      )
    })

    it('should throw error if requested service does not have access', async () => {
      const now = Date.now().toString()
      const context = createMock<ExecutionContext>({
        getType: () => 'rpc',
        switchToRpc: () => ({
          getContext: () => ({
            internalRepr: new Map<string, string[]>([
              ['x-fireflies-service', ['unauthorized-service']],
              ['x-fireflies-signature', [generateSignature(clientId, secret, now, payload)]],
              ['x-fireflies-request-timestamp', [now]]
            ])
          }),
          getData: () => payload
        })
      })
      await expect(guard.canActivate(context)).rejects.toThrowError(
        new BadRequestError({ message: 'Invalid service access' })
      )
    })

    it('should throw error if requested client is revoked', async () => {
      const now = Date.now().toString()
      jest
        .spyOn(aclService, 'getAclByServiceAndClientId')
        .mockResolvedValueOnce({ ...aclObject, status: AclStatus.REVOKED })
      const context = createMock<ExecutionContext>({
        getType: () => 'rpc',
        switchToRpc: () => ({
          getContext: () => ({
            internalRepr: new Map<string, string[]>([
              ['x-fireflies-service', [serviceName]],
              ['x-fireflies-signature', [generateSignature(clientId, secret, now, payload)]],
              ['x-fireflies-request-timestamp', [now]]
            ])
          }),
          getData: () => payload
        })
      })
      await expect(guard.canActivate(context)).rejects.toThrowError(
        new BadRequestError({ message: 'Client has been revoked!' })
      )
    })
  })
})

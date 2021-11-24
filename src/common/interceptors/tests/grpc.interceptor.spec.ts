import { RpcException } from '@nestjs/microservices'
import { of, throwError } from 'rxjs'
import { ObjectAlreadyExistsError } from '@common/errors'
import { GrpcInterceptor } from '../grpc.interceptor'

const res = { name: 'User 1', age: 4, id: 1 }

const next = {
  handle: () => of(res)
}

const nextError = {
  handle: () =>
    throwError(
      () => new RpcException(new ObjectAlreadyExistsError({ field: 'id', objectType: 'User' }))
    )
}

const nextUnknownError = {
  handle: () => throwError(() => new RpcException(new Error('Unknown error')))
}

describe('GrpcInterceptor', () => {
  let interceptor: GrpcInterceptor<typeof res>

  beforeEach(() => {
    interceptor = new GrpcInterceptor()
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  describe('return the data wrapped in data object', () => {
    it('should successfully return', () => {
      return new Promise<void>(done => {
        interceptor.intercept({} as any, next).subscribe({
          next: value => {
            expect(value).toEqual({ data: res })
          },
          complete: () => {
            done()
          }
        })
      })
    })

    it('should format error', () => {
      return new Promise<void>(done => {
        interceptor.intercept({} as any, nextError).subscribe({
          error: _err => {
            expect(_err.error.code).toEqual(2)
            expect(_err.message).toEqual('The User with its specified id already exists')
            done()
          },
          complete: () => {
            done()
          }
        })
      })
    })

    it('should format unknown error', () => {
      return new Promise<void>(done => {
        interceptor.intercept({} as any, nextUnknownError).subscribe({
          error: _err => {
            expect(_err.message).toEqual('Unknown error')
            done()
          },
          complete: () => {
            done()
          }
        })
      })
    })
  })
})

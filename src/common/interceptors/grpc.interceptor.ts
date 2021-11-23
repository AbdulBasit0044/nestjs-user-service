import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { DomainError } from '@common/errors'
import { BaseRpcResponse } from '@common/types'
import { httpToGrpcErrorCode } from '@common/utils'

interface Response<T> extends BaseRpcResponse {
  data?: T | null
}

@Injectable()
export class GrpcInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => (data.items ? data : { data })),
      catchError(error => {
        if (error instanceof DomainError) {
          return throwError(() => {
            return new RpcException({
              code: httpToGrpcErrorCode(error.status),
              message: error.message,
              details: error.metadata
            })
          })
        }
        // throw RPC~2 UNKNOWN error if error is not domain error
        return throwError(() => {
          return new RpcException({
            code: 2,
            message: error.message,
            details: error.metadata
          })
        })
      })
    )
  }
}

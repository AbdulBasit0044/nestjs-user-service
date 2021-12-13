import { HttpStatus } from '@nestjs/common'

export enum GrpcErrorCodes {
  OK = 0,
  CANCELLED = 1,
  UNKNOWN = 2,
  INVALID_ARGUMENT = 3,
  DEADLINE_EXCEEDED = 4,
  NOT_FOUND = 5,
  ALREADY_EXISTS = 6,
  PERMISSION_DENIED = 7,
  RESOURCE_EXHAUSTED = 8,
  FAILED_PRECONDITION = 9,
  ABORTED = 10,
  OUT_OF_RANGE = 11,
  UNIMPLEMENTED = 12,
  INTERNAL = 13,
  UNAVAILABLE = 14,
  DATA_LOSS = 15,
  UNAUTHENTICATED = 16
}

export function httpToGrpcErrorCode(httpErrorCode: number): number {
  let errorCode: number
  switch (httpErrorCode) {
    case HttpStatus.OK:
      errorCode = GrpcErrorCodes.OK
      break
    case HttpStatus.REQUEST_TIMEOUT:
      errorCode = GrpcErrorCodes.CANCELLED
      break
    case HttpStatus.INTERNAL_SERVER_ERROR:
      errorCode = GrpcErrorCodes.INTERNAL
      break
    case HttpStatus.BAD_REQUEST:
      errorCode = GrpcErrorCodes.INVALID_ARGUMENT
      break
    case HttpStatus.GATEWAY_TIMEOUT:
      errorCode = GrpcErrorCodes.DEADLINE_EXCEEDED
      break
    case HttpStatus.CONFLICT:
      errorCode = GrpcErrorCodes.ALREADY_EXISTS
      break
    case HttpStatus.FORBIDDEN:
      errorCode = GrpcErrorCodes.PERMISSION_DENIED
      break
    case HttpStatus.PRECONDITION_FAILED:
      errorCode = GrpcErrorCodes.FAILED_PRECONDITION
      break
    case HttpStatus.TOO_MANY_REQUESTS:
      errorCode = GrpcErrorCodes.RESOURCE_EXHAUSTED
      break
    case HttpStatus.PAYLOAD_TOO_LARGE:
      errorCode = GrpcErrorCodes.OUT_OF_RANGE
      break
    case HttpStatus.NOT_IMPLEMENTED:
      errorCode = GrpcErrorCodes.UNIMPLEMENTED
      break
    case HttpStatus.SERVICE_UNAVAILABLE:
      errorCode = GrpcErrorCodes.UNAVAILABLE
      break
    case HttpStatus.UNAUTHORIZED:
      errorCode = GrpcErrorCodes.UNAUTHENTICATED
      break
    default:
      errorCode = GrpcErrorCodes.UNKNOWN
      break
  }
  return errorCode
}

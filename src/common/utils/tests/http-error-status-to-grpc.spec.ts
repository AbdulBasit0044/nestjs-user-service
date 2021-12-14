import { HttpStatus } from '@nestjs/common'
import { httpToGrpcErrorCode, GrpcErrorCodes } from '../http-error-status-to-grpc.util'

describe('Http Error Status To Grpc TestSuite', () => {
  it('should return GRPC OK equivalent', () => {
    expect(httpToGrpcErrorCode(HttpStatus.OK)).toEqual(GrpcErrorCodes.OK)
  })
  it('should return GRPC RequestTimeout equivalent', () => {
    expect(httpToGrpcErrorCode(HttpStatus.REQUEST_TIMEOUT)).toEqual(GrpcErrorCodes.CANCELLED)
  })
  it('should return GRPC InternalServerError equivalent', () => {
    expect(httpToGrpcErrorCode(HttpStatus.INTERNAL_SERVER_ERROR)).toEqual(GrpcErrorCodes.INTERNAL)
  })
  it('should return GRPC BAD_REQUEST equivalent', () => {
    expect(httpToGrpcErrorCode(HttpStatus.BAD_REQUEST)).toEqual(GrpcErrorCodes.INVALID_ARGUMENT)
  })
  it('should return GRPC GATEWAY_TIMEOUT equivalent', () => {
    expect(httpToGrpcErrorCode(HttpStatus.GATEWAY_TIMEOUT)).toEqual(GrpcErrorCodes.DEADLINE_EXCEEDED)
  })
  it('should return GRPC CONFLICT equivalent', () => {
    expect(httpToGrpcErrorCode(HttpStatus.CONFLICT)).toEqual(GrpcErrorCodes.ALREADY_EXISTS)
  })
  it('should return GRPC FORBIDDEN equivalent', () => {
    expect(httpToGrpcErrorCode(HttpStatus.FORBIDDEN)).toEqual(GrpcErrorCodes.PERMISSION_DENIED)
  })
  it('should return GRPC PRECONDITION_FAILED equivalent', () => {
    const code = httpToGrpcErrorCode(HttpStatus.PRECONDITION_FAILED)
    expect(code).toEqual(GrpcErrorCodes.FAILED_PRECONDITION)
  })
  it('should return GRPC TOO_MANY_REQUESTS equivalent', () => {
    const code = httpToGrpcErrorCode(HttpStatus.TOO_MANY_REQUESTS)
    expect(code).toEqual(GrpcErrorCodes.RESOURCE_EXHAUSTED)
  })
  it('should return GRPC PAYLOAD_TOO_LARGE equivalent', () => {
    const code = httpToGrpcErrorCode(HttpStatus.PAYLOAD_TOO_LARGE)
    expect(code).toEqual(GrpcErrorCodes.OUT_OF_RANGE)
  })
  it('should return GRPC NOT_IMPLEMENTED equivalent', () => {
    const code = httpToGrpcErrorCode(HttpStatus.NOT_IMPLEMENTED)
    expect(code).toEqual(GrpcErrorCodes.UNIMPLEMENTED)
  })
  it('should return GRPC SERVICE_UNAVAILABLE equivalent', () => {
    const code = httpToGrpcErrorCode(HttpStatus.SERVICE_UNAVAILABLE)
    expect(code).toEqual(GrpcErrorCodes.UNAVAILABLE)
  })
  it('should return GRPC UNAUTHORIZED equivalent', () => {
    const code = httpToGrpcErrorCode(HttpStatus.UNAUTHORIZED)
    expect(code).toEqual(GrpcErrorCodes.UNAUTHENTICATED)
  })
  it('should return GRPC UNKNOWN Error when unknown http status code is provided', () => {
    expect(httpToGrpcErrorCode(1234)).toEqual(GrpcErrorCodes.UNKNOWN)
  })
})

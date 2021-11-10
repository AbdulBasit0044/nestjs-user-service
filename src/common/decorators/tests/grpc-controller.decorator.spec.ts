import { INTERCEPTORS_METADATA } from '@nestjs/common/constants'
import { GrpcInterceptor, LoggingInterceptor } from '@common/interceptors'
import { GrpcController } from '../grpc-controller.decorator'

describe('GrpcController', () => {
  @GrpcController()
  class TestWithMethod {}

  it('should be using the guard defined on the prototype method and with the user role', () => {
    const interceptorsMetadata = Reflect.getMetadata(INTERCEPTORS_METADATA, TestWithMethod)

    expect(interceptorsMetadata).toEqual([GrpcInterceptor, LoggingInterceptor])
  })
})

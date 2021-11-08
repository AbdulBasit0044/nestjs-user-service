import { applyDecorators, Controller, UseInterceptors, UsePipes } from '@nestjs/common'
import { GrpcInterceptor, LoggingInterceptor } from '@common/interceptors'
import { ValidationPipe } from '@common/pipes'

export function GrpcController(): ClassDecorator {
  return applyDecorators(
    Controller(),
    UseInterceptors(GrpcInterceptor, LoggingInterceptor),
    UsePipes(ValidationPipe)
  )
}

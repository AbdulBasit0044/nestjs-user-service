import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { NewRelicInterceptor } from '@common/interceptors'

export function UseNewRelic() {
  return applyDecorators(UseInterceptors(NewRelicInterceptor))
}

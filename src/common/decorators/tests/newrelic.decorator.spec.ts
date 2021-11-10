import { INTERCEPTORS_METADATA } from '@nestjs/common/constants'
import { NewRelicInterceptor } from '@common/interceptors'
import { UseNewRelic } from '..'

describe('UseNewRelic', () => {
  @UseNewRelic()
  class TestClass {}

  it('should be using the new relic interceptor', () => {
    const interceptorsMetadata = Reflect.getMetadata(INTERCEPTORS_METADATA, TestClass)
    expect(interceptorsMetadata).toEqual([NewRelicInterceptor])
  })
})

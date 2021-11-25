import { ExecutionContext } from '@nestjs/common'
import { createMock } from '@golevelup/nestjs-testing'
import { of } from 'rxjs'
import newrelic from 'newrelic'
import { NewRelicInterceptor } from '../newrelic.interceptor'

const next = {
  handle: () => of({})
}

const CLASS_NAME = 'FakeClass'
const HANDLER_NAME = 'fakeHandler'
const ROUTE = `${CLASS_NAME}/${HANDLER_NAME}`

describe('NewRelicInterceptor', () => {
  let interceptor: NewRelicInterceptor

  beforeEach(() => {
    interceptor = new NewRelicInterceptor()
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  describe('newrelic web transaction', () => {
    it('should start a web transaction', () => {
      const context = createMock<ExecutionContext>({
        getHandler: () => ({ name: HANDLER_NAME }),
        getClass: () => ({ name: CLASS_NAME })
      })

      const startWebTransactionSpy = jest.spyOn(newrelic, 'startWebTransaction')

      return new Promise<void>(done => {
        interceptor.intercept(context, next).subscribe({
          next: () => {
            const [[expectedTransactionRoute]] = startWebTransactionSpy.mock.calls

            expect(expectedTransactionRoute === ROUTE).toBeTruthy()
            expect(startWebTransactionSpy).toHaveBeenCalled()
            done()
          }
        })
      })
    })
  })
})

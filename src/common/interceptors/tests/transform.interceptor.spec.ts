import { of } from 'rxjs'
import { TransformInterceptor } from '../transform.interceptor'

const res = { name: 'User 1', age: 4, id: 1 }

const next = {
  handle: () => of(res)
}

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<typeof res>

  beforeEach(() => {
    interceptor = new TransformInterceptor()
  })
  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })
  describe('should return the data wrapped in data object', () => {
    it('should successfully return', () => {
      return new Promise<void>(done => {
        interceptor.intercept({} as any, next).subscribe({
          next: value => {
            expect(value).toEqual({ data: res })
          },
          error: error => {
            throw error
          },
          complete: () => {
            done()
          }
        })
      })
    })
  })
})

import * as NestMongoose from '@nestjs/mongoose'
import { CustomSchema, transformToJson } from '../custom-schema.decorator'

const obj = {
  _id: '123',
  name: 'test',
  __v: 0
}

describe('CustomSchema', () => {
  it('should test toJSON', () => {
    const schemaSpy = jest.spyOn(NestMongoose, 'Schema')
    @CustomSchema()
    class Test {}
    expect(Test).toBeDefined()
    const transform = schemaSpy.mock.calls?.[0]?.[0]?.toJSON?.transform as Function
    expect(schemaSpy).toHaveBeenCalled()
    transform(undefined, obj, undefined)
  })
  it('should be able to use new properties if set', () => {
    const schemaSpy = jest.spyOn(NestMongoose, 'Schema')
    @CustomSchema({ toJSON: { transform: transformToJson } })
    class Test {}
    expect(Test).toBeDefined()
    expect(schemaSpy).toHaveBeenCalled()
    const transform = schemaSpy.mock.calls?.[0]?.[0]?.toJSON?.transform as Function
    transform(undefined, obj, undefined)
  })
})

describe('transformToJson', () => {
  it('should prepare the object', () => {
    const result = transformToJson(obj)
    expect(result).toEqual({
      id: '123',
      name: 'test'
    })
  })
})

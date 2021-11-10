import { validate } from 'class-validator'
import { getTimeZone } from '@common/utils'
import { UpdateUserDto } from '@modules/users/dto/update-user.dto'

describe('timeZoneValidator test suite', () => {
  it('should return false when invalid timezone is provided', () => {
    const dto = new UpdateUserDto()
    dto.timezone = 'abc'
    return validate(dto).then(errors => {
      expect(errors.length).toBeTruthy()
    })
  })
  it('should success timezone is provided', () => {
    const dto = new UpdateUserDto()
    dto.timezone = getTimeZone()
    return validate(dto).then(errors => {
      expect(errors.length).toBeFalsy()
    })
  })
})

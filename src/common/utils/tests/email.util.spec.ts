import { matchesGenericEmail } from '../email.util'

describe('emailUtilTestSuite', () => {
  it('should return false when invalid email is provide', () => {
    expect(matchesGenericEmail('abc')).toBeFalsy()
  })

  it('should return true if generic domain email is provided', () => {
    expect(matchesGenericEmail('someone@gmail.com')).toBeTruthy()
  })

  it('should return true if educational domain email is provided', () => {
    expect(matchesGenericEmail('someone@edu.com')).toBeTruthy()
  })

  it('should return false if invalid domain email is provided', () => {
    expect(matchesGenericEmail('someone@fakersss.com')).toBeFalsy()
  })
})

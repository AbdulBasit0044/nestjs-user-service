import { generateId } from '@common/utils'
import { createTestUser } from '@modules/users/fixtures'
import { logInfo, logWarn, logError } from '../default.logger'

const user = createTestUser()
const ACTION_MOCK = 'getUserById'
const SERVICE_MOCK = 'UserService'
const requestId = generateId()

describe('Logger', () => {
  it('should log an error message with an json', () => {
    const log = jest.fn(logError)
    log({ requestId, serviceName: SERVICE_MOCK, action: ACTION_MOCK, document: user })
    expect(log).toBeCalledTimes(1)
  })

  it('should log an info message with an json', () => {
    const log = jest.fn(logInfo)
    log({ requestId, serviceName: SERVICE_MOCK, action: ACTION_MOCK, document: user })
    expect(log).toBeCalledTimes(1)
  })

  it('should log an warn message with an json', () => {
    const log = jest.fn(logWarn)
    log({ requestId, serviceName: SERVICE_MOCK, action: ACTION_MOCK, document: user })
    expect(log).toBeCalledTimes(1)
  })
})

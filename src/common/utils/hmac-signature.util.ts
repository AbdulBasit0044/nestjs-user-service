import { randomBytes, createHmac } from 'crypto'
import { DIGEST_TYPE, HMAC_TYPE, HMAC_VERSION } from '@common/constants'

export const generateSignature = (clientId: string, secret: string, timestamp: string, body) => {
  const hmac = createHmac(HMAC_TYPE, secret)
  hmac.update(`${HMAC_VERSION}:${timestamp}:${JSON.stringify(body)}`)
  return `c${clientId}=${hmac.digest(DIGEST_TYPE)}`
}

export const generateSecret = () => randomBytes(16).toString('hex')

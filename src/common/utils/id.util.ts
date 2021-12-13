import { randomUUID, randomBytes } from 'crypto'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function generateId(): string {
  return randomUUID()
}

export function newObjectId(): string {
  return randomString()
}

function randomString(size = 10): string {
  if (size === 0) {
    throw new Error('Zero-length randomString is useless.')
  }
  let objectId = ''
  const bytes = randomBytes(size)
  for (let i = 0; i < bytes.length; ++i) {
    objectId += alphabet[bytes.readUInt8(i) % alphabet.length]
  }
  return objectId
}

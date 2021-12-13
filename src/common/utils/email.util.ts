import { isEmail } from 'class-validator'
import { emailDomains } from '@common/constants'

const educationalDomains = ['edu', 'university', 'academy', 'mba', 'school', 'courses', 'education']

export const matchesGenericEmail = (email: string) => {
  if (!isEmail(email)) return false
  const domain = email.split('@')[1].toLowerCase()
  const parts = domain.split('.')
  return parts.some(part => educationalDomains.includes(part)) || emailDomains.includes(domain)
}

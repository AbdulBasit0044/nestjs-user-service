export const toTimestamp = (value: string | number): number => {
  return typeof value === 'string'
    ? new Date(value).getTime()
    : isTimestamp(value)
    ? value
    : timestampFromRemainingSeconds(value)
}

export const isExpiredByTimestamp = (value: number | undefined): boolean => {
  return !value || new Date(value) <= new Date()
}

export const getTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

const isTimestamp = (value: string | number): boolean => {
  return !value ? false : new Date(value).getFullYear() > 1970
}
const timestampFromRemainingSeconds = (value: number): number => {
  return new Date(new Date().setSeconds(value)).getTime()
}

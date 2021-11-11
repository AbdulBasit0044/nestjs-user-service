import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'
import moment from 'moment-timezone'

export function IsTimeZoneValid(property?: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsTimeZoneValid',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return !!moment.tz.zone(value)
        }
      }
    })
  }
}

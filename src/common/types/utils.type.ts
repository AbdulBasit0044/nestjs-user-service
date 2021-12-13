export type Obj = { [key: string]: any }

export type RemoveNeverProperties<T> = Omit<
  T,
  {
    [K in keyof T]: T[K] extends never ? K : never
  }[keyof T]
>

export type RequiredNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>
}

export type $Values<T extends Obj> = T[keyof T]

export type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>

export type PrimitiveKeys<T> = keyof PickByValue<T, string>

import { Obj } from './utils.type'

export interface IUseCase<T extends Obj = any, TRes = any> {
  execute(params: T): Promise<TRes> | TRes
}

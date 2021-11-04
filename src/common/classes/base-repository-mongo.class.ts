/* istanbul ignore file */
import { Injectable, mixin, Type } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Entity } from './entity.class'
import { BaseRepository } from './base-repository.class'

export interface IBaseRepositoryMongo<
  T extends Entity,
  U = Omit<T, '_id' | 'createdAt' | 'updatedAt' | 'id'>
> extends BaseRepository<T> {
  model: Model<T>
  getById(id: string): Promise<T | null>
  update(id: string, item: Partial<T>): Promise<T>
  deleteById(id: string): Promise<boolean>
  exists(filter: Partial<T>): Promise<boolean>
  existsIds(ids: string[]): Promise<boolean>
  create(input: U): Promise<T>
}

export function BaseRepositoryMongo<
  T extends Entity,
  U = Omit<T, '_id' | 'createdAt' | 'updatedAt' | 'id'>
>(schema: Type<T>): Type<IBaseRepositoryMongo<T, U>> {
  @Injectable()
  class BaseRepositoryMongoClass extends BaseRepository<T> implements IBaseRepositoryMongo<T, U> {
    constructor(@InjectModel(schema.name) readonly model: Model<T>) {
      super()
    }

    create(input: U): Promise<T> {
      return this.model.create(input)
    }

    getById(id: string): Promise<T | null> {
      // @ts-ignore
      return this.model.findById(id)
    }

    update(id: string, item: T): Promise<T> {
      // @ts-ignore
      return this.model.findByIdAndUpdate(id, item, { new: true })
    }

    async deleteById(id: string): Promise<boolean> {
      // @ts-ignore
      return (await this.model.deleteOne({ _id: id })).deletedCount === 1
    }

    exists(filter: Partial<T>): Promise<boolean> {
      return this.model.exists(filter)
    }

    existsById(id: string): Promise<boolean> {
      // @ts-ignore
      return this.exists({ _id: id })
    }

    async existsIds(ids: string[]): Promise<boolean> {
      // @ts-ignore
      const count = await this.model.countDocuments({ _id: { $in: ids } })
      return count === ids.length
    }
  }
  return mixin(BaseRepositoryMongoClass)
}

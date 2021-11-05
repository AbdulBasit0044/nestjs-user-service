import { PaginatedList } from '@common/models'
import { OrderEnum, PaginationParams, QueryOptionsParams, SortParams } from '@common/types'

interface CreatePaginatedListPayload<T> {
  page: number
  pageSize: number
  /**
   * total of items in the query
   */
  count: number
  data: T[]
}

export abstract class BaseRepository<T> {
  protected defaultPage = 1

  protected defaultPageSize = 10

  protected getPage(page?: number): number {
    return page ? (page < 1 ? this.defaultPage : page) : this.defaultPage
  }

  protected getPageSize(pageSize?: number): number {
    return pageSize ? (pageSize < 1 ? this.defaultPageSize : pageSize) : this.defaultPageSize
  }

  protected createPaginationPayload({
    data,
    page: _page,
    pageSize: _pageSize,
    count
  }: CreatePaginatedListPayload<T>): PaginatedList<T> {
    const pageSize = this.getPageSize(_pageSize)
    const page = this.getPage(_page)
    const pageCount = Math.ceil(count / pageSize)
    return {
      count,
      items: data,
      pageInfo: {
        currentPage: page,
        hasNextPage: page < pageCount,
        hasPreviousPage: count > pageSize && ((pageCount > 1 && page > 1) || page === pageCount + 1),
        itemCount: count,
        perPage: pageSize,
        pageCount
      }
    }
  }

  protected getPaginationOffset({ page, pageSize }: PaginationParams): number {
    return !page ? 0 : (page - 1) * pageSize
  }

  protected getSortOptions({ sort, order }: SortParams) {
    return !sort ? {} : { [sort]: order === OrderEnum.DESC ? -1 : 1 }
  }

  protected getSelectable(select: string[] | undefined): any {
    const selectable = {}
    if (select) {
      select.forEach(e => {
        selectable[e] = 1
      })
    }
    return selectable
  }

  protected getQueryOptions({ page, pageSize, sort, order }: QueryOptionsParams) {
    page = this.getPage(page)
    pageSize = this.getPageSize(pageSize)
    const sortOptions = this.getSortOptions({ sort, order })
    return {
      skip: this.getPaginationOffset({ page, pageSize }),
      limit: pageSize,
      sort: sortOptions
    }
  }
}

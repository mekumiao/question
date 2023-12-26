export interface Paging {
  offset?: number
  limit?: number
}

export interface PagingResult<T extends object> {
  offset: number
  limit: number
  total: number
  items: T[]
}

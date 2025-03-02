export interface NotificationSocket {
  status: string
  data: {
    senderId: number
    content: string
    time: string
    notificationType: string
    status: string
  }
}

export interface NotificationResponse {
  id: number
  senderId: number
  receiverId: number
  content: string
  time: string
  notificationType: string
  status: 'READ' | 'UNREAD'
}

export interface NotificationPageResponse {
  content: NotificationResponse[]
  pageable: {
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    pageNumber: number
    pageSize: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalElements: number
  totalPages: number
  first: boolean
  numberOfElements: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  empty: boolean
}

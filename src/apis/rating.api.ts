import http from '@/utils/http'

export const exportRatings = (fromDate: string, toDate: string) =>
  http.get('/admin/ratings/export', {
    params: { fromDate, toDate },
    responseType: 'blob'
  }) 
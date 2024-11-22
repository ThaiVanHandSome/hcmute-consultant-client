import { User } from '@/types/user.type'
import http from '@/utils/http'

export const exportData = async (params: any) => {
  try {
    const user: User = localStorage.getItem('user') as unknown as User
    const response = await http.post<Blob>('export', null, {
      params,
      responseType: 'blob'
    })

    const contentDisposition = response.headers['content-disposition']
    let fileName = 'exported_file'
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
      if (fileNameMatch?.[1]) {
        fileName = decodeURIComponent(fileNameMatch[1])
      }
    } else {
      const exportType = params.exportType === 'pdf' ? 'pdf' : 'csv'
      const currentDate = new Date()
      const formattedDate = currentDate
        .toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
        .replace(/[/,:]/g, '_')

      fileName = `${params.dataType}_(${formattedDate})_${user.lastName + '_' + user.firstName}.${exportType}`
    }

    const blob = new Blob([response.data], { type: response.headers['content-type'] })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Export failed', error)
  }
}

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import useRatingQueryConfig from '@/hooks/useRatingQueryConfig.tsx'
import { Download } from 'lucide-react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { exportRatings } from '@/apis/rating.api'

interface FormData {
  fromDate: string
  toDate: string
}

export default function ManageRating() {
  const [error, setError] = useState<string>('')
  const ratingQueryConfig = useRatingQueryConfig()

  const form = useForm<FormData>({
    defaultValues: {
      fromDate: '',
      toDate: ''
    }
  })

  const navigate = useNavigate()
  const onSubmit = form.handleSubmit((values) => {
    if (!values.fromDate || !values.toDate) {
      setError('Vui lòng chọn đầy đủ từ ngày và đến ngày')
      return
    }
    setError('')
    navigate({
      pathname: path.manageRating,
      search: createSearchParams({
        ...ratingQueryConfig,
        fromDate: values.fromDate,
        toDate: values.toDate
      }).toString()
    })
  })

  const handleExport = async () => {
    const values = form.getValues()
    if (!values.fromDate || !values.toDate) {
      setError('Vui lòng chọn đầy đủ từ ngày và đến ngày')
      return
    }
    setError('')

    try {
      const response = await exportRatings(values.fromDate, values.toDate)
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bao-cao-danh-gia-${format(new Date(), 'yyyy-MM-dd')}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error(error)
      setError('Không thể xuất báo cáo')
    }
  }

  return (
    <div className='space-y-6'>
      {error && (
        <div className='text-red-500 font-medium text-sm'>{error}</div>
      )}

      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Báo cáo đánh giá tư vấn viên</h1>
          <p className='text-sm italic'>
            Thời gian xuất báo cáo: {format(new Date(), 'dd/MM/yyyy')}
          </p>
        </div>
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3 space-y-2'>
                <label className='text-sm font-medium'>Từ ngày</label>
                <input
                  type="date"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={form.watch('fromDate')}
                  onChange={(e) => {
                    form.setValue('fromDate', e.target.value)
                    setError('')
                  }}
                />
              </div>
              <div className='col-span-3 space-y-2'>
                <label className='text-sm font-medium'>Đến ngày</label>
                <input
                  type="date"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={form.watch('toDate')}
                  onChange={(e) => {
                    form.setValue('toDate', e.target.value)
                    setError('')
                  }}
                />
              </div>
              <div className='col-span-2 flex items-end'>
                <Button 
                  onClick={handleExport} 
                  type='button' 
                  variant='outline'
                  className='gap-2'
                >
                  <Download className='h-4 w-4' />
                  Xuất báo cáo
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 
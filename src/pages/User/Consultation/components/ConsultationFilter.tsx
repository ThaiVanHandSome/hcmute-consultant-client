import DatePicker from '@/components/dev/DatePicker'
import path from '@/constants/path'
import { ConsultationQueryConfig } from '@/hooks/useConsultationQueryConfig'
import { parseDate } from '@/utils/utils'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

interface Props {
  readonly queryConfig: ConsultationQueryConfig
}

export default function ConsultationFilter({ queryConfig }: Props) {
  const navigate = useNavigate()

  const defaultStartDate = parseDate(queryConfig.startDate)
  const defaultEndDate = parseDate(queryConfig.endDate)
  const [startDate, setStartDate] = useState<Date | undefined>(defaultStartDate as Date)
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    if (defaultEndDate) return defaultEndDate
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })

  // when form values change, navigate to get new data with new params
  useEffect(() => {
    navigate({
      pathname: path.consultation,
      search: createSearchParams({
        ...queryConfig,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : ''
      }).toString()
    })
  }, [startDate, endDate])

  return (
    <div className='grid grid-cols-2 gap-2 mb-4'>
      <div className='col-span-2 lg:col-span-1'>
        <DatePicker label='Ngày bắt đầu' date={startDate} setDate={setStartDate} placeholder='Chọn ngày bắt đầu' />
      </div>
      <div className='col-span-2 lg:col-span-1'>
        <DatePicker label='Ngày kết thúc' date={endDate} setDate={setEndDate} placeholder='Chọn ngày kết thúc' />
      </div>
    </div>
  )
}

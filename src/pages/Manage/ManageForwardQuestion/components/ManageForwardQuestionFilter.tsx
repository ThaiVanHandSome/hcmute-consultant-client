import DatePicker from '@/components/dev/DatePicker'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import { ForwardQuestionQueryConfig } from '@/hooks/useForwardQuestionQueryConfig'
import { parseDate } from '@/utils/utils'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

interface Props {
  readonly queryConfig: ForwardQuestionQueryConfig
}

export default function ManageForwardQuestionFilter({ queryConfig }: Props) {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      title: queryConfig.title
    }
  })

  const defaultStartDate = parseDate(queryConfig.startDate)
  const defaultEndDate = parseDate(queryConfig.endDate)
  const [startDate, setStartDate] = useState<Date | undefined>(defaultStartDate as Date)
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    if (defaultEndDate) return defaultEndDate
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })

  // handle find forward questions with title
  const onSubmit = form.handleSubmit((values) => {
    const title = values.title
    if (title) {
      navigate({
        pathname: path.manageForwardQuestion,
        search: createSearchParams({
          ...queryConfig,
          title
        }).toString()
      })
    }
  })

  // when form values change, navigate to get new data with new params
  useEffect(() => {
    navigate({
      pathname: path.manageForwardQuestion,
      search: createSearchParams({
        ...queryConfig,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : ''
      }).toString()
    })
  }, [startDate, endDate])

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className='grid grid-cols-4 gap-2 mb-4'>
          <div className='col-span-1'>
            <DatePicker label='Ngày bắt đầu' date={startDate} setDate={setStartDate} placeholder='Chọn ngày bắt đầu' />
          </div>
          <div className='col-span-1'>
            <DatePicker label='Ngày kết thúc' date={endDate} setDate={setEndDate} placeholder='Chọn ngày kết thúc' />
          </div>
        </div>
        <div className='grid grid-cols-5 gap-2 mb-4'>
          <div className='col-span-4'>
            <InputCustom className='mb-0' control={form.control} name='title' placeholder='Nhập tiêu đề để tìm kiếm' />
          </div>
          <div className='col-span-1 flex items-center'>
            <Button className='w-full'>Tìm kiếm</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

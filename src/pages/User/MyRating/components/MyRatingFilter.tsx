import { getAllDepartments } from '@/apis/department.api'
import DatePicker from '@/components/dev/DatePicker'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import { RatingQueryConfig } from '@/hooks/useRatingQueryConfig'
import { FormControlItem } from '@/types/utils.type'
import { generateSelectionData, parseDate } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

interface Props {
  readonly queryConfig: RatingQueryConfig
}

export default function MyRatingFilter({ queryConfig }: Props) {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      departmentId: queryConfig.departmentId,
      consultantName: queryConfig.consultantName
    }
  })

  const departmentId = form.watch('departmentId')

  const defaultStartDate = parseDate(queryConfig.startDate)
  const defaultEndDate = parseDate(queryConfig.endDate)
  const [startDate, setStartDate] = useState<Date | undefined>(defaultStartDate as Date)
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    if (defaultEndDate) return defaultEndDate
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  // generate selection data
  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  // handle find rating with consultant name
  const onSubmit = form.handleSubmit((values) => {
    const consultantName = values.consultantName
    if (consultantName) {
      navigate({
        pathname: path.myRating,
        search: createSearchParams({
          ...queryConfig,
          consultantName
        }).toString()
      })
    }
  })

  // when form values change, navigate to get new data with new params
  useEffect(() => {
    navigate({
      pathname: path.myRating,
      search: createSearchParams({
        ...queryConfig,
        departmentId: departmentId || '',
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : ''
      }).toString()
    })
  }, [departmentId, startDate, endDate])

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className='grid grid-cols-3 gap-2 mb-4'>
          <div className='col-span-1'>
            <SelectionCustom
              control={form.control}
              name='departmentId'
              placeholder='Đơn vị'
              defaultValue={queryConfig.departmentId}
              data={departmentsSelectionData}
            />
          </div>
          <div className='col-span-1'>
            <DatePicker date={startDate} setDate={setStartDate} placeholder='Chọn ngày bắt đầu' />
          </div>
          <div className='col-span-1'>
            <DatePicker date={endDate} setDate={setEndDate} placeholder='Chọn ngày kết thúc' />
          </div>
        </div>
        <div className='grid grid-cols-5 gap-4'>
          <div className='col-span-4'>
            <InputCustom
              className='mb-0'
              control={form.control}
              name='consultantName'
              placeholder='Nhập tư vấn viên để tìm kiếm'
            />
          </div>
          <div className='col-span-1 flex items-center'>
            <Button className='w-full'>Tìm kiếm</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

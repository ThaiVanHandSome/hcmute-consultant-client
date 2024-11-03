import { getAllDepartments } from '@/apis/department.api'
import { getAllQuestionStatus } from '@/apis/question.api'
import DatePicker from '@/components/dev/DatePicker'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ROLE } from '@/constants/role'
import { AppContext } from '@/contexts/app.context'
import { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { QuestionStatus } from '@/types/question.type'
import { Role } from '@/types/user.type'
import { FormControlItem } from '@/types/utils.type'
import { generateSelectionData, parseDate } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { format } from 'date-fns'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

interface Props {
  readonly queryConfig: QuestionQueryConfig
  readonly path: string
}

export default function QuestionFilter({ queryConfig, path }: Props) {
  const { role } = useContext(AppContext)
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      departmentId: queryConfig.departmentId,
      status: queryConfig.status,
      title: queryConfig.title
    }
  })

  const departmentId = form.watch('departmentId')
  const status = form.watch('status')

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

  const { data: questionsStatus } = useQuery({
    queryKey: ['questionsStatus'],
    queryFn: getAllQuestionStatus
  })

  // generate selection data
  const questionsStatusSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = questionsStatus?.data.data
    return data?.map((item: QuestionStatus) => {
      return {
        value: String(item.key),
        label: item.displayName
      }
    })
  }, [questionsStatus])

  // handle find questions with title
  const onSubmit = form.handleSubmit((values) => {
    const title = values.title
    if (title) {
      navigate({
        pathname: path,
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
      pathname: path,
      search: createSearchParams({
        ...queryConfig,
        departmentId: departmentId || '',
        status: status || '',
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : ''
      }).toString()
    })
  }, [departmentId, status, startDate, endDate])

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div
          className={clsx('grid gap-2 mb-4', {
            'grid-cols-4': role === ROLE.user,
            'grid-cols-3': [ROLE.admin, ROLE.advisor, ROLE.consultant].includes(role as Role)
          })}
        >
          {role === ROLE.user && (
            <div className='col-span-1'>
              <SelectionCustom
                control={form.control}
                name='departmentId'
                placeholder='Đơn vị'
                defaultValue={queryConfig.departmentId}
                data={departmentsSelectionData}
              />
            </div>
          )}
          <div className='col-span-1'>
            <SelectionCustom
              control={form.control}
              name='status'
              placeholder='Trạng thái'
              defaultValue={queryConfig.status}
              data={questionsStatusSelectionData}
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

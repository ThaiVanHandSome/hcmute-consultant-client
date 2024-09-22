import { getAllDepartments } from '@/apis/department.api'
import { getAllQuestionStatus } from '@/apis/question.api'
import { getAllQuestionsOfUser } from '@/apis/user.api'
import DatePicker from '@/components/dev/DatePicker'
import InputCustom from '@/components/dev/Form/InputCustom'
import PaginationCustom from '@/components/dev/PaginationCustom'
import Question from '@/components/dev/Question'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useQuestionQueryConfig, { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { QuestionStatus } from '@/types/question.type'
import { FormControlItem } from '@/types/utils.type'
import { generateSelectionData, parseDate } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function MyQuestion() {
  const navigate = useNavigate()
  const queryConfig: QuestionQueryConfig = useQuestionQueryConfig()
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

  const { data: questionsOfUser } = useQuery({
    queryKey: ['questionsOfUser', queryConfig],
    queryFn: () => getAllQuestionsOfUser(queryConfig)
  })

  // handle find questions with title
  const onSubmit = form.handleSubmit((values) => {
    const title = values.title
    if (title) {
      navigate({
        pathname: path.myQuestions,
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
      pathname: path.myQuestions,
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
    <div>
      <h1 className='text-primary font-bold capitalize mb-4'>Câu hỏi của bản thân</h1>
      <div>
        <div className='mb-6'>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className='grid grid-cols-4 gap-2 mb-4'>
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
                  <InputCustom
                    className='mb-0'
                    control={form.control}
                    name='title'
                    placeholder='Nhập tiêu đề để tìm kiếm'
                  />
                </div>
                <div className='col-span-1 flex items-center'>
                  <Button className='w-full'>Tìm kiếm</Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
        <Separator className='my-8' />
        <div>
          {questionsOfUser?.data.data.content.map((question) => (
            <Question type='user' key={question.title + question.createdAt} question={question} />
          ))}
        </div>
        <div className='flex items-center justify-center'>
          <PaginationCustom
            path={path.myQuestions}
            queryConfig={queryConfig}
            pageSize={questionsOfUser?.data.data.totalPages as number}
          />
        </div>
      </div>
    </div>
  )
}

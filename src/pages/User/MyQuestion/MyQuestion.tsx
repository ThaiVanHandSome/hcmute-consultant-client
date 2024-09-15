import { getAllDepartments } from '@/apis/department.api'
import { getAllQuestionStatus } from '@/apis/question.api'
import { getAllQuestionsOfUser } from '@/apis/user.api'
import DatePickerWithRange from '@/components/dev/DatePickerWithRange/DatePickerWithRange'
import InputCustom from '@/components/dev/InputCustom'
import PaginationCustom from '@/components/dev/PaginationCustom'
import Question from '@/components/dev/Question'
import SelectionCustom from '@/components/dev/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useQueryConfig, { QueryConfig } from '@/hooks/useQueryConfig'
import { QuestionStatus } from '@/types/question.type'
import { FormControlItem } from '@/types/utils.type'
import { generateSelectionData } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import { addDays } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function MyQuestion() {
  const navigate = useNavigate()
  const queryConfig: QueryConfig = useQueryConfig()
  const form = useForm({
    defaultValues: {
      departmentId: '',
      status: '',
      title: ''
    }
  })

  const departmentId = form.watch('departmentId')
  const status = form.watch('status')

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20)
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })
  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  const { data: questionsStatus } = useQuery({
    queryKey: ['questionsStatus'],
    queryFn: getAllQuestionStatus
  })
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

  const onSubmit = form.handleSubmit((values) => {
    console.log(values)
  })

  useEffect(() => {
    if (!departmentId) return
    navigate({
      pathname: path.myQuestions,
      search: createSearchParams({
        departmentId
      }).toString()
    })
  }, [departmentId])

  return (
    <div>
      <h1 className='text-primary font-bold capitalize mb-4'>Câu hỏi của bản thân</h1>
      <div>
        <div className='mb-6'>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className='grid grid-cols-3 gap-2 mb-4'>
                <div className='col-span-1'>
                  <SelectionCustom
                    control={form.control}
                    name='departmentId'
                    placeholder='Đơn vị'
                    data={departmentsSelectionData}
                  />
                </div>
                <div className='col-span-1'>
                  <SelectionCustom
                    control={form.control}
                    name='status'
                    placeholder='Trạng thái'
                    data={questionsStatusSelectionData}
                  />
                </div>
                <div className='col-span-1'>
                  <DatePickerWithRange date={date} setDate={setDate} />
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

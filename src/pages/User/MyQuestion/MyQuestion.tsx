import { getAllDepartments } from '@/apis/department.api'
import { getAllQuestionStatus } from '@/apis/question.api'
import { getAllQuestionsOfUser } from '@/apis/user.api'
import DatePickerWithRange from '@/components/dev/DatePickerWithRange/DatePickerWithRange'
import Question from '@/components/dev/Question'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useQueryConfig, { QueryConfig } from '@/hooks/useQueryConfig'
import { useQuery } from '@tanstack/react-query'
import { addDays } from 'date-fns'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'

export default function MyQuestion() {
  const queryConfig: QueryConfig = useQueryConfig()
  const form = useForm({
    defaultValues: {
      departmentId: '',
      status: '',
      title: ''
    }
  })

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20)
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  const { data: questionsStatus } = useQuery({
    queryKey: ['questionsStatus'],
    queryFn: getAllQuestionStatus
  })

  const { data: questionsOfUser } = useQuery({
    queryKey: ['questionsOfUser', queryConfig],
    queryFn: () => getAllQuestionsOfUser(queryConfig)
  })

  const onSubmit = form.handleSubmit((values) => {
    console.log(values)
  })

  return (
    <div>
      <h1 className='text-primary font-bold capitalize mb-2'>CÂU HỎI CỦA BẢN THÂN</h1>
      <div>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className='grid grid-cols-3 gap-2 mb-4'>
                <div className='col-span-1'>
                  <FormField
                    control={form.control}
                    name='departmentId'
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Đơn vị' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments?.data.data.map((department) => (
                              <SelectItem key={department.id} value={String(department.id)}>
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-1'>
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Trạng thái' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {questionsStatus?.data.data.map((questionStatus) => (
                              <SelectItem key={questionStatus.key} value={String(questionStatus.key)}>
                                {questionStatus.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-1'>
                  <DatePickerWithRange date={date} setDate={setDate} />
                </div>
              </div>
              <div className='grid grid-cols-5 gap-4'>
                <div className='col-span-4'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder='Tìm kiếm' {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-1 '>
                  <Button className='w-full'>Tìm kiếm</Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
        <div>
          {questionsOfUser?.data.data.content.map((question) => <Question key={question.title} question={question} />)}
        </div>
      </div>
    </div>
  )
}

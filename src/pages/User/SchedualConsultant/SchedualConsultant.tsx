import { getTeacherConsultantsByDepartment } from '@/apis/consultant.api'
import { getAllDepartments } from '@/apis/department.api'
import { createUserConsultant } from '@/apis/user.api'
import CheckboxCustom from '@/components/dev/Form/CheckboxCustom'
import Editor from '@/components/dev/Form/Editor'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import FormPartContainer from '@/components/dev/QuestionForm/components/FormPartContainer'
import QuestionLabel from '@/components/dev/QuestionForm/components/QuestionLabel'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import { toast } from 'sonner'
import { Consultant } from '@/types/consultant.type'
import { FormControlItem } from '@/types/utils.type'
import { SchedualConsultantSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AlertCircle, Building2, Calendar, Clock3, MessageSquare, Users2 } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

export type ConsultantSchedualFormData = yup.InferType<typeof SchedualConsultantSchema>

export default function SchedualConsultant() {
  const form = useForm<ConsultantSchedualFormData>({
    defaultValues: {
      consultantId: '',
      departmentId: '',
      title: '',
      content: '',
      statusPublic: true,
      mode: true
    },
    resolver: yupResolver(SchedualConsultantSchema)
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  const navigate = useNavigate()

  // generate selection data
  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  const departmentId = form.watch('departmentId')
  console.log(departmentId)
  const { data: consultants } = useQuery({
    queryKey: ['teacher-consultants', departmentId],
    queryFn: () => getTeacherConsultantsByDepartment(parseInt(departmentId)),
    enabled: !!departmentId
  })

  // generate selection data from departments to use in selection component
  const consultantsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = consultants?.data.data
    return data?.map((consultant: Consultant) => {
      return {
        value: String(consultant.id),
        label: consultant.lastName + ' ' + consultant.firstName
      }
    })
  }, [consultants])

  const createUserConsultantMutation = useMutation({
    mutationFn: (body: ConsultantSchedualFormData) => createUserConsultant(body)
  })

  const onSubmit = form.handleSubmit((values) => {
    values.content = `<div class="editor">${values.content}</div>`
    createUserConsultantMutation.mutate(values, {
      onSuccess: (res) => {
        toast.success(res.data.message)
        navigate(path.home)
      }
    })
  })
  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        {/* Header Section */}
        <div className='max-w-2xl mx-auto text-center mb-10'>
          <div className='flex justify-center mb-4'>
            <div className='bg-primary/10 p-3 rounded-full'>
              <Calendar className='w-6 h-6 text-primary' />
            </div>
          </div>
          <h1 className='text-2xl font-semibold text-foreground mb-2'>Đặt lịch tư vấn</h1>
          <p className='text-sm text-secondary-foreground'>Đặt lịch hẹn với tư vấn viên để được hỗ trợ trực tiếp</p>
        </div>

        <div className='grid lg:grid-cols-12 gap-6'>
          {/* Sidebar Information */}
          <div className='lg:col-span-4 space-y-4'>
            {/* Guidelines Card */}
            <div className='bg-background rounded-lg shadow-sm border border-secondary/50 p-5'>
              <div className='space-y-4'>
                <div className='flex gap-3'>
                  <Users2 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                  <div>
                    <p className='text-sm text-secondary-foreground'>
                      Tư vấn trực tiếp với giảng viên, chuyên viên các phòng ban
                    </p>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <Clock3 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                  <div>
                    <p className='text-sm text-secondary-foreground'>
                      Thời gian phản hồi: <span className='font-medium'>1-2 ngày làm việc</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Card */}
            <div className='bg-destructive rounded-lg border border-destructive/50 p-5'>
              <div className='flex gap-3'>
                <AlertCircle className='w-5 h-5 text-destructive-foreground shrink-0 mt-0.5' />
                <p className='text-sm text-destructive-foreground'>
                  Vui lòng cung cấp thông tin chính xác để buổi tư vấn diễn ra thuận lợi
                </p>
              </div>
            </div>
          </div>

          {/* Main Form Section */}
          <div className='lg:col-span-8'>
            <div className='bg-background rounded-lg shadow-sm border border-secondary p-6'>
              <Form {...form}>
                <form onSubmit={onSubmit} className='space-y-6'>
                  <div className='bg-background rounded-lg divide-y divide-secondary'>
                    {/* Department & Consultant Selection */}
                    <div className='p-4'>
                      <FormPartContainer
                        Label={
                          <QuestionLabel
                            title='Chọn tư vấn viên'
                            subtitle='Vui lòng chọn đơn vị và tư vấn viên phù hợp'
                            icon={<Building2 className='w-5 h-5 text-primary' />}
                          />
                        }
                        Items={
                          <div className='grid gap-4 md:grid-cols-2'>
                            <SelectionCustom
                              control={form.control}
                              name='departmentId'
                              placeholder='Chọn đơn vị'
                              label='Đơn vị'
                              data={departmentsSelectionData}
                              isRequired
                              className='w-full'
                            />
                            <SelectionCustom
                              control={form.control}
                              name='consultantId'
                              placeholder='Chọn tư vấn viên'
                              label='Tư vấn viên'
                              data={consultantsSelectionData}
                              isRequired
                              className='w-full'
                            />
                          </div>
                        }
                      />
                    </div>

                    {/* Consultation Content */}
                    <div className='p-4'>
                      <FormPartContainer
                        Label={
                          <QuestionLabel
                            title='Nội dung tư vấn'
                            subtitle='Mô tả vấn đề bạn cần được tư vấn'
                            icon={<MessageSquare className='w-5 h-5 text-primary' />}
                          />
                        }
                        Items={
                          <div className='space-y-4'>
                            <InputCustom
                              control={form.control}
                              name='title'
                              placeholder='Tóm tắt vấn đề cần tư vấn'
                              label='Tiêu đề'
                              isRequired
                            />
                            <Editor control={form.control} name='content' label='Chi tiết vấn đề' isRequired />
                          </div>
                        }
                      />
                    </div>

                    {/* Consultation Mode */}
                    <div className='p-4'>
                      <FormPartContainer
                        Label={
                          <QuestionLabel
                            title='Hình thức tư vấn'
                            subtitle='Chọn hình thức tư vấn phù hợp với bạn'
                            icon={<Users2 className='w-5 h-5 text-primary' />}
                          />
                        }
                        Items={
                          <div className='flex items-center space-x-2'>
                            <CheckboxCustom control={form.control} name='mode' label='Tư vấn trực tuyến' />
                          </div>
                        }
                      />
                    </div>
                  </div>

                  {/* Form Footer */}
                  <div className='flex items-center justify-between bg-secondary/50 p-4 rounded-lg'>
                    <CheckboxCustom control={form.control} name='statusPublic' label='Cho phép hiển thị công khai' />
                    <Button type='submit' className='px-6'>
                      Đặt lịch
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

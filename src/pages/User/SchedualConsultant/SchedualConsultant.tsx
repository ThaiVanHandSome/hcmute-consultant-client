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
import { toast } from '@/hooks/use-toast'
import { Consultant } from '@/types/consultant.type'
import { FormControlItem } from '@/types/utils.type'
import { SchedualConsultantSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { MailWarningIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

export type ConsultantSchedualFormData = yup.InferType<typeof SchedualConsultantSchema>

export default function SchedualConsultant() {
  const form = useForm<ConsultantSchedualFormData>({
    defaultValues: {
      consultantId: 'qw',
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
        toast({
          variant: 'success',
          description: res.data.message
        })
        navigate(path.home)
      }
    })
  })
  return (
    <div className='bg-primary-bg min-h-[100vh] py-6'>
      <div className='container'>
        <h1 className='font-extrabold text-2xl text-left uppercase mb-6 text-primary tracking-wide'>Đặt lịch tư vấn</h1>
        <div className='grid grid-cols-12 gap-4'>
          <div className='hidden lg:block col-span-3 text-sm'>
            <div className='px-4 py-4 bg-background text-foreground rounded-lg shadow-md mb-6'>
              <p className='text-xl font-semibold text-blue-600 mb-2 uppercase'>Tiêu chí</p>
              <p className='text-md mb-3'>
                Nếu bạn muốn gặp mặt trực tiếp hoặc online tư vấn viên, hãy đặt lịch tư vấn tại đây
              </p>
              <p className='text-md mb-3'>
                Sau khi đặt lịch, sẽ mất khoảng <strong>3 ngày</strong> để yêu cầu của bạn được xem xét và được duyệt.
                Hãy chú ý thông báo nhé!
              </p>
              <div className='px-4 py-3 bg-red-100 border-l-4 border-red-600 text-red-700 mb-3 rounded'>
                <p className='text-md font-bold mb-1 flex items-center'>
                  <MailWarningIcon className='mr-1' />
                  Cảnh báo:
                </p>
                <p className='text-md'>
                  Vui lòng không đặt lịch tư vấn nếu không có nhu cầu. Nếu như bạn hủy lịch tư vấn với một lý do{' '}
                  <strong>không chính đáng</strong>, bạn sẽ bị <strong>khóa tài khoản</strong>. Nếu bạn muốn mở lại tài
                  khoản, vui lòng liên hệ quản trị viên.
                </p>
              </div>
            </div>
          </div>
          <div className='bg-background text-foreground px-6 py-2 col-span-12 lg:col-span-9 rounded-lg shadow-xl border'>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <FormPartContainer
                  Label={<QuestionLabel title='Tư vấn viên' subtitle='Tư vấn viên bạn muốn đặt lịch tư vấn' />}
                  Items={
                    <div className='space-y-4'>
                      <div>
                        <SelectionCustom
                          control={form.control}
                          name='departmentId'
                          placeholder='Đơn vị'
                          label='Đơn vị'
                          data={departmentsSelectionData}
                          isRequired
                          infoText='Chọn đơn vị mà bạn muốn đặt lịch tư vấn'
                        />
                      </div>
                      <div>
                        <SelectionCustom
                          control={form.control}
                          name='consultantId'
                          placeholder='Tư vấn viên'
                          label='Tư vấn viên'
                          data={consultantsSelectionData}
                          isRequired
                          infoText='Chọn tư vấn viên bạn muốn nhờ sự tư vấn'
                        />
                      </div>
                    </div>
                  }
                />
                <FormPartContainer
                  Label={<QuestionLabel title='Nội dung cần tư vấn' subtitle='Chi tiết vấn đề cần được tư vấn' />}
                  Items={
                    <div>
                      <InputCustom
                        className='mt-1 mb-3'
                        control={form.control}
                        name='title'
                        placeholder='Tiêu đề'
                        label='Tiêu đề'
                        isRequired
                        infoText='Tóm tắt vấn đề mà bạn cần được tư vấn là gì?'
                      />
                      <Editor
                        label='Nội dung'
                        control={form.control}
                        name='content'
                        isRequired
                        infoText='Nêu rõ vấn đề mà bạn cần được tư vấn. Cần nêu chi tiết để tư vấn viên có thể hỗ trợ bạn tốt hơn.'
                      />
                    </div>
                  }
                />
                <div className='flex items-center justify-between w-full'>
                  <CheckboxCustom control={form.control} name='mode' label='Online' />
                  <Button type='submit'>Đặt lịch</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

import { getAllDepartments, getFields, getRolesAsk } from '@/apis/department.api'
import { createNewQuestion, updateQuestion } from '@/apis/question.api'
import FileShow from '@/components/dev/FileShow'
import CheckboxCustom from '@/components/dev/Form/CheckboxCustom'
import Editor from '@/components/dev/Form/Editor'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import FormPartContainer from '@/components/dev/QuestionForm/components/FormPartContainer'
import QuestionLabel from '@/components/dev/QuestionForm/components/QuestionLabel'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import useQuestionQueryConfig, { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { CreateQuestionRequest, Question } from '@/types/question.type'
import { FormControlItem } from '@/types/utils.type'
import { CreateQuestionSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

interface Props {
  readonly question?: Question
}

type FormData = yup.InferType<typeof CreateQuestionSchema>

export default function QuestionForm({ question }: Props) {
  const isUpdate = !!question

  const queryClient = useQueryClient()
  const isFormReset = useRef<boolean>(!isUpdate)
  const queryConfig: QuestionQueryConfig = useQuestionQueryConfig()
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : (question?.fileName ?? '')
  }, [file])

  const navigate = useNavigate()

  const form = useForm<FormData>({
    defaultValues: {
      departmentId: '',
      fieldId: '',
      roleAskId: '',
      title: '',
      content: '',
      firstName: '',
      lastName: '',
      statusPublic: true,
      studentCode: ''
    },
    resolver: yupResolver(CreateQuestionSchema)
  })

  useEffect(() => {
    if (!question && isFormReset.current) return
    form.reset({
      departmentId: String(question?.department.id),
      fieldId: String(question?.field.id),
      roleAskId: String(question?.roleAsk.id),
      title: question?.title,
      content: question?.content,
      firstName: question?.askerFirstname,
      lastName: question?.askerLastname,
      statusPublic: true,
      studentCode: ''
    })
    isFormReset.current = true
  }, [question])

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })
  // generate selection data
  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  const departmentId = form.watch('departmentId')
  const { data: fields } = useQuery({
    queryKey: ['fields', departmentId],
    queryFn: () => getFields(parseInt(departmentId)),
    enabled: !!departmentId
  })

  // generate selection data
  const fieldsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = fields?.data.data
    return generateSelectionData(data)
  }, [fields])

  const { data: rolesAsk } = useQuery({
    queryKey: ['rolesAsk'],
    queryFn: getRolesAsk
  })

  // generate selection data
  const roleAskSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = rolesAsk?.data.data
    return generateSelectionData(data)
  }, [rolesAsk])

  const createQuestionMutation = useMutation({
    mutationFn: ({ params, file }: { params: CreateQuestionRequest; file?: File }) => createNewQuestion(params, file)
  })

  const updateQuestionMutation = useMutation({
    mutationFn: ({ questionId, params, file }: { questionId: number; params: CreateQuestionRequest; file?: File }) =>
      updateQuestion(questionId, params, file)
  })

  // handle question create process
  const onSubmit = form.handleSubmit((values) => {
    values.content = `<div class="editor">${values.content}</div>`
    const params = omit(values, ['email']) as CreateQuestionRequest
    if (!isUpdate) {
      createQuestionMutation.mutate(
        { params, file },
        {
          onSuccess: (res) => {
            toast({
              variant: 'success',
              description: res.data.message
            })

            // refetch query to get new data
            queryClient.invalidateQueries({
              queryKey: ['questions', queryConfig]
            })
            navigate(path.home)
          }
        }
      )
      return
    }
    const questionId = question.id
    updateQuestionMutation.mutate(
      { questionId, params, file },
      {
        onSuccess: (res) => {
          toast({
            variant: 'success',
            description: res.data.message
          })

          // refetch query to get new data
          queryClient.invalidateQueries({
            queryKey: ['questions-of-user', queryConfig]
          })
        }
      }
    )
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    setFile(fileFromLocal)
  }

  console.log(previewImage)

  return (
    <div className='overflow-hidden'>
      {isFormReset.current && (
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormPartContainer
              Label={<QuestionLabel title='Nơi tiếp nhận' subtitle='Khoa bạn muốn gửi câu hỏi đến' />}
              Items={
                <div className='space-y-4'>
                  <div>
                    <SelectionCustom
                      control={form.control}
                      name='departmentId'
                      placeholder='Đơn vị'
                      label='Đơn vị'
                      data={departmentsSelectionData}
                      defaultValue={String(question?.department.id)}
                      isRequired
                      infoText='Chọn đơn vị mà bạn muốn đặt câu hỏi. Tuy nhiên, nếu bạn chưa biết nên hỏi đơn vị nào, bạn cứ chọn 1 đơn vị, trưởng ban của đơn vị sẽ chuyển tiếp câu hỏi của bạn đến một đơn vị thích hợp.'
                    />
                  </div>
                  <div>
                    <SelectionCustom
                      control={form.control}
                      name='fieldId'
                      placeholder='Lĩnh vực'
                      label='Lĩnh vực'
                      data={fieldsSelectionData}
                      defaultValue={String(question?.field.id)}
                      isRequired
                      infoText='Chọn lĩnh vực mà bạn muốn hỏi. Chẳng hạn nếu bạn muốn hỏi về học bổng bạn có thể chọn Điểm rèn luyện - Học bổng'
                    />
                  </div>
                </div>
              }
            />
            <FormPartContainer
              Label={
                <QuestionLabel
                  title='Thông tin cá nhân'
                  subtitle='Cung cấp thông tin để chúng tôi hỗ trợ bạn tốt hơn'
                />
              }
              Items={
                <div className='space-y-4'>
                  <div>
                    <InputCustom
                      control={form.control}
                      name='firstName'
                      placeholder='Họ'
                      label='Họ'
                      isRequired
                      infoText='Nhập họ của bạn. Vui lòng nhập họ có nghĩa, không dùng các biệt danh GenZ'
                    />
                  </div>
                  <div>
                    <InputCustom
                      control={form.control}
                      name='lastName'
                      placeholder='Tên'
                      label='Tên'
                      isRequired
                      infoText='Nhập tên của bạn. Vui lòng nhập tên có nghĩa, không dùng các biệt danh GenZ'
                    />
                  </div>
                  <div>
                    <SelectionCustom
                      control={form.control}
                      name='roleAskId'
                      placeholder='Vai trò'
                      data={roleAskSelectionData}
                      defaultValue={String(question?.roleAsk.id)}
                      label='Vai trò'
                      isRequired
                      infoText='Bạn là ai? Học sinh, Sinh viên hay Phụ huynh,...'
                    />
                  </div>
                  <div>
                    <InputCustom
                      control={form.control}
                      name='studentCode'
                      placeholder='Mã số sinh viên'
                      label='Mã số sinh viên'
                      helperText='Nhập mã số sinh viên của bạn nếu bạn cần hỗ trợ chi tiết hơn'
                    />
                  </div>
                </div>
              }
            />

            <FormPartContainer
              Label={<QuestionLabel title='Nội dung câu hỏi' subtitle='Chi tiết vấn đề cần được giải đáp' />}
              Items={
                <div>
                  <div className='w-full mt-1'>
                    <InputCustom
                      control={form.control}
                      name='title'
                      placeholder='Tiêu đề'
                      label='Tiêu đề'
                      isRequired
                      infoText='Tóm tắt vấn đề mà bạn cần hỏi là gì'
                    />
                  </div>
                  <Editor
                    control={form.control}
                    name='content'
                    label='Nội dung'
                    isRequired
                    infoText='Nêu rõ vấn đề mà bạn cần hỏi. Cần nêu chi tiết để tư vấn viên có thể hỗ trợ bạn tốt hơn.'
                  />
                </div>
              }
            />

            <FormPartContainer
              Label={<QuestionLabel title='Tệp đính kèm' subtitle='Không bắt buộc. Hỗ trợ hình ảnh và tài liệu' />}
              Items={
                <div className='mb-4'>
                  <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Input id='file' type='file' onChange={handleFileChange} />
                    {previewImage && <FileShow url={previewImage} />}
                  </div>
                </div>
              }
            />

            <div className='flex items-center justify-between w-full'>
              <CheckboxCustom control={form.control} name='statusPublic' label='Chế độ công khai' />
              <Button
                isLoading={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                disabled={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                type='submit'
                className='text-center'
              >
                {isUpdate ? 'Chỉnh sửa câu hỏi' : 'Gửi câu hỏi'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

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
import { Building2, UserCircle, HelpCircle, Paperclip, Info } from 'lucide-react'

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

  // Thêm hàm xử lý drag and drop
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      // Chỉ kiểm tra kích thước file (10MB = 10 * 1024 * 1024 bytes)
      if (droppedFile.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          description: 'File không được vượt quá 10MB'
        })
        return
      }

      setFile(droppedFile)
    }
  }

  return (
    <div>
      {isFormReset.current && (
        <Form {...form}>
          <form onSubmit={onSubmit} className='space-y-6'>
            {/* Main Form Container */}
            <div className='bg-white rounded-lg divide-y divide-gray-100'>
              {/* Department Selection Section */}
              <div className='p-4'>
                <FormPartContainer
                  Label={
                    <QuestionLabel
                      title='Chọn đơn vị tiếp nhận'
                      subtitle='Vui lòng chọn đúng đơn vị để được hỗ trợ nhanh nhất'
                      icon={<Building2 className='w-5 h-5 text-primary' />}
                    />
                  }
                  Items={
                    <div className='grid gap-4 md:grid-cols-2'>
                      <SelectionCustom
                        control={form.control}
                        name='departmentId'
                        placeholder='Chọn phòng/khoa...'
                        label='Đơn vị tiếp nhận'
                        data={departmentsSelectionData}
                        defaultValue={String(question?.department.id)}
                        isRequired
                        className='w-full'
                      />
                      <SelectionCustom
                        control={form.control}
                        name='fieldId'
                        placeholder='Chọn lĩnh vực cụ thể...'
                        label='Lĩnh vực'
                        data={fieldsSelectionData}
                        defaultValue={String(question?.field.id)}
                        isRequired
                        className='w-full'
                      />
                    </div>
                  }
                />
              </div>

              {/* Personal Info Section */}
              <div className='p-4'>
                <FormPartContainer
                  Label={
                    <QuestionLabel
                      title='Thông tin cá nhân'
                      subtitle='Thông tin của bạn sẽ được bảo mật'
                      icon={<UserCircle className='w-5 h-5 text-primary' />}
                    />
                  }
                  Items={
                    <div className='grid gap-4 md:grid-cols-2'>
                      <InputCustom
                        control={form.control}
                        name='firstName'
                        placeholder='Ví dụ: Nguyễn'
                        label='Họ và tên đệm'
                        isRequired
                      />
                      <InputCustom
                        control={form.control}
                        name='lastName'
                        placeholder='Ví dụ: An'
                        label='Tên'
                        isRequired
                      />
                      <SelectionCustom
                        control={form.control}
                        name='roleAskId'
                        placeholder='Bạn đang là...'
                        data={roleAskSelectionData}
                        defaultValue={String(question?.roleAsk.id)}
                        label='Vai trò của bạn'
                        isRequired
                        className='w-full'
                      />
                      <InputCustom
                        control={form.control}
                        name='studentCode'
                        placeholder='Ví dụ: 21520001'
                        label='Mã số sinh viên (nếu có)'
                      />
                    </div>
                  }
                />
              </div>

              {/* Question Content Section */}
              <div className='p-4'>
                <FormPartContainer
                  Label={
                    <QuestionLabel
                      title='Nội dung câu hỏi'
                      subtitle='Hãy mô tả chi tiết vấn đề của bạn'
                      icon={<HelpCircle className='w-5 h-5 text-primary' />}
                    />
                  }
                  Items={
                    <div className='space-y-4'>
                      <InputCustom
                        control={form.control}
                        name='title'
                        placeholder='Tóm tắt ngắn gọn vấn đề của bạn'
                        label='Tiêu đề câu hỏi'
                        isRequired
                      />
                      <Editor control={form.control} name='content' label='Chi tiết câu hỏi' isRequired />
                    </div>
                  }
                />
              </div>

              {/* Attachment Section */}
              <div className='p-4'>
                <FormPartContainer
                  Label={
                    <QuestionLabel
                      title='Tài liệu đính kèm'
                      subtitle='Thêm hình ảnh hoặc tài liệu minh họa (nếu cần)'
                      icon={<Paperclip className='w-5 h-5 text-primary' />}
                    />
                  }
                  Items={
                    <div className='space-y-4'>
                      <div className='flex items-center justify-center w-full'>
                        <label
                          className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                            <Paperclip className='w-8 h-8 mb-3 text-gray-400' />
                            <p className='text-sm text-gray-500'>
                              <span className='font-medium'>Click để tải file</span> hoặc kéo thả
                            </p>
                            <p className='text-xs text-gray-500'>Tất cả các loại file (Max. 10MB)</p>
                          </div>
                          <Input id='file' type='file' className='hidden' onChange={handleFileChange} />
                        </label>
                      </div>
                      {previewImage && <FileShow url={previewImage} />}
                    </div>
                  }
                />
              </div>
            </div>

            {/* Form Footer */}
            <div className='flex items-center justify-between bg-gray-50 p-4 rounded-lg'>
              <div className='flex items-center space-x-2'>
                <CheckboxCustom control={form.control} name='statusPublic' label='Cho phép hiển thị công khai' />
                <Info className='w-4 h-4 text-gray-400 cursor-help' />
              </div>
              <Button
                isLoading={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                disabled={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                type='submit'
                className='px-6'
              >
                {isUpdate ? 'Cập nhật' : 'Gửi câu hỏi'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

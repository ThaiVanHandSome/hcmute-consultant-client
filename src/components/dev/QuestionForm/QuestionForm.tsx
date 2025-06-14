/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { toast } from 'sonner'
import useQuestionQueryConfig, { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { CreateQuestionRequest, Question } from '@/types/question.type'
import { FormControlItem } from '@/types/utils.type'
import { CreateQuestionSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omit } from 'lodash'
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as yup from 'yup'
import { Building2, UserCircle, HelpCircle, Paperclip } from 'lucide-react'
import { useRecommendQuestions } from '@/components/dev/QuestionForm/hooks/useRecommendQuestions'

interface Props {
  readonly question?: Question
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profileData?: any // Thêm type cụ thể cho profile data
  setShowRecommendationsPopup?: Dispatch<SetStateAction<boolean>>
  setRecommendations?: Dispatch<SetStateAction<any>>
}

type FormData = yup.InferType<typeof CreateQuestionSchema>

export default function QuestionForm({
  question,
  profileData,
  setShowRecommendationsPopup,
  setRecommendations
}: Props) {
  const isUpdate = !!question
  const [searchParams] = useSearchParams()
  const contentFromUrl = searchParams.get('content')

  const queryClient = useQueryClient()
  const isFormReset = useRef<boolean>(!isUpdate)
  const queryConfig: QuestionQueryConfig = useQuestionQueryConfig()
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : (question?.fileName ?? '')
  }, [file])

  // State quản lý popup hiển thị câu hỏi gợi ý
  const editorRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()

  const form = useForm<FormData>({
    defaultValues: {
      departmentId: '',
      fieldId: '',
      roleAskId: '',
      title: '',
      content: contentFromUrl ? `<div class="editor">${contentFromUrl}</div>` : '',
      firstName: profileData?.firstName || '',
      lastName: profileData?.lastName || '',
      statusPublic: true,
      studentCode: profileData?.studentCode || ''
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
      content: contentFromUrl ? `<div class="editor">${contentFromUrl}</div>` : question?.content || '',
      firstName: profileData?.firstName || question?.askerFirstname,
      lastName: profileData?.lastName || question?.askerLastname,
      statusPublic: true,
      studentCode: profileData?.studentCode || ''
    })
    isFormReset.current = true
  }, [question, profileData, contentFromUrl])

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

  const { recommendations, fetchRecommendations } = useRecommendQuestions()

  const handleContentChange = (content: string) => {
    // Strip HTML tags
    const plainText = content.replace(/<[^>]+>/g, '')

    fetchRecommendations(plainText)

    // Hiển thị popup khi nội dung dài và không đang loading
    if (plainText.length > 10 && recommendations.length > 0) {
      console.log('Should show popup, recommendations:', recommendations)
      setShowRecommendationsPopup && setShowRecommendationsPopup(true)
    }
  }

  const recommendationsJSON = JSON.stringify(recommendations)
  useEffect(() => {
    setRecommendations && setRecommendations(recommendations)
  }, [recommendationsJSON])

  // handle question create process
  const onSubmit = form.handleSubmit((values) => {
    values.content = `<div class="editor">${values.content}</div>`
    const params = omit(values, ['email']) as CreateQuestionRequest
    if (!isUpdate) {
      createQuestionMutation.mutate(
        { params, file },
        {
          onSuccess: (res) => {
            toast.success(res.data.message)

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
          toast.success(res.data.message)

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
        toast.error('File không được vượt quá 10MB')
        return
      }

      setFile(droppedFile)
    }
  }

  // Thêm useEffect để debug recommendations và cập nhật hiển thị popup
  useEffect(() => {
    console.log('Recommendations updated:', recommendations)
    if (recommendations.length > 0) {
      setShowRecommendationsPopup && setShowRecommendationsPopup(true)
    }
  }, [recommendations])

  return (
    <div>
      {isFormReset.current && (
        <Form {...form}>
          <form onSubmit={onSubmit} className='space-y-6'>
            {/* Main Form Container */}
            <div className='bg-background rounded-lg divide-y divide-secondary'>
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

                      <div className='relative' ref={editorRef}>
                        <Editor
                          control={form.control}
                          name='content'
                          label='Chi tiết câu hỏi'
                          isRequired
                          onChange={handleContentChange}
                        />
                      </div>
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
                          className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-secondary-foreground rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary/80'
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                            <Paperclip className='w-8 h-8 mb-3 text-secondary-foreground/80' />
                            <p className='text-sm text-secondary-foreground'>
                              <span className='font-medium'>Click để tải file</span> hoặc kéo thả
                            </p>
                            <p className='text-xs text-secondary-foreground'>Chỉ chấp nhận file ảnh (Max. 10MB)</p>
                          </div>
                          <Input
                            id='file'
                            type='file'
                            className='hidden'
                            onChange={handleFileChange}
                            accept='image/*'
                          />
                        </label>
                      </div>
                      {previewImage && <FileShow url={previewImage} />}
                    </div>
                  }
                />
              </div>
            </div>

            {/* Form Footer */}
            <div className='flex items-center justify-between bg-secondary/50 p-4 rounded-lg'>
              <div className='flex items-center space-x-2'>
                <CheckboxCustom control={form.control} name='statusPublic' label='Cho phép hiển thị công khai' />
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

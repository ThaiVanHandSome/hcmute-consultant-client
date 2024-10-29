import { getAllDepartments, getFields, getRolesAsk } from '@/apis/department.api'
import { createNewQuestion, updateQuestion } from '@/apis/question.api'
import CheckboxCustom from '@/components/dev/Form/CheckboxCustom'
import Editor from '@/components/dev/Form/Editor'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import useQuestionQueryConfig, { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { guideTypes } from '@/pages/User/CreateQuestion/CreateQuestion'
import { CreateQuestionRequest, Question } from '@/types/question.type'
import { FormControlItem } from '@/types/utils.type'
import { CreateQuestionSchema } from '@/utils/rules'
import { generateSelectionData, isImageFile } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

interface Props {
  readonly question?: Question
  readonly setGuideActive?: React.Dispatch<
    React.SetStateAction<
      | 'department'
      | 'field'
      | 'role'
      | 'studentId'
      | 'firstName'
      | 'lastName'
      | 'email'
      | 'title'
      | 'content'
      | undefined
    >
  >
}

type FormData = yup.InferType<typeof CreateQuestionSchema>

export default function QuestionForm({ question, setGuideActive }: Props) {
  const isUpdate = !!question

  const queryClient = useQueryClient()
  const isFormReset = useRef<boolean>(!isUpdate)
  const queryConfig: QuestionQueryConfig = useQuestionQueryConfig()
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    if (isImageFile((file?.name as string) ?? '')) return file ? URL.createObjectURL(file) : (question?.fileName ?? '')
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

  const handleFocus = (fieldName: keyof typeof guideTypes) => {
    if (setGuideActive) {
      setGuideActive(fieldName)
    }
  }

  return (
    <div className='overflow-hidden'>
      {isFormReset.current && (
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <Label className='text-md italic relative inline-flex items-center before:inline-block after:inline-block before:w-4 after:w-4 before:h-[1px] after:h-[1px] before:bg-current after:bg-current before:mr-2 after:ml-2'>
              Nơi tiếp nhận
            </Label>
            <div className='grid grid-cols-8 gap-2 mb-6 mt-1'>
              <div className='col-span-4'>
                <SelectionCustom
                  control={form.control}
                  name='departmentId'
                  placeholder='Đơn vị'
                  label='Đơn vị'
                  data={departmentsSelectionData}
                  defaultValue={String(question?.department.id)}
                  onFocus={() => handleFocus(guideTypes.department)}
                />
              </div>
              <div className='col-span-4'>
                <SelectionCustom
                  control={form.control}
                  name='fieldId'
                  placeholder='Lĩnh vực'
                  label='Lĩnh vực'
                  data={fieldsSelectionData}
                  defaultValue={String(question?.field.id)}
                  onFocus={() => handleFocus(guideTypes.field)}
                />
              </div>
            </div>
            <Label className='text-md italic relative inline-flex items-center before:inline-block after:inline-block before:w-4 after:w-4 before:h-[1px] after:h-[1px] before:bg-current after:bg-current before:mr-2 after:ml-2'>
              Thông tin cá nhân
            </Label>
            <div className='grid grid-cols-8 gap-4 mt-1'>
              <div className='col-span-4'>
                <InputCustom
                  onFocus={() => handleFocus(guideTypes.firstName)}
                  control={form.control}
                  name='firstName'
                  placeholder='Họ'
                  label='Họ'
                />
              </div>
              <div className='col-span-4'>
                <InputCustom
                  onFocus={() => handleFocus(guideTypes.lastName)}
                  control={form.control}
                  name='lastName'
                  placeholder='Tên'
                  label='Tên'
                />
              </div>
            </div>
            <div className='grid grid-cols-8 gap-3 mb-4'>
              <div className='col-span-4'>
                <SelectionCustom
                  control={form.control}
                  name='roleAskId'
                  placeholder='Vai trò'
                  data={roleAskSelectionData}
                  defaultValue={String(question?.roleAsk.id)}
                  onFocus={() => handleFocus(guideTypes.role)}
                  label='Vai trò'
                />
              </div>
              <div className='col-span-4'>
                <InputCustom
                  onFocus={() => handleFocus(guideTypes.studentId)}
                  control={form.control}
                  name='studentCode'
                  placeholder='Mã số sinh viên'
                  label='Mã số sinh viên'
                />
              </div>
            </div>
            <Label className='text-md italic relative inline-flex items-center before:inline-block after:inline-block before:w-4 after:w-4 before:h-[1px] after:h-[1px] before:bg-current after:bg-current before:mr-2 after:ml-2'>
              Nội dung câu hỏi
            </Label>
            <div className='w-full mt-1'>
              <InputCustom
                onFocus={() => handleFocus(guideTypes.title)}
                control={form.control}
                name='title'
                placeholder='Tiêu đề'
                label='Tiêu đề'
              />
            </div>
            <Editor control={form.control} name='content' label='Nội dung' />
            <div className='mb-4'>
              <div className='grid w-full max-w-sm items-center gap-1.5'>
                <Label htmlFor='file'>Tệp đính kèm</Label>
                <Input id='file' type='file' onChange={handleFileChange} />
                {previewImage && <img src={previewImage} alt='fileUploadImage' className='object-cover h-64' />}
              </div>
            </div>
            <CheckboxCustom control={form.control} name='statusPublic' label='Chế độ công khai' />
            <div className='flex items-center justify-center'>
              <Button
                isLoading={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                disabled={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                type='submit'
                className='text-center w-1/3'
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

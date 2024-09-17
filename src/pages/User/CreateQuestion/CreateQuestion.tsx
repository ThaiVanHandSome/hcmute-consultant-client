import { getAllDepartments, getFields, getRolesAsk } from '@/apis/department.api'
import { createNewQuestion } from '@/apis/question.api'
import InputCustom from '@/components/dev/InputCustom'
import SelectionCustom from '@/components/dev/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import useQueryConfig, { QueryConfig } from '@/hooks/useQueryConfig'
import { CreateQuestionRequest } from '@/types/question.type'
import { FormControlItem } from '@/types/utils.type'
import { CreateQuestionSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
import * as yup from 'yup'

type FormData = yup.InferType<typeof CreateQuestionSchema>

export default function CreateQuestion() {
  const queryClient = useQueryClient()
  const queryConfig: QueryConfig = useQueryConfig()
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const form = useForm<FormData>({
    defaultValues: {
      departmentId: '',
      fieldId: '',
      roleAskId: '',
      title: '',
      content: '',
      email: '',
      firstName: '',
      lastName: '',
      statusPublic: true,
      studentCode: ''
    },
    resolver: yupResolver(CreateQuestionSchema)
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

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

  const fieldsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = fields?.data.data
    return generateSelectionData(data)
  }, [fields])

  const { data: rolesAsk } = useQuery({
    queryKey: ['rolesAsk'],
    queryFn: getRolesAsk
  })
  const roleAskSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = rolesAsk?.data.data
    return generateSelectionData(data)
  }, [rolesAsk])

  const createQuestionMutation = useMutation({
    mutationFn: ({ params, file }: { params: CreateQuestionRequest; file?: File }) => createNewQuestion(params, file)
  })

  const onSubmit = form.handleSubmit((values) => {
    const params = omit(values, ['email']) as CreateQuestionRequest
    createQuestionMutation.mutate(
      { params, file },
      {
        onSuccess: (res) => {
          toast({
            variant: 'success',
            title: 'Thành công',
            description: res.data.message
          })
          queryClient.invalidateQueries({
            queryKey: ['questions', queryConfig]
          })
        }
      }
    )
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    setFile(fileFromLocal)
  }

  return (
    <div className='py-6 bg-primary-bg'>
      <div className='container'>
        <div className='flex justify-center '>
          <div className='w-2/3 bg-white px-6 py-3 shadow-lg rounded-lg'>
            <h1 className='font-bold text-2xl text-center uppercase mb-6 text-primary'>Đặt câu hỏi cho ban tư vấn</h1>
            <div>
              <Form {...form}>
                <form onSubmit={onSubmit}>
                  <div className='grid grid-cols-12 gap-2 mb-4'>
                    <div className='col-span-4'>
                      <SelectionCustom
                        control={form.control}
                        name='departmentId'
                        placeholder='Đơn vị'
                        data={departmentsSelectionData}
                      />
                    </div>
                    <div className='col-span-4'>
                      <SelectionCustom
                        control={form.control}
                        name='fieldId'
                        placeholder='Lĩnh vực'
                        data={fieldsSelectionData}
                      />
                    </div>
                    <div className='col-span-4'>
                      <SelectionCustom
                        control={form.control}
                        name='roleAskId'
                        placeholder='Vai trò'
                        data={roleAskSelectionData}
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-4'>
                      <InputCustom control={form.control} name='studentCode' placeholder='Mã số sinh viên' />
                    </div>
                    <div className='col-span-4'>
                      <InputCustom control={form.control} name='firstName' placeholder='Họ' />
                    </div>
                    <div className='col-span-4'>
                      <InputCustom control={form.control} name='lastName' placeholder='Tên' />
                    </div>
                  </div>
                  <div className='grid grid-cols-12 gap-3'>
                    <div className='col-span-5'>
                      <InputCustom control={form.control} name='email' placeholder='Email' />
                    </div>
                    <div className='col-span-7'>
                      <InputCustom control={form.control} name='title' placeholder='Tiêu đề' />
                    </div>
                  </div>
                  <div className='mb-4'>
                    <Label className='ml-1 mb-2'>Nội dung</Label>
                    <FormField
                      control={form.control}
                      name='content'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ReactQuill theme='snow' value={form.watch('content')} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mb-4'>
                    <div className='grid w-full max-w-sm items-center gap-1.5'>
                      <Label htmlFor='file'>Tệp đính kèm</Label>
                      <Input id='file' type='file' onChange={handleFileChange} />
                      {file?.type.includes('image') && (
                        <img src={previewImage} alt='fileUploadImage' className='object-cover h-64' />
                      )}
                    </div>
                  </div>
                  <div className='mb-4'>
                    <FormField
                      control={form.control}
                      name='statusPublic'
                      render={({ field }) => (
                        <FormItem className='flex items-center'>
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className='!mt-0 ml-1'>Chế độ công khai</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='flex items-center justify-center'>
                    <Button
                      isLoading={createQuestionMutation.isPending}
                      disabled={createQuestionMutation.isPending}
                      type='submit'
                      className='text-center w-1/3'
                    >
                      Gửi câu hỏi
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

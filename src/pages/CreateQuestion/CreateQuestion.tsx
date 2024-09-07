import { getAllDepartments, getFields, getRolesAsk } from '@/apis/department.api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateQuestionSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
import * as yup from 'yup'

type FormData = yup.InferType<typeof CreateQuestionSchema>

export default function CreateQuestion() {
  const [value, setValue] = useState<string>()

  const form = useForm<FormData>({
    defaultValues: {
      department: '',
      field: '',
      roleAsk: '',
      content: '',
      email: '',
      firstName: '',
      lastName: '',
      publicMode: true,
      studentId: '',
      title: ''
    },
    resolver: yupResolver(CreateQuestionSchema)
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  const departmentId = form.watch('department')
  const { data: fields } = useQuery({
    queryKey: ['fields', departmentId],
    queryFn: () => getFields(parseInt(departmentId)),
    enabled: !!departmentId
  })

  const { data: rolesAsk } = useQuery({
    queryKey: ['rolesAsk'],
    queryFn: getRolesAsk
  })

  return (
    <div className='flex justify-center py-6 bg-primary-bg h-[100vh]'>
      <div className='w-2/3 bg-white px-6 py-3 shadow-lg rounded-lg'>
        <h1 className='font-bold text-2xl text-center uppercase mb-6'>Đặt câu hỏi cho ban tư vấn</h1>
        <div>
          <Form {...form}>
            <form>
              <div className='grid grid-cols-12 gap-2 mb-4'>
                <div className='col-span-4'>
                  <FormField
                    control={form.control}
                    name='department'
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Khoa' />
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
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-4'>
                  <FormField
                    control={form.control}
                    name='field'
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Ngành' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fields?.data.data.map((field) => (
                              <SelectItem key={field.id} value={String(field.id)}>
                                {field.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-4'>
                  <FormField
                    control={form.control}
                    name='field'
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Vai trò' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rolesAsk?.data.data.map((roleAsk) => (
                              <SelectItem key={roleAsk.id} value={String(roleAsk.id)}>
                                {roleAsk.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className='grid grid-cols-12 gap-4 mb-4'>
                <div className='col-span-4'>
                  <FormField
                    control={form.control}
                    name='studentId'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder='Mã số sinh viên' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-4'>
                  <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder='Họ' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-4'>
                  <FormField
                    control={form.control}
                    name='lastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder='Tên' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className='grid grid-cols-12 gap-3 mb-4'>
                <div className='col-span-5'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder='Email' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-7'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder='Tiêu đề' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className='mb-4'>
                <ReactQuill theme='snow' value={value} onChange={setValue} />
              </div>
              <div className='mb-4'>
                <FormField
                  control={form.control}
                  name='publicMode'
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
                <Button type='submit' className='text-center w-1/3'>
                  Gửi câu hỏi
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

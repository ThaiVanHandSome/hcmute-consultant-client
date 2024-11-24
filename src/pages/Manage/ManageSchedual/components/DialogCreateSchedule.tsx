import { createSchedule } from '@/apis/consultant.api'
import DatePicker from '@/components/dev/DatePicker'
import CheckboxCustom from '@/components/dev/Form/CheckboxCustom'
import Editor from '@/components/dev/Form/Editor'
import InputCustom from '@/components/dev/Form/InputCustom'
import TimePickerCustom from '@/components/dev/TimePickerCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { ErrorResponse } from '@/types/utils.type'
import { CreateScheduleSchema } from '@/utils/rules'
import { isAxiosUnprocessableEntity } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export type CreateScheduleFormData = yup.InferType<typeof CreateScheduleSchema>

interface Props {
  readonly children: React.ReactNode
}

export default function DialogCreateSchedule({ children }: Props) {
  const form = useForm<CreateScheduleFormData>({
    defaultValues: {
      title: '',
      content: '',
      location: '',
      link: '',
      mode: false,
      statusPublic: true,
      consultationDate: '',
      consultationTime: '',
      type: false
    },
    resolver: yupResolver(CreateScheduleSchema)
  })

  const [isOnline, setIsOnline] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const [date, setDate] = useState<Date | undefined>(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })
  const [time, setTime] = useState<string | undefined>()

  const handleCheckedChange = (val: boolean) => {
    form.setValue('mode', val)
    setIsOnline(val)
  }

  const createScheduleMutation = useMutation({
    mutationFn: (body: CreateScheduleFormData) => createSchedule(body)
  })

  const onSubmit = form.handleSubmit((values) => {
    values.consultationDate = format(String(date), 'yyyy-MM-dd')
    values.consultationTime = time
    createScheduleMutation.mutate(values, {
      onSuccess: (res) => {
        toast({
          description: res.data.message
        })
        setOpen(false)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<{ field: string; message: string }[]>>(error)) {
          const formError = error.response?.data.data
          formError?.forEach(({ field, message }) => {
            form.setError(field as keyof CreateScheduleFormData, {
              message: message,
              type: 'server'
            })
          })
        }
      }
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='max-w-[800px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Tạo buổi tư vấn</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <InputCustom control={form.control} name='title' label='Tiêu đề' placeholder='Nhập tiêu đề' />
              <Editor control={form.control} name='content' label='Nội dung' />
              <div className='flex items-center space-x-2 my-2'>
                <Switch id='mode' checked={isOnline} onCheckedChange={(val) => handleCheckedChange(val)} />
                <Label htmlFor='mode'>{isOnline ? 'Online' : 'Offline'}</Label>
              </div>
              <DatePicker date={date} setDate={setDate} placeholder='Chọn ngày' label='Ngày tư vấn' />
              <TimePickerCustom time={time} setTime={setTime} label='Giờ tư vấn' placeholder='Chọn giờ' />
              {isOnline && <InputCustom control={form.control} name='link' placeholder='Nhập link' label='Link' />}
              {!isOnline && (
                <InputCustom control={form.control} name='location' placeholder='Nhập địa chỉ' label='Địa chỉ' />
              )}
              <CheckboxCustom control={form.control} name='statusPublic' label='Công khai' />
              <Button disabled={createScheduleMutation.isPending} isLoading={createScheduleMutation.isPending}>
                Tạo
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

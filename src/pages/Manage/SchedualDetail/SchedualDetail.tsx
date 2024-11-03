import { confirmSchedual, getSchedualById } from '@/apis/consultant.api'
import AvatarCustom from '@/components/dev/AvatarCustom'
import DatePicker from '@/components/dev/DatePicker'
import Editor from '@/components/dev/Form/Editor'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import TimePickerCustom from '@/components/dev/TimePickerCustom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import { SchedualConfirm } from '@/types/consultant.type'
import { FormControlItem } from '@/types/utils.type'
import { SchedualConfirmSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { omitBy } from 'lodash'
import { EllipsisVertical, ReplyIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'

const statusPublicSelectionData: FormControlItem[] = [
  {
    value: 'true',
    label: 'Công khai'
  },
  {
    value: 'false',
    label: 'Riêng tư'
  }
]

const statusConfirmedSelectionData: FormControlItem[] = [
  {
    value: 'true',
    label: 'Đã duyệt'
  },
  {
    value: 'false',
    label: 'Chưa duyệt'
  }
]

const modeSelectionData: FormControlItem[] = [
  {
    value: 'true',
    label: 'Online'
  },
  {
    value: 'false',
    label: 'Offline'
  }
]

type FormData = yup.InferType<typeof SchedualConfirmSchema>

export const getBoolean = (value: string | undefined) => {
  if (value === 'true') return true
  if (value == 'false') return false
  return undefined
}

const getTextOfBoolean = (value: boolean) => {
  if (value === true) return 'true'
  if (value === false) return 'false'
  return ''
}

export default function SchedualDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const formReset = useRef<boolean>(false)
  const form = useForm<FormData>({
    defaultValues: {
      title: '',
      content: '',
      mode: 'true',
      statusPublic: 'true',
      statusConfirmed: 'false',
      link: '',
      location: ''
    },
    resolver: yupResolver(SchedualConfirmSchema)
  })

  const mode = getBoolean(form.watch('mode'))

  const [date, setDate] = useState<Date | undefined>(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })
  const [time, setTime] = useState<string | undefined>()

  const { data: schedualResponse } = useQuery({
    queryKey: ['schedule', id],
    queryFn: () => getSchedualById(parseInt(id as string)),
    enabled: !!id
  })
  const schedule = schedualResponse?.data.data

  const confirmSchedualMutation = useMutation({
    mutationFn: ({ body, scheduleId }: { body: SchedualConfirm; scheduleId: number }) =>
      confirmSchedual(scheduleId, body)
  })

  const onSubmit = form.handleSubmit((values) => {
    values.content = `<div class="editor">${values.content}</div>`
    const body: SchedualConfirm = omitBy(
      {
        title: values.title,
        content: values.content,
        consultationDate: format(String(date), 'yyyy-MM-dd'),
        consultationTime: time ?? '00:00',
        link: values.link ?? '',
        location: values.location ?? '',
        mode: getBoolean(values.mode),
        statusConfirmed: getBoolean(values.statusConfirmed),
        statusPublic: getBoolean(values.statusPublic)
      },
      (value) => value === ''
    )
    const scheduleId = schedule?.id as number
    confirmSchedualMutation.mutate(
      { body, scheduleId },
      {
        onSuccess: (res) => {
          toast({
            variant: 'success',
            description: res.data.message
          })
          navigate(path.manageSchedule)
        }
      }
    )
  })

  useEffect(() => {
    if (schedule?.statusConfirmed) {
      form.reset({
        content: schedule.content,
        link: schedule.link,
        location: schedule.location,
        mode: getTextOfBoolean(schedule.mode),
        statusConfirmed: getTextOfBoolean(schedule.statusConfirmed),
        statusPublic: getTextOfBoolean(schedule.statusPublic),
        title: schedule.title
      })
    }
    formReset.current = true
  }, [schedule])

  const isReadOnly = schedule?.statusConfirmed

  return (
    <div>
      {formReset.current && (
        <>
          <div className='font-semibold mb-3 text-2xl'>{schedule?.title}</div>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-2'>
              <AvatarCustom url={schedule?.userName} className='size-9' />
              <p className='font-bold text-sm'>{schedule?.userName}</p>
              <div className='text-sm italic'>
                {schedule?.consultationDate} {schedule?.consultationTime}
              </div>
              <Badge variant='destructive'>{schedule?.statusConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</Badge>
            </div>
            <div className='flex items-center space-x-2'>
              <div
                aria-hidden='true'
                className='size-9 flex items-center justify-center rounded-full hover:bg-secondary cursor-pointer'
              >
                <ReplyIcon className='size-4 text-secondary-foreground' />
              </div>
              <div className='size-9 flex items-center justify-center rounded-full hover:bg-secondary cursor-pointer'>
                <EllipsisVertical className='size-4 text-secondary-foreground' />
              </div>
            </div>
          </div>
          <div className='bg-background px-6 rounded-lg shadow-xl flex items-center justify-center py-2'>
            <div className='w-2/3 bg-primary-bg px-4 py-2 rounded-lg'>
              <div dangerouslySetInnerHTML={{ __html: schedule?.content as string }}></div>
            </div>
          </div>
          <Separator className='my-4' />
          <div className='px-6 py-2 bg-background rounded-xl shadow-xl'>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <Badge variant='outline'>Xác nhận lịch</Badge>
                <div className='grid grid-cols-5 gap-2 mt-2 mb-4'>
                  <SelectionCustom
                    control={form.control}
                    name='statusPublic'
                    data={statusPublicSelectionData}
                    placeholder='Public/Private'
                    label='Công khai'
                    disabled={isReadOnly}
                  />
                  <SelectionCustom
                    control={form.control}
                    name='statusConfirmed'
                    data={statusConfirmedSelectionData}
                    placeholder='Confirm/Not Confirm'
                    label='Trạng thái'
                    disabled={isReadOnly}
                  />
                  <SelectionCustom
                    control={form.control}
                    name='mode'
                    data={modeSelectionData}
                    placeholder='Online/Offline'
                    label='Hình thức'
                    disabled={isReadOnly}
                  />
                  <DatePicker
                    date={date}
                    setDate={setDate}
                    placeholder='Chọn ngày'
                    label='Ngày tư vấn'
                    disabled={isReadOnly}
                  />
                  <TimePickerCustom
                    time={time}
                    setTime={setTime}
                    label='Giờ tư vấn'
                    placeholder='Chọn giờ'
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  {mode && (
                    <InputCustom
                      control={form.control}
                      name='link'
                      placeholder='Nhập link'
                      label='Link meet'
                      readOnly={isReadOnly}
                    />
                  )}
                  {!mode && (
                    <InputCustom
                      control={form.control}
                      name='location'
                      placeholder='Nhập địa chỉ'
                      label='Địa chỉ'
                      readOnly={isReadOnly}
                    />
                  )}
                  <InputCustom
                    control={form.control}
                    name='title'
                    placeholder='Nhập tiêu đề'
                    label='Tiêu đề'
                    readOnly={isReadOnly}
                  />
                  <Editor control={form.control} name='content' label='Nội dung' disabled={isReadOnly} />
                </div>
                {!isReadOnly && (
                  <Button disabled={confirmSchedualMutation.isPending} isLoading={confirmSchedualMutation.isPending}>
                    Xác nhận
                  </Button>
                )}
              </form>
            </Form>
          </div>
        </>
      )}
    </div>
  )
}

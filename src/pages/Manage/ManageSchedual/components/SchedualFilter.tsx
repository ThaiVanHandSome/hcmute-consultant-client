import DatePicker from '@/components/dev/DatePicker'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import { SchedualQueryConfig } from '@/hooks/useSchedualQueryConfig'
import { getBoolean } from '@/pages/Manage/SchedualDetail/SchedualDetail'
import { FormControlItem } from '@/types/utils.type'
import { parseDate } from '@/utils/utils'
import { format } from 'date-fns'
import { isUndefined, omitBy } from 'lodash'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

interface Props {
  readonly queryConfig: SchedualQueryConfig
}

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

export default function SchedualFilter({ queryConfig }: Props) {
  const form = useForm({
    defaultValues: {
      title: '',
      statusPublic: '',
      statusConfirmed: '',
      mode: ''
    }
  })

  const navigate = useNavigate()

  const defaultStartDate = parseDate(queryConfig.startDate)
  const defaultEndDate = parseDate(queryConfig.endDate)
  const [startDate, setStartDate] = useState<Date | undefined>(defaultStartDate as Date)
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    if (defaultEndDate) return defaultEndDate
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })

  const statusPublic = getBoolean(form.watch('statusPublic'))
  const statusConfirmed = getBoolean(form.watch('statusConfirmed'))
  const mode = getBoolean(form.watch('mode'))

  const onSubmit = form.handleSubmit((values) => {
    const title = values.title
    navigate({
      pathname: path.manageSchedule,
      search: createSearchParams({
        ...queryConfig,
        title
      }).toString()
    })
  })

  useEffect(() => {
    navigate({
      pathname: path.manageSchedule,
      search: createSearchParams(
        omitBy(
          {
            ...queryConfig,
            statusPublic: String(statusPublic),
            statusConfirmed: String(statusConfirmed),
            mode: String(mode),
            startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
            endDate: endDate ? format(endDate, 'yyyy-MM-dd') : ''
          },
          (value) => isUndefined(value) || value === 'undefined' || value === ''
        )
      ).toString()
    })
  }, [startDate, endDate, statusPublic, statusConfirmed, mode])

  return (
    <div>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div>
            <div className='grid grid-cols-5 gap-2 mb-3'>
              <SelectionCustom
                control={form.control}
                name='statusPublic'
                data={statusPublicSelectionData}
                placeholder='Public/Private'
              />
              <SelectionCustom
                control={form.control}
                name='statusConfirmed'
                data={statusConfirmedSelectionData}
                placeholder='Confirm/Not Confirm'
              />
              <SelectionCustom
                control={form.control}
                name='mode'
                data={modeSelectionData}
                placeholder='Online/Offline'
              />
              <DatePicker date={startDate} setDate={setStartDate} placeholder='Chọn ngày bắt đầu' />
              <DatePicker date={endDate} setDate={setEndDate} placeholder='Chọn ngày kết thúc' />
            </div>
            <div className='grid grid-cols-5 gap-4'>
              <div className='col-span-4'>
                <InputCustom control={form.control} name='title' placeholder='Nhập tiêu đề để tìm kiếm' />
              </div>
              <Button className='col-span-1'>Tìm kiếm</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

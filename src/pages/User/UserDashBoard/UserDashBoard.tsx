import {
  getUserConsultantScheduleStatistics,
  getUserConversationStatistics,
  getUserQuestionStatistics,
  getUserRatingStatistics,
  getUserStatistics
} from '@/apis/statistics.api'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import ChartWithYear from '@/components/dev/ChartWithYear'
import { ChartStatistics } from '@/types/statistics.type'
import { SuccessResponse } from '@/types/utils.type'
import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useState } from 'react'

const statisticType = {
  question: 'question',
  rating: 'rating',
  conversation: 'conversation',
  consultantSchedule: 'consultant-schedule'
} as const

const statisticDataType = [
  {
    type: statisticType.question,
    label: 'Số câu hỏi',
    getData: getUserQuestionStatistics,
    keyFn: 'questions'
  },
  {
    type: statisticType.rating,
    label: 'Số bài đánh giá',
    getData: getUserRatingStatistics,
    keyFn: 'ratings'
  },
  {
    type: statisticType.conversation,
    label: 'Số cuộc hội thoại',
    getData: getUserConversationStatistics,
    keyFn: 'conversations'
  },
  {
    type: statisticType.consultantSchedule,
    label: 'Số lịch tư vấn',
    getData: getUserConsultantScheduleStatistics,
    keyFn: 'consultant-schedule'
  }
] as const

export default function UserDashBoard() {
  const [year, setYear] = useState<string>('2024')
  const [type, setType] = useState<string>(statisticType.question)

  const { data: userStatistics } = useQuery({
    queryKey: ['user-statistics'],
    queryFn: getUserStatistics
  })

  const renderStatisticItem = (label: string, value: number) => (
    <div className='col-span-1 px-6 py-2 rounded-lg shadow-lg text-center'>
      <div className='font-bold text-4xl mb-2 text-primary text-[#2563eb]'>{value}</div>
      <div className='text-sm'>{label}</div>
    </div>
  )

  const statisticsData = [
    {
      label: 'Tổng số câu hỏi đã đặt ra',
      value: userStatistics?.data.data.totalQuestions
    },
    {
      label: 'Tổng số câu hỏi trên 500 like',
      value: userStatistics?.data.data.questionsOver500Views
    },
    {
      label: 'Tổng số lịch hẹn tư vấn',
      value: userStatistics?.data.data.totalAppointments
    },
    {
      label: 'Tổng số form đánh giá đã gửi',
      value: userStatistics?.data.data.totalRatings
    }
  ]

  const selectedType = statisticDataType.find((item) => item.type === type)

  return (
    <div>
      <div className='grid grid-cols-4 gap-4'>
        {statisticsData.map((item) => renderStatisticItem(item.label, item.value as number))}
      </div>
      <Separator className='my-4' />
      <div className='flex justify-between items-center mb-2'>
        <div>
          <Select defaultValue={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder='Chọn loại' />
            </SelectTrigger>
            <SelectContent className='w-[180px]'>
              <SelectGroup>
                {statisticDataType.map((item) => (
                  <SelectItem key={item.type} value={item?.type}>
                    {item?.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select defaultValue={year} onValueChange={setYear}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Chọn năm' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Years</SelectLabel>
                <SelectItem value='2020'>2020</SelectItem>
                <SelectItem value='2021'>2021</SelectItem>
                <SelectItem value='2022'>2022</SelectItem>
                <SelectItem value='2023'>2023</SelectItem>
                <SelectItem value='2024'>2024</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='mt-8'>
        <ChartWithYear
          year={year}
          label={selectedType?.label as string}
          getData={
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            selectedType?.getData as (year: number) => Promise<AxiosResponse<SuccessResponse<ChartStatistics[]>, any>>
          }
          keyFn={selectedType?.keyFn as string}
        />
      </div>
    </div>
  )
}

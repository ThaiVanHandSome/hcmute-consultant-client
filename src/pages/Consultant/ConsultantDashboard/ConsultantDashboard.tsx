import {
  getConsultantStatisticAnswerApprovals,
  getConsultantStatisticAnswersGiven,
  getConsultantStatisticConversations,
  getConsultantStatisticDeletedQuestions,
  getConsultantStatisticPosts,
  getConsultantStatistics,
  getConsultantStatisticSchedules
} from '@/apis/statistics.api'
import ChartWithYear from '@/components/dev/ChartWithYear'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ChartStatistics } from '@/types/statistics.type'
import { SuccessResponse } from '@/types/utils.type'
import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useState } from 'react'

const statisticType = {
  deletedQuestions: 'deletedQuestions',
  conversations: 'conversations',
  consultationSchedules: 'consultationSchedules',
  approvedPosts: 'approvedPosts',
  answersGiven: 'answersGiven',
  answerApprovals: 'answerApprovals'
} as const

const statisticDataType = [
  {
    type: statisticType.deletedQuestions,
    label: 'Số câu hỏi đã xóa',
    getData: getConsultantStatisticDeletedQuestions,
    keyFn: 'deleted-questions'
  },
  {
    type: statisticType.conversations,
    label: 'Số cuộc hội thoại',
    getData: getConsultantStatisticConversations,
    keyFn: 'conversations'
  },
  {
    type: statisticType.consultationSchedules,
    label: 'Số lịch tư vấn',
    getData: getConsultantStatisticSchedules,
    keyFn: 'schedules'
  },
  {
    type: statisticType.approvedPosts,
    label: 'Số bài đăng',
    getData: getConsultantStatisticPosts,
    keyFn: 'posts'
  },
  {
    type: statisticType.answersGiven,
    label: 'Số câu trả lời',
    getData: getConsultantStatisticAnswersGiven,
    keyFn: 'answers-given'
  },
  {
    type: statisticType.answerApprovals,
    label: 'Số câu hỏi đã chuyển tiếp',
    getData: getConsultantStatisticAnswerApprovals,
    keyFn: 'answer-approvals'
  }
] as const

export default function ConsultantDashboard() {
  const [year, setYear] = useState<string>('2024')
  const [type, setType] = useState<string>(statisticType.deletedQuestions)

  const { data: consultantStatistics } = useQuery({
    queryKey: ['consutant-statistics'],
    queryFn: getConsultantStatistics
  })

  const renderStatisticItem = (label: string, value: number) => (
    <div className='col-span-1 px-6 py-2 rounded-lg shadow-lg text-center'>
      <div className='font-bold text-4xl mb-2 text-primary text-[#2563eb]'>{value}</div>
      <div className='text-sm'>{label}</div>
    </div>
  )

  const selectedType = statisticDataType.find((item) => item.type === type)

  const statisticsData = [
    {
      label: 'Tổng số câu hỏi trong ngày',
      value: consultantStatistics?.data.data.totalQuestionsInDay
    },
    {
      label: 'Tổng số câu hỏi đã chuyển tiếp',
      value: consultantStatistics?.data.data.totalForwardedQuestions
    },
    {
      label: 'Tổng số câu hỏi đã xóa',
      value: consultantStatistics?.data.data.totalDeletedQuestions
    },
    {
      label: 'Tổng số câu hỏi đã nhận',
      value: consultantStatistics?.data.data.totalAnswersGiven
    },
    {
      label: 'Tổng số lịch tư vấn',
      value: consultantStatistics?.data.data.totalConsultantSchedule
    },
    {
      label: 'Tổng số bài đăng',
      value: consultantStatistics?.data.data.totalApprovedPosts
    },
    {
      label: 'Tổng số cuộc hội thoại',
      value: consultantStatistics?.data.data.totalConversations
    }
  ]

  return (
    <div>
      <div className='grid grid-cols-4 gap-4'>
        {statisticsData.map((item) => renderStatisticItem(item.label, item.value as number))}
      </div>
      <div className='flex justify-between items-center mt-8'>
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
            selectedType?.getData as (year: number) => Promise<AxiosResponse<SuccessResponse<ChartStatistics[]>, any>>
          }
          keyFn={selectedType?.keyFn as string}
        />
      </div>
    </div>
  )
}

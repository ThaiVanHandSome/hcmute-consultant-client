import {
  getUserConversationStatistics,
  getUserQuestionStatistics,
  getUserRatingStatistics,
  getUserStatistics
} from '@/apis/statistics.api'
import { Separator } from '@/components/ui/separator'
import ChartWithYear from '@/pages/User/UserDashBoard/components/ChartWithYear'
import { useQuery } from '@tanstack/react-query'

export default function UserDashBoard() {
  const { data: userStatistics } = useQuery({
    queryKey: ['user-statistics'],
    queryFn: getUserStatistics
  })

  const renderStatisticItem = (label: string, value: number) => (
    <div className='col-span-1 px-6 py-2 rounded-lg shadow-lg text-center'>
      <div className='font-bold text-4xl mb-2 text-primary'>{value}</div>
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

  return (
    <div>
      <div className='grid grid-cols-4 gap-4'>
        {statisticsData.map((item) => renderStatisticItem(item.label, item.value as number))}
      </div>
      <Separator className='my-4' />
      <div className='mt-8'>
        <ChartWithYear
          title='Thống kê số lượng câu hỏi theo năm'
          label='Số câu hỏi'
          getData={getUserQuestionStatistics}
          keyFn='questions'
        />
      </div>
      <Separator className='my-4' />
      <div className='mt-8'>
        <ChartWithYear
          title='Thống kê số lượng bài đánh giá theo năm'
          label='Số bài đánh giá'
          getData={getUserRatingStatistics}
          keyFn='ratings'
        />
      </div>
      <Separator className='my-4' />
      <div className='mt-8'>
        <ChartWithYear
          title='Thống kê số cuộc hội thoại theo năm'
          label='Số cuộc hội thoại'
          getData={getUserConversationStatistics}
          keyFn='conversations'
        />
      </div>
    </div>
  )
}

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

  return (
    <div>
      <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-1 px-6 py-2 rounded-lg shadow-lg text-center'>
          <div className='font-bold text-4xl mb-2 text-primary'>{userStatistics?.data.data.totalQuestions}</div>
          <div className='text-sm'>Tổng số câu hỏi đã đặt ra</div>
        </div>
        <div className='col-span-1 px-6 py-2 rounded-lg shadow-lg text-center'>
          <div className='font-bold text-4xl mb-2 text-primary'>{userStatistics?.data.data.questionsOver500Views}</div>
          <div className='text-sm'>Tổng số câu hỏi trên 500 like</div>
        </div>
        <div className='col-span-1 px-6 py-2 rounded-lg shadow-lg text-center'>
          <div className='font-bold text-4xl mb-2 text-primary'>{userStatistics?.data.data.totalAppointments}</div>
          <div className='text-sm'>Tổng số lịch hẹn tư vấn</div>
        </div>
        <div className='col-span-1 px-6 py-2 rounded-lg shadow-lg text-center'>
          <div className='font-bold text-4xl mb-2 text-primary'>{userStatistics?.data.data.totalRatings}</div>
          <div className='text-sm'>Tổng số form đánh giá đã gửi</div>
        </div>
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

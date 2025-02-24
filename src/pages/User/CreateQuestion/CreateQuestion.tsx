import QuestionForm from '@/components/dev/QuestionForm'
import { AlertCircle, BookOpen, Clock3, HelpCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/apis/user.api'

export default function CreateQuestion() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  })

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      <div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        {/* Header Section */}
        <div className='max-w-2xl mx-auto text-center mb-10'>
          <div className='flex justify-center mb-4'>
            <div className='bg-primary/10 p-3 rounded-full'>
              <HelpCircle className='w-6 h-6 text-primary' />
            </div>
          </div>
          <h1 className='text-2xl font-semibold text-gray-900 mb-2'>Trung tâm hỗ trợ sinh viên</h1>
          <p className='text-sm text-gray-600'>Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn</p>
        </div>

        <div className='grid lg:grid-cols-12 gap-6'>
          {/* Sidebar Information */}
          <div className='lg:col-span-4 space-y-4'>
            {/* Guidelines Card */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-5'>
              <div className='space-y-4'>
                <div className='flex gap-3'>
                  <BookOpen className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                  <div>
                    <p className='text-sm text-gray-600'>Các vấn đề: học tập, học bổng, chính sách sinh viên...</p>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <Clock3 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                  <div>
                    <p className='text-sm text-gray-600'>
                      Thời gian phản hồi: <span className='font-medium'>1-2 ngày làm việc</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Card */}
            <div className='bg-red-50 rounded-lg border border-red-100 p-5'>
              <div className='flex gap-3'>
                <AlertCircle className='w-5 h-5 text-red-500 shrink-0 mt-0.5' />
                <p className='text-sm text-red-600'>
                  Không đặt câu hỏi có nội dung không phù hợp. Tài khoản vi phạm sẽ bị khóa.
                </p>
              </div>
            </div>
          </div>

          {/* Main Form Section */}
          <div className='lg:col-span-8'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-6'>
              <QuestionForm question={undefined} profileData={profile?.data.data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

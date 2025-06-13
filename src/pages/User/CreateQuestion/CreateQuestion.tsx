import { BookOpen, Clock3, AlertCircle } from 'lucide-react'
import QuestionForm from '@/components/dev/QuestionForm/QuestionForm'

export default function CreateQuestion() {
  return (
    <div className='container py-8'>
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Đặt câu hỏi</h1>
          <p className='text-muted-foreground'>Đặt câu hỏi để được giảng viên và chuyên viên hỗ trợ</p>
        </div>

        <div className='grid lg:grid-cols-12 gap-6'>
          {/* Sidebar Information */}
          <div className='lg:col-span-4 space-y-4'>
            {/* Guidelines Card */}
            <div className='bg-background rounded-lg shadow-sm border border-secondary p-5'>
              <div className='space-y-4'>
                <div className='flex gap-3'>
                  <BookOpen className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                  <div>
                    <p className='text-sm text-secondary-foreground'>
                      Các vấn đề: học tập, học bổng, chính sách sinh viên...
                    </p>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <Clock3 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                  <div>
                    <p className='text-sm text-secondary-foreground'>
                      Thời gian phản hồi: <span className='font-medium'>1-2 ngày làm việc</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Card */}
            <div className='bg-destructive rounded-lg border border-red-100 p-5'>
              <div className='flex gap-3'>
                <AlertCircle className='w-5 h-5 text-destructive-foreground shrink-0 mt-0.5' />
                <p className='text-sm text-destructive-foreground'>
                  Không đặt câu hỏi có nội dung không phù hợp. Tài khoản vi phạm sẽ bị khóa.
                </p>
              </div>
            </div>
          </div>

          {/* Main Form Section */}
          <div className='lg:col-span-8'>
            <div className='bg-background rounded-lg shadow-sm border border-secondary p-6'>
              <QuestionForm question={undefined} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import QuestionForm from '@/components/dev/QuestionForm'
import UserGuide from '@/pages/User/CreateQuestion/components/UserGuide'
import { MailWarningIcon } from 'lucide-react'
import { useState } from 'react'

export const guideTypes = {
  department: 'department',
  field: 'field',
  role: 'role',
  studentId: 'studentId',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  title: 'title',
  content: 'content'
} as const

export default function CreateQuestion() {
  const [guideActive, setGuideActive] = useState<keyof typeof guideTypes>()
  return (
    <div className='py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-9 bg-background text-foreground px-6 py-3 shadow-lg rounded-lg'>
            <h1 className='font-extrabold text-2xl text-left uppercase mb-6 text-primary tracking-wide'>
              Đặt câu hỏi cho ban tư vấn
            </h1>
            <div>
              <QuestionForm setGuideActive={setGuideActive} />
            </div>
          </div>
          <div className='col-span-3'>
            <div className='px-4 py-4 bg-background text-foreground rounded-lg shadow-md mb-6'>
              <p className='text-xl font-semibold text-blue-600 mb-2 uppercase'>Tiêu chí</p>
              <p className='text-md text-foreground mb-3'>
                Mọi thắc mắc về việc học tập, học bổng, các chính sách của trường,... Các bạn đều có thể đặt câu hỏi tại
                đây.
              </p>
              <p className='text-md text-foreground mb-3'>
                Sau khi đặt câu hỏi, sẽ mất khoảng <strong>1 ngày</strong> để câu hỏi của bạn được xem xét và được
                duyệt. Hãy chú ý thông báo nhé!
              </p>
              <div className='px-4 py-3 bg-red-100 border-l-4 border-red-600 text-red-700 mb-3 rounded'>
                <p className='text-md font-bold mb-1 flex items-center'>
                  <MailWarningIcon className='mr-1' />
                  Cảnh báo:
                </p>
                <p className='text-md'>
                  Vui lòng không đặt các câu hỏi <strong>khiếm nhã</strong>. Câu hỏi sẽ được kiểm duyệt chặt chẽ. Nếu
                  phát hiện sai phạm, tài khoản sẽ bị cấm <strong>vĩnh viễn</strong>.
                </p>
              </div>
            </div>

            {guideActive && (
              <div className=' rounded-lg shadow'>
                <UserGuide guideType={guideActive} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

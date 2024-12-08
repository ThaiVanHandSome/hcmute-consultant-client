import { Badge } from '@/components/ui/badge'
import { Question } from '@/types/question.type'
import { formatDate } from '@/utils/utils'
import { GlobeIcon } from '@radix-ui/react-icons'

interface Props {
  readonly question: Question
}

export default function QuestionHeader({ question }: Props) {
  return (
    <div className='relative'>
      <div className='flex flex-col lg:flex-row items-start justify-center lg:items-center lg:justify-start space-y-2 lg:space-x-2 lg:space-y-0 mb-2'>
        <Badge>{question.department.name}</Badge>
        <Badge>{question.field.name}</Badge>
      </div>
      <div className='flex items-start justify-between w-full max-w-full'>
        <div className='flex items-center mb-2'>
          <img src={question.askerAvatarUrl} alt='avatar' className='size-10 mr-2 rounded-full' />
          <div>
            <div className='font-bold mr-2 text-sm'>
              {question.askerLastname} {question.askerFirstname}
            </div>
            <div className='text-xs text-gray-400 flex items-center'>
              <span className='mr-1'>Tạo vào ngày {formatDate(question.createdAt)}</span>
              <GlobeIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

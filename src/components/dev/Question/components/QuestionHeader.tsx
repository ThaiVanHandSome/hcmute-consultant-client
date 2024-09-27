import { EyeIcon } from '@/icons'
import { Question } from '@/types/question.type'
import { formatDate } from '@/utils/utils'
import { GlobeIcon } from '@radix-ui/react-icons'

interface Props {
  readonly question: Question
}

export default function QuestionHeader({ question }: Props) {
  return (
    <div className='flex items-start justify-between'>
      <div className='flex items-center mb-2'>
        <img src={question.askerAvatarUrl} alt='avatar' className='size-10 mr-2 rounded-full' />
        <div>
          <div className='font-bold mr-2 text-sm'>
            {question.askerFirstname} {question.askerLastname}
          </div>
          <div className='text-xs text-gray-400 flex items-center'>
            <span className='mr-1'>{formatDate(question.createdAt)}</span>
            <GlobeIcon />
          </div>
        </div>
      </div>
      <div className='flex items-center'>
        <EyeIcon />
        <span className='ml-1 font-bold text-sm'>{question.views}</span>
      </div>
    </div>
  )
}

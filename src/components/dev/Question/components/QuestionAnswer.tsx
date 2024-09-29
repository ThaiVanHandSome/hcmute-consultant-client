import { Question } from '@/types/question.type'
import { formatDate } from '@/utils/utils'

interface Props {
  readonly question: Question
}

export default function QuestionAnswer({ question }: Props) {
  return (
    <div className='flex'>
      <img src={question.answerAvatarUrl} alt='avatar' className='size-8 mr-2 rounded-full' />
      <div>
        <div className='rounded-3xl bg-[#f0f2f5] px-4 py-2'>
          <div className='font-bold text-sm'>
            {question.answerUserLastname} {question.answerUserFirstname}
          </div>
          <div dangerouslySetInnerHTML={{ __html: question.answerContent }}></div>
        </div>
        <div className='text-[10px] text-gray-400 ml-4'>{formatDate(question.answerCreatedAt)}</div>
      </div>
    </div>
  )
}

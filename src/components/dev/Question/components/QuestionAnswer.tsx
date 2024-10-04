import AvatarCustom from '@/components/dev/AvatarCustom'
import { Question } from '@/types/question.type'
import { formatDate } from '@/utils/utils'

interface Props {
  readonly question: Question
}

export default function QuestionAnswer({ question }: Props) {
  return (
    <div className='flex w-full max-w-full'>
      <AvatarCustom url={question.answerAvatarUrl} className='size-8 mr-2' />
      <div>
        <div className='rounded-2xl bg-secondary text-secondary-foreground px-4 py-2'>
          <div className='font-bold text-sm'>
            {question.answerUserLastname} {question.answerUserFirstname}
          </div>
          <div dangerouslySetInnerHTML={{ __html: question.answerContent }} className='text-sm'></div>
        </div>
        <div className='text-[10px] ml-4'>{formatDate(question.answerCreatedAt)}</div>
      </div>
    </div>
  )
}

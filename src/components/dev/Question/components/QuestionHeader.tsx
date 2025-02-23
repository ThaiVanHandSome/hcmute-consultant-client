import QuestionAction from '@/components/dev/Question/components/QuestionAction'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Question } from '@/types/question.type'
import { formatDate } from '@/utils/utils'
import { GlobeIcon } from '@radix-ui/react-icons'

interface Props {
  readonly question: Question
}

export default function QuestionHeader({ question }: Props) {
  return (
    <div className='relative'>
      <div className='flex items-center justify-between px-3 py-2'>
        <div className='flex flex-col items-start justify-center space-y-1'>
          <Badge>{question.department.name}</Badge>
          <Badge>{question.field.name}</Badge>
        </div>
        <QuestionAction question={question} />
      </div>
      <Separator className='my-1' />
      <div className='flex items-start justify-between w-full max-w-full px-4'>
        <div className='flex items-center mb-2'>
          <img src={question.askerAvatarUrl} alt='avatar' className='size-10 mr-2 rounded-full' />
          <div>
            <div className='flex items-center space-x-2'>
              <div className='font-semibold mr-1 text-sm'>
                {question.askerLastname} {question.askerFirstname}
              </div>
              <div className='text-xs text-gray-400 flex items-center'>
                <span className='mr-1'>{formatDate(question.createdAt)}</span>
                <GlobeIcon />
              </div>
            </div>
            <Badge variant='secondary' className='font-normal'>
              {question.roleAsk.name}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

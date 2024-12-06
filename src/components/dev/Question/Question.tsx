import clsx from 'clsx'

import { Separator } from '@/components/ui/separator'
import { Question as QuestionType } from '@/types/question.type'
import QuestionHeader from '@/components/dev/Question/components/QuestionHeader'
import QuestionContent from '@/components/dev/Question/components/QuestionContent'
import QuestionAnswer from '@/components/dev/Question/components/QuestionAnswer'
import { MessageCircleIcon } from 'lucide-react'
import QuestionAction from '@/components/dev/Question/components/QuestionAction'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  readonly question: QuestionType
}

export default function Question({ question, className }: Props) {
  return (
    <div
      className={clsx(
        className,
        'bg-primary-bg text-foreground rounded-md shadow-sm w-full max-w-full overflow-hidden border'
      )}
    >
      <div className='px-4 py-3 mb-6'>
        <QuestionHeader question={question} />
        <QuestionContent question={question} />
        <QuestionAction question={question}/>
        {question.answerContent && (
          <>
            <Separator className='my-4' />
            <div className='flex items-center space-x-1 mb-3'>
              <MessageCircleIcon strokeWidth={1.25} />
              <span className='font-bold'>Câu trả lời</span>
            </div>
            <QuestionAnswer question={question} />
          </>
        )}
      </div>
    </div>
  )
}

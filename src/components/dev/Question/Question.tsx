import clsx from 'clsx'

import { Separator } from '@/components/ui/separator'
import { Question as QuestionType } from '@/types/question.type'
import QuestionHeader from '@/components/dev/Question/components/QuestionHeader'
import QuestionContent from '@/components/dev/Question/components/QuestionContent'
import QuestionAnswer from '@/components/dev/Question/components/QuestionAnswer'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  readonly question: QuestionType
}

export default function Question({ question, className }: Props) {
  return (
    <div className={clsx(className, 'bg-white')}>
      <div className='px-4 py-3 rounded-lg shadow-md mb-6'>
        <QuestionHeader question={question} />
        <QuestionContent question={question} />
        {question.answerContent && (
          <>
            <Separator className='my-4' />
            <QuestionAnswer question={question} />
          </>
        )}
      </div>
    </div>
  )
}

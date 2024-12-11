import { Question } from '@/types/question.type'
import FileShow from '@/components/dev/FileShow'

interface Props {
  readonly question: Question
}

export default function QuestionContent({ question }: Props) {
  return (
    <div className='w-full max-w-full'>
      <div>
        <div className='font-semibold text-md italic mb-1 break-words'>{question.title}</div>
        <div
          dangerouslySetInnerHTML={{ __html: question.content }}
          className='mb-4 w-full max-w-full break-words'
        ></div>
      </div>
      {question?.fileName && <FileShow url={question.fileName} />}
    </div>
  )
}

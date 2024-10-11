import { Question } from '@/types/question.type'
import { isImageFile } from '@/utils/utils'
import FileItem from '@/components/dev/FileItem'
import QuestionImage from '@/components/dev/QuestionImage'

interface Props {
  readonly question: Question
}

export default function QuestionContent({ question }: Props) {
  return (
    <div className='w-full max-w-full'>
      <div>
        <div className='font-semibold text-md italic mb-1'>{question.title}</div>
        <div dangerouslySetInnerHTML={{ __html: question.content }} className='mb-4 w-full max-w-full'></div>
      </div>
      {question?.fileName && (
        <>
          {isImageFile(question?.fileName ?? '') && (
            <div className='-mx-4'>
              <QuestionImage url={question.fileName} />
            </div>
          )}
          {!isImageFile(question?.fileName ?? '') && <FileItem url={question?.fileName} />}
        </>
      )}
    </div>
  )
}

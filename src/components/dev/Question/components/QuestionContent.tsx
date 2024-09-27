import { Question } from '@/types/question.type'

interface Props {
  readonly question: Question
}

export default function QuestionContent({ question }: Props) {
  return (
    <div className='px-2'>
      <div className='text-blue-600 font-semibold text-sm'>#{question.department.name}</div>
      <div className='mb-3 text-blue-600 font-semibold text-sm'>#{question.field.name}</div>
      <div className='font-semibold text-md italic mb-2'>🎯 {question.title}</div>
      <div dangerouslySetInnerHTML={{ __html: question.content }} className='mb-4'></div>
      {question.fileName.includes('http') && (
        <div className='flex items-center justify-start'>
          <img src={question.fileName} alt='content-bg' className={'object-cover w-full'} />
        </div>
      )}
    </div>
  )
}

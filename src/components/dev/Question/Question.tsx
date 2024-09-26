import { Separator } from '@/components/ui/separator'
import { EyeIcon } from '@/icons'
import { Question as QuestionType } from '@/types/question.type'
import { formatDate } from '@/utils/utils'
import { GlobeIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  readonly question: QuestionType
}

export default function Question({ question, className }: Props) {
  return (
    <div className={clsx(className, 'bg-white')}>
      <div className='px-4 py-3 rounded-lg shadow-md mb-6'>
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
        <div className='px-2'>
          <div className='text-blue-600 font-semibold text-sm'>#{question.department.name}</div>
          <div className='mb-3 text-blue-600 font-semibold text-sm'>#{question.field.name}</div>
          <div className='font-semibold text-md italic mb-2'>🎯 {question.title}</div>
          <div dangerouslySetInnerHTML={{ __html: question.content }} className='mb-4'></div>
          {question.fileName.includes('http') && (
            <div className='flex items-center justify-start'>
              <img src={question.fileName} alt='content-bg' className={clsx('object-cover w-full')} />
            </div>
          )}
        </div>
        {question.answerContent && (
          <>
            <Separator className='my-4' />
            <div>
              <div className='flex'>
                <img src={question.answerAvatarUrl} alt='avatar' className='size-8 mr-2 rounded-full' />
                <div>
                  <div className='rounded-3xl bg-[#f0f2f5] px-4 py-2'>
                    <div className='font-bold text-sm'>
                      {question.answerUserFirstname} {question.answerUserLastname}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: question.answerContent }}></div>
                  </div>
                  <div className='text-xs text-gray-400 ml-4'>{formatDate(question.answerCreatedAt)}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

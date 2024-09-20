import { Separator } from '@/components/ui/separator'
import { EyeIcon } from '@/icons'
import { Question as QuestionType } from '@/types/question.type'
import { formatDate } from '@/utils/utils'
import { GlobeIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  readonly question: QuestionType
  readonly type?: 'all' | 'user'
}

export default function Question({ question, type = 'all', className }: Props) {
  return (
    <div
      className={clsx(className, {
        'bg-white': type === 'all',
        'bg-primary-bg': type === 'user'
      })}
    >
      <div className='px-4 py-3 rounded-lg shadow-md mb-6'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center mb-2'>
            <img
              src='https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/435116190_1794745547688837_695033224121990189_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEFOc7dmSSU7vb15NsbXRVcAbRqSYGR-PMBtGpJgZH483la9c7bx87IipYQAJCmaNUFuB_I6V1GglCT7OUisAKa&_nc_ohc=Tfkhgvffv3cQ7kNvgERMbSU&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=ADHfltbhANdWHLfZtFl-Hqm&oh=00_AYDYXIj0aYVvkcSodbUivsAJUDUuTAQLGcbUF-sBdafZwQ&oe=66E1DC27'
              alt='avatar'
              className='size-10 mr-2 rounded-full'
            />
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
              <img
                src={question.fileName}
                alt='content-bg'
                className={clsx('object-cover', {
                  'w-1/2': type === 'user',
                  'w-full': type === 'all'
                })}
              />
            </div>
          )}
        </div>
        {question.answerContent && (
          <>
            <Separator className='my-4' />
            <div>
              <div className='flex'>
                <img
                  src='https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/311590829_1254153242092852_4832227332157715848_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGNnmpAkRiZt0npaCZ4oArImf3JOiEdXRuZ_ck6IR1dGwgrTcgAYPXDlKYJIj1Ihc1NJ4SfxczRdoQ60WCQDr4g&_nc_ohc=8Eb09yiYugUQ7kNvgF6K04h&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=AAyfPeAYfunJO1OpTsxrEy7&oh=00_AYCcacHwjFkQWjJJo_7RMtBXa6JhcUp7KemLEDmTqSD83A&oe=66E1B192'
                  alt='avatar'
                  className='size-8 mr-2 rounded-full'
                />
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

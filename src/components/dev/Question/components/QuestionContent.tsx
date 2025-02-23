import { Question } from '@/types/question.type'
import FileShow from '@/components/dev/FileShow'
import { motion } from 'framer-motion'

interface Props {
  readonly question: Question
}

export default function QuestionContent({ question }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-4xl mx-auto p-6'
    >
      <article className='bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6'>
        {/* Title Section */}
        <header className='mb-4'>
          <h2 className='text-xl font-medium text-gray-900 dark:text-gray-100 leading-relaxed'>{question.title}</h2>
        </header>

        {/* Content Section */}
        <div className='prose prose-gray dark:prose-invert max-w-none'>
          <div
            dangerouslySetInnerHTML={{ __html: question.content }}
            className='text-gray-600 dark:text-gray-300 leading-relaxed'
          />
        </div>

        {/* File Attachment Section */}
        {question?.fileName && (
          <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
            <FileShow url={question.fileName} />
          </div>
        )}
      </article>
    </motion.div>
  )
}

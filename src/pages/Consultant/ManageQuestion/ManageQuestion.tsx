import { getAllQuestion } from '@/apis/question.api'
import DataTable from '@/components/dev/DataTable'
import QuestionFilter from '@/components/dev/QuestionFilter'
import path from '@/constants/path'
import useQuestionQueryConfig from '@/hooks/useQuestionQueryConfig'
import { colums } from '@/pages/Consultant/ManageQuestion/components/columns'
import { useQuery } from '@tanstack/react-query'

export default function ManageQuestion() {
  const questionQueryConfig = useQuestionQueryConfig()

  const { data: questions } = useQuery({
    queryKey: ['questions', questionQueryConfig],
    queryFn: () => getAllQuestion(questionQueryConfig)
  })
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-semibold text-lg'>Câu hỏi</h1>
        <p className='text-sm italic'>Quản lý câu hỏi</p>
      </div>
      <div>
        <QuestionFilter queryConfig={questionQueryConfig} path={path.manageQuestion} />
      </div>
      <div>
        {questions && (
          <DataTable columns={colums} data={questions?.data.data.content} size={questions?.data.data.size} />
        )}
      </div>
    </div>
  )
}

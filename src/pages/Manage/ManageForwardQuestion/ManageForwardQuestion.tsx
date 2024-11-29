import { getForwardQuestion } from '@/apis/question.api'
import Paginate from '@/components/dev/PaginationCustom/PaginationCustom'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useForwardQuestionQueryConfig from '@/hooks/useForwardQuestionQueryConfig'
import ForwardQuestionTable from '@/pages/Manage/ManageForwardQuestion/components/ForwardQuestionTable'
import ManageForwardQuestionFilter from '@/pages/Manage/ManageForwardQuestion/components/ManageForwardQuestionFilter'
import { useQuery } from '@tanstack/react-query'

export default function ManageForwardQuestion() {
  const forwardQuestionQueryConfig = useForwardQuestionQueryConfig()
  const { data: forwardQuestions } = useQuery({
    queryKey: ['forward-questions', forwardQuestionQueryConfig],
    queryFn: () => getForwardQuestion(forwardQuestionQueryConfig)
  })
  return (
    <div className='space-y-6'>
      <div>
        <div>
          <h1 className='font-semibold text-lg'>Câu hỏi chuyển tiếp</h1>
          <p className='text-sm italic'>Quản lý câu hỏi chuyển tiếp</p>
        </div>
      </div>
      <div>
        <ManageForwardQuestionFilter queryConfig={forwardQuestionQueryConfig} />
      </div>
      <Separator className='my-2' />
      <div>
        <ForwardQuestionTable forwardQuestions={forwardQuestions?.data.data.content} />
      </div>
      <div>
        <Paginate
          path={path.manageForwardQuestion}
          queryConfig={forwardQuestionQueryConfig}
          pageSize={forwardQuestions?.data.data.totalPages as number}
        />
      </div>
    </div>
  )
}

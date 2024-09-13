import { getAllQuestion } from '@/apis/question.api'
import useQueryConfig, { QueryConfig } from '@/hooks/useQueryConfig'
import { Spinner } from '@/icons'
import Question from '@/pages/User/Home/components/ListQuestion/components/Question'
import { Question as QuestionType } from '@/types/question.type'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export default function ListQuestion() {
  const initialQueryConfig: QueryConfig = useQueryConfig()
  const [listQuestion, setListQuestion] = useState<QuestionType[]>([])
  const [queryConfig, setQueryConfig] = useState(initialQueryConfig)

  const {
    data: questions,
    isLoading,
    isFetching,
    isError
  } = useQuery({
    queryKey: ['questions', queryConfig],
    queryFn: () => getAllQuestion(queryConfig),
    refetchOnMount: true
  })

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollTop + windowHeight >= documentHeight) {
        setQueryConfig((prev) => ({
          ...prev,
          page: String(parseInt(prev.page) + 1)
        }))
      }
    }

    if (!isFetching && !isError) window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isFetching])

  const json = JSON.stringify(initialQueryConfig)
  useEffect(() => {
    setListQuestion([])
    setQueryConfig(initialQueryConfig)
  }, [json])

  const questionJson = JSON.stringify(questions)
  useEffect(() => {
    if (questions?.data.data.content) {
      setListQuestion((prev) => [...prev, ...questions.data.data.content])
    }
  }, [questionJson])

  return (
    <div>
      <div>
        {listQuestion.map((question) => (
          <Question key={question.title} question={question} />
        ))}
      </div>
      <div className='mt-4 flex items-center justify-center'>{isLoading && <Spinner />}</div>
    </div>
  )
}

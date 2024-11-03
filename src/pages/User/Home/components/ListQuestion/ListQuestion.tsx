import { getAllQuestion } from '@/apis/question.api'
import useQuestionQueryConfig, { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { Spinner } from '@/icons'
import Question from '@/components/dev/Question'
import { Question as QuestionType } from '@/types/question.type'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export default function ListQuestion() {
  const initialQuestionQueryConfig: QuestionQueryConfig = useQuestionQueryConfig()
  const [listQuestion, setListQuestion] = useState<QuestionType[]>([])
  const [questionQueryConfig, setQuestionQueryConfig] = useState(initialQuestionQueryConfig)

  const {
    data: questions,
    isLoading,
    isFetching,
    isError
  } = useQuery({
    queryKey: ['questions', questionQueryConfig],
    queryFn: () => getAllQuestion(questionQueryConfig),
    refetchOnMount: true
  })

  // when user scroll to end page => fetch question with next page
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollTop + windowHeight >= documentHeight) {
        setQuestionQueryConfig((prev) => ({
          ...prev,
          page: String(parseInt(prev.page) + 1)
        }))
      }
    }

    if (!isFetching && !isError) window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isFetching, isError])

  // if user choose one of departments => reset list question and set new question query config
  const json = JSON.stringify(initialQuestionQueryConfig)
  useEffect(() => {
    setListQuestion([])
    setQuestionQueryConfig(initialQuestionQueryConfig)
  }, [json])

  const questionJson = JSON.stringify(questions)

  // add new question fetched to state list question
  useEffect(() => {
    if (questions?.data.data.content) {
      setListQuestion((prev) => [...prev, ...questions.data.data.content])
    }
  }, [questionJson])

  return (
    <div>
      <div className='space-y-6'>
        {listQuestion.map((question) => (
          <Question key={question.id} question={question} />
        ))}
      </div>
      <div className='mt-4 flex items-center justify-center'>{isLoading && <Spinner />}</div>
    </div>
  )
}

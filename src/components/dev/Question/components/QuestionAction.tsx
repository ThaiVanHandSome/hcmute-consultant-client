import { checkLike, getLikeCount, likeQuestion, unlikeQuestion } from '@/apis/question.api'
import { Button } from '@/components/ui/button'
import { Question } from '@/types/question.type'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { ThumbsUpIcon } from 'lucide-react'

interface Props {
  readonly question: Question
}

export default function QuestionAction({ question }: Props) {
  const likeQuestionMutation = useMutation({
    mutationFn: (questionId: number) => likeQuestion(questionId)
  })

  const unlikeQuestionMutation = useMutation({
    mutationFn: (questionId: number) => unlikeQuestion(questionId)
  })

  const id = question.id
  const { data: isLikeQuestionRes, refetch: refetchIsLike } = useQuery({
    queryKey: [`is-like-question-${id}`, id],
    queryFn: () => checkLike(id),
    enabled: !!id
  })
  const isLikeQuestion = isLikeQuestionRes?.data.data

  const { data: likeCountRes, refetch: refetchLikeCount } = useQuery({
    queryKey: [`like-count-question-${id}`, id],
    queryFn: () => getLikeCount(id),
    enabled: !!id
  })
  const likeCount = likeCountRes?.data.data

  const handleLikeQuestion = () => {
    if (isLikeQuestion === undefined) return
    if (isLikeQuestion) {
      unlikeQuestionMutation.mutate(question.id, {
        onSuccess: () => {
          refetchIsLike()
          refetchLikeCount()
        }
      })
      return
    }
    likeQuestionMutation.mutate(question.id, {
      onSuccess: () => {
        refetchIsLike()
        refetchLikeCount()
      }
    })
  }
  return (
    <div className='flex items-center gap-1'>
      <Button variant='link' className='text-black gap-1 px-1 py-1 h-7 z-40' onClick={handleLikeQuestion}>
        <ThumbsUpIcon
          className={clsx('size-4', {
            'text-blue-600': isLikeQuestion
          })}
          strokeWidth={1.25}
        />
        <span
          className={clsx('font-semibold text-sm', {
            'text-blue-600': isLikeQuestion
          })}
        >
          Thích
        </span>
      </Button>
      <span className='text-sm text-black font-semibold'>{likeCount}</span>
    </div>
  )
}

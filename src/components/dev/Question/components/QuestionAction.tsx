import { checkLike, getLikeCount, likeQuestion, unlikeQuestion } from '@/apis/question.api'
import AvatarGroup from '@/components/dev/AvatarGroup'
import { Button } from '@/components/ui/button'
import { Question } from '@/types/question.type'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ThumbsUpIcon } from 'lucide-react'
import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

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
  const avatars = useMemo(() => {
    if (!likeCount) return []
    return Array.from({ length: likeCount + 10 }, () => ({
      id: uuidv4(),
      name: 'avatar',
      url: `https://github.com/shadcn.png`
    }))
  }, [likeCount])

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
    <div className='flex flex-col items-end gap-1'>
      <Button variant='link' className='text-black gap-1 px-1 py-1 h-7' onClick={handleLikeQuestion}>
        {!isLikeQuestion && <ThumbsUpIcon strokeWidth={1.25} className='size-5' />}
        {isLikeQuestion && (
          <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' className='fill-primary'>
            <path d='M12.012 1a1 1 0 0 0-.907.553L7.98 7.799A1 1 0 0 1 8 8v15h9.5a3.01 3.01 0 0 0 2.88-2.16l2.33-8c.553-1.895-.907-3.84-2.88-3.84h-4.557l.698-2.88c.632-2.562-1.322-5.087-3.96-5.12ZM4 9c-1.645 0-3 1.355-3 3v8c0 1.645 1.355 3 3 3h2V9Z' />
          </svg>
        )}
      </Button>
      <AvatarGroup id={uuidv4()} avatars={avatars} />
    </div>
  )
}

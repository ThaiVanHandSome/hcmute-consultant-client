import { checkLike, getLikeCount, likeQuestion, unlikeQuestion } from '@/apis/question.api'
import { Separator } from '@/components/ui/separator'
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
    <div>
      <div className='flex items-center space-x-2 my-2'>
        <img
          height='18'
          role='presentation'
          src="data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.5'/%3E%3Cpath d='M7.3014 3.8662a.6974.6974 0 0 1 .6974-.6977c.6742 0 1.2207.5465 1.2207 1.2206v1.7464a.101.101 0 0 0 .101.101h1.7953c.992 0 1.7232.9273 1.4917 1.892l-.4572 1.9047a2.301 2.301 0 0 1-2.2374 1.764H6.9185a.5752.5752 0 0 1-.5752-.5752V7.7384c0-.4168.097-.8278.2834-1.2005l.2856-.5712a3.6878 3.6878 0 0 0 .3893-1.6509l-.0002-.4496ZM4.367 7a.767.767 0 0 0-.7669.767v3.2598a.767.767 0 0 0 .767.767h.767a.3835.3835 0 0 0 .3835-.3835V7.3835A.3835.3835 0 0 0 5.134 7h-.767Z' fill='%23fff'/%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(90 .0005 8) scale(7.99958)'%3E%3Cstop offset='.5618' stop-color='%230866FF' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%230866FF' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5257 10.9237) scale(10.1818)'%3E%3Cstop offset='.3143' stop-color='%2302ADFC'/%3E%3Cstop offset='1' stop-color='%2302ADFC' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3989' y1='2.3999' x2='13.5983' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2302ADFC'/%3E%3Cstop offset='.5' stop-color='%230866FF'/%3E%3Cstop offset='1' stop-color='%232B7EFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E"
          width='18'
        ></img>
        <span className='ml-2 font-semibold text-sm'>{likeCount}</span>
      </div>
      <Separator className='my-2' />
      <div className='flex'>
        <div
          aria-hidden='true'
          onClick={handleLikeQuestion}
          className='rounded-md cursor-pointer transition-all flex items-center space-x-1 hover:bg-secondary hover:text-secondary-foreground px-4 py-2 justify-center flex-shrink-0'
        >
          <ThumbsUpIcon
            className={clsx({
              'fill-blue-600 text-gray-200': isLikeQuestion
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
        </div>
      </div>
    </div>
  )
}

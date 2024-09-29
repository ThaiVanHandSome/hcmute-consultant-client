import { getAllRating } from '@/apis/consultant.api'
import { Separator } from '@/components/ui/separator'
import useRatingQueryConfig from '@/hooks/useRatingQueryConfig'
import MyRatingFilter from '@/pages/User/MyRating/components/MyRatingFilter'
import { useQuery } from '@tanstack/react-query'

export default function MyRating() {
  const ratingQueryConfig = useRatingQueryConfig()

  const { data: userRatings } = useQuery({
    queryKey: ['user-ratings', ratingQueryConfig],
    queryFn: () => getAllRating(ratingQueryConfig)
  })

  console.log(userRatings)

  return (
    <div>
      <div>
        <MyRatingFilter queryConfig={ratingQueryConfig} />
      </div>
      <Separator className='my-8' />
    </div>
  )
}

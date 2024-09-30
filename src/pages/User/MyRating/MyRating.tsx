import { getAllRating } from '@/apis/consultant.api'
import DataTable from '@/components/dev/DataTable'
import PaginationCustom from '@/components/dev/PaginationCustom'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useRatingQueryConfig from '@/hooks/useRatingQueryConfig'
import { columns } from '@/pages/User/MyRating/components/columns'
import MyRatingFilter from '@/pages/User/MyRating/components/MyRatingFilter'
import { useQuery } from '@tanstack/react-query'

export default function MyRating() {
  const ratingQueryConfig = useRatingQueryConfig()

  const { data: userRatings } = useQuery({
    queryKey: ['user-ratings', ratingQueryConfig],
    queryFn: () => getAllRating(ratingQueryConfig)
  })

  return (
    <div>
      <div>
        <MyRatingFilter queryConfig={ratingQueryConfig} />
      </div>
      <Separator className='my-8' />
      <div className='mb-4'>
        {userRatings?.data.data.content && (
          <DataTable data={userRatings.data.data.content} columns={columns} size={userRatings.data.data.size} />
        )}
      </div>
      <PaginationCustom
        path={path.myRating}
        queryConfig={ratingQueryConfig}
        pageSize={userRatings?.data.data.totalPages as number}
      />
    </div>
  )
}

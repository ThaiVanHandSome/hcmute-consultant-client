import { getPosts } from '@/apis/post.api'
import { Button } from '@/components/ui/button'
import usePostQueryConfig from '@/hooks/usePostQueryConfig'
import ConsultActivity from '@/pages/User/Home/components/ListConsultActivity/components/ConsultActivity'
import { useQuery } from '@tanstack/react-query'

export default function ListConsultActivity() {
  let postQueryConfig = usePostQueryConfig()
  postQueryConfig = {
    ...postQueryConfig,
    isApproved: String(true)
  }
  const { data: posts } = useQuery({
    queryKey: ['posts', postQueryConfig],
    queryFn: () => getPosts(postQueryConfig)
  })
  return (
    <div className='py-2 w-full'>
      <div className='mb-2 py-2 rounded-md font-bold text-lg px-2 text-gray-500'>Các hoạt động tự vấn</div>
      <ul className='max-w-full w-full'>
        {posts?.data.data.content.map((post) => <ConsultActivity key={post.id} post={post} />)}
      </ul>
      <div className='flex items-center justify-center'>
        <Button className='px-2 h-8 text-xs'>Xem thêm</Button>
      </div>
    </div>
  )
}

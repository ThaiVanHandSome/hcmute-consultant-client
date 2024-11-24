import { getPosts } from '@/apis/post.api'
import { Button } from '@/components/ui/button'
import usePostQueryConfig from '@/hooks/usePostQueryConfig'
import ItemPost from '@/pages/User/Home/components/ListPost/components/ConsultActivity/ItemPost'
import { useQuery } from '@tanstack/react-query'

export default function ListPost() {
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
    <div className='py-2 w-full rounded-md shadow-md bg-primary-bg mb-4'>
      <div className='mb-2 py-2 rounded-md font-bold text-lg px-2 text-gray-500'>Bài đăng</div>
      {!!posts && posts.data.data.content.length > 0 ? (
        <>
          <ul className='max-w-full w-full'>
            {posts?.data.data.content.map((post) => <ItemPost key={post.id} post={post} />)}
          </ul>
          <div className='flex items-center justify-center'>
            <Button className='px-2 h-8 text-xs'>Xem thêm</Button>
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center text-gray-400 bg-primary-bg py-4 rounded-md shadow-sm'>
          <p className='text-center text-sm'>Không có hoạt động nào để hiển thị</p>
        </div>
      )}
    </div>
  )
}

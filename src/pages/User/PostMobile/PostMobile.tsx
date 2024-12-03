import { getPosts } from '@/apis/post.api'
import Paginate from '@/components/dev/PaginationCustom/PaginationCustom'
import path from '@/constants/path'
import usePostQueryConfig from '@/hooks/usePostQueryConfig'
import ItemPost from '@/pages/User/Home/components/ListPost/components/ConsultActivity/ItemPost'
import { useQuery } from '@tanstack/react-query'

export default function PostMobile() {
  let postQueryConfig = usePostQueryConfig()
  postQueryConfig = {
    ...postQueryConfig,
    isApproved: String(true)
  }
  const { data: posts } = useQuery({
    queryKey: ['posts', postQueryConfig],
    queryFn: () => getPosts(postQueryConfig)
  })
  const postsData = posts?.data.data.content

  return (
    <div className='py-2 w-full rounded-md shadow-md bg-primary-bg mb-4'>
      <div className='mb-2 py-2 rounded-md font-bold text-lg px-2 text-gray-500'>Bài đăng</div>
      {!!postsData && postsData.length > 0 ? (
        <>
          <ul className='max-w-full w-full'>
            {postsData.map((post) => (
              <ItemPost key={post.id} post={post} />
            ))}
          </ul>
          <div>
            <Paginate
              path={path.posts}
              queryConfig={postQueryConfig}
              pageSize={posts?.data.data.totalPages as number}
              RANGE={1}
              showChooseQuantity={false}
            />
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

import { getPosts } from '@/apis/post.api'
import { Button } from '@/components/ui/button'
import usePostQueryConfig from '@/hooks/usePostQueryConfig'
import ItemPost from '@/pages/User/Home/components/ListPost/components/ConsultActivity/ItemPost'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

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

  const [isShowAll, setIsShowAll] = useState<boolean>(false)
  const postsData = useMemo(() => {
    if (!isShowAll) return posts?.data.data.content.slice(0, 2)
    return posts?.data.data.content
  }, [isShowAll, posts])
  return (
    <div className='py-2 w-full rounded-md shadow-md bg-background mb-4'>
      <div className='mb-2 py-2 rounded-md font-bold text-lg px-2 text-gray-500'>Bài đăng</div>
      {!!postsData && postsData.length > 0 ? (
        <>
          <ul className='max-w-full w-full'>
            {postsData.map((post) => (
              <ItemPost key={post.id} post={post} />
            ))}
          </ul>
          <div className='flex items-center justify-center'>
            <Button className='px-2 h-8 text-xs flex items-center gap-1' onClick={() => setIsShowAll((prev) => !prev)}>
              {isShowAll ? (
                <>
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 15l7-7 7 7'></path>
                  </svg>
                  Thu gọn
                </>
              ) : (
                <>
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7'></path>
                  </svg>
                  Xem thêm
                </>
              )}
            </Button>
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

import { getPosts } from '@/apis/post.api'
import usePostQueryConfig from '@/hooks/usePostQueryConfig'
import { isImageFile } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Link, useParams } from 'react-router-dom'

export default function Post() {
  let postQueryConfig = usePostQueryConfig()
  postQueryConfig = {
    ...postQueryConfig,
    isApproved: String(true)
  }
  const params = useParams()
  const id = parseInt(params.id as string)

  const { data: posts } = useQuery({
    queryKey: ['posts', postQueryConfig],
    queryFn: () => getPosts(postQueryConfig)
  })
  return (
    <div className='h-remain-screen grid grid-cols-12 gap-4'>
      <div className='col-span-4 px-3 py-1 border-r'>
        <div className='mb-2 py-2 rounded-md font-bold text-lg px-2 text-gray-500'>Các hoạt động tự vấn</div>
        {posts?.data.data.content.map((post) => (
          <Link
            to={`/posts/${post.userId}`}
            className={clsx('flex mb-3  px-2 py-1 hover:transition-all cursor-pointer rounded-md w-full', {
              'hover:bg-secondary hover:text-secondary-foreground': id !== post.userId,
              'bg-secondary text-secondary-foreground': id === post.userId
            })}
          >
            {isImageFile(post.fileName) && (
              <img src={post.fileName} alt='consult' className='size-24 mr-2 rounded-md' />
            )}
            <div className='flex items-center'>
              <p className='font-semibold text-md line-clamp-2 mb-1'>{post.title}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className='col-span-8'></div>
    </div>
  )
}

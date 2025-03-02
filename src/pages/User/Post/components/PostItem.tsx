import { countLikeOfPost } from '@/apis/like.api'
import usePostQueryConfig from '@/hooks/usePostQueryConfig'
import { Post } from '@/types/post.type'
import { isImageFile } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { MessageCircleIcon, ThumbsUpIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  post: Post
  postQueryConfig: {
    [key: string]: string
  }
  activeId: number
}

export default function PostItem({ post, postQueryConfig, activeId }: Props) {
  const queryConfig = usePostQueryConfig()
  const id = post.id
  const { data: countLikes } = useQuery({
    queryKey: ['count-like-of-posts', id],
    queryFn: () => countLikeOfPost(id),
    enabled: !!id
  })

  return (
    <Link
      to={`/posts/${post.id}?${new URLSearchParams({ ...queryConfig, ...postQueryConfig }).toString()}`}
      className='block my-2'
    >
      <div
        className={clsx('p-2 rounded-md', {
          'bg-muted': post.id === activeId,
          'hover:bg-muted': post.id !== activeId
        })}
      >
        <div className='font-medium text-foreground'>{post.title}</div>
        <div className='flex items-center space-x-2 mt-1 text-xs text-gray-500'>
          <span>{post.name}</span>
          <span>•</span>
          <span>{post.createdAt}</span>
        </div>
        <div className='text-xs font-semibold text-muted-foreground flex items-center space-x-2 mt-1'>
          <span className='flex items-center space-x-1'>
            <span>{countLikes?.data.data}</span> <ThumbsUpIcon className='size-4' />
          </span>
          <span className='flex items-center space-x-1'>
            <span>{post.totalComments}</span> <MessageCircleIcon className='size-4' />
          </span>
        </div>
      </div>
    </Link>
  )
}

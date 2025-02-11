import { countLikeOfPost } from '@/apis/like.api'
import { Post } from '@/types/post.type'
import { useQuery } from '@tanstack/react-query'
import { MessageCircleIcon, ThumbsUpIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  readonly post: Post
}

export default function ItemPost({ post }: Props) {
  const id = post.id

  const { data: countLikes } = useQuery({
    queryKey: ['count-like-of-posts', id],
    queryFn: () => countLikeOfPost(id),
    enabled: !!id
  })

  return (
    <Link to={`/posts/${post.id}`} className='block'>
      <div className='border flex mb-3 hover:bg-secondary hover:text-secondary-foreground px-3 py-2 hover:transition-all cursor-pointer rounded-md overflow-hidden items-center justify-between'>
        <div>
          <p className='flex-1 font-semibold text-md break-all line-clamp-2'>{post.title}</p>
          <p className='text-xs font-semibold text-muted-foreground'>
            {post.name} - {post.createdAt}
          </p>
        </div>
        <p className='text-xs font-semibold text-muted-foreground flex items-center space-x-2'>
          <div className='flex items-center space-x-1'>
            <span>{countLikes?.data.data}</span> <ThumbsUpIcon className='size-4' />
          </div>{' '}
          <div className='flex items-center space-x-1'>
            <span>{post.totalComments}</span> <MessageCircleIcon className='size-4' />
          </div>
        </p>
      </div>
    </Link>
  )
}

import { countLikeOfPost } from '@/apis/like.api'
import { PostQueryConfig } from '@/hooks/usePostQueryConfig'
import { Post } from '@/types/post.type'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Link, createSearchParams } from 'react-router-dom'

interface Props {
  readonly post: Post
  readonly postQueryConfig: PostQueryConfig
}

export default function PostItem({ post, postQueryConfig }: Props) {
  const id = post.id
  const { data: countLikes } = useQuery({
    queryKey: ['count-like-of-posts', id],
    queryFn: () => countLikeOfPost(id),
    enabled: !!id
  })

  return (
    <Link
      key={post.id}
      to={{
        pathname: `/posts/${post.id}`,
        search: createSearchParams(postQueryConfig).toString()
      }}
      className={clsx('flex mb-3 px-2 py-1 hover:transition-all cursor-pointer rounded-md w-full', {
        'hover:bg-secondary hover:text-secondary-foreground': id !== post.id,
        'bg-secondary text-secondary-foreground': id === post.id
      })}
    >
      <div>
        <p className='flex-1 font-semibold text-md break-all line-clamp-2'>{post.title}</p>
        <p className='text-xs font-semibold text-muted-foreground'>
          {post.name} - {post.createdAt}
        </p>
        <p className='text-xs font-semibold text-muted-foreground'>
          {countLikes?.data.data} thích - {post.totalComments} bình luận
        </p>
      </div>
    </Link>
  )
}

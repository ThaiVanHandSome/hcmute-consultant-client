import { countLikeOfPost } from '@/apis/like.api'
import { PostQueryConfig } from '@/hooks/usePostQueryConfig'
import { Post } from '@/types/post.type'
import { isImageFile } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { MessageCircleIcon, ThumbsUpIcon } from 'lucide-react'
import { Link, createSearchParams } from 'react-router-dom'

interface Props {
  readonly activeId?: number
  readonly post: Post
  readonly postQueryConfig: PostQueryConfig
}

export default function PostItem({ post, activeId, postQueryConfig }: Props) {
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
      className={clsx(
        'flex border items-center gap-2 mb-3 px-3 py-2 hover:transition-all cursor-pointer rounded-md w-full',
        {
          'hover:bg-secondary hover:text-secondary-foreground': activeId !== post.id,
          'bg-secondary text-secondary-foreground': activeId === post.id
        }
      )}
    >
      <div className='w-1/3'>
        <img
          src={
            isImageFile(post.fileName)
              ? post.fileName
              : 'https://hcmute.edu.vn/Services/GetArticleImage.ashx?option=0&Id=134d1231-6bee-4036-bf0f-1d33e33a0ad4'
          }
          alt='post-image'
          className='rounded-md'
        />
      </div>
      <div className='flex-1'>
        <p className='flex-1 font-semibold text-md break-all line-clamp-2'>{post.title}</p>
        <p className='text-xs font-semibold text-muted-foreground'>
          {post.name} - {post.createdAt}
        </p>
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

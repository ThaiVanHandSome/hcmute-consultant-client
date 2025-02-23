import { countLikeOfPost } from '@/apis/like.api'
import { Post } from '@/types/post.type'
import { isImageFile } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import { MessageCircleIcon, ThumbsUpIcon, ClockIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

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
    <Link to={`/posts/${post.id}`} className='group block'>
      <article className='bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden'>
        <div className='aspect-[16/9] overflow-hidden'>
          <img
            src={
              isImageFile(post.fileName)
                ? post.fileName
                : 'https://hcmute.edu.vn/Services/GetArticleImage.ashx?option=0&Id=134d1231-6bee-4036-bf0f-1d33e33a0ad4'
            }
            alt={post.title}
            className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300'
          />
        </div>

        <div className='p-4 space-y-3'>
          <h3 className='font-semibold text-md leading-tight line-clamp-2 group-hover:text-primary transition-colors'>
            {post.title}
          </h3>

          <div className='flex items-center space-x-2 text-sm text-gray-600'>
            <span className='font-medium'>{post.name}</span>
            <span>•</span>
            <div className='flex items-center text-gray-500'>
              <ClockIcon className='size-4 mr-1' />
              <time>{formatDistanceToNow(new Date(post.createdAt), { locale: vi, addSuffix: true })}</time>
            </div>
          </div>

          <div className='flex items-center space-x-4 text-sm text-gray-600'>
            <div className='flex items-center space-x-1.5'>
              <ThumbsUpIcon className='size-4' />
              <span>{countLikes?.data.data ?? 0}</span>
            </div>
            <div className='flex items-center space-x-1.5'>
              <MessageCircleIcon className='size-4' />
              <span>{post.totalComments}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

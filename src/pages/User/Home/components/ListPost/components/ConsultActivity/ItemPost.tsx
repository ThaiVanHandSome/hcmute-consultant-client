import { countLikeOfPost, getLikeUsersOfPost } from '@/apis/like.api'
import { Post } from '@/types/post.type'
import { isImageFile } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import { MessageCircleIcon, ThumbsUpIcon, ClockIcon, FileIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { UserInfo } from '@/types/like.type'

// Simple Skeleton component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse bg-gray-200 rounded', className)} />
)

interface Props {
  readonly post: Post
}

export default function ItemPost({ post }: Props) {
  const id = post.id
  const [showLikeUsers, setShowLikeUsers] = useState(false)

  const { data: countLikes } = useQuery({
    queryKey: ['count-like-of-posts', id],
    queryFn: () => countLikeOfPost(id),
    enabled: !!id
  })

  // Fetch users who liked the post when modal is open
  const { data: likeUsersData, isLoading: isLoadingLikeUsers } = useQuery({
    queryKey: ['like-users-post', id],
    queryFn: () => getLikeUsersOfPost(id),
    enabled: !!id && showLikeUsers
  })

  // Debug logs
  useEffect(() => {
    if (likeUsersData) {
      console.log('Liked Users Data:', likeUsersData)
    }
  }, [likeUsersData])

  const likeCount = countLikes?.data.data ?? 0

  // Lấy trực tiếp từ response của API đúng
  const likeUsers = likeUsersData?.data?.data || []

  const handleDialogOpenChange = (open: boolean) => {
    // Ngăn chặn sự kiện lan truyền khi đóng modal
    if (!open) {
      setTimeout(() => setShowLikeUsers(false), 0)
    } else {
      setShowLikeUsers(true)
    }
  }

  const renderPostContent = () => (
    <>
      <div className='aspect-[16/9] overflow-hidden'>
        {post.fileName ? (
          isImageFile(post.fileName) ? (
            <img
              src={`${post.fileName}`}
              alt='Post attachment'
              className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gray-100'>
              <div className='p-4 flex items-center gap-2'>
                <FileIcon className='h-10 w-10 text-gray-500' />
                <span className='text-sm text-gray-700 truncate max-w-[200px]'>{post.fileName}</span>
              </div>
            </div>
          )
        ) : (
          <div className='w-full h-full bg-gray-50 flex items-center justify-center'>
            <p className='text-gray-400 text-sm'>Không có tập tin đính kèm</p>
          </div>
        )}
      </div>

      <div className='p-4 space-y-3'>
        <h3 className='font-semibold text-md leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-2'>
          {post.title}
        </h3>

        <div className='flex items-center justify-between text-sm text-gray-600'>
          <span className='font-medium'>{post.name}</span>
          <div className='flex items-center text-gray-500 text-xs'>
            <ClockIcon className='size-4 mr-1' />
            <time>{formatDistanceToNow(new Date(post.createdAt), { locale: vi, addSuffix: true })}</time>
          </div>
        </div>

        <div className='flex items-center space-x-4 text-sm text-gray-600'>
          <div className='flex items-center space-x-1.5'>
            <ThumbsUpIcon className='size-4' />
            <span>{likeCount}</span>
          </div>

          <div className='flex items-center space-x-1.5'>
            <MessageCircleIcon className='size-4' />
            <span>{post.totalComments}</span>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Link to={`/posts/${post.id}`} className='group block'>
        <article className='bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden'>
          {renderPostContent()}
        </article>
      </Link>

      <Dialog open={showLikeUsers} onOpenChange={handleDialogOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Người đã thích bài viết</DialogTitle>
          </DialogHeader>

          <div className='max-h-[300px] overflow-y-auto'>
            {isLoadingLikeUsers ? (
              <div className='space-y-3 p-2'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div>
                      <Skeleton className='h-4 w-32 mb-2' />
                      <Skeleton className='h-3 w-20' />
                    </div>
                  </div>
                ))}
              </div>
            ) : likeUsers && likeUsers.length > 0 ? (
              <div className='space-y-3 p-2'>
                {likeUsers.map((user: UserInfo) => (
                  <div key={user.id} className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{`${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>{`${user.lastName || ''} ${user.firstName || ''}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-8 text-center text-gray-500'>Không có thông tin người thích</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

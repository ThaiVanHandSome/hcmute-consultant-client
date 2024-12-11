import { countLikeOfPost } from '@/apis/like.api'
import FileShow from '@/components/dev/FileShow'
import { Post } from '@/types/post.type'
import { useQuery } from '@tanstack/react-query'
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
      <div className='border flex mb-3 hover:bg-secondary hover:text-secondary-foreground px-2 py-1 hover:transition-all cursor-pointer rounded-md overflow-hidden items-center'>
        {post?.fileName && <FileShow url={post.fileName} />}
        <div>
          <p className='flex-1 font-semibold text-md break-all line-clamp-2'>{post.title}</p>
          <p className='text-xs font-semibold text-muted-foreground'>
            {post.name} - {post.createdAt}
          </p>
          <p className='text-xs font-semibold text-muted-foreground'>
            {countLikes?.data.data} thích - {post.totalComments} bình luận
          </p>
        </div>
      </div>
    </Link>
  )
}

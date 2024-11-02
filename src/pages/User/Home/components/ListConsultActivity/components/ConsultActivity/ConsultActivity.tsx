import { Post } from '@/types/post.type'
import { isImageFile } from '@/utils/utils'
import { Link } from 'react-router-dom'

interface Props {
  readonly post: Post
}

export default function ConsultActivity({ post }: Props) {
  return (
    <Link
      to={`/posts/${post.id}`}
      className='flex mb-3 hover:bg-secondary hover:text-secondary-foreground px-2 py-1 hover:transition-all cursor-pointer rounded-md'
    >
      {isImageFile(post.fileName) && <img src={post.fileName} alt='consult' className='size-16 mr-2 rounded-md' />}
      <div className='flex items-center'>
        <p className='font-semibold text-md line-clamp-2 mb-1'>{post.title}</p>
      </div>
    </Link>
  )
}

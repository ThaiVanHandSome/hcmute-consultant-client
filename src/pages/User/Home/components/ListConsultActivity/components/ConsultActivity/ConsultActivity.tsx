import { Post } from '@/types/post.type'
import { isImageFile } from '@/utils/utils'
import { Link } from 'react-router-dom'

interface Props {
  readonly post: Post
}

export default function ConsultActivity({ post }: Props) {
  return (
    <Link to={`/posts/${post.id}`} className='block'>
      <div className='flex mb-3 hover:bg-secondary hover:text-secondary-foreground px-2 py-1 hover:transition-all cursor-pointer rounded-md overflow-hidden items-center'>
        {isImageFile(post.fileName) && (
          <div className='w-16 h-16 mr-2'>
            <img src={post.fileName} alt='consult' className='object-fill w-full h-full block rounded-md' />
          </div>
        )}
        <p className='flex-1 font-semibold text-md break-all line-clamp-2'>{post.title}</p>
      </div>
    </Link>
  )
}

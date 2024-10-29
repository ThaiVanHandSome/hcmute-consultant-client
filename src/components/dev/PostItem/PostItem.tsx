import path from '@/constants/path'
import { Post } from '@/types/post.type'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'

interface Props {
  readonly post: Post
}

export default function PostItem({ post }: Props) {
  return (
    <Link to={path.postDetail}>
      <div className='hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg rounded-md cursor-pointer py-2 px-4 border-b'>
        <div className='grid grid-cols-12 items-center gap-4 text-sm py-1'>
          <div className='col-span-2 text-sm font-semibold text-left italic'>{post.createdAt}</div>
          <div className='col-span-7 truncate'>{post.title}</div>
          <div className='col-span-3 flex items-center justify-end'>
            <div className='flex items-center space-x-1'>
              <span className='font-sm font-semibold'>{post.views}</span>
              <EyeOpenIcon className='size-3' />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

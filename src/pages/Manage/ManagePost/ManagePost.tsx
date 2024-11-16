import { getPosts } from '@/apis/post.api'
import ExportCustom from '@/components/dev/ExportCustom'
import Paginate from '@/components/dev/PaginationCustom'
import PostItem from '@/components/dev/PostItem'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import usePostQueryConfig from '@/hooks/usePostQueryConfig'
import DialogAddPost from '@/pages/Manage/ManagePost/components/DialogAddPost'
import { useQuery } from '@tanstack/react-query'

export default function ManagePost() {
  const postQueryConfig = usePostQueryConfig()
  const { data: posts } = useQuery({
    queryKey: ['posts', postQueryConfig],
    queryFn: () => getPosts(postQueryConfig)
  })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Bài đăng</h1>
          <p className='text-sm italic'>Quản lý bài đăng</p>
        </div>
        <div className='flex items-center space-x-2'>
          <DialogAddPost /> <ExportCustom dataType='post' queryConfig={postQueryConfig} />
        </div>
      </div>
      <Separator className='my-2' />
      <div className='bg-background'>
        {posts?.data.data.content.map((post, index) => <PostItem key={index} post={post} />)}
      </div>
      <div>
        <Paginate
          path={path.managePost}
          pageSize={posts?.data.data.totalPages as number}
          queryConfig={postQueryConfig}
        />
      </div>
    </div>
  )
}

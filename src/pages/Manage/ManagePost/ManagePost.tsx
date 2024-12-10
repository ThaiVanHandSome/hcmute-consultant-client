import { getPosts } from '@/apis/post.api'
import ExportCustom from '@/components/dev/ExportCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import Paginate from '@/components/dev/PaginationCustom'
import PostItem from '@/components/dev/PostItem'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import usePostQueryConfig from '@/hooks/usePostQueryConfig'
import DialogAddPost from '@/pages/Manage/ManagePost/components/DialogAddPost'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function ManagePost() {
  const postQueryConfig = usePostQueryConfig()
  const { data: posts } = useQuery({
    queryKey: ['posts', postQueryConfig],
    queryFn: () => getPosts(postQueryConfig)
  })

  const form = useForm({
    defaultValues: {
      isApproved: 'true'
    }
  })

  const isApprovalSelectionData = [
    {
      value: 'true',
      label: 'Đã duyệt'
    },
    {
      value: 'false',
      label: 'Chưa duyệt'
    }
  ]

  const navigate = useNavigate()
  const isApproved = form.watch('isApproved')
  useEffect(() => {
    navigate({
      pathname: path.managePost,
      search: createSearchParams({
        ...postQueryConfig,
        isApproved
      }).toString()
    })
  }, [isApproved])

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
      <div className='w-1/4'>
        <Form {...form}>
          <form>
            <SelectionCustom
              control={form.control}
              name='isApproved'
              label='Trạng thái'
              placeholder='Trạng thái'
              data={isApprovalSelectionData}
              defaultValue='true'
            />
          </form>
        </Form>
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

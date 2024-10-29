import AvatarCustom from '@/components/dev/AvatarCustom'
import { Separator } from '@/components/ui/separator'
import { MessageCircle } from 'lucide-react'

export default function PostDetail() {
  return (
    <div>
      <div className='grid grid-cols-12 gap-4 '>
        <div className='col-span-8 bg-background rounded-xl shadow-xl px-4 py-2'>
          <p>Tiêu đề</p>
          <p>Nội dung</p>
          <p>Hình ảnh</p>
        </div>
        <div className='col-span-4 bg-background rounded-xl shadow-xl px-4 py-2'>
          <h1 className='font-bold mb-2 text-lg flex items-center space-x-1'>
            <MessageCircle />
            <span>Bình luận</span>
          </h1>
          <Separator className='my-2' />
          <div className='space-y-2'>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='flex w-full max-w-full'>
                  <AvatarCustom url='' className='size-8 mr-2' />
                  <div>
                    <div className='rounded-2xl bg-secondary text-secondary-foreground px-4 py-2'>
                      <div className='font-bold text-sm'>Thái Văn</div>
                      <div className='text-sm'>Câu trả lời</div>
                    </div>
                    <div className='text-[10px] ml-4'>20-11-2024</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

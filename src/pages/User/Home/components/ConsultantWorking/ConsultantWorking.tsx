import AvatarCustom from '@/components/dev/AvatarCustom'
import { AppContext } from '@/contexts/app.context'
import { useContext } from 'react'

export default function ConsultantWorking() {
  const { user } = useContext(AppContext)
  return (
    <div>
      <div className='mb-2 rounded-sm font-bold text-lg px-2 text-gray-500'>Liên hệ</div>
      <ul>
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <li
              key={index}
              className='flex items-center px-2 py-2 hover:bg-slate-100 hover:transition-all cursor-pointer rounded-md'
            >
              <div className='mr-2 rounded-full relative'>
                <AvatarCustom url={user?.avatarUrl} />
                <div className='size-2 rounded-full bg-green-600 absolute bottom-0 right-0' />
              </div>
              <p className='font-semibold'>Tư vấn viên</p>
            </li>
          ))}
      </ul>
    </div>
  )
}

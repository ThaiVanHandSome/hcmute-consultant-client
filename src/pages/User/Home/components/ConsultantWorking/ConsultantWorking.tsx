import AvatarCustom from '@/components/dev/AvatarCustom'
import { AppContext } from '@/contexts/app.context'
import { useContext } from 'react'

export default function ConsultantWorking() {
  const { user, onlineUsers } = useContext(AppContext)

  return (
    <div className='rounded-md shadow-md bg-primary-bg'>
      <div className='mb-2 rounded-sm font-bold text-lg px-2 text-gray-500'>Liên hệ</div>
      <ul>
        {onlineUsers?.length !== 0 ? (
          onlineUsers?.map((onlineUser, index) => (
            <li
              key={index}
              className='flex items-center px-2 py-2 hover:bg-secondary hover:transition-all cursor-pointer rounded-md'
            >
              <AvatarCustom url={user?.avatarUrl} isWorking={true} />
              <p className='font-semibold ml-2'>{onlineUser.fullName}</p>
            </li>
          ))
        ) : (
          <div className='flex items-center justify-center text-gray-400 bg-primary-bg py-4 rounded-md shadow-sm'>
            <p className='text-center text-sm'>Không có tư vấn viên nào đang online</p>
          </div>
        )}
      </ul>
    </div>
  )
}

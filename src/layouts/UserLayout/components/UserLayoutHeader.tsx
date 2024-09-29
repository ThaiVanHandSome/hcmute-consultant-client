import AvatarCustom from '@/components/dev/AvatarCustom'
import { AppContext } from '@/contexts/app.context'
import { useContext } from 'react'

export default function UserLayoutHeader() {
  const { user } = useContext(AppContext)
  return (
    <div className='flex items-center py-4'>
      <AvatarCustom url={user?.avatarUrl} className='size-14' />
      <div className='ml-3'>
        <p>{user?.username}</p>
        <p className='text-gray-400 text-sm'>Tài khoản cá nhân</p>
      </div>
    </div>
  )
}

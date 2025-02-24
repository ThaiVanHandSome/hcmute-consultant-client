import AvatarCustom from '@/components/dev/AvatarCustom'
import { AppContext } from '@/contexts/app.context'
import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/apis/user.api'

export default function UserLayoutHeader() {
  const { user } = useContext(AppContext)
  
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  })

  return (
    <div className='hidden lg:flex items-center py-4'>
      <AvatarCustom url={profile?.data.data.avatarUrl || user?.avatarUrl} className='size-14' />
      <div className='ml-3'>
        <p>{user?.username}</p>
        <p className='text-gray-400 text-sm'>Tài khoản cá nhân</p>
      </div>
    </div>
  )
}

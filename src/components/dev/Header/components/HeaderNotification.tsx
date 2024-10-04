import { getNotifications } from '@/apis/notification.api'
import Popover from '@/components/dev/Popover'
import { formatDate } from '@/utils/utils'
import { BellIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'

export default function HeaderNotification() {
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  })

  return (
    <Popover
      placement='bottom'
      renderPopover={
        <ul className='px-6 py-3'>
          {!notifications && <p className='text-sm text-foreground'>Hiện chưa có thông báo nào!</p>}
          {notifications?.data.data.slice(0, 5).map((notification) => (
            <li key={notification.time} className='py-2 border-b border-border group'>
              <p className='group-hover:text-primary font-semibold mb-1 cursor-default text-foreground'>
                {notification.content}
              </p>
              <p className='text-xs text-muted-foreground'>{formatDate(notification.time, true)}</p>
            </li>
          ))}
        </ul>
      }
    >
      <div className='relative'>
        <BellIcon className='size-6 text-foreground mr-6' />
        <p className='font-bold size-5 text-xs rounded-full bg-destructive text-destructive-foreground flex items-center justify-center absolute top-0 right-1 -translate-x-1/2 -translate-y-1/2'>
          {notifications?.data.data?.length ?? 0}
        </p>
      </div>
    </Popover>
  )
}

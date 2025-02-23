import { getNotifications } from '@/apis/notification.api'
import Popover from '@/components/dev/Popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/utils/utils'
import { BellIcon, CheckCircledIcon, CrossCircledIcon, InfoCircledIcon, UpdateIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

// Thêm helper function để lấy icon theo type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'SUCCESS':
      return <CheckCircledIcon className='size-5 text-success' />
    case 'ERROR':
      return <CrossCircledIcon className='size-5 text-destructive' />
    case 'UPDATE':
      return <UpdateIcon className='size-5 text-primary' />
    default:
      return <InfoCircledIcon className='size-5 text-muted-foreground' />
  }
}

export default function HeaderNotification() {
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  })

  const notificationsData = useMemo(() => {
    if (!notifications) return []
    const notices = notifications?.data.data
    return notices
  }, [notifications])

  // Đếm số notification chưa đọc
  const unreadCount = useMemo(() => {
    return notifications?.data.data.filter((notice) => notice.status === 'UNREAD').length ?? 0
  }, [notifications])

  return (
    <Popover
      placement='bottom'
      renderPopover={
        <div className='w-[400px] rounded-lg shadow-lg'>
          <div className='flex items-center justify-between px-4 py-3 bg-card'>
            <div className='flex items-center space-x-2'>
              <BellIcon className='size-5 text-primary' />
              <p className='font-semibold text-card-foreground'>Thông báo</p>
              {unreadCount > 0 && (
                <span className='px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary'>
                  {unreadCount} mới
                </span>
              )}
            </div>
            {notifications && notifications.data.data.length > 0 && (
              <Button variant='ghost' size='sm' className='text-xs hover:text-primary'>
                Đánh dấu đã đọc
              </Button>
            )}
          </div>
          <Separator />
          <div className='p-2 max-h-[400px] overflow-y-auto'>
            {!notifications && (
              <div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
                <BellIcon className='size-8 mb-2' />
                <p className='text-sm'>Chưa có thông báo nào</p>
              </div>
            )}
            {notificationsData.map((notification) => (
              <div
                key={notification.id}
                className={`group p-3 mb-1 rounded-md transition-all hover:bg-accent cursor-pointer
                  ${notification.status === 'UNREAD' ? 'bg-accent/50' : ''}`}
              >
                <div className='flex items-start gap-3'>
                  {getNotificationIcon(notification.notificationType)}
                  <div className='flex-1 min-w-0'>
                    <p
                      className={`text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors
                      ${notification.status === 'UNREAD' ? 'font-medium' : ''}`}
                    >
                      {notification.content}
                    </p>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <span>{formatDate(notification.time, true)}</span>
                      {notification.status === 'UNREAD' && (
                        <>
                          <span>•</span>
                          <span className='text-primary'>Chưa đọc</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {notifications && notifications.data.data.length > 5 && (
            <div className='px-4 py-2 bg-card border-t'>
              <Button variant='ghost' className='w-full h-8 text-xs hover:text-primary'>
                <Link to='/notifications'>Xem tất cả thông báo</Link>
              </Button>
            </div>
          )}
        </div>
      }
    >
      <div className='relative cursor-pointer hover:opacity-70 transition-opacity'>
        <BellIcon className='size-5 text-foreground' />
        {unreadCount > 0 && (
          <div className='absolute -top-1 -right-1 size-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center'>
            {unreadCount < 10 ? unreadCount : '9+'}
          </div>
        )}
      </div>
    </Popover>
  )
}

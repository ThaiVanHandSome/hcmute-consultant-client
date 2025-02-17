import { getNotifications } from '@/apis/notification.api'
import Popover from '@/components/dev/Popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/utils/utils'
import { BellIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

export default function HeaderNotification() {
  const [isViewMore, setIsViewMore] = useState<boolean>(false)
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  })

  const notificationsData = useMemo(() => {
    if (!notifications) return []
    const notices = notifications?.data.data
    return isViewMore ? notices : notices.slice(0, 5)
  }, [isViewMore])
  const numberOfNotification = notificationsData.length ?? 0

  return (
    <Popover
      placement='bottom'
      renderPopover={
        <div>
          <div className='flex items-center space-x-2 px-3 py-1'>
            <BellIcon className='!size-5' />
            <p className='font-semibold'>Thông báo</p>
          </div>
          <Separator />
          <ul className='px-6 py-3'>
            {!notifications && <p className='text-sm text-foreground'>Hiện chưa có thông báo nào!</p>}
            {notificationsData.map((notification) => (
              <li key={notification.time} className='py-2 border-b border-border group'>
                <p className='group-hover:text-primary font-semibold mb-1 cursor-default text-foreground'>
                  {notification.content}
                </p>
                <p className='text-xs text-muted-foreground'>{formatDate(notification.time, true)}</p>
              </li>
            ))}
          </ul>
          <div className='px-6 py-2'>
            <Button
              variant='secondary'
              className='px-2 h-8 text-xs flex items-center gap-1'
              onClick={() => setIsViewMore((prev) => !prev)}
            >
              {isViewMore ? (
                <>
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 15l7-7 7 7'></path>
                  </svg>
                  Thu gọn
                </>
              ) : (
                <>
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7'></path>
                  </svg>
                  Xem thêm
                </>
              )}
            </Button>
          </div>
        </div>
      }
    >
      <div className='relative'>
        <BellIcon className='size-5 text-foreground mr-6' />
        <p className='font-bold size-4 text-xs rounded-full bg-destructive text-destructive-foreground flex items-center justify-center absolute top-0 right-2 -translate-x-1/2 -translate-y-1/2'>
          {numberOfNotification < 10 ? numberOfNotification : '9+'}
        </p>
      </div>
    </Popover>
  )
}

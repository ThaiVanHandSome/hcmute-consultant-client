import { getNotifications } from '@/apis/notification.api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/utils/utils'
import {
  BellIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  InfoCircledIcon,
  UpdateIcon,
  CheckIcon,
  TrashIcon
} from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

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

export default function NotificationsPage() {
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  })

  const notificationsList = notifications?.data.data || []
  const unreadNotifications = notificationsList.filter((notice) => notice.status === 'UNREAD')
  const readNotifications = notificationsList.filter((notice) => notice.status === 'READ')

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className='container max-w-4xl py-8'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <BellIcon className='size-6 text-primary' />
          <h1 className='text-2xl font-bold'>Thông báo của bạn</h1>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='flex items-center gap-2'>
            <CheckIcon className='size-4' />
            Đánh dấu tất cả đã đọc
          </Button>
          <Button variant='outline' size='sm' className='flex items-center gap-2'>
            <TrashIcon className='size-4' />
            Xóa tất cả
          </Button>
        </div>
      </div>

      <Card className='p-6'>
        <Tabs defaultValue='all' className='w-full'>
          <TabsList className='mb-4'>
            <TabsTrigger value='all' className='flex items-center gap-2'>
              Tất cả
              <span className='px-2 py-0.5 text-xs rounded-full bg-muted'>{notificationsList.length}</span>
            </TabsTrigger>
            <TabsTrigger value='unread' className='flex items-center gap-2'>
              Chưa đọc
              <span className='px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary'>
                {unreadNotifications.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value='read'>Đã đọc</TabsTrigger>
          </TabsList>

          <TabsContent value='all'>
            <motion.div variants={container} initial='hidden' animate='show' className='space-y-2'>
              {notificationsList.map((notification) => (
                <motion.div
                  key={notification.id}
                  variants={item}
                  className={`group p-4 rounded-lg transition-all hover:bg-accent cursor-pointer
                    ${notification.status === 'UNREAD' ? 'bg-accent/50' : 'bg-card'}`}
                >
                  <div className='flex items-start gap-4'>
                    {getNotificationIcon(notification.notificationType)}
                    <div className='flex-1 min-w-0'>
                      <p
                        className={`text-sm mb-1 group-hover:text-primary transition-colors
                        ${notification.status === 'UNREAD' ? 'font-medium' : ''}`}
                      >
                        {notification.content}
                      </p>
                      <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                        <span>{formatDate(notification.time, true)}</span>
                        {notification.status === 'UNREAD' && (
                          <>
                            <span>•</span>
                            <span className='text-primary'>Chưa đọc</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button variant='ghost' size='sm' className='opacity-0 group-hover:opacity-100 transition-opacity'>
                      <CheckIcon className='size-4' />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value='unread'>
            <motion.div variants={container} initial='hidden' animate='show' className='space-y-2'>
              {unreadNotifications.map((notification) => (
                // Similar structure as above, but only for unread notifications
                <motion.div variants={item} key={notification.id}>
                  {/* ... */}
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value='read'>
            <motion.div variants={container} initial='hidden' animate='show' className='space-y-2'>
              {readNotifications.map((notification) => (
                // Similar structure as above, but only for read notifications
                <motion.div variants={item} key={notification.id}>
                  {/* ... */}
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

import { getNotificationDetail, getNotifications, markAllAsRead, markAsRead, deleteAllNotifications, deleteNotification } from '@/apis/notification.api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NotificationResponse } from '@/types/notification.type'
import { formatDate } from '@/utils/utils'
import {
  BellIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  InfoCircledIcon,
  UpdateIcon,
  CheckIcon,
  TrashIcon,
  ChevronLeftIcon
} from '@radix-ui/react-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  })

  const { data: notificationDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['notification', selectedNotificationId],
    queryFn: () => getNotificationDetail(Number(selectedNotificationId)),
    enabled: selectedNotificationId !== null
  })

  useEffect(() => {
    // Kiểm tra localStorage khi component mount
    const savedId = localStorage.getItem('selectedNotificationId')
    if (savedId) {
      setSelectedNotificationId(Number(savedId))
      localStorage.removeItem('selectedNotificationId') // Xóa sau khi đã đọc
    }
  }, [])

  useEffect(() => {
    if (selectedNotificationId && notificationDetail?.data.data.status === 'UNREAD') {
      markAsRead(Number(selectedNotificationId)).then(() => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      })
    }
  }, [selectedNotificationId, notificationDetail, queryClient])

  const notificationsList = notifications?.data.data.content || []
  const unreadNotifications = notificationsList.filter((notice: NotificationResponse) => notice.status === 'UNREAD')
  const readNotifications = notificationsList.filter((notice: NotificationResponse) => notice.status === 'READ')

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

  const handleNotificationClick = async (notification: NotificationResponse) => {
    if (notification.status === 'UNREAD') {
      try {
        await markAsRead(notification.id)
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      } catch (error) {
        console.error('Lỗi khi đánh dấu đã đọc:', error)
      }
    }
    setSelectedNotificationId(notification.id)
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', error)
    }
  }

  const handleMarkButtonClick = async (event: React.MouseEvent, notification: NotificationResponse) => {
    event.stopPropagation() 
    
    if (notification.status === 'UNREAD') {
      try {
        await markAsRead(notification.id)
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      } catch (error) {
        console.error('Lỗi khi đánh dấu đã đọc:', error)
      }
    }
  }

  const handleBackToList = () => {
    setSelectedNotificationId(null)
  }

  const handleDeleteAll = async () => {
    try {
      // Thử gọi API xóa tất cả
      await deleteAllNotifications()
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      setSuccessMessage('Đã xóa tất cả thông báo thành công!')
      
      // Tự động ẩn thông báo sau 5 giây
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error: any) {
      console.error('Lỗi khi xóa tất cả thông báo:', error)
      
      // Hiển thị thông báo lỗi chi tiết
      if (error && typeof error === 'object' && error.response?.data?.message) {
        alert(`Lỗi: ${error.response.data.message}`);
      } else if (error && typeof error === 'object' && error.message && error.message.includes('transaction')) {
        alert('Lỗi giao dịch từ hệ thống. Vui lòng liên hệ admin để thêm @Transactional cho phương thức xóa tất cả.');
      } else {
        alert('Có lỗi xảy ra khi xóa thông báo. Vui lòng thử lại sau hoặc liên hệ admin.');
      }
    }
  }

  if (selectedNotificationId !== null) {
    return (
      <div className='container max-w-4xl py-8'>
        <div className='flex items-center gap-3 mb-6'>
          <Button variant='ghost' size='sm' onClick={handleBackToList} className='flex items-center gap-2'>
            <ChevronLeftIcon className='size-4' />
            Quay lại
          </Button>
          <h1 className='text-2xl font-bold'>Chi tiết thông báo</h1>
        </div>

        <Card className='p-6'>
          {isLoadingDetail ? (
            <div className='flex justify-center py-8'>Đang tải...</div>
          ) : notificationDetail ? (
            <div>
              <div className='flex items-start gap-4 mb-4'>
                {getNotificationIcon(notificationDetail.data.data.notificationType)}
                <div>
                  <h2 className='text-xl font-medium mb-2'>
                    {notificationDetail.data.data.content}
                  </h2>
                  <p className='text-sm text-muted-foreground'>
                    {formatDate(notificationDetail.data.data.time, true)}
                  </p>
                </div>
              </div>
              <div className='mt-6 pt-6 border-t'>
                <p className='text-muted-foreground text-sm'>
                  Thông báo được gửi từ hệ thống tư vấn học tập HCMUTE.
                </p>
              </div>
            </div>
          ) : (
            <div className='flex justify-center py-8 text-muted-foreground'>
              Không tìm thấy thông báo
            </div>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className='container max-w-4xl py-8'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <BellIcon className='size-6 text-primary' />
          <h1 className='text-2xl font-bold'>Thông báo của bạn</h1>
        </div>
        <div className='flex items-center gap-2'>
          <Button 
            variant='outline' 
            size='sm' 
            className='flex items-center gap-2'
            onClick={handleMarkAllAsRead}
          >
            <CheckIcon className='size-4' />
            Đánh dấu tất cả đã đọc
          </Button>
          <Button variant='outline' size='sm' className='flex items-center gap-2' onClick={handleDeleteAll}>
            <TrashIcon className='size-4' />
            Xóa tất cả
          </Button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <CheckCircledIcon className="size-5 mr-2" />
          <span>{successMessage}</span>
        </div>
      )}

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
              {notificationsList.map((notification: NotificationResponse) => (
                <motion.div
                  key={notification.id}
                  variants={item}
                  className={`group p-4 rounded-lg transition-all hover:bg-accent cursor-pointer
                    ${notification.status === 'UNREAD' ? 'bg-accent/50' : 'bg-card'}`}
                  onClick={() => handleNotificationClick(notification)}
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
                    {notification.status === 'UNREAD' && (
                      <Button 
                        variant='ghost' 
                        size='sm' 
                        className='opacity-0 group-hover:opacity-100 transition-opacity'
                        onClick={(e) => handleMarkButtonClick(e, notification)}
                      >
                        <CheckIcon className='size-4' />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value='unread'>
            <motion.div variants={container} initial='hidden' animate='show' className='space-y-2'>
              {unreadNotifications.map((notification: NotificationResponse) => (
                <motion.div
                  key={notification.id}
                  variants={item}
                  className='group p-4 rounded-lg transition-all hover:bg-accent cursor-pointer bg-accent/50'
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className='flex items-start gap-4'>
                    {getNotificationIcon(notification.notificationType)}
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm mb-1 font-medium group-hover:text-primary transition-colors'>
                        {notification.content}
                      </p>
                      <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                        <span>{formatDate(notification.time, true)}</span>
                        <span>•</span>
                        <span className='text-primary'>Chưa đọc</span>
                      </div>
                    </div>
                    <Button 
                      variant='ghost' 
                      size='sm' 
                      className='opacity-0 group-hover:opacity-100 transition-opacity'
                      onClick={(e) => handleMarkButtonClick(e, notification)}
                    >
                      <CheckIcon className='size-4' />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value='read'>
            <motion.div variants={container} initial='hidden' animate='show' className='space-y-2'>
              {readNotifications.map((notification: NotificationResponse) => (
                <motion.div
                  key={notification.id}
                  variants={item}
                  className='group p-4 rounded-lg transition-all hover:bg-accent cursor-pointer bg-card'
                >
                  <div className='flex items-start gap-4'>
                    {getNotificationIcon(notification.notificationType)}
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm mb-1 group-hover:text-primary transition-colors'>
                        {notification.content}
                      </p>
                      <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                        <span>{formatDate(notification.time, true)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

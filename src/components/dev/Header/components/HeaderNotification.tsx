import { getNotifications, markAllAsRead, markAsRead } from '@/apis/notification.api'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { NotificationResponse } from '@/types/notification.type'
import { formatDate } from '@/utils/utils'
import {
  BellIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  InfoCircledIcon,
  UpdateIcon,
  CheckIcon
} from '@radix-ui/react-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'SUCCESS':
      return <CheckCircledIcon className='size-4 text-success' />
    case 'ERROR':
      return <CrossCircledIcon className='size-4 text-destructive' />
    case 'UPDATE':
      return <UpdateIcon className='size-4 text-primary' />
    default:
      return <InfoCircledIcon className='size-4 text-muted-foreground' />
  }
}

export default function HeaderNotification() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false)
  const [markAllSuccess, setMarkAllSuccess] = useState(false)

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  })

  const notificationsData = useMemo(() => {
    // Lấy danh sách thông báo từ API response
    const list = notifications?.data?.data?.content || []
    
    // Sắp xếp theo thời gian mới nhất
    const sortedList = [...list].sort((a, b) => 
      new Date(b.time).getTime() - new Date(a.time).getTime()
    )
    
    // Chỉ lấy 5 thông báo mới nhất
    return sortedList.slice(0, 5)
  }, [notifications])

  const unreadCount = useMemo(() => {
    if (!notifications?.data?.data?.content) return 0
    return notifications.data.data.content.filter((n: NotificationResponse) => n.status === 'UNREAD').length
  }, [notifications])

  const handleNotificationClick = async (notification: NotificationResponse) => {
    // Đánh dấu đã đọc nếu chưa đọc
    if (notification.status === 'UNREAD') {
      try {
        await markAsRead(notification.id)
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      } catch (error) {
        console.error('Lỗi khi đánh dấu đã đọc:', error)
      }
    }
    
    // Lưu ID thông báo vào localStorage để sử dụng trong NotificationPage
    localStorage.setItem('selectedNotificationId', notification.id.toString())
    
    // Chuyển hướng đến trang chi tiết thông báo
    navigate('/notifications')
  }

  const handleMarkAllAsRead = async () => {
    if (isMarkingAllAsRead) return; // Tránh gọi API nhiều lần nếu đang processing

    console.log('Bắt đầu đánh dấu tất cả đã đọc...')
    try {
      setIsMarkingAllAsRead(true)
      
      console.log('Gọi API markAllAsRead...')
      const response = await markAllAsRead()
      console.log('Kết quả từ API:', response)
      
      // Hard refresh query (với fetchOptions để force refresh từ server)
      console.log('Đang làm mới danh sách thông báo...')
      await queryClient.resetQueries({ queryKey: ['notifications'] })
      await queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' })
      
      // Hiển thị thông báo thành công
      console.log('Hoàn tất đánh dấu tất cả đã đọc!')
      setMarkAllSuccess(true)
      setTimeout(() => {
        setMarkAllSuccess(false)
      }, 3000) // Ẩn thông báo sau 3 giây
    } catch (error) {
      console.error('Lỗi chi tiết khi đánh dấu tất cả đã đọc:', error)
      alert('Không thể đánh dấu tất cả đã đọc. Vui lòng thử lại sau.')
    } finally {
      setIsMarkingAllAsRead(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <BellIcon className='size-5' />
          {unreadCount > 0 && (
            <span className='absolute -top-1 -right-1 size-5 flex items-center justify-center text-[10px] font-medium bg-primary text-white rounded-full'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-80 p-0'>
        <div className='flex items-center justify-between p-4 border-b'>
          <h3 className='font-medium text-sm'>Thông báo</h3>
          {unreadCount > 0 ? (
            <>
              <Button 
                variant='outline' 
                size='sm' 
                className='text-xs h-8 flex items-center gap-1.5 border-primary text-primary hover:bg-primary/10'
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllAsRead}
              >
                {isMarkingAllAsRead ? (
                  <>
                    <span className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full mr-1"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckIcon className='size-3.5' />
                    Đánh dấu tất cả đã đọc
                  </>
                )}
              </Button>
              
              {/* Nút dự phòng để đảm bảo API được gọi */}
              <button 
                type="button"
                className="ml-2 p-1 bg-primary text-white text-[10px] rounded hidden"
                onClick={() => {
                  console.log('Thử gọi API từ nút dự phòng');
                  markAllAsRead()
                    .then(() => {
                      queryClient.invalidateQueries({ queryKey: ['notifications'] });
                      console.log('Gọi API từ nút dự phòng thành công!');
                    })
                    .catch(e => console.error('Lỗi từ nút dự phòng:', e));
                }}
              >
                Test API
              </button>
            </>
          ) : markAllSuccess ? (
            <span className='text-xs text-green-600 flex items-center gap-1'>
              <CheckCircledIcon className='size-3.5' />
              Đã đánh dấu tất cả đã đọc
            </span>
          ) : null}
        </div>
        <div className='max-h-80 overflow-y-auto'>
          {notificationsData.length > 0 ? (
            <div>
              {notificationsData.map((notification: NotificationResponse) => (
                <div 
                  key={notification.id} 
                  className={`p-3 hover:bg-accent cursor-pointer ${notification.status === 'UNREAD' ? 'bg-accent/50' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className='flex items-start gap-3'>
                    {getNotificationIcon(notification.notificationType)}
                    <div className='flex-1 min-w-0'>
                      <p className={`text-sm ${notification.status === 'UNREAD' ? 'font-medium' : ''}`}>
                        {notification.content}
                      </p>
                      <div className='flex items-center gap-2 text-xs text-muted-foreground mt-1'>
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
              <Separator />
              <div className='p-2'>
                <Link to='/notifications'>
                  <Button variant='ghost' className='w-full text-primary' size='sm'>
                    Xem tất cả thông báo
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-muted-foreground text-sm'>
              <BellIcon className='size-8 mb-2 text-muted' />
              <p>Chưa có thông báo nào</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

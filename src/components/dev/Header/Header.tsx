import { useContext } from 'react'
import { Link, createSearchParams } from 'react-router-dom'

// import LogoHCMUTE from '@/assets/images/logos/logo_hcmute_3.png'
import HeaderNotification from '@/components/dev/Header/components/HeaderNotification'
import NavHeader from '@/components/dev/Header/components/NavHeader'
import UserPopover from '@/components/dev/Header/components/UserPopover/UserPopover'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { AppContext } from '@/contexts/app.context'
import HeaderMessage from '@/components/dev/Header/components/HeaderMessage'
import ConsultantPopover from '@/components/dev/Header/components/ConsultantPopover'
import { ROLE, Role } from '@/constants/role'
import { Button } from '@/components/ui/button'
import LogoHCMUTE from '@/assets/images/logos/logo_hcmute_3.png'
import ModeToggle from '@/components/dev/ModeToggle'
import { AlignJustifyIcon, ChartNoAxesGantt } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import AvatarCustom from '@/components/dev/AvatarCustom'
import { clearLS } from '@/utils/auth'
import { CalendarIcon, DashboardIcon, RulerHorizontalIcon } from '@radix-ui/react-icons'
import { LogOutIcon } from 'lucide-react'
import { QuestionCircle, UserIcon } from '@/icons'
import PopoverItem from '@/components/dev/Header/components/PopoverItem'

export default function Header() {
  const { setIsAuthenticated, isAuthenticated, user, role, setUser, setRole } = useContext(AppContext)

  const handleLogout = () => {
    clearLS()
    setIsAuthenticated(false)
    setUser(null)
    setRole('')
  }

  const userPopoverData = [
    {
      id: 1,
      to: path.profile,
      children: (
        <>
          <UserIcon /> <span className='ml-1'>Hồ sơ cá nhân</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 2,
      to: path.myQuestions,
      children: (
        <>
          <QuestionCircle />
          <span className='ml-1'>Câu hỏi của tôi</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 2,
      to: path.mySchedual,
      children: (
        <>
          <CalendarIcon />
          <span className='ml-1'>Lịch tư vấn của tôi</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 78,
      to: path.consultation,
      children: (
        <>
          <CalendarIcon />
          <span className='ml-1'>Buổi tư vấn</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 232,
      to: path.myRating,
      children: (
        <>
          <RulerHorizontalIcon />
          <span className='ml-1'>Đánh giá của tôi</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 3,
      to: path.userDashBoard,
      children: (
        <>
          <DashboardIcon />
          <span className='ml-1'>Thống kê</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 4,
      to: undefined,
      children: (
        <>
          <LogOutIcon className='size-4 text-sm' />
          <span className='ml-1'>Đăng xuất</span>
        </>
      ),
      onClick: handleLogout
    }
  ]
  const consultantPopoverData = [
    {
      id: 1,
      to: path.profile,
      children: (
        <>
          <UserIcon /> <span className='ml-1'>Hồ sơ cá nhân</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 2,
      to: path.consultantDashboard,
      children: (
        <>
          <DashboardIcon />
          <span className='ml-1'>Thống kê</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 3,
      to: path.manageQuestion,
      children: (
        <>
          <ChartNoAxesGantt className='size-5' strokeWidth={1.25} />
          <span className='ml-1'>Quản lý</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 4,
      to: undefined,
      children: (
        <>
          <LogOutIcon className='size-4 text-sm' />
          <span className='ml-1'>Đăng xuất</span>
        </>
      ),
      onClick: handleLogout
    }
  ]
  const popoverData = role === ROLE.user ? userPopoverData : consultantPopoverData
  return (
    <header className='w-full border-b py-2 px-4 lg:px-12 flex items-center justify-between fixed top-0 left-0 z-30 bg-background text-foreground h-header-height backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='block lg:hidden'>
        <Sheet>
          <SheetTrigger>
            <AlignJustifyIcon />
          </SheetTrigger>
          <SheetContent side='left'>
            <div>
              {isAuthenticated && (
                <div className='flex items-start justify-between z-50'>
                  <Accordion type='single' collapsible>
                    <AccordionItem value='col-1'>
                      <AccordionTrigger>
                        <AvatarCustom url={user?.avatarUrl} />
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul>
                          {popoverData.map((item) => (
                            <PopoverItem key={item.id} to={item.to} onClick={item.onClick}>
                              {item.children}
                            </PopoverItem>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  {/* <ModeToggle /> */}
                </div>
              )}
              <NavHeader />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className='hidden lg:flex items-center'>
        <a href={path.home} className='flex items-center space-x-3'>
          <img src={LogoHCMUTE} alt='logo-hcmute' className='w-10 h-10' />
          <div className='w-[150px]'>
            <p className='font-bold !text-[#3155A6] text-sm text-appear2'>TƯ VẤN SINH VIÊN</p>
          </div>
        </a>
      </div>
      <div className='hidden lg:block'>
        <NavHeader />
      </div>
      <div className='flex items-center'>
        {!isAuthenticated && (
          <div className='flex items-center space-x-4'>
            <Button size='sm' variant='outline'>
              <Link
                to={{
                  pathname: path.register,
                  search: createSearchParams({
                    status: registerStatus.create
                  }).toString()
                }}
              >
                Đăng ký
              </Link>
            </Button>
            <Button size='sm'>
              <Link to={path.login}>Đăng nhập</Link>
            </Button>
          </div>
        )}
        {isAuthenticated && (
          <div className='flex lg:hidden items-center'>
            <HeaderNotification />
            <HeaderMessage />
          </div>
        )}
        {isAuthenticated && (
          <div className='hidden lg:flex items-center'>
            <HeaderNotification />
            {[ROLE.consultant as Role, ROLE.user as Role].includes(role as Role) && (
              <HeaderMessage />
            )}
            <ModeToggle />
            {role === ROLE.user && <UserPopover />}
            {[ROLE.consultant as Role, ROLE.admin as Role, ROLE.advisor as Role].includes(role as Role) && (
              <ConsultantPopover />
            )}
          </div>
        )}
      </div>
    </header>
  )
}

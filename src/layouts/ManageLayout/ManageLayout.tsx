import AvatarCustom from '@/components/dev/AvatarCustom'
import Header from '@/components/dev/Header'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import { ROLE } from '@/constants/role'
import { AppContext } from '@/contexts/app.context'
import { QuestionCircle } from '@/icons'
import { Role } from '@/types/user.type'
import clsx from 'clsx'
import {
  CalendarDaysIcon,
  CaptionsIcon,
  ClipboardPlusIcon,
  CreativeCommonsIcon,
  FingerprintIcon,
  MapPinIcon,
  SchoolIcon,
  User2Icon
} from 'lucide-react'
import { useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function ManageLayout() {
  const { role, user } = useContext(AppContext)
  const asideNav = [
    {
      title: 'Người dùng',
      children: [
        {
          path: path.manageUser,
          icon: <User2Icon className='size-5' />,
          label: 'Tài khoản',
          enabled: true
        }
      ],
      enabled: [ROLE.admin].includes(role as Role)
    },
    {
      title: 'Câu hỏi',
      children: [
        {
          path: path.manageQuestion,
          icon: <QuestionCircle className='size-5' />,
          label: 'Câu hỏi',
          enabled: [ROLE.admin, ROLE.consultant, ROLE.advisor].includes(role as Role)
        },
        {
          path: path.manageApprovalAnswer,
          icon: <QuestionCircle className='size-5' />,
          label: 'Phê duyệt',
          enabled: [ROLE.admin, ROLE.advisor].includes(role as Role)
        },
        {
          path: path.manageForwardQuestion,
          icon: <QuestionCircle className='size-5' />,
          label: 'Câu hỏi chuyển tiếp',
          enabled: [ROLE.admin, ROLE.consultant, ROLE.advisor].includes(role as Role)
        },
        {
          path: path.manageCommonQuestion,
          icon: <CreativeCommonsIcon className='size-5' />,
          label: 'Câu hỏi chung',
          enabled: [ROLE.admin, ROLE.advisor].includes(role as Role)
        }
      ],
      enabled: [ROLE.admin, ROLE.consultant, ROLE.advisor].includes(role as Role)
    },
    {
      title: 'Tư vấn',
      children: [
        {
          path: path.manageSchedule,
          icon: <CalendarDaysIcon className='size-5' />,
          label: 'Lịch tư vấn',
          enabled: true
        }
      ],
      enabled: [ROLE.admin, ROLE.consultant, ROLE.advisor].includes(role as Role)
    },
    {
      title: 'Bài đăng',
      children: [
        {
          path: path.managePost,
          icon: <ClipboardPlusIcon className='size-5' />,
          label: 'Bài đăng',
          enabled: true
        }
      ],
      enabled: [ROLE.admin, ROLE.advisor].includes(role as Role)
    },
    {
      title: 'Quyền',
      children: [
        {
          path: path.manageRole,
          icon: <FingerprintIcon className='size-5' />,
          label: 'Quyền người dùng',
          enabled: true
        },
        {
          path: path.manageConsultantRole,
          icon: <FingerprintIcon className='size-5' />,
          label: 'Quyền tư vấn viên',
          enabled: true
        },
        {
          path: path.manageAskRole,
          icon: <FingerprintIcon className='size-5' />,
          label: 'Quyền người hỏi',
          enabled: true
        }
      ],
      enabled: [ROLE.admin].includes(role as Role)
    },
    {
      title: 'Địa chỉ',
      children: [
        {
          path: path.manageDistrict,
          icon: <MapPinIcon className='size-5' />,
          label: 'Quận/Huyện',
          enabled: true
        },
        {
          path: path.manageWard,
          icon: <MapPinIcon className='size-5' />,
          label: 'Phường/Xã',
          enabled: true
        },
        {
          path: path.manageProvince,
          icon: <MapPinIcon className='size-5' />,
          label: 'Tỉnh/Thành phố',
          enabled: true
        }
      ],
      enabled: [ROLE.admin].includes(role as Role)
    },
    {
      title: 'Khác',
      children: [
        {
          path: path.manageField,
          icon: <CaptionsIcon className='size-5' />,
          label: 'Lĩnh vực',
          enabled: true
        },
        {
          path: path.manageDepartment,
          icon: <SchoolIcon className='size-5' />,
          label: 'Khoa',
          enabled: true
        }
      ],
      enabled: [ROLE.admin].includes(role as Role)
    }
  ]
  return (
    <div>
      <Header />
      <div className='gap-2 bg-background mt-[var(--header-height)] min-h-remain-screen relative'>
        <div className='w-[250px] fixed top-[var(--header-height)] left-0 bottom-0 bg-primary text-primary-foreground py-4 px-4 space-y-4 border-r overflow-y-auto'>
          <div className='flex items-center justify-center'>
            <img src='https://tracuuxettuyen.hcmute.edu.vn/assets/img/logo/ute_logo.png' alt='logo' className='w-24' />
          </div>
          <div className='flex items-center space-x-2'>
            <AvatarCustom url={user?.avatarUrl} />
            <div className='text-sm font-semibold'>
              <p>
                {user?.lastName} {user?.firstName}
              </p>
              <p>{role === ROLE.consultant ? 'Tư vấn viên' : role === ROLE.advisor ? 'Trưởng ban' : 'Admin'}</p>
            </div>
          </div>
          <Separator className='my-2' />
          {asideNav
            .map((item) => {
              if (!item.enabled) return null
              const childrenElement = item.children
                .map((child) => {
                  if (!child.enabled) return null
                  return (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        clsx('px-3 py-2 rounded-md text-sm flex items-center justify-start gap-2 w-full', {
                          'bg-secondary text-secondary-foreground  font-semibold': isActive,
                          'hover:bg-secondary hover:text-secondary-foreground transition-all': !isActive
                        })
                      }
                    >
                      {child.icon} {child.label}
                    </NavLink>
                  )
                })
                .filter(Boolean)

              return (
                <div key={item.title}>
                  <p className='font-semibold text-lg mb-1 ml-2 text-yellow-200'>{item.title}</p>
                  <div className='space-y-1'>{childrenElement}</div>
                </div>
              )
            })
            .filter(Boolean)}
        </div>
        <div className='px-6 py-2 rounded-3xl'>
          <div className='ml-[230px] px-4 py-2 rounded-3xl bg-primary-bg'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

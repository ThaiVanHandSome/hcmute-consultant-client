import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

interface Props {
  readonly to: string
  readonly label: string
  readonly icon?: React.ReactNode
  readonly isEmphasize?: boolean
}

export default function NavLinkItem({ to, label, icon, isEmphasize }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex text-sm items-center text-muted-foreground hover:text-primary hover:transition-all mx-0 lg:mx-2 my-2 lg:my-0',
          {
            '!text-primary font-bold': isActive,
            'flaming-text': isEmphasize
          }
        )
      }
    >
      {label}
      {icon && <div className='ml-1'>{icon}</div>}
    </NavLink>
  )
}

import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

interface Props {
  readonly to: string
  readonly label: string
}

export default function NavLinkItem({ to, label }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx('inline-block capitalize text-gray-500 hover:text-primary hover:transition-all mx-2', {
          'text-primary font-bold': isActive
        })
      }
    >
      {label}
    </NavLink>
  )
}

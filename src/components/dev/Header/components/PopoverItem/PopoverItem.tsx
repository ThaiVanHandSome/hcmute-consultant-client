import { Link } from 'react-router-dom'

interface Props {
  readonly to?: string
  readonly children: React.ReactNode
  readonly onClick?: () => void
}

export default function PopoverItem({ to, children, onClick }: Props) {
  return (
    <li
      aria-hidden='true'
      className='hover:font-bold hover:transition-all hover:text-primary text-sm py-2'
      onClick={!to ? onClick : () => {}}
    >
      {to && (
        <Link to={to} className='flex items-center'>
          {children}
        </Link>
      )}
      {!to && <div className='flex items-center'>{children}</div>}
    </li>
  )
}

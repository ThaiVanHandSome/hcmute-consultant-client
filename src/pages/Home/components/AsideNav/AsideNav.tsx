import { getAllDepartments } from '@/apis/department.api'
import path from '@/constants/path'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

export default function AsideNav() {
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  return (
    <aside>
      <div className='px-4 py-2 h-remain-screen overflow-y-auto'>
        <div className='text-center mb-4 py-2 rounded-sm bg-primary text-primary-foreground'>Câu hỏi theo đơn vị</div>
        <ul>
          {departments?.data.data?.map((department) => (
            <li
              key={department.id}
              className='text-left border-b border-slate-300 hover:bg-slate-200 hover:font-semibold transition-all'
            >
              <Link to={path.home} className='py-3 px-3 block'>
                {department.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

import { getAllDepartments } from '@/apis/department.api'
import { ScrollArea } from '@/components/ui/scroll-area'
import path from '@/constants/path'
import useQueryConfig, { QueryConfig } from '@/hooks/useQueryConfig'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Link, createSearchParams } from 'react-router-dom'

export default function AsideNav() {
  const queryConfig: QueryConfig = useQueryConfig()
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  return (
    <aside>
      <ScrollArea>
        <div className='px-4 py-2 h-remain-screen'>
          <div className='text-center mb-4 py-2 rounded-sm bg-primary text-primary-foreground font-bold'>
            Câu hỏi theo đơn vị
          </div>
          <ul>
            {departments?.data.data?.map((department) => (
              <li
                key={department.id}
                className={clsx(
                  'text-left border-b border-slate-300 hover:bg-slate-200 hover:font-semibold transition-all',
                  {
                    'bg-slate-200 font-semibold text-primary': parseInt(queryConfig.departmentId) === department.id
                  }
                )}
              >
                <Link
                  to={{
                    pathname: path.home,
                    search: createSearchParams({
                      departmentId: String(department.id)
                    }).toString()
                  }}
                  className='py-3 px-3 block'
                >
                  {department.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>
    </aside>
  )
}

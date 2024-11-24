import { getAllDepartments } from '@/apis/department.api'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useQuestionQueryConfig, { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import ConsultantWorking from '@/pages/User/Home/components/ConsultantWorking'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Link, createSearchParams } from 'react-router-dom'

export default function AsideNav() {
  const queryConfig: QuestionQueryConfig = useQuestionQueryConfig()
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  return (
    <aside>
      <div className='h-remain-screen'>
        <ScrollArea className='h-1/2'>
          <div className='px-4 py-2 h-1/2 '>
            <div className='mb-2 pt-2 rounded-sm font-bold text-lg px-2 text-gray-500'>Câu hỏi theo đơn vị</div>
            <ul>
              <li
                className={clsx('text-left hover:font-semibold transition-all text-sm hover:rounded-md', {
                  'bg-primary text-primary-foreground font-semibold rounded-md': !queryConfig.departmentId,
                  'hover:bg-card hover:text-card-foreground': queryConfig.departmentId
                })}
              >
                <Link
                  to={{
                    pathname: path.home
                  }}
                  className='py-3 px-3 block font-semibold'
                >
                  Tất cả phòng ban
                </Link>
              </li>
              {departments?.data.data?.map((department) => (
                <li
                  key={department.id}
                  className={clsx('text-left hover:font-semibold transition-all text-sm hover:rounded-md', {
                    'bg-primary text-primary-foreground font-semibold rounded-md':
                      parseInt(queryConfig.departmentId) === department.id,
                    'hover:bg-card hover:text-card-foreground': parseInt(queryConfig.departmentId) !== department.id
                  })}
                >
                  <Link
                    to={{
                      pathname: path.home,
                      search: createSearchParams({
                        departmentId: String(department.id)
                      }).toString()
                    }}
                    className='py-3 px-3 block font-semibold'
                  >
                    {department.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
        <Separator className='my-2' />
        <div className='px-4 h-1/2 mt-'>
          <ConsultantWorking />
        </div>
      </div>
    </aside>
  )
}

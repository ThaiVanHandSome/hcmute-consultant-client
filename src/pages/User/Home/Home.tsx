import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import path from '@/constants/path'
import { ROLE } from '@/constants/role'
import { AppContext } from '@/contexts/app.context'
import AsideNav from '@/pages/User/Home/components/AsideNav'
import ListQuestion from '@/pages/User/Home/components/ListQuestion'
import { useContext, useState, useEffect } from 'react'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import ListPost from '@/pages/User/Home/components/ListPost'
import ListConsultActivity from '@/pages/User/Home/components/ListConsultActivity'
import { TrendingUp, Search, HelpCircle, BookOpen, Activity, ChevronRight } from 'lucide-react'
import useQuestionQueryConfig, { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'

export default function Home() {
  const { role } = useContext(AppContext)
  const questionQueryConfig: QuestionQueryConfig = useQuestionQueryConfig()
  const [searchValue, setSearchValue] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({
        pathname: path.home,
        search: createSearchParams({
          ...questionQueryConfig,
          content: searchValue
        }).toString()
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [searchValue])

  return (
    <div className='min-h-screen bg-background selection:bg-blue-100'>
      <div className='flex relative max-w-[1920px] mx-auto'>
        {/* Left Sidebar - Refined */}
        <div className='hidden lg:flex flex-col w-[280px] fixed top-[var(--header-height)] h-[calc(100vh-var(--header-height))] bg-primary-bg shadow-[1px_0px_0px_0px_rgba(0,0,0,0.05)]'>
          <div className='p-1'>
            <AsideNav />
          </div>
        </div>

        {/* Main Content - Enhanced */}
        <main className='flex-1 lg:ml-[280px] lg:mr-[320px] relative z-10'>
          <div className='max-w-4xl mx-auto p-8 space-y-8'>
            {/* Question CTA - Premium */}
            {role === ROLE.user && (
              <div className='group relative'>
                <div className='absolute -inset-[0.5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-700'></div>
                <div className='relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-600 rounded-lg'>
                  <div className='absolute inset-0 bg-[url("/grid-pattern.svg")] opacity-10'></div>
                  <div className='relative p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                      <div className='p-2 rounded-lg bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105'>
                        <HelpCircle className='w-5 h-5 text-white' strokeWidth={1.5} />
                      </div>
                      <h2 className='text-lg font-semibold text-white'>Bạn cần được tư vấn chuyên sâu?</h2>
                    </div>
                    <p className='text-sm text-blue-50 mb-4 leading-relaxed'>
                      Đặt câu hỏi ngay để nhận được tư vấn từ các chuyên gia hàng đầu
                    </p>
                    <div className='flex gap-3'>
                      <Link to={path.createQuestion}>
                        <Button className='relative overflow-hidden group/btn bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300'>
                          <span className='relative z-10 flex items-center gap-1.5'>
                            Đặt câu hỏi ngay
                            <ChevronRight className='w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform' />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Questions - Professional Academic Style */}
            <div className='relative bg-gradient-to-b from-blue-50/30 via-blue-50/50 to-blue-50/30 -mx-8 px-8 py-2'>
              <div className='relative max-w-4xl mx-auto'>
                <div className='bg-background rounded-xl border border-secondary shadow-sm overflow-hidden'>
                  <div className='p-4 border-b border-secondary'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <div className='p-1.5 rounded-lg bg-primary/20'>
                          <BookOpen className='w-4 h-4 text-primary' strokeWidth={1.5} />
                        </div>
                        <div>
                          <h2 className='text-base font-semibold text-foreground'>Câu hỏi gần đây</h2>
                          <p className='text-xs text-secondary-foreground mt-0.5'>
                            Các câu hỏi từ sinh viên và giảng viên
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-secondary-foreground border-secondary text-xs py-1'
                        >
                          <Link
                            className='flex items-center space-x-1'
                            to={{
                              pathname: path.home,
                              search: createSearchParams({
                                ...questionQueryConfig,
                                isMostLiked: 'true'
                              }).toString()
                            }}
                          >
                            <TrendingUp className='w-3.5 h-3.5 mr-1' strokeWidth={1.5} />
                            Phổ biến
                          </Link>
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-secondary-foreground border-secondary text-xs py-1'
                        >
                          <Link
                            className='flex items-center space-x-1'
                            to={{
                              pathname: path.home,
                              search: createSearchParams({
                                ...questionQueryConfig,
                                isNewest: 'true'
                              }).toString()
                            }}
                          >
                            <Activity className='w-3.5 h-3.5 mr-1' strokeWidth={1.5} />
                            Mới nhất
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className='bg-primary-bg'>
                    <div className='p-4 bg-primary-bg'>
                      <ListQuestion />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Refined */}
        <div className='hidden lg:block w-[320px] fixed top-[var(--header-height)] right-0 h-[calc(100vh-var(--header-height))] bg-primary-bg shadow-[-1px_0px_0px_0px_rgba(0,0,0,0.05)]'>
          <ScrollArea className='h-full'>
            <div className='px-3 py-2 space-y-8'>
              {/* Search - Enhanced */}
              <div className='group relative'>
                <div className='absolute -inset-[0.5px] bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-700'></div>
                <div className='relative flex items-center'>
                  <Search
                    className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
                    strokeWidth={1.5}
                  />
                  <input
                    type='text'
                    placeholder='Tìm kiếm...'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary text-secondary-foreground placeholder:text-secondary-foreground transition-all duration-300'
                  />
                </div>
              </div>

              {/* Trending Posts */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='font-medium text-foreground flex items-center gap-2'>
                    <TrendingUp className='w-5 h-5 text-primary' strokeWidth={1.5} />
                    Bài viết nổi bật
                  </h3>
                  <Button variant='ghost' size='sm' className='text-gray-500 hover:text-gray-900 group/btn'>
                    Xem tất cả
                    <ChevronRight className='w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform' />
                  </Button>
                </div>
                <ListPost />
              </div>

              {/* Recent Activity */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='font-medium text-foreground flex items-center gap-2'>
                    <Activity className='w-5 h-5 text-primary' strokeWidth={1.5} />
                    Hoạt động tư vấn
                  </h3>
                  <Button variant='ghost' size='sm' className='text-gray-500 hover:text-gray-900 group/btn'>
                    Xem tất cả
                    <ChevronRight className='w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform' />
                  </Button>
                </div>
                <ListConsultActivity />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

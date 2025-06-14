/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookOpen, Clock3, AlertCircle, HelpCircle } from 'lucide-react'
import QuestionForm from '@/components/dev/QuestionForm/QuestionForm'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'

export default function CreateQuestion() {
  const [showRecommendationsPopup, setShowRecommendationsPopup] = useState<boolean>(false)
  const [recommendations, setRecommendations] = useState<any>()
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)

  console.log({
    showRecommendationsPopup,
    recommendations
  })

  return (
    <div className='container py-8'>
      <div className='space-y-6'>
        <div className='max-w-2xl mx-auto text-center mb-10'>
          <div className='flex justify-center mb-4'>
            <div className='bg-primary/10 p-3 rounded-full'>
              <HelpCircle className='w-6 h-6 text-primary' />
            </div>
          </div>
          <h1 className='text-2xl font-semibold text-foreground mb-2'>Trung tâm hỗ trợ sinh viên</h1>
          <p className='text-sm text-secondary-foreground'>
            Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn
          </p>
        </div>

        <div className='grid lg:grid-cols-12 gap-6'>
          {/* Sidebar Information */}
          <div className='lg:col-span-4 space-y-4'>
            {/* Guidelines Card */}
            <div className='bg-background rounded-lg shadow-sm border border-secondary p-5'>
              <div className='space-y-4'>
                <div className='flex gap-3'>
                  <BookOpen className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                  <div>
                    <p className='text-sm text-secondary-foreground'>
                      Các vấn đề: học tập, học bổng, chính sách sinh viên...
                    </p>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <Clock3 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                  <div>
                    <p className='text-sm text-secondary-foreground'>
                      Thời gian phản hồi: <span className='font-medium'>1-2 ngày làm việc</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Card */}
            <div className='bg-destructive rounded-lg border border-red-100 p-5'>
              <div className='flex gap-3'>
                <AlertCircle className='w-5 h-5 text-destructive-foreground shrink-0 mt-0.5' />
                <p className='text-sm text-destructive-foreground'>
                  Không đặt câu hỏi có nội dung không phù hợp. Tài khoản vi phạm sẽ bị khóa.
                </p>
              </div>
            </div>

            {showRecommendationsPopup && recommendations.length > 0 && (
              <div className='w-full z-50 animate-fadeIn'>
                <div className='bg-background w-full rounded-xl shadow-2xl border border-muted overflow-hidden'>
                  {/* Header */}
                  <div className='p-4 flex justify-between items-center border-b border-muted bg-muted/10'>
                    <div className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-primary'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'></path>
                        <line x1='12' y1='17' x2='12.01' y2='17'></line>
                      </svg>
                      <h3 className='font-semibold text-lg text-primary'>Câu hỏi tương tự</h3>
                    </div>
                    <button
                      onClick={() => setShowRecommendationsPopup(false)}
                      className='text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted/50'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <line x1='18' y1='6' x2='6' y2='18'></line>
                        <line x1='6' y1='6' x2='18' y2='18'></line>
                      </svg>
                    </button>
                  </div>

                  {/* Warning Message */}
                  <div className='p-4 bg-yellow-50 border-b border-yellow-100'>
                    <div className='flex items-start gap-3'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-yellow-600 flex-shrink-0 mt-0.5'
                      >
                        <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path>
                        <line x1='12' y1='9' x2='12' y2='13'></line>
                        <line x1='12' y1='17' x2='12.01' y2='17'></line>
                      </svg>
                      <div>
                        <p className='text-sm text-yellow-800 font-medium'>Lưu ý quan trọng</p>
                        <p className='text-sm text-yellow-700 mt-1'>
                          Nếu bạn tìm thấy câu hỏi tương tự phù hợp với thắc mắc của mình, vui lòng xem xét câu trả lời
                          trước khi đặt câu hỏi mới để tránh trùng lặp.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='max-h-[400px] overflow-y-auto'>
                    <div className='divide-y divide-muted'>
                      {recommendations.map((rec: any, index: any) => (
                        <button
                          type='button'
                          key={index}
                          onClick={() => setSelectedQuestion(rec)}
                          className='w-full text-left p-4 hover:bg-muted/50 transition-all duration-200 ease-in-out group'
                        >
                          <div className='flex items-start gap-3'>
                            <div className='flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium'>
                              {index + 1}
                            </div>
                            <div className='flex-1'>
                              <div
                                className='prose prose-sm max-w-none group-hover:text-primary transition-colors'
                                dangerouslySetInnerHTML={{ __html: rec.question }}
                              ></div>
                              {rec.answer && (
                                <div
                                  className='mt-2 text-sm text-muted-foreground line-clamp-2'
                                  dangerouslySetInnerHTML={{ __html: rec.answer }}
                                ></div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className='p-4 border-t border-muted bg-muted/10 flex justify-between items-center'>
                    <span className='text-sm text-muted-foreground'>
                      Tìm thấy {recommendations.length} câu hỏi tương tự
                    </span>
                    <button
                      onClick={() => setShowRecommendationsPopup(false)}
                      className='px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Question Detail Modal */}
            <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
              <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-primary'
                      >
                        <circle cx='12' cy='12' r='10'></circle>
                        <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'></path>
                        <line x1='12' y1='17' x2='12.01' y2='17'></line>
                      </svg>
                    </div>
                    <div>
                      <DialogTitle className='text-xl'>Chi tiết câu hỏi</DialogTitle>
                      <DialogDescription>Xem thông tin chi tiết về câu hỏi và câu trả lời</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className='space-y-8 py-4'>
                  {/* Question Section */}
                  <div className='relative pl-8 border-l-2 border-muted'>
                    <div className='absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-muted'></div>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <h4 className='text-sm font-medium text-muted-foreground'>Câu hỏi</h4>
                        <span className='text-xs text-muted-foreground/70'>•</span>
                        <span className='text-xs text-muted-foreground'>Từ người dùng</span>
                      </div>
                      <div className='prose prose-sm max-w-none'>
                        <div
                          className='text-foreground'
                          dangerouslySetInnerHTML={{ __html: selectedQuestion?.question }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Answer Section */}
                  {selectedQuestion?.answer && (
                    <div className='relative pl-8 border-l-2 border-muted'>
                      <div className='absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-muted'></div>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <h4 className='text-sm font-medium text-muted-foreground'>Câu trả lời</h4>
                          <span className='text-xs text-muted-foreground/70'>•</span>
                          <span className='text-xs text-muted-foreground'>Từ tư vấn viên</span>
                        </div>
                        <div className='prose prose-sm max-w-none'>
                          <div
                            className='text-foreground'
                            dangerouslySetInnerHTML={{ __html: selectedQuestion.answer }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    className='px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium flex items-center gap-2'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='18'
                      height='18'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <line x1='18' y1='6' x2='6' y2='18'></line>
                      <line x1='6' y1='6' x2='18' y2='18'></line>
                    </svg>
                    Đóng
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Main Form Section */}
          <div className='lg:col-span-8'>
            <div className='bg-background rounded-lg shadow-sm border border-secondary p-6'>
              <QuestionForm
                question={undefined}
                setShowRecommendationsPopup={setShowRecommendationsPopup}
                setRecommendations={setRecommendations}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

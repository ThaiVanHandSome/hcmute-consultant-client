import { getCommonQuestionAdvisor } from '@/apis/question.api'
import ExportCustom from '@/components/dev/ExportCustom'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import useCommonQuestionQueryConfig from '@/hooks/useCommonQuestionQueryConfig'
import CommonQuestionTable from '@/pages/Manage/ManageCommonQuestion/components/CommonQuestionTable'
import DialogCommonQuestion from '@/pages/Manage/ManageCommonQuestion/components/DialogCommonQuestion'
import { PlusIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

export default function ManageCommonQuestion() {
  const commonQuestionQueryConfig = useCommonQuestionQueryConfig()
  const form = useForm({
    defaultValues: {
      title: ''
    }
  })

  const { data: commonQuestions } = useQuery({
    queryKey: ['common-questions', commonQuestionQueryConfig],
    queryFn: () => getCommonQuestionAdvisor(commonQuestionQueryConfig)
  })

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Câu hỏi chung</h1>
          <p className='text-sm italic'>Quản lý câu hỏi chung</p>
        </div>
        <div className='flex items-center space-x-2'>
          <DialogCommonQuestion>
            <Button className='space-x-1'>
              <PlusIcon />
              <span>Thêm câu hỏi chung</span>
            </Button>
          </DialogCommonQuestion>
          <ExportCustom dataType='commonQuestion' queryConfig={commonQuestionQueryConfig} />
        </div>
      </div>
      <div>
        <Form {...form}>
          <form>
            <div className='grid grid-cols-12 gap-2'>
              <div className='col-span-4'>
                <InputCustom control={form.control} name='title' placeholder='Nhập tiêu đề để tìm kiếm' />
              </div>
              <div className='col-span-1'>
                <Button>Tìm kiếm</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <Separator />
      <div>
        <CommonQuestionTable commonQuestions={commonQuestions?.data.data.content} />
      </div>
    </div>
  )
}

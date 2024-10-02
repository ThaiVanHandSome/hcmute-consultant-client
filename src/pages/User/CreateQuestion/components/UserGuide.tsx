import { guideTypes } from '@/pages/User/CreateQuestion/CreateQuestion'

interface Props {
  readonly guideType?: keyof typeof guideTypes
}

export default function UserGuide({ guideType }: Props) {
  const guides = {
    [guideTypes.department]: {
      title: 'Đơn vị',
      desc: 'Chọn đơn vị mà bạn muốn đặt câu hỏi. Tuy nhiên, nếu bạn chưa biết nên hỏi đơn vị nào, bạn cứ chọn 1 đơn vị, trưởng ban của đơn vị sẽ chuyển tiếp câu hỏi của bạn đến một đơn vị thích hợp.'
    },
    [guideTypes.field]: {
      title: 'Lĩnh vực',
      desc: 'Chọn lĩnh vực mà bạn muốn hỏi. Chẳng hạn nếu bạn muốn hỏi về học bổng bạn có thể chọn Điểm rèn luyện - Học bổng'
    },
    [guideTypes.role]: {
      title: 'Vai trò',
      desc: 'Bạn là ai? Học sinh, Sinh viên hay Phụ huynh,...'
    },
    [guideTypes.studentId]: {
      title: 'Mã số sinh viên',
      desc: 'Nhập mã số sinh viên của bạn nếu bạn cần hỗ trợ chi tiết hơn'
    },
    [guideTypes.firstName]: {
      title: 'Họ',
      desc: 'Nhập họ của bạn. Vui lòng nhập họ có nghĩa, không dùng các biệt danh GenZ'
    },
    [guideTypes.lastName]: {
      title: 'Tên',
      desc: 'Nhập tên của bạn. Vui lòng nhập tên có nghĩa, không dùng các biệt danh GenZ'
    },
    [guideTypes.email]: {
      title: 'Email',
      desc: 'Nhập email của bạn'
    },
    [guideTypes.title]: {
      title: 'Tiêu đề',
      desc: 'Tóm tắt vấn đề mà bạn cần hỏi là gì'
    },
    [guideTypes.content]: {
      title: 'Nội dung',
      desc: 'Nêu rõ vấn đề mà bạn cần hỏi. Cần nêu chi tiết để tư vấn viên có thể hỗ trợ bạn tốt hơn.'
    }
  }
  return (
    <div className='bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-lg shadow-md'>
      {guideType && guides[guideType] && (
        <div>
          <p className='text-xl font-semibold text-blue-700 mb-2'>{guides[guideType].title}</p>
          <p className='text-gray-600 text-sm'>{guides[guideType].desc}</p>
        </div>
      )}
    </div>
  )
}

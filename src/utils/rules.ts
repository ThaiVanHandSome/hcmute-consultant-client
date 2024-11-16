import * as yup from 'yup'

export const RegisterSchema = yup.object({
  username: yup.string().required('Bạn phải nhập username').min(5, 'Bạn phải nhập tối thiểu 5 ký tự'),
  email: yup.string().required('Bạn phải nhập email'),
  password: yup.string().required('Bạn phải nhập mật khẩu').min(6, 'Mật khẩu phải có tối đa 6 kí tự'),
  confirmPassword: yup
    .string()
    .required('Bạn phải nhập lại mật khẩu')
    .min(6, 'Mật khẩu phải có tối đa 6 kí tự')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
  phone: yup.string().required('Bạn phải nhập số điện thoại').max(20, 'Số điện thoại có tối đa 20 ký tự'),
  gender: yup.string().oneOf(['NAM', 'NU'])
})

export const ConfirmTokenSchema = yup.object({
  token: yup.string().required('Bạn phải nhập mã xác nhận')
})

export const LoginSchema = yup.object({
  email: yup.string().required('Bạn phải nhập email').email('Email không đúng định dạng'),
  password: yup.string().required('Bạn phải nhập mật khẩu').min(6, 'Mật khẩu phải có tối đa 6 kí tự')
})

export const ChangeEmailSchema = yup.object({
  newEmail: yup.string().required('Bạn phải nhập email').email('Email không đúng định dạng')
})

export const PasswordRecoverySchema = yup.object({
  emailRequest: yup.string().required('Bạn phải nhập email').email('Email không đúng định dạng'),
  password: yup.string().required('Bạn phải nhập mật khẩu').min(6, 'Mật khẩu phải có tối đa 6 kí tự'),
  newPassword: yup.string().required('Bạn phải nhập mật khẩu').min(6, 'Mật khẩu phải có tối đa 6 kí tự'),
  confirmPassword: yup
    .string()
    .required('Bạn phải nhập lại mật khẩu')
    .min(6, 'Mật khẩu phải có tối đa 6 kí tự')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu không khớp')
})

export const CreateQuestionSchema = yup.object({
  departmentId: yup.string().required('Bạn phải chọn đơn vị'),
  fieldId: yup.string().required('Bạn phải chọn lĩnh vực'),
  roleAskId: yup.string().required('Bạn phải chọn vai trò'),
  studentCode: yup.string(),
  firstName: yup.string().required('Bạn phải nhập họ'),
  lastName: yup.string().required('Bạn phải nhập tên'),
  title: yup.string().required('Bạn phải nhập tiêu đề câu hỏi'),
  content: yup
    .string()
    .required('Bạn chưa nhập nội dung cần tư vấn')
    .notOneOf(['<p><br></p>'], 'Bạn chưa nhập nội dung cần tư vấn'),
  statusPublic: yup.boolean()
})

export const ConsultantsSchema = yup.object({
  departmentId: yup.string(),
  name: yup.string().required('Bạn phải nhập tên ban tư vấn')
})

export const SchedualConsultantSchema = yup.object({
  departmentId: yup.string().required('Bạn phải chọn phòng ban'),
  consultantId: yup.string().required('Bạn phải chọn người tư vấn'),
  title: yup.string().required('Bạn phải nhập tiêu đề'),
  content: yup.string().required('Bạn phải nhập nội dung cần được tư vấn'),
  statusPublic: yup.boolean(),
  mode: yup.boolean()
})

export const RatingSchema = yup.object({
  consultantId: yup.string().required('Bạn phải chọn người tư vấn'),
  departmentId: yup.string().required('Bạn phải chọn phòng ban'),
  generalSatisfaction: yup.string().required('Bạn chưa đánh giá'),
  generalComment: yup.string(),
  expertiseKnowledge: yup.string().required('Bạn chưa đánh giá'),
  expertiseComment: yup.string(),
  attitude: yup.string().required('Bạn chưa đánh giá'),
  attitudeComment: yup.string(),
  responseSpeed: yup.string().required('Bạn chưa đánh giá'),
  responseSpeedComment: yup.string(),
  understanding: yup.string().required('Bạn chưa đánh giá'),
  understandingComment: yup.string()
})

export const CreateConversationSchema = yup.object({
  consultantId: yup.string().required('Bạn phải chọn người tư vấn'),
  departmentId: yup.string().required('Bạn phải chọn phòng ban')
})

export const CreateGroupConversationSchema = yup.object({
  name: yup.string()
})

export const SchedualConfirmSchema = yup.object({
  mode: yup.string(),
  statusPublic: yup.string(),
  statusConfirmed: yup.string(),
  title: yup.string().required('Bạn phải nhập tiêu đề'),
  content: yup.string().required('Bạn phải nhập nội dung cần được tư vấn'),
  location: yup.string(),
  link: yup.string()
})

export const AddPostSchema = yup.object({
  title: yup.string().required('Bạn phải nhập tiêu đề'),
  content: yup.string().required('Bạn phải nhập nội dung')
})

export const DistrictSchema = yup.object({
  code: yup.string().required('Bạn phải nhập mã'),
  codeName: yup.string().required('Bạn phải nhập tên mã'),
  fullName: yup.string().required('Bạn phải nhập toàn bộ tên'),
  fullNameEn: yup.string().required('Bạn phải nhập toàn bộ tên (English)'),
  name: yup.string().required('Bạn phải nhập tên'),
  nameEn: yup.string().required('Bạn phải nhập tên (English)'),
  provinceCode: yup.string().required('Bạn phải chọn tỉnh/thành phố')
})

export const WardSchema = yup.object({
  code: yup.string().required('Bạn phải nhập mã'),
  codeName: yup.string().required('Bạn phải nhập tên mã'),
  fullName: yup.string().required('Bạn phải nhập toàn bộ tên'),
  fullNameEn: yup.string().required('Bạn phải nhập toàn bộ tên (English)'),
  name: yup.string().required('Bạn phải nhập tên'),
  nameEn: yup.string().required('Bạn phải nhập tên (English)'),
  districtCode: yup.string().required('Bạn phải chọn tỉnh/thành phố'),
  provinceCode: yup.string()
})

export const ProvinceSchema = yup.object({
  code: yup.string().required('Bạn phải nhập mã'),
  codeName: yup.string().required('Bạn phải nhập tên mã'),
  fullName: yup.string().required('Bạn phải nhập toàn bộ tên'),
  fullNameEn: yup.string().required('Bạn phải nhập toàn bộ tên (English)'),
  name: yup.string().required('Bạn phải nhập tên'),
  nameEn: yup.string().required('Bạn phải nhập tên (English)')
})

export const RoleSchema = yup.object({
  name: yup.string().required('Bạn phải nhập tên')
})

export const ConsultantRoleSchema = yup.object({
  name: yup.string().required('Bạn phải nhập tên'),
  roleId: yup.string().required('Bạn phải nhập mã role')
})

export const FieldSchema = yup.object({
  name: yup.string().required('Bạn phải nhập tên'),
  departmentId: yup.string().required('Bạn phải chọn khoa')
})

export const DepartmentSchema = yup.object({
  name: yup.string().required('Bạn phải nhập tên'),
  description: yup.string().required('Bạn phải nhập mô tả'),
  logo: yup.string().required()
})

export const CommonQuestionSchema = yup.object({
  title: yup.string().required('Bạn phải nhập tiêu đề câu hỏi'),
  content: yup.string().required('Bạn phải nhập nội dung câu hỏi'),
  answerTitle: yup.string().required('Bạn phải nhập tiêu đề câu trả lời'),
  answerContent: yup.string().required('Bạn phải nhập nội dung câu trả lời')
})

export const AnswerSchema = yup.object({
  content: yup.string().required('Bạn phải nhập nội dung câu trả lời')
})

import * as yup from 'yup'

export const RegisterSchema = yup.object({
  username: yup.string().required('Bạn phải nhập username').min(5, 'Bạn phải nhập tối thiểu 5 ký tự'),
  email: yup.string().required('Bạn phải nhập email').email('Email không đúng định dạng'),
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

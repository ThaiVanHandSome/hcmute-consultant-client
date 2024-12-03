const path = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  createQuestion: '/create-question',
  user: '/user',
  myQuestions: '/user/question',
  profile: '/user/profile',
  changePassword: '/user/change-password',
  mySchedual: '/user/schedual-consutants',
  myRating: '/user/ratings',
  consultants: '/consultants',
  chats: '/chats',
  consultantEvaluation: '/consultant-evaluation',
  scheduleConsultant: '/schedule-consultant',
  consultation: '/user/consultations',
  userDashBoard: '/user/dashboard',
  consultantDashboard: '/user/consultant-dashboard',
  questionLibrary: '/question-library',
  messages: '/messages',
  consultantMessages: '/consultant-messages',
  manage: '/manage',
  manageQuestion: '/manage/questions',
  manageForwardQuestion: '/manage/forward-questions',
  manageSchedule: '/manage/schedules',
  managePost: '/manage/posts',
  manageCommonQuestion: '/manage/common-questions',
  manageDistrict: '/manage/districts',
  manageWard: '/manage/wards',
  manageProvince: '/manage/provinces',
  manageRole: '/manage/roles',
  manageConsultantRole: '/manage/consultant-roles',
  manageAskRole: '/manage/ask-roles',
  manageField: '/manage/fields',
  manageDepartment: '/manage/departments',
  manageUser: '/manage/users',
  manageApprovalAnswer: '/manage/approval-answers',
  approvalQuestionDetail: '/manage/approval-answers/detail/:id',
  questionDetail: '/manage/questions/detail/:id',
  schedualDetail: '/manage/schedules/detail/:id',
  postDetail: '/manage/posts/detail/:id',
  scheduleActivity: '/schedule-activities/:id',
  scheduleActivities: '/schedule-activities',
  post: '/posts/:id',
  posts: '/posts'
} as const

export default path

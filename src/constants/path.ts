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
  consultantEvaluation: '/consultant-evaluation',
  scheduleConsultant: '/schedule-consultant',
  userDashBoard: '/user/dashboard',
  questionLibrary: '/question-library',
  messages: '/messages',
  consultantMessages: '/consultant-messages',
  manage: '/manage',
  manageQuestion: '/manage/questions',
  manageSchedule: '/manage/schedules',
  questionDetail: '/manage/questions/detail/:id',
  schedualDetail: '/manage/schedules/detail/:id'
} as const

export default path

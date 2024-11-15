import { useContext } from 'react'

import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import path from '@/constants/path'
import { AppContext } from '@/contexts/app.context'

// import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout'
import UserLayout from '@/layouts/UserLayout'

import ForgotPassword from '@/pages/Auth/ForgotPassword'
import LoginV2 from '@/pages/Auth/LoginV2'
import Register from '@/pages/Auth/Register'
import ChangePassword from '@/pages/User/ChangePassword'
import ConsultantEvaluation from '@/pages/User/ConsultantEvaluation'
import Consultants from '@/pages/User/Consultants'
import CreateQuestion from '@/pages/User/CreateQuestion'
import Home from '@/pages/User/Home'
import Message from '@/pages/User/Message'
import MyQuestion from '@/pages/User/MyQuestion'
import Profile from '@/pages/User/Profile'
import QuestionLibrary from '@/pages/User/QuestionLibrary'
import SchedualConsultant from '@/pages/User/SchedualConsultant'
import UserDashBoard from '@/pages/User/UserDashBoard'
import MySchedual from '@/pages/User/MySchedual'
import MyRating from '@/pages/User/MyRating'
import ManageLayout from '@/layouts/ManageLayout'
import ManageQuestion from '@/pages/Manage/ManageQuestion'
import QuestionDetail from '@/pages/Manage/QuestionDetail'
import ManageSchedual from '@/pages/Manage/ManageSchedual'
import SchedualDetail from '@/pages/Manage/SchedualDetail'
import ManagePost from '@/pages/Manage/ManagePost'
import PostDetail from '@/pages/Manage/PostDetail'
import ConsultantDashboard from '@/pages/Manage/ConsultantDashboard'
import Post from '@/pages/User/Post'
import ManageCommonQuestion from '@/pages/Manage/ManageCommonQuestion'
import { ROLE } from '@/constants/role'
import { Role } from '@/types/user.type'
import ManageDistrict from '@/pages/Manage/ManageDistrict'
import ManageWard from '@/pages/Manage/ManageWard'
import ManageProvince from '@/pages/Manage/ManageProvince'
import ManageRole from '@/pages/Manage/ManageRole'
import ManageConsultantRole from '@/pages/Manage/ManageConsultantRole'
import ManageAskRole from '@/pages/Manage/ManageAskRole'
import ManageField from '@/pages/Manage/ManageField'
import ManageDepartment from '@/pages/Manage/ManageDepartment'
import ManageUser from '@/pages/Manage/ManageUser'
import ManageApprovalAnswer from '@/pages/Manage/ManageApprovalAnswer/ManageApprovalAnswer'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function ProtectedManageRoute() {
  const { role } = useContext(AppContext)
  return [ROLE.admin, ROLE.advisor, ROLE.consultant].includes(role as Role) ? <Outlet /> : <Navigate to={path.home} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
}

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: path.consultants,
      index: true,
      element: (
        <MainLayout>
          <Consultants />
        </MainLayout>
      )
    },
    {
      path: path.questionLibrary,
      index: true,
      element: (
        <MainLayout>
          <QuestionLibrary />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.consultantEvaluation,
          index: true,
          element: (
            <MainLayout>
              <ConsultantEvaluation />
            </MainLayout>
          )
        },
        {
          path: path.scheduleConsultant,
          index: true,
          element: (
            <MainLayout>
              <SchedualConsultant />
            </MainLayout>
          )
        },
        {
          path: path.createQuestion,
          element: (
            <MainLayout>
              <CreateQuestion />
            </MainLayout>
          )
        },
        {
          path: path.messages,
          element: (
            <MainLayout>
              <Message />
            </MainLayout>
          )
        },
        {
          path: path.post,
          element: (
            <MainLayout>
              <Post />
            </MainLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.myQuestions,
              element: <MyQuestion />
            },
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.myRating,
              element: <MyRating />
            },
            {
              path: path.mySchedual,
              element: <MySchedual />
            },
            {
              path: path.userDashBoard,
              element: <UserDashBoard />
            }
          ]
        },
        {
          path: '',
          element: <ProtectedManageRoute />,
          children: [
            {
              path: path.manage,
              element: <ManageLayout />,
              children: [
                {
                  path: path.manageQuestion,
                  element: <ManageQuestion />
                },
                {
                  path: path.manageSchedule,
                  element: <ManageSchedual />
                },
                {
                  path: path.managePost,
                  element: <ManagePost />
                },
                {
                  path: path.questionDetail,
                  element: <QuestionDetail />
                },
                {
                  path: path.schedualDetail,
                  element: <SchedualDetail />
                },
                {
                  path: path.postDetail,
                  element: <PostDetail />
                },
                {
                  path: path.manageCommonQuestion,
                  element: <ManageCommonQuestion />
                },
                {
                  path: path.manageDistrict,
                  element: <ManageDistrict />
                },
                {
                  path: path.manageWard,
                  element: <ManageWard />
                },
                {
                  path: path.manageProvince,
                  element: <ManageProvince />
                },
                {
                  path: path.manageRole,
                  element: <ManageRole />
                },
                {
                  path: path.manageConsultantRole,
                  element: <ManageConsultantRole />
                },
                {
                  path: path.manageAskRole,
                  element: <ManageAskRole />
                },
                {
                  path: path.manageField,
                  element: <ManageField />
                },
                {
                  path: path.manageDepartment,
                  element: <ManageDepartment />
                },
                {
                  path: path.manageUser,
                  element: <ManageUser />
                },
                {
                  path: path.manageApprovalAnswer,
                  element: <ManageApprovalAnswer />
                },
                {
                  path: path.approvalQuestionDetail,
                  element: <QuestionDetail />
                }
              ]
            },
            {
              path: path.user,
              element: (
                <MainLayout>
                  <UserLayout />
                </MainLayout>
              ),
              children: [
                {
                  path: path.consultantDashboard,
                  element: <ConsultantDashboard />
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: <LoginV2 />
        },
        {
          path: path.register,
          element: <Register />
        },
        {
          path: path.forgotPassword,
          element: <ForgotPassword />
        }
      ]
    }
  ])
  return routeElement
}

import { useContext } from 'react'

import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import path from '@/constants/path'
import { AppContext } from '@/contexts/app.context'

// import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout'
import UserLayout from '@/layouts/UserLayout'

import ForgotPassword from '@/pages/Auth/ForgotPassword'
import Login from '@/pages/Auth/Login'
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

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
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
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: <Login />
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

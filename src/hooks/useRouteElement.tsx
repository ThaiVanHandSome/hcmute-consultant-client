import path from '@/constants/path'
import { AppContext } from '@/contexts/app.context'
import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout'
import ForgotPassword from '@/pages/Auth/ForgotPassword'
import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
import CreateQuestion from '@/pages/User/CreateQuestion'
import Home from '@/pages/User/Home'
import MyQuestion from '@/pages/User/MyQuestion'
import { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

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
      path: '',
      element: <ProtectedRoute />,
      children: [
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
          path: path.createQuestion,
          element: (
            <MainLayout>
              <CreateQuestion />
            </MainLayout>
          )
        },
        {
          path: path.myQuestions,
          element: (
            <MainLayout>
              <MyQuestion />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <AuthLayout>
              <Login />
            </AuthLayout>
          )
        },
        {
          path: path.register,
          element: (
            <AuthLayout>
              <Register />
            </AuthLayout>
          )
        },
        {
          path: path.forgotPassword,
          element: (
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          )
        }
      ]
    }
  ])
  return routeElement
}

import path from '@/constants/path'
import { AppContext } from '@/contexts/app.context'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

// function ProtectedRoute() {
//   const { isAuthenticated } = useContext(AppContext)
//   return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
// }

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
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <MainLayout>
              <Login />
            </MainLayout>
          )
        },
        {
          path: path.register,
          element: (
            <MainLayout>
              <Register />
            </MainLayout>
          )
        }
      ]
    }
  ])
  return routeElement
}

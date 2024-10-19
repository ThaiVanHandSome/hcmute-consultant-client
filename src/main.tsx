import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'
import 'react-quill/dist/quill.snow.css'
import './index.css'
import { AppProvider } from '@/contexts/app.context.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/dev/ThemeProvider/ThemeProvider.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <App />
        </ThemeProvider>
      </AppProvider>
    </QueryClientProvider>
  </BrowserRouter>
  // </StrictMode>
)

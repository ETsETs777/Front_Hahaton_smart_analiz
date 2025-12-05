import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { routes } from '@/routes'
import '@ant-design/v5-patch-for-react-19'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import './styles/global.scss'

dayjs.locale('ru')

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
)

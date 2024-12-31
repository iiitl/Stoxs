import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.tsx'
import DashBoard from './pages/DashBoard.tsx'
import About from './pages/About.tsx'
import AddStocks from './pages/AddStocks.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: <DashBoard />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/addstocks",
        element: <AddStocks />,
      }
    ]
},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)
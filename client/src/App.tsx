import AppRoutes from "./routes/Routes"
import { BrowserRouter as MainRouter } from "react-router"
import { useEffect } from "react"

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('SW registered: ', registration)
        },
        (error) => {
          console.log('SW registration failed: ', error)
        }
      )
    }
  }, [])

  return (
    <>
      <MainRouter>
        <div className="container">
          <AppRoutes />
        </div>
      </MainRouter>
    </>
  )
}

export default App

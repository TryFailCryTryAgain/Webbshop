import AppRoutes from "./routes/Routes"
import { BrowserRouter as MainRouter } from "react-router"

function App() {

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

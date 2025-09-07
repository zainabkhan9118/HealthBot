import { ThemeProvider } from "@/components/theme-provider"
import Layout from "./layout"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import HomePage from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Chat from "./pages/Chat"
import Settings from "./pages/Settings"
import Progress from "./pages/Progress"
import Journal from "./pages/Journal"
import Resources from "./pages/Resources"
import CheckIn from "./pages/CheckIn"
import CheckInHistory from "./pages/CheckInHistory"
function App() {
  return (
    <>
    <ThemeProvider defaultTheme="Light" storageKey="vite-ui-theme">
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/check-in-history" element={<CheckInHistory />} />
        {/* Dashboard routes with layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="settings" element={<Settings/>} />
          <Route path="progress" element={<Progress />} />
          <Route path="journal" element={<Journal />} />
          <Route path="resources" element={<Resources />} />
        </Route>
      </Routes>
      </Router>
    </ThemeProvider>
    </>
  )
}

export default App

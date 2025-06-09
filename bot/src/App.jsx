import { ThemeProvider } from "@/components/theme-provider"
import Layout from "./layout"
import { ModeToggle } from "./components/mode-toggle"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import HomePage from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Chat from "./pages/Chat"

function App() {
  return (
    <>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Dashboard routes with layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
      </Router>
    </ThemeProvider>
    </>
  )
}

export default App

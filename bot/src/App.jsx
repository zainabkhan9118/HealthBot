import { ThemeProvider } from "@/components/theme-provider"
import Layout from "./layout"
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
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
import { ChatProvider } from "@/context/ChatContext"
import { AuthProvider } from "@/context/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"

function App() {
  return (
    <>
    <ThemeProvider defaultTheme="Light" storageKey="vite-ui-theme">
    <Router>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes - require authentication */}
            <Route 
              path="/check-in" 
              element={
                <ProtectedRoute>
                  <CheckIn />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/check-in-history" 
              element={
                <ProtectedRoute>
                  <CheckInHistory />
                </ProtectedRoute>
              } 
            />
            
            {/* Dashboard routes with layout - all protected */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="chat" element={<Chat />} />
              <Route path="settings" element={<Settings/>} />
              <Route path="progress" element={<Progress />} />
              <Route path="journal" element={<Journal />} />
              <Route path="resources" element={<Resources />} />
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ChatProvider>
      </AuthProvider>
      </Router>
    </ThemeProvider>
    </>
  )
}

export default App

import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import SettingPage from './pages/SettingPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router } from 'react-router-dom'
import SettingsPage from './pages/SettingsPage'

const PrivateRoute = ({ children }) => {
  const { authUser } = useAuthStore()
  return authUser ? children : <Navigate to="/login" />
}

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
  const { theme } = useThemeStore()

  console.log("Online Users:", onlineUsers);

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <Router>
      <Toaster />
      <div data-theme={theme} className="min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
            <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
            <Route path='/settings' element={authUser ? <SettingPage /> : <Navigate to="/login" />} />
            <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
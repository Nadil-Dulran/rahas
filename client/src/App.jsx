import React, { useContext, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage.jsx'
import Loginpage from './pages/Loginpage.jsx'
import Profilepage from './pages/Profilepage.jsx'
import { GradientBackground } from './components/GradientBackground.jsx'
import {Toaster} from 'react-hot-toast';

const App = () => {
  const [theme, setTheme] = useState('dark') // or 'light'
  const isDark = theme === 'dark'
const {authUser} = useContext(AuthContext)
  return (
    <GradientBackground theme={theme}>
      <Toaster/>
      <Routes>
        <Route path="/" element={authUser ? <Homepage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <Loginpage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <Profilepage /> : <Navigate to="/login" />} />
      </Routes>
      {/* Sun/Moon icon toggle (no traditional button element) */}
      <div
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle theme"
        tabIndex={0}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setTheme(isDark ? 'light' : 'dark')
          }
        }}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full border border-black/10 bg-white/80 p-1shadow backdrop-blur transition dark:border-white/10 dark:bg-black/50 dark:text-white"
      >
        <span className="sr-only">{isDark ? 'Switch to light' : 'Switch to dark'}</span>
        {/* Track */}
        <span className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 transition dark:bg-gray-700">
          {/* Knob */}
          <span
            className={`absolute left-1 top-1 inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white text-yellow-500 shadow transition duration-200 ${isDark ? 'translate-x-6 text-yellow-300' : 'translate-x-0'}`}
          >
            {/* Icon inside knob: sun for light, moon for dark */}
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M21.752 15.002A9.718 9.718 0 0 1 12.998 22C7.477 22 3 17.523 3 12.002a9.718 9.718 0 0 1 6.998-8.754.75.75 0 0 1 .94.94A8.218 8.218 0 0 0 10.5 6.75c0 4.556 3.694 8.25 8.25 8.25.685 0 1.351-.083 1.997-.244a.75.75 0 0 1 1.005.246.75.75 0 0 1 0 .001z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-10a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM5 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm14 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM7.05 7.05a1 1 0 1 1 1.414-1.414A1 1 0 0 1 7.05 7.05zm8.486 8.486a1 1 0 1 1 1.414-1.414 1 1 0 0 1-1.414 1.414zM7.05 16.95a1 1 0 1 1 1.414 1.414 1 1 0 0 1-1.414-1.414zM16.95 7.05a1 1 0 1 1 1.414 1.414 1 1 0 0 1-1.414-1.414z" />
              </svg>
            )}
          </span>
        </span>
      </div>
    </GradientBackground>
  )
}

export default App
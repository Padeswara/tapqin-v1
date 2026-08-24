import { useState, useEffect } from 'react'
import defaultProfileData from './data/profile.json'
import { AdminPage } from './pages/AdminPage'

export default function AdminApp() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('tapqin_theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('tapqin_profile_data')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    return defaultProfileData
  })

  // Sync theme
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('tapqin_theme', theme)
  }, [theme])

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'tapqin_profile_data' && e.newValue) {
        try {
          setProfile(JSON.parse(e.newValue))
        } catch (err) {
          console.error(err)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleSaveProfile = (newData) => {
    setProfile(newData)
    try {
      localStorage.setItem('tapqin_profile_data', JSON.stringify(newData))
    } catch (e) {
      console.error(e)
    }
  }

  const handleOpenPublicTab = () => {
    window.open('/', '_blank')
  }

  return (
    <AdminPage
      profileData={profile}
      onSave={handleSaveProfile}
      onNavigateToPublic={handleOpenPublicTab}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  )
}

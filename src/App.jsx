import { useState, useEffect } from 'react'
import defaultProfileData from './data/profile.json'
import { PublicPage } from './pages/PublicPage'
import { getProfileFromSupabase, subscribeToProfileUpdates } from './lib/supabase'

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('tapqin_theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Dynamic Profile Data (Instant local render with fast Supabase sync)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('tapqin_profile_data')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    return defaultProfileData
  })

  // 1. Fetch latest profile data from Supabase on mount
  useEffect(() => {
    let isMounted = true

    async function syncFromCloud() {
      const cloudData = await getProfileFromSupabase()
      if (cloudData && isMounted) {
        setProfile(cloudData)
        try {
          localStorage.setItem('tapqin_profile_data', JSON.stringify(cloudData))
        } catch (e) {
          console.error(e)
        }
      }
    }

    syncFromCloud()

    // 2. Realtime listener for instant live updates from CMS
    const unsubscribe = subscribeToProfileUpdates((updatedData) => {
      if (isMounted && updatedData) {
        setProfile(updatedData)
        try {
          localStorage.setItem('tapqin_profile_data', JSON.stringify(updatedData))
        } catch (e) {
          console.error(e)
        }
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  // 3. Listen for storage changes from CMS across local tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'tapqin_profile_data' && e.newValue) {
        try {
          setProfile(JSON.parse(e.newValue))
        } catch (err) {
          console.error('Failed to sync profile from storage', err)
        }
      }
      if (e.key === 'tapqin_theme' && e.newValue) {
        setTheme(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Sync theme with HTML root class
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('tapqin_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <PublicPage
      profile={profile}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  )
}

export default App

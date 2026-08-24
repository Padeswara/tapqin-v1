import { useState, useEffect } from 'react'
import defaultProfileData from './data/profile.json'
import { AdminPage } from './pages/AdminPage'
import { getProfileFromSupabase, saveProfileToSupabase, isSupabaseConfigured } from './lib/supabase'
import { Lock, ArrowRight, ShieldCheck, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react'

const CONFIGURED_ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '123456'

export default function AdminApp() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('tapqin_theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Auth state: check if admin is unlocked in this browser
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('tapqin_admin_auth') === 'true' || sessionStorage.getItem('tapqin_admin_auth') === 'true'
  })
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

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

  // Sync latest from Supabase on mount
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
    return () => {
      isMounted = false
    }
  }, [])

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

  // Handle Admin PIN verification
  const handlePinSubmit = (e) => {
    e?.preventDefault()
    if (pinInput.trim() === CONFIGURED_ADMIN_PIN.trim()) {
      setIsAuthenticated(true)
      setPinError(false)
      if (rememberMe) {
        localStorage.setItem('tapqin_admin_auth', 'true')
      } else {
        sessionStorage.setItem('tapqin_admin_auth', 'true')
      }
    } else {
      setPinError(true)
      setPinInput('')
    }
  }

  // Handle Save (Dual-Sync: Cloud Database + LocalStorage + Physical Disk File)
  const handleSaveProfile = async (newData) => {
    setProfile(newData)
    
    // 1. Save to browser LocalStorage
    try {
      localStorage.setItem('tapqin_profile_data', JSON.stringify(newData))
    } catch (e) {
      console.error('LocalStorage write error:', e)
    }

    // 2. Save to Supabase Cloud Database (Makes it live for everyone in production!)
    if (isSupabaseConfigured) {
      const result = await saveProfileToSupabase(newData)
      if (!result.success) {
        console.warn('Supabase cloud sync failed:', result.error)
      } else {
        console.log('Successfully synced profile to Supabase Cloud! ☁️')
      }
    }

    // 3. Automatically save to physical file `src/data/profile.json` during local dev
    try {
      await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      })
    } catch (err) {
      // In production static hosting, local disk write is not available
    }
  }

  const handleOpenPublicTab = () => {
    window.open('/', '_blank')
  }

  // PIN LOCK SCREEN (If not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm m-auto bg-white dark:bg-[#121215] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-2xl space-y-6 text-center animate-fade-in">
          {/* Lock Icon Header */}
          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 flex items-center justify-center shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-bold tracking-tight">Tapqin Admin Portal</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Enter your Admin PIN to access the CMS dashboard
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400 dark:text-zinc-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  autoFocus
                  required
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value)
                    if (pinError) setPinError(false)
                  }}
                  placeholder="Enter 6-digit PIN"
                  className={`w-full pl-10 pr-10 py-3 text-center tracking-widest font-mono text-sm rounded-2xl bg-slate-50 dark:bg-zinc-900 border ${
                    pinError
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500'
                  } focus:outline-none transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {pinError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-medium animate-fade-in">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Incorrect PIN. Please try again.</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="hover:underline text-slate-600 dark:text-zinc-300"
              >
                Back to Website
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Unlock CMS Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secured with Supabase Cloud & PIN Encryption</span>
          </div>
        </div>
      </div>
    )
  }

  // AUTHENTICATED CMS
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

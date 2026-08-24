import React, { useState, useEffect, useRef } from 'react'
import { SocialIcon } from '../components/SocialIcon'
import { PublicPage } from './PublicPage'
import {
  Sun,
  Moon,
  ExternalLink,
  Download,
  Copy,
  Check,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  User,
  Link2,
  FileCode2,
  CheckCircle2,
  X,
  Save,
  RotateCcw,
  AlertTriangle,
  Camera,
  Image as ImageIcon,
} from 'lucide-react'

const AVAILABLE_ICONS = [
  'portfolio', 'website', 'globe', 'github', 'gitlab', 'codepen', 'devto', 'code',
  'linkedin', 'instagram', 'x', 'threads', 'facebook', 'youtube', 'tiktok',
  'spotify', 'discord', 'telegram', 'whatsapp', 'figma', 'dribbble', 'behance',
  'reddit', 'medium', 'pinterest', 'twitch', 'steam', 'patreon', 'email', 'phone', 'shop'
]

const ALL_CATEGORIES = [
  'Social Media',
  'Work',
  'Code',
  'Contact',
  'Portfolio',
  'Shop',
  'Personal',
  'Other',
]

const PLATFORM_PRESETS = [
  { name: 'Instagram', icon: 'instagram', category: 'Social Media', placeholder: 'https://instagram.com/username', subtitlePlaceholder: 'e.g. Daily stories & gallery' },
  { name: 'WhatsApp', icon: 'whatsapp', category: 'Social Media', placeholder: 'https://wa.me/1234567890', subtitlePlaceholder: 'e.g. Chat directly on WhatsApp' },
  { name: 'GitHub', icon: 'github', category: 'Code', placeholder: 'https://github.com/username', subtitlePlaceholder: 'e.g. Open source repositories' },
  { name: 'LinkedIn', icon: 'linkedin', category: 'Work', placeholder: 'https://linkedin.com/in/username', subtitlePlaceholder: 'e.g. Professional network & resume' },
  { name: 'YouTube', icon: 'youtube', category: 'Social Media', placeholder: 'https://youtube.com/@channel', subtitlePlaceholder: 'e.g. Video tutorials & content' },
  { name: 'Twitter / X', icon: 'x', category: 'Social Media', placeholder: 'https://x.com/username', subtitlePlaceholder: 'e.g. Tech insights & thoughts' },
  { name: 'TikTok', icon: 'tiktok', category: 'Social Media', placeholder: 'https://tiktok.com/@username', subtitlePlaceholder: 'e.g. Short videos & creative clips' },
  { name: 'Main Portfolio', icon: 'portfolio', category: 'Work', placeholder: 'https://yourportfolio.com', subtitlePlaceholder: 'e.g. Explore projects & case studies' },
  { name: 'Website / Blog', icon: 'website', category: 'Work', placeholder: 'https://yourwebsite.com', subtitlePlaceholder: 'e.g. Articles & notes' },
  { name: 'Email', icon: 'email', category: 'Contact', placeholder: 'mailto:hello@domain.com', subtitlePlaceholder: 'e.g. Inquiries & collaborations' },
  { name: 'Spotify', icon: 'spotify', category: 'Social Media', placeholder: 'https://open.spotify.com/playlist/...', subtitlePlaceholder: 'e.g. Favorite playlist & tracks' },
  { name: 'Discord', icon: 'discord', category: 'Social Media', placeholder: 'https://discord.gg/...', subtitlePlaceholder: 'e.g. Join the community server' },
  { name: 'Telegram', icon: 'telegram', category: 'Social Media', placeholder: 'https://t.me/username', subtitlePlaceholder: 'e.g. Direct message' },
  { name: 'Facebook', icon: 'facebook', category: 'Social Media', placeholder: 'https://facebook.com/...', subtitlePlaceholder: 'e.g. Facebook profile page' },
  { name: 'Threads', icon: 'threads', category: 'Social Media', placeholder: 'https://threads.net/@username', subtitlePlaceholder: 'e.g. Daily thoughts & updates' },
  { name: 'Figma', icon: 'figma', category: 'Work', placeholder: 'https://figma.com/@username', subtitlePlaceholder: 'e.g. UI/UX templates & design resources' },
  { name: 'Dribbble', icon: 'dribbble', category: 'Work', placeholder: 'https://dribbble.com/username', subtitlePlaceholder: 'e.g. Visual design showcase' },
  { name: 'Behance', icon: 'behance', category: 'Work', placeholder: 'https://behance.net/username', subtitlePlaceholder: 'e.g. Full project case studies' },
  { name: 'Custom Link', icon: 'globe', category: 'Other', placeholder: 'https://...', subtitlePlaceholder: 'e.g. Visit my custom link' },
]

export function AdminPage({ profileData, onSave, onNavigateToPublic, theme, onToggleTheme }) {
  const [data, setData] = useState(JSON.parse(JSON.stringify(profileData)))
  const [activeTab, setActiveTab] = useState('editor') // 'editor' | 'json'
  const [copiedJson, setCopiedJson] = useState(false)
  const [jsonInput, setJsonInput] = useState(JSON.stringify(profileData, null, 2))
  const [toastMessage, setToastMessage] = useState(null)

  // File Input Refs
  const avatarFileInputRef = useRef(null)
  const linkThumbnailFileRef = useRef(null)

  // Modals State
  const [showPlatformPicker, setShowPlatformPicker] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false)
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false)
  const [deleteTargetIndex, setDeleteTargetIndex] = useState(null)

  const [editingLinkIndex, setEditingLinkIndex] = useState(null)
  const [isCustomCategory, setIsCustomCategory] = useState(false)

  // Track Unsaved Changes
  const hasUnsavedChanges = JSON.stringify(data) !== JSON.stringify(profileData)

  useEffect(() => {
    setJsonInput(JSON.stringify(data, null, 2))
  }, [data])

  // Browser Navigation & Tab Close Guard
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr))
    }, 2200)
  }

  // Profile Field Changes (Updates local draft only)
  const handleProfileChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  // Avatar Photo Upload Handler (with Canvas Compression)
  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP, etc.).')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 400
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88)
        handleProfileChange('avatar', optimizedDataUrl)
        showToast('Profile photo uploaded successfully!')
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  // Link Thumbnail Upload Handler (with Canvas Compression)
  const handleLinkThumbnailFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP, etc.).')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 600
        let width = img.width
        let height = img.height

        if (width > maxDim) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
        setLinkForm((prev) => ({ ...prev, thumbnail: optimizedDataUrl }))
        showToast('Link thumbnail uploaded successfully!')
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const [linkForm, setLinkForm] = useState({
    title: '',
    subtitle: '',
    url: '',
    icon: 'website',
    category: 'Social Media',
    customCategory: '',
    badge: '',
    thumbnail: '',
    placeholder: 'https://...',
    subtitlePlaceholder: 'Short description (optional)',
  })

  // When user selects a platform preset
  const handleSelectPlatform = (preset) => {
    setShowPlatformPicker(false)
    setEditingLinkIndex(null)
    setIsCustomCategory(false)
    setLinkForm({
      title: preset.name,
      subtitle: '',
      url: '',
      icon: preset.icon || 'website',
      category: preset.category || 'Social Media',
      customCategory: '',
      badge: '',
      thumbnail: '',
      placeholder: preset.placeholder || 'https://...',
      subtitlePlaceholder: preset.subtitlePlaceholder || 'Short description (optional)',
    })
    setShowFormModal(true)
  }

  const handleOpenEditLink = (index) => {
    const item = data.links[index]
    setEditingLinkIndex(index)
    const isCustom = item.category && !ALL_CATEGORIES.includes(item.category)
    setIsCustomCategory(isCustom)
    setLinkForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      url: item.url || '',
      icon: item.icon || 'website',
      category: isCustom ? 'custom' : (item.category || 'Social Media'),
      customCategory: isCustom ? item.category : '',
      badge: item.badge || '',
      thumbnail: item.thumbnail || '',
      placeholder: 'https://...',
      subtitlePlaceholder: 'Short description (optional)',
    })
    setShowFormModal(true)
  }

  const handleCategorySelectChange = (val) => {
    if (val === 'custom') {
      setIsCustomCategory(true)
      setLinkForm((prev) => ({ ...prev, category: 'custom' }))
    } else {
      setIsCustomCategory(false)
      setLinkForm((prev) => ({ ...prev, category: val }))
    }
  }

  // Save Link into local draft (appends to the bottom when new)
  const handleSaveLink = (e) => {
    e.preventDefault()
    if (!linkForm.title.trim() || !linkForm.url.trim()) return

    const finalCategory = isCustomCategory
      ? (linkForm.customCategory.trim() || 'Other')
      : (linkForm.category || 'Social Media')

    const updatedLinks = [...data.links]
    const itemToSave = {
      title: linkForm.title.trim(),
      subtitle: linkForm.subtitle.trim() ? linkForm.subtitle.trim() : undefined,
      url: linkForm.url.trim(),
      icon: linkForm.icon || 'website',
      category: finalCategory,
      badge: linkForm.badge.trim() ? linkForm.badge.trim() : undefined,
      thumbnail: linkForm.thumbnail?.trim() ? linkForm.thumbnail.trim() : undefined,
    }

    if (editingLinkIndex !== null) {
      updatedLinks[editingLinkIndex] = itemToSave
    } else {
      updatedLinks.push(itemToSave)
    }

    const updatedData = { ...data, links: updatedLinks }
    setData(updatedData)
    setShowFormModal(false)
    setEditingLinkIndex(null)
    showToast(editingLinkIndex !== null ? 'Link updated in draft!' : 'New link added to draft!')
  }

  // Confirm delete from local draft
  const handleConfirmDelete = () => {
    if (deleteTargetIndex === null) return
    const updatedLinks = data.links.filter((_, i) => i !== deleteTargetIndex)
    const updatedData = { ...data, links: updatedLinks }
    setData(updatedData)
    setDeleteTargetIndex(null)
    showToast('Link removed from draft!')
  }

  // Reorder links in local draft
  const handleMoveLink = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= data.links.length) return
    const updatedLinks = [...data.links]
    const temp = updatedLinks[index]
    updatedLinks[index] = updatedLinks[targetIndex]
    updatedLinks[targetIndex] = temp
    const updatedData = { ...data, links: updatedLinks }
    setData(updatedData)
  }

  // Save Draft to Main Website (Storage)
  const handleExecuteSaveAll = () => {
    onSave(data)
    setShowSaveConfirmModal(false)
    showToast('All changes saved to live website!')
  }

  // Exit Guard Handler: Triggered when clicking "View Public Page"
  const handleExitClick = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirmModal(true)
    } else {
      onNavigateToPublic()
    }
  }

  // Exit & Save
  const handleExitAndSave = () => {
    onSave(data)
    setShowExitConfirmModal(false)
    showToast('Changes saved! Opening live site...')
    setTimeout(() => {
      onNavigateToPublic()
    }, 200)
  }

  // Exit Without Saving (Discard changes)
  const handleExitWithoutSave = () => {
    setShowExitConfirmModal(false)
    onNavigateToPublic()
  }

  // Reset Draft to match profileData
  const handleResetDraft = () => {
    if (window.confirm('Discard all unsaved changes in draft?')) {
      setData(JSON.parse(JSON.stringify(profileData)))
      showToast('Draft changes discarded.')
    }
  }

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'profile.json'
    a.click()
    URL.revokeObjectURL(url)
    showToast('profile.json downloaded successfully!')
  }

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopiedJson(true)
    showToast('JSON copied to clipboard!')
    setTimeout(() => setCopiedJson(false), 2000)
  }

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      if (parsed && parsed.name && Array.isArray(parsed.links)) {
        setData(parsed)
        showToast('JSON data loaded into draft!')
      } else {
        alert('Invalid JSON format (must include "name" and an array of "links").')
      }
    } catch (err) {
      alert('Error parsing JSON: ' + err.message)
    }
  }

  const targetLinkToDelete = deleteTargetIndex !== null ? data.links[deleteTargetIndex] : null

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-white flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 px-4 sm:px-8 py-3 bg-white dark:bg-[#121215] border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h1 className="font-bold text-sm sm:text-base tracking-tight">Tapqin CMS Dashboard</h1>
          </div>
          {hasUnsavedChanges && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              Unsaved Changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Reset Draft Button */}
          {hasUnsavedChanges && (
            <button
              onClick={handleResetDraft}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-400 cursor-pointer flex items-center gap-1.5 transition-all"
              title="Reset Draft Changes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          {/* SAVE BUTTON WITH POPUP TRIGGER */}
          <button
            onClick={() => setShowSaveConfirmModal(true)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 ${
              hasUnsavedChanges
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
            title="Save Changes to Live Website"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 sm:px-3 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Open Public Page / Exit with Confirmation Modal */}
          <button
            onClick={handleExitClick}
            className="px-3 sm:px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Open Live Public Website"
          >
            <span className="hidden sm:inline">View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: CMS Form & Management (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Unified 2 Tabs */}
          <div className="flex gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 shadow-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'editor'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Manage Profile & Links ({data.links.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'json'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Import / Export JSON</span>
            </button>
          </div>

          {/* TAB 1: UNIFIED CONTENT EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-6 animate-fade-in">
              {/* SECTION 1: USER PROFILE (WITH PHOTO UPLOAD) */}
              <div className="bg-white dark:bg-[#121215] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-3">
                  <User className="w-4 h-4 text-orange-500" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                    Main Profile Information
                  </h2>
                </div>

                {/* AVATAR PHOTO UPLOAD SECTION */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
                  {/* Avatar Preview */}
                  <div className="relative group shrink-0">
                    <div className="w-20 h-20 rounded-full p-[2px] bg-slate-200 dark:bg-zinc-800 shadow-xs overflow-hidden relative">
                      {data.avatar ? (
                        <img
                          src={data.avatar}
                          alt="Avatar Preview"
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            const fallback = e.target.nextElementSibling
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      {/* Default Library Icon Avatar */}
                      <div
                        style={{ display: data.avatar ? 'none' : 'flex' }}
                        className="w-full h-full rounded-full bg-slate-800 dark:bg-zinc-800 items-center justify-center text-white dark:text-zinc-200"
                      >
                        <User className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Profile Photo / Avatar</h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Upload photo from device or provide an external image URL
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <input
                        type="file"
                        ref={avatarFileInputRef}
                        onChange={handleAvatarFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload New Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleProfileChange('avatar', '')}
                        className="px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
                        title="Reset to default icon avatar"
                      >
                        Reset Default Icon
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={data.name || ''}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                      Handle / Username
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-slate-400 dark:text-zinc-500 font-mono select-none pointer-events-none">
                        @
                      </span>
                      <input
                        type="text"
                        value={(data.handle || '').replace(/^@+/, '')}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/^@+/, '').trim()
                          handleProfileChange('handle', cleaned ? `@${cleaned}` : '')
                        }}
                        className="w-full pl-7 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Short Bio / Description
                  </label>
                  <textarea
                    rows={2}
                    value={data.description || ''}
                    onChange={(e) => handleProfileChange('description', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Tell visitors about yourself or your skills..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                      Avatar Image URL (Optional external link)
                    </label>
                    <input
                      type="text"
                      value={data.avatar || ''}
                      onChange={(e) => handleProfileChange('avatar', e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none text-[11px] font-mono"
                      placeholder="https://... or data:image/..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                      Location
                    </label>
                    <input
                      type="text"
                      value={data.location || ''}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="Jakarta, Indonesia 🇮🇩"
                    />
                  </div>
                </div>

                {/* LIVE AVAILABILITY / WORK STATUS SETTINGS */}
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live Availability Status (Work & Hire)
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Display a live pulsing badge on your profile showing you are open for work
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!data.availableForWork}
                        onChange={(e) => handleProfileChange('availableForWork', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {data.availableForWork && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-fade-in">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                          Badge Status Text
                        </label>
                        <input
                          type="text"
                          value={data.availabilityStatus || ''}
                          onChange={(e) => handleProfileChange('availabilityStatus', e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          placeholder="Available for Work & Projects"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                          Inquiry Note / Collaboration Message
                        </label>
                        <input
                          type="text"
                          value={data.availabilityMessage || ''}
                          onChange={(e) => handleProfileChange('availabilityMessage', e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          placeholder="Open for new projects & consulting..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: ADD NEW LINK (+ BUTTON TRIGGER) */}
              <div className="bg-white dark:bg-[#121215] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                    Add New Link
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Click the button to select a social platform & create a new link
                  </p>
                </div>

                <button
                  onClick={() => setShowPlatformPicker(true)}
                  className="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Link</span>
                </button>
              </div>

              {/* SECTION 3: ACTIVE LINKS LIST (SCROLLABLE) */}
              <div className="bg-white dark:bg-[#121215] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                      Active Links ({data.links.length})
                    </h3>
                  </div>
                </div>

                {/* SCROLLABLE LIST CONTAINER */}
                <div className="max-h-[460px] overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
                  {data.links.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No links yet. Click the <strong>+ Add New Link</strong> button above.
                    </div>
                  ) : (
                    data.links.map((link, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-xs"
                      >
                        <SocialIcon iconName={link.icon} emoji={link.emoji} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold truncate text-slate-900 dark:text-white">
                              {link.title}
                            </span>
                            {link.badge && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200/50 dark:border-orange-800/30">
                                {link.badge}
                              </span>
                            )}
                            {link.thumbnail && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium rounded-md bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                                <ImageIcon className="w-2.5 h-2.5" />
                                <span>Thumbnail</span>
                              </span>
                            )}
                            {link.category && (
                              <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                • {link.category}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate font-mono">
                            {link.url}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveLink(idx, -1)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 disabled:opacity-20 cursor-pointer text-slate-600 dark:text-zinc-300"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === data.links.length - 1}
                            onClick={() => handleMoveLink(idx, 1)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 disabled:opacity-20 cursor-pointer text-slate-600 dark:text-zinc-300"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditLink(idx)}
                            className="p-2 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 text-xs font-semibold cursor-pointer"
                            title="Edit link"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetIndex(idx)}
                            className="p-2 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25 text-xs font-semibold cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JSON EXPORT & IMPORT */}
          {activeTab === 'json' && (
            <div className="bg-white dark:bg-[#121215] rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4 animate-fade-in">
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Download the <code className="font-mono font-semibold">profile.json</code> file or copy raw data directly.
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleDownloadJSON}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download profile.json</span>
                </button>
                <button
                  onClick={handleCopyJSON}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>JSON Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Raw JSON Editor
                </label>
                <textarea
                  rows={11}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full p-3 font-mono text-[11px] rounded-2xl bg-slate-900 text-emerald-400 dark:bg-slate-950 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={handleImportJSON}
                  className="mt-2.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Load JSON to Draft</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Real-Time Live Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-20 w-full flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Live Mobile Simulator
              </span>
            </div>

            {/* Mobile Phone Mockup Device */}
            <div className="w-full max-w-[390px] h-[620px] rounded-[36px] bg-slate-900 p-2.5 shadow-2xl border-4 border-slate-700/60 relative overflow-hidden flex flex-col">
              <div className="w-full h-full rounded-[28px] overflow-hidden relative">
                <PublicPage
                  profile={data}
                  theme={theme}
                  onToggleTheme={onToggleTheme}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL 1: SOCIAL MEDIA & PLATFORM SELECTION GRID */}
      {showPlatformPicker && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-200"
          onClick={() => setShowPlatformPicker(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl m-auto bg-white dark:bg-[#121215] text-slate-900 dark:text-white rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-2xl space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold">Select Platform / Social Media</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Choose a platform to add to your links list
                </p>
              </div>
              <button
                onClick={() => setShowPlatformPicker(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {PLATFORM_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPlatform(preset)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500/50 hover:bg-orange-500/5 dark:hover:bg-orange-500/10 transition-all cursor-pointer group text-left"
                >
                  <SocialIcon iconName={preset.icon} />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-800 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 block truncate">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block truncate">
                      {preset.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: LINK DETAIL FORM (WITH THUMBNAIL SUPPORT) */}
      {showFormModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-200"
          onClick={() => setShowFormModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg m-auto bg-white dark:bg-[#121215] text-slate-900 dark:text-white rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-2xl space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                {/* Back Button to Platform Picker when adding a new link */}
                {editingLinkIndex === null && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowFormModal(false)
                      setShowPlatformPicker(true)
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
                    title="Back to platform choices"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}

                <SocialIcon iconName={linkForm.icon} />
                <div>
                  <h3 className="text-sm font-bold">
                    {editingLinkIndex !== null ? 'Edit Link' : `Add ${linkForm.title || ''} Link`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Enter the URL and details for this link
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowFormModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Link Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={linkForm.title}
                    onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Link title"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    URL / Link *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={linkForm.url}
                    onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                    placeholder={linkForm.placeholder || 'https://...'}
                  />
                </div>
              </div>

              {/* Subtitle / Note (Default Empty with Placeholder) */}
              <div>
                <label className="block text-[11px] font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                  Subtitle / Note (Optional)
                </label>
                <input
                  type="text"
                  value={linkForm.subtitle}
                  onChange={(e) => setLinkForm({ ...linkForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder={linkForm.subtitlePlaceholder || 'e.g. Short description...'}
                />
              </div>

              {/* Category Options */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                  Select Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => handleCategorySelectChange(cat)}
                      className={`px-2.5 py-1.5 text-xs rounded-xl font-medium border text-center transition-all cursor-pointer ${
                        !isCustomCategory && linkForm.category === cat
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs font-semibold'
                          : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleCategorySelectChange('custom')}
                    className={`px-2.5 py-1.5 text-xs rounded-xl font-medium border text-center transition-all cursor-pointer ${
                      isCustomCategory
                        ? 'bg-orange-500 text-white border-orange-500 shadow-xs font-semibold'
                        : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    + Custom...
                  </button>
                </div>

                {isCustomCategory && (
                  <div className="pt-1 animate-fade-in">
                    <input
                      type="text"
                      autoFocus
                      value={linkForm.customCategory}
                      onChange={(e) => setLinkForm({ ...linkForm, customCategory: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="Type custom category name..."
                    />
                  </div>
                )}
              </div>

              {/* THUMBNAIL / PREVIEW IMAGE (OPTIONAL) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                    Thumbnail Preview Image (Appears on Hover)
                  </label>
                  {linkForm.thumbnail && (
                    <button
                      type="button"
                      onClick={() => setLinkForm((prev) => ({ ...prev, thumbnail: '' }))}
                      className="text-[10px] text-red-500 hover:underline cursor-pointer"
                    >
                      Remove Thumbnail
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={linkForm.thumbnail || ''}
                    onChange={(e) => setLinkForm({ ...linkForm, thumbnail: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none text-[11px] font-mono"
                    placeholder="https://... or click Upload Photo"
                  />
                  <input
                    type="file"
                    ref={linkThumbnailFileRef}
                    onChange={handleLinkThumbnailFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => linkThumbnailFileRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                    title="Upload thumbnail photo from device"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>

                {linkForm.thumbnail && (
                  <div className="mt-1.5 w-full h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 relative">
                    <img
                      src={linkForm.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Badge & Icon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={linkForm.badge}
                    onChange={(e) => setLinkForm({ ...linkForm, badge: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="e.g. Featured / New / Promo"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Change Icon (Optional)
                  </label>
                  <select
                    value={linkForm.icon}
                    onChange={(e) => setLinkForm({ ...linkForm, icon: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-300 dark:border-zinc-800 focus:ring-2 focus:ring-orange-500 focus:outline-none capitalize"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic} value={ic} className="dark:bg-zinc-900">
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  {editingLinkIndex !== null ? 'Save Changes' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION POPUP */}
      {deleteTargetIndex !== null && targetLinkToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-200"
          onClick={() => setDeleteTargetIndex(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm m-auto bg-white dark:bg-[#121215] text-slate-900 dark:text-white rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-2xl space-y-4 animate-fade-in text-center"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center justify-center shadow-xs">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold">Delete Link?</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-900 dark:text-white font-semibold">"{targetLinkToDelete.title}"</strong>?
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate font-mono">
                {targetLinkToDelete.url}
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetIndex(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SAVE CMS CHANGES CONFIRMATION POPUP */}
      {showSaveConfirmModal && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-200"
          onClick={() => setShowSaveConfirmModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm m-auto bg-white dark:bg-[#121215] text-slate-900 dark:text-white rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-2xl space-y-4 animate-fade-in text-center"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-xs">
              <Save className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold">Save CMS Changes?</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                Are you sure you want to save and apply all profile and link updates to the live Tapqin website?
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteSaveAll}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Yes, Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: UNSAVED CHANGES EXIT CONFIRMATION POPUP */}
      {showExitConfirmModal && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-200"
          onClick={() => setShowExitConfirmModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm m-auto bg-white dark:bg-[#121215] text-slate-900 dark:text-white rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-2xl space-y-4 animate-fade-in text-center"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold">Unsaved Changes Detected!</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                You have unsaved changes in your draft. Would you like to save them before opening the live website?
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {/* Option 1: Save & Open Main Web */}
              <button
                type="button"
                onClick={handleExitAndSave}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & View Live Web</span>
              </button>

              {/* Option 2: Exit without saving */}
              <button
                type="button"
                onClick={handleExitWithoutSave}
                className="w-full py-2.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Discard & View Live Web
              </button>

              {/* Option 3: Cancel / Stay in CMS */}
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="w-full py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                Stay in CMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert with Lucide Icon */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[60] px-4 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-fade-in pointer-events-none border border-slate-800 dark:border-zinc-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

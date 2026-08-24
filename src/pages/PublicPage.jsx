import React, { useState, useMemo } from 'react'
import { SocialIcon } from '../components/SocialIcon'
import {
  FaWhatsapp,
  FaInstagram,
  FaXTwitter,
  FaFacebook,
  FaLinkedin,
} from 'react-icons/fa6'
import {
  Sun,
  Moon,
  Share2,
  ChevronRight,
  MapPin,
  Copy,
  ExternalLink,
  X,
  User,
  Briefcase,
  Mail,
  Sparkles,
  Check,
  CheckCircle2,
} from 'lucide-react'

// Smart Thumbnail Resolver (Uses custom thumbnail or smart platform snapshot)
const PLATFORM_THUMBNAILS = {
  portfolio: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
  website: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
  globe: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
  github: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80',
  gitlab: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  codepen: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
  linkedin: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=600&auto=format&fit=crop&q=80',
  instagram: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
  x: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&auto=format&fit=crop&q=80',
  threads: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  youtube: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&auto=format&fit=crop&q=80',
  tiktok: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=600&auto=format&fit=crop&q=80',
  whatsapp: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&auto=format&fit=crop&q=80',
  spotify: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=600&auto=format&fit=crop&q=80',
  discord: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&auto=format&fit=crop&q=80',
  telegram: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  facebook: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
  figma: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
  dribbble: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
  behance: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&auto=format&fit=crop&q=80',
  email: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&auto=format&fit=crop&q=80'
}

const getLinkThumbnail = (link) => {
  if (link.thumbnail && link.thumbnail.trim()) return link.thumbnail
  const iconKey = (link.icon || '').toLowerCase().trim()
  if (PLATFORM_THUMBNAILS[iconKey]) {
    return PLATFORM_THUMBNAILS[iconKey]
  }
  return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
}

export function PublicPage({ profile, theme, onToggleTheme }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showHireModal, setShowHireModal] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [shareTab, setShareTab] = useState('link')
  const [toastMessage, setToastMessage] = useState(null)
  const [expandedLinkIndex, setExpandedLinkIndex] = useState(null)

  const emailAddress = useMemo(() => {
    const found = profile.links?.find((l) => l.icon === 'email' || l.url?.startsWith('mailto:'))
    if (found) return found.url.replace(/^mailto:/, '').trim()
    return ''
  }, [profile.links])

  const whatsappUrl = useMemo(() => {
    const found = profile.links?.find((l) => l.icon === 'whatsapp' || l.url?.includes('wa.me') || l.url?.includes('whatsapp.com'))
    return found?.url || ''
  }, [profile.links])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr))
    }, 2200)
  }

  const handleCopyEmail = () => {
    if (!emailAddress) return
    navigator.clipboard.writeText(emailAddress)
    setCopiedEmail(true)
    showToast('Email copied to clipboard!')
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('Link copied to clipboard!')
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Check out ${profile.name}'s profile on Tapqin!`

  const sharePlatforms = [
    {
      name: 'WhatsApp',
      color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
      icon: <FaWhatsapp className="w-5 h-5" />,
      action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
    },
    {
      name: 'Instagram',
      color: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30 hover:bg-pink-500/25',
      icon: <FaInstagram className="w-5 h-5" />,
      action: () => {
        navigator.clipboard.writeText(shareUrl)
        showToast('Link copied! Opening Instagram...')
        setTimeout(() => window.open('https://instagram.com', '_blank'), 600)
      }
    },
    {
      name: 'X',
      color: 'bg-slate-500/15 text-slate-800 dark:text-white border-slate-400/30 hover:bg-slate-500/25',
      icon: <FaXTwitter className="w-5 h-5" />,
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-600/30 hover:bg-blue-600/25',
      icon: <FaFacebook className="w-5 h-5" />,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    {
      name: 'LinkedIn',
      color: 'bg-sky-600/15 text-[#0A66C2] dark:text-sky-400 border-sky-600/30 hover:bg-sky-600/25',
      icon: <FaLinkedin className="w-5 h-5" />,
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
    },
  ]

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} - Tapqin`,
          text: profile.description,
          url: window.location.href,
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink()
        }
      }
    } else {
      handleCopyLink()
    }
  }

  // Extract categories (Default English: 'All')
  const categories = useMemo(() => {
    const cats = ['All']
    profile.links.forEach((l) => {
      if (l.category && !cats.includes(l.category)) {
        cats.push(l.category)
      }
    })
    return cats
  }, [profile.links])

  // Filter links
  const filteredLinks = useMemo(() => {
    return profile.links.filter((link) => {
      return activeCategory === 'All' || link.category === activeCategory
    })
  }, [activeCategory, profile.links])

  return (
    <div className="h-dvh w-full flex items-center justify-center p-0 sm:p-6 md:p-8 relative overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-200">
      {/* Main Container: Fullscreen Edge-to-Edge on Mobile, Centered Glass Card on Desktop */}
      <div className="w-full sm:max-w-[475px] h-full sm:h-full rounded-none sm:rounded-[32px] border-0 sm:border glass-container flex flex-col relative z-10 overflow-hidden animate-fade-in">
        
        {/* Centered Top Header (No "Bio Link", Centered Tapqin Logo) */}
        <div className="shrink-0 px-4 py-2.5 flex items-center justify-center border-b border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
              Tapqin
            </span>
          </div>
        </div>

        {/* Hero Profile Section (Original Full-Sized Profile Aesthetic) */}
        <header className="shrink-0 flex flex-col items-center pt-5 pb-3 px-5 text-center">
          {/* Avatar (Original Full Size) */}
          <div className="relative mb-3">
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-[2px] bg-slate-200 dark:bg-zinc-800 shadow-sm overflow-hidden">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  loading="eager"
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
                style={{ display: profile.avatar ? 'none' : 'flex' }}
                className="w-full h-full rounded-full bg-slate-800 dark:bg-zinc-800 items-center justify-center text-white dark:text-zinc-200"
              >
                <User className="w-10 h-10 sm:w-11 sm:h-11" />
              </div>
            </div>
          </div>

          {/* Name & Handle (Static Text - Not Copyable) */}
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {profile.name}
            </h1>
            {profile.handle && (
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400 font-mono tracking-wide select-none">
                {profile.handle.startsWith('@') ? profile.handle : `@${profile.handle}`}
              </p>
            )}
          </div>

          {/* Bio */}
          {profile.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-[360px] mt-2 leading-relaxed font-normal">
              {profile.description}
            </p>
          )}

          {/* Location & Live Availability Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            {profile.location && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill text-xs font-medium text-slate-700 dark:text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                <span>{profile.location}</span>
              </div>
            )}

            {/* Interactive Live Availability Pill */}
            {profile.availableForWork && (
              <button
                type="button"
                onClick={() => setShowHireModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-500/30 text-xs font-semibold text-emerald-700 dark:text-emerald-400 transition-all cursor-pointer group shadow-2xs active:scale-95"
                title="Click to view work availability & contact"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="truncate max-w-[210px] text-[11px] sm:text-xs">
                  {profile.availabilityStatus || 'Available for Work'}
                </span>
              </button>
            )}
          </div>

          {/* Category Filter Tabs (Centered) */}
          {categories.length > 1 && (
            <div className="w-full flex items-center justify-center flex-wrap gap-2 mt-4 pb-0.5 px-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-zinc-800/90 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Scrollable Links Section (pb-20 to accommodate sticky buttons) */}
        <main className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-5 pb-20 pt-1.5">
          {filteredLinks.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400 dark:text-zinc-500 animate-fade-in">
              No links found in this category.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {filteredLinks.map((link, index) => {
                const thumbnailSrc = getLinkThumbnail(link)
                const isExpanded = expandedLinkIndex === index

                return (
                  <div
                    key={link.url + index}
                    style={{ animationDelay: `${index * 35}ms` }}
                    className="group relative flex flex-col w-full p-3 sm:p-3.5 rounded-2xl glass-card transition-all duration-200 animate-fade-in"
                  >
                    {/* Main Link Info Row: Clickable to toggle thumbnail expansion */}
                    <div
                      onClick={() => setExpandedLinkIndex(isExpanded ? null : index)}
                      className="flex items-center gap-3 w-full cursor-pointer select-none"
                    >
                      {/* Real Brand Icon from Library */}
                      <SocialIcon iconName={link.icon} emoji={link.emoji} />

                      {/* Title & Subtitle */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] sm:text-sm font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white truncate transition-colors">
                            {link.title}
                          </span>
                          {link.badge && (
                            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full bg-slate-100 border border-slate-200 text-slate-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        {link.subtitle && (
                          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-zinc-200 truncate mt-0.5 transition-colors">
                            {link.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Expand / Collapse Indicator Icon */}
                      <div
                        className={`shrink-0 p-1 rounded-lg text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90 text-orange-500 dark:text-orange-400' : 'group-hover:text-slate-800 dark:group-hover:text-white'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Full Expanded Thumbnail Preview (Positioned BELOW the Title Row) */}
                    {thumbnailSrc && (
                      <div
                        className={`w-full transition-all duration-300 ease-out overflow-hidden ${
                          isExpanded ? 'max-h-80 opacity-100 mt-3' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(link.url, '_blank')
                          }}
                          className="w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 relative cursor-pointer shadow-xs"
                          title="Click image to open link"
                        >
                          <img
                            src={thumbnailSrc}
                            alt={link.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {/* Static Compact Open Link Badge (No Hover Effect) */}
                          <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs select-none">
                            <span>Open Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Branding & Copyright Footer */}
              <footer className="pt-6 pb-2 text-center select-none">
                <p className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 tracking-tight">
                  © 2026 Tapqin by Padeswaraa. All rights reserved.
                </p>
              </footer>
            </div>
          )}
        </main>

        {/* STICKY BOTTOM CONTROLS */}
        {/* Sticky Bottom Center: Share Button */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md border border-slate-200 dark:border-zinc-700/80 shadow-lg hover:shadow-xl text-xs font-semibold text-slate-800 dark:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Share Profile"
          >
            <Share2 className="w-3.5 h-3.5 text-orange-500" />
            <span>Share</span>
          </button>
        </div>

        {/* Sticky Bottom Right: Dark/Light Mode Button */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-full bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md border border-slate-200 dark:border-zinc-700/80 shadow-lg hover:shadow-xl text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>

        {/* Share & QR Modal (Fixed Viewport Centered for iOS & Desktop) */}
        {showShareModal && (
          <div
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain transition-opacity duration-200"
            onClick={() => setShowShareModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[360px] m-auto glass-container rounded-3xl p-5 border border-slate-200 dark:border-zinc-800 shadow-2xl relative space-y-4 animate-fade-in text-slate-900 dark:text-white"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
                  <button
                    onClick={() => setShareTab('link')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      shareTab === 'link' ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    Link
                  </button>
                  <button
                    onClick={() => setShareTab('qr')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      shareTab === 'qr' ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    QR Code
                  </button>
                </div>

                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {shareTab === 'link' ? (
                <div className="space-y-3.5">
                  {/* Copy Link Box */}
                  <div className="p-3 rounded-2xl glass-pill flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-700 dark:text-zinc-300 truncate font-mono">
                      {shareUrl}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-transform active:scale-95 shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>

                  {/* Share via Apps (Icons from React-Icons) */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-left">
                      Share via Apps
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {sharePlatforms.map((platform) => (
                        <button
                          key={platform.name}
                          onClick={platform.action}
                          className={`flex items-center justify-center h-11 rounded-2xl border transition-all cursor-pointer active:scale-90 ${platform.color}`}
                          title={`Share to ${platform.name}`}
                        >
                          {platform.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Native Device Share (Optional) */}
                  {typeof navigator !== 'undefined' && navigator.share && (
                    <button
                      onClick={handleNativeShare}
                      className="w-full py-2.5 rounded-xl glass-pill hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors text-slate-800 dark:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
                      <span>More Sharing Options</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                      shareUrl
                    )}`}
                    alt="QR Code"
                    className="w-36 h-36 rounded-lg bg-white p-1"
                    loading="lazy"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-2 font-medium">
                    Scan QR code to open profile
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Work & Hire Inquiry Modal (Fixed Viewport Centered for iOS & Desktop) */}
        {showHireModal && (
          <div
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain transition-opacity duration-200"
            onClick={() => setShowHireModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[380px] m-auto glass-container rounded-3xl p-5 border border-slate-200 dark:border-zinc-800 shadow-2xl relative space-y-4 animate-fade-in text-slate-900 dark:text-white"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Work & Hire
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                      Collaborate with {profile.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowHireModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/25 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {profile.availabilityStatus || 'Available for New Opportunities'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                  {profile.availabilityMessage ||
                    "I'm currently accepting new freelance projects, consulting, and full-time opportunities. Feel free to reach out!"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {emailAddress && (
                  <>
                    <a
                      href={`mailto:${emailAddress}?subject=Project Collaboration with ${encodeURIComponent(profile.name)}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Direct Email</span>
                    </a>

                    <button
                      onClick={handleCopyEmail}
                      className="w-full py-2.5 px-4 rounded-xl glass-pill hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center justify-between cursor-pointer transition-all active:scale-95 font-mono"
                    >
                      <span className="truncate text-[11px]">{emailAddress}</span>
                      <span className="flex items-center gap-1 text-[11px] font-sans text-orange-600 dark:text-orange-400 font-semibold shrink-0">
                        {copiedEmail ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Email</span>
                          </>
                        )}
                      </span>
                    </button>
                  </>
                )}

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Toast Alert with Lucide Icon */}
        {toastMessage && (
          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in pointer-events-none border border-slate-800 dark:border-zinc-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  )
}

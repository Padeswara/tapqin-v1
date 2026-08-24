import React from 'react'
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaXTwitter,
  FaThreads,
  FaYoutube,
  FaTiktok,
  FaDiscord,
  FaTelegram,
  FaWhatsapp,
  FaSpotify,
  FaFacebook,
  FaReddit,
  FaGitlab,
  FaCodepen,
  FaFigma,
  FaDribbble,
  FaBehance,
  FaMedium,
  FaTwitch,
  FaPinterest,
  FaSteam,
  FaPatreon,
  FaDev,
} from 'react-icons/fa6'
import {
  Briefcase,
  Globe,
  Mail,
  ShoppingBag,
  Phone,
  ExternalLink,
  FileText,
  Code,
} from 'lucide-react'

export function SocialIcon({ iconName, emoji, className = 'w-5.5 h-5.5' }) {
  const icon = (iconName || '').toLowerCase().trim()

  const renderBadge = (IconComponent, colorStyle) => (
    <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-xs border ${colorStyle}`}>
      <IconComponent className={className} />
    </div>
  )

  switch (icon) {
    // Coding & Development
    case 'github':
      return renderBadge(
        FaGithub,
        'bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/20'
      )
    case 'gitlab':
      return renderBadge(
        FaGitlab,
        'bg-orange-500/15 text-[#FC6D26] border-orange-500/30'
      )
    case 'codepen':
      return renderBadge(
        FaCodepen,
        'bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/20'
      )
    case 'devto':
      return renderBadge(
        FaDev,
        'bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/20'
      )
    case 'code':
      return renderBadge(
        Code,
        'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
      )

    // Professional & Design
    case 'portfolio':
      return renderBadge(
        Briefcase,
        'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
      )
    case 'linkedin':
      return renderBadge(
        FaLinkedin,
        'bg-[#0A66C2]/15 text-[#0A66C2] dark:text-[#388ee0] border-[#0A66C2]/30'
      )
    case 'figma':
      return renderBadge(
        FaFigma,
        'bg-purple-500/15 text-[#F24E1E] dark:text-[#ff744c] border-purple-500/30'
      )
    case 'dribbble':
      return renderBadge(
        FaDribbble,
        'bg-pink-500/15 text-[#EA4C89] border-pink-500/30'
      )
    case 'behance':
      return renderBadge(
        FaBehance,
        'bg-blue-600/15 text-[#1769FF] border-blue-600/30'
      )
    case 'resume':
    case 'cv':
      return renderBadge(
        FileText,
        'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      )

    // Social Media
    case 'instagram':
      return renderBadge(
        FaInstagram,
        'bg-pink-500/15 text-[#E4405F] border-pink-500/30'
      )
    case 'x':
    case 'twitter':
      return renderBadge(
        FaXTwitter,
        'bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/20'
      )
    case 'threads':
      return renderBadge(
        FaThreads,
        'bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/20'
      )
    case 'facebook':
    case 'fb':
      return renderBadge(
        FaFacebook,
        'bg-blue-600/15 text-[#1877F2] border-blue-600/30'
      )
    case 'reddit':
      return renderBadge(
        FaReddit,
        'bg-orange-500/15 text-[#FF4500] border-orange-500/30'
      )
    case 'medium':
      return renderBadge(
        FaMedium,
        'bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/20'
      )
    case 'pinterest':
      return renderBadge(
        FaPinterest,
        'bg-red-600/15 text-[#BD081C] border-red-600/30'
      )

    // Media & Streaming
    case 'youtube':
      return renderBadge(
        FaYoutube,
        'bg-red-600/15 text-[#FF0000] border-red-600/30'
      )
    case 'tiktok':
      return renderBadge(
        FaTiktok,
        'bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/20'
      )
    case 'spotify':
      return renderBadge(
        FaSpotify,
        'bg-emerald-500/15 text-[#1DB954] border-emerald-500/30'
      )
    case 'twitch':
      return renderBadge(
        FaTwitch,
        'bg-purple-600/15 text-[#9146FF] border-purple-600/30'
      )

    // Messaging & Community
    case 'whatsapp':
    case 'wa':
      return renderBadge(
        FaWhatsapp,
        'bg-emerald-500/15 text-[#25D366] border-emerald-500/30'
      )
    case 'telegram':
      return renderBadge(
        FaTelegram,
        'bg-sky-500/15 text-[#26A5E4] border-sky-500/30'
      )
    case 'discord':
      return renderBadge(
        FaDiscord,
        'bg-indigo-500/15 text-[#5865F2] border-indigo-500/30'
      )
    case 'patreon':
      return renderBadge(
        FaPatreon,
        'bg-orange-500/15 text-[#FF424D] border-orange-500/30'
      )
    case 'steam':
      return renderBadge(
        FaSteam,
        'bg-slate-800/15 text-slate-800 dark:text-white border-slate-800/30'
      )

    // Contact & General
    case 'email':
    case 'mail':
      return renderBadge(
        Mail,
        'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
      )
    case 'phone':
      return renderBadge(
        Phone,
        'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      )
    case 'shop':
    case 'store':
      return renderBadge(
        ShoppingBag,
        'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
      )
    case 'globe':
    case 'website':
    case 'web':
      return renderBadge(
        Globe,
        'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
      )

    default:
      if (emoji) {
        return (
          <div className="shrink-0 w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-lg transition-transform duration-200 group-hover:scale-110 shadow-xs">
            {emoji}
          </div>
        )
      }
      return renderBadge(
        ExternalLink,
        'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30'
      )
  }
}

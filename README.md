# Tapqin — Link in Bio & Portfolio CMS

**Tapqin** is a modern **Link in Bio & Personal Portfolio** web application featuring a **Built-in Admin CMS Dashboard** and real-time cloud synchronization. Designed with a clean glassmorphism aesthetic, it offers a responsive layout (edge-to-edge mobile experience and centered glass card on desktop), dark/light mode support, and effortless content management without touching code.

---

## ✨ Key Features

### 🌐 Public Profile Page (`index.html` / `/`)
- **Responsive Glassmorphism UI**: Fullscreen edge-to-edge layout on mobile devices and a sleek centered glass card on desktop viewports.
- **Dynamic Category Filtering**: Automatically extracts and groups links by category (e.g., *Work*, *Social Media*, *Code*, *Contact*, or custom categories).
- **Expandable Link Thumbnails**: Click any link card to reveal an interactive preview banner (supports custom uploaded thumbnails or automatic smart platform snapshots) before opening the destination URL.
- **Live Work Availability Badge**: Interactive pulsing status pill that opens a **Work & Hire** inquiry modal with direct email composer, one-click email copy, and WhatsApp chat integration.
- **Profile Sharing & QR Code**: Built-in share modal supporting quick social sharing (WhatsApp, Instagram, X, Facebook, LinkedIn), Native Web Share API, and an automatic **QR Code** generator.
- **Dark & Light Mode**: Instant theme switching with persistent user preference.

### 🛠️ Admin CMS Dashboard (`admin.html` / `/admin.html`)
- **PIN-Protected Access**: Secured by a 6-digit Admin PIN lock screen (session-only in-memory protection on every reload).
- **Interactive Live Preview**: Side-by-side mobile viewport preview that reflects draft edits in real time before publishing.
- **Profile & Availability Management**: Edit display name, handle (`@username`), bio, location, and *Available for Work* status & inquiry note.
- **Client-Side Image Upload & Compression**: Upload profile avatars and custom link thumbnails directly from your device—automatically resized and compressed using HTML5 Canvas.
- **30+ Platform Presets & Brand Icons**: Built-in support for popular platforms including GitHub, GitLab, CodePen, Dev.to, LinkedIn, Instagram, X, Threads, YouTube, TikTok, Spotify, Discord, Telegram, WhatsApp, Figma, Dribbble, Behance, and more.
- **Link Ordering & Badges**: Add, edit, delete, attach highlight badges, and reorder links (*move up/down*) with unsaved-changes protection.
- **JSON Import & Export**: Backup your profile data as a `profile.json` file, copy raw JSON to the clipboard, or import a JSON configuration directly.
- **Triple-Sync Persistence**:
  1. **LocalStorage**: Instant browser persistence and cross-tab synchronization.
  2. **Local Disk Sync (Development Mode)**: Automatically writes changes directly to [`src/data/profile.json`](src/data/profile.json) on disk via a custom Vite middleware (`/api/save-profile`).
  3. **Supabase Cloud & Realtime (Optional / Production)**: Persists profile data to Supabase and broadcasts live updates to all active visitors instantly without page reloads.

---

## 🧰 Tech Stack

- **UI Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/) (Multi-Page Application: `index.html` & `admin.html`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/) (`fa6`)
- **Database & Realtime Sync**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 📁 Project Structure

```text
tapqin-v1/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── SocialIcon.jsx       # Brand & social icon resolver component
│   ├── data/
│   │   └── profile.json         # Default profile & links data (fallback/seed)
│   ├── lib/
│   │   └── supabase.js          # Supabase client, CRUD helpers & Realtime listener
│   ├── pages/
│   │   ├── AdminPage.jsx        # Admin CMS Dashboard UI & Live Preview
│   │   └── PublicPage.jsx       # Public Link in Bio UI
│   ├── AdminApp.jsx             # PIN authentication gate & multi-target save handler
│   ├── App.jsx                  # Public app state, theme & real-time sync wrapper
│   ├── admin.jsx                # Entry point for admin.html
│   ├── main.jsx                 # Entry point for index.html
│   └── index.css                # Global styles & glassmorphism utilities
├── .env.example                 # Environment variables template
├── admin.html                   # HTML entry for the CMS Dashboard
├── index.html                   # HTML entry for the Public Page
├── package.json
└── vite.config.js               # Vite config + custom local-persistence plugin
```

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have **Node.js** (v18+ recommended) and **pnpm** (or npm/yarn) installed.

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables (Optional)
Copy `.env.example` to `.env` in the project root:
```bash
cp .env.example .env
```

Add the following variables to your `.env` file:
```env
# 6-digit PIN to unlock the Admin CMS Dashboard (Defaults to 123456 if omitted)
VITE_ADMIN_PIN=123456

# Supabase Configuration (Optional - enables cloud persistence & live updates in production)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Note**: If Supabase environment variables are not provided, the app runs seamlessly using [`src/data/profile.json`](src/data/profile.json) and `localStorage`.

### 4. Start the Development Server
```bash
pnpm dev
```
- **Public Profile Page**: `http://localhost:5173/`
- **Admin CMS Dashboard**: `http://localhost:5173/admin.html` (Default PIN: `123456`)

When you click **Save Changes** in the Admin CMS during local development, your updates are automatically written directly to [`src/data/profile.json`](src/data/profile.json).

---

## ☁️ Supabase Database Setup (Production Cloud Sync)

To persist CMS edits in a production environment (e.g., Vercel, Netlify, Cloudflare Pages), run the following SQL in your **Supabase SQL Editor** to create the `tapqin_profile` table:

```sql
create table public.tapqin_profile (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS) & policies
alter table public.tapqin_profile enable row level security;

create policy "Allow public read access"
  on public.tapqin_profile for select
  using (true);

create policy "Allow anon insert and update"
  on public.tapqin_profile for all
  using (true)
  with check (true);

-- Enable Realtime broadcasts for live updates
alter publication supabase_realtime add table public.tapqin_profile;
```

On first load with Supabase configured, the application automatically seeds the `id = 'main'` record using the default data from [`src/data/profile.json`](src/data/profile.json) if the table is empty.

---

## 📦 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the Vite development server with HMR & local disk persistence |
| `pnpm build` | Builds both `index.html` and `admin.html` for production into `dist/` |
| `pnpm preview` | Locally previews the production build |
| `pnpm lint` | Runs static code analysis using **Oxlint** |

---

## 📄 License & Credits

© 2026 **Tapqin** by **Padeswaraa** (`@Rittergeistworks`). All rights reserved.

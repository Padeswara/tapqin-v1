import { createClient } from '@supabase/supabase-js'
import defaultProfileData from '../data/profile.json'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null

/**
 * Fetch profile data from Supabase.
 * If the record doesn't exist yet, it automatically seeds the initial profile data.
 */
export async function getProfileFromSupabase() {
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('tapqin_profile')
      .select('data')
      .eq('id', 'main')
      .maybeSingle()

    if (error) {
      console.warn('Supabase fetch error:', error.message)
      return null
    }

    // If data exists in DB, return it
    if (data && data.data) {
      return data.data
    }

    // If table is empty, auto-seed with default profile data
    console.log('Seeding initial profile data to Supabase...')
    await saveProfileToSupabase(defaultProfileData)
    return defaultProfileData
  } catch (err) {
    console.warn('Failed to load from Supabase:', err)
    return null
  }
}

/**
 * Save / Upsert profile data to Supabase
 */
export async function saveProfileToSupabase(profileData) {
  if (!supabase) return { success: false, error: 'Supabase not configured' }

  try {
    const { error } = await supabase.from('tapqin_profile').upsert({
      id: 'main',
      data: profileData,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase save error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Supabase save exception:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Realtime listener for live synchronization across all active visitor tabs
 */
export function subscribeToProfileUpdates(onUpdate) {
  if (!supabase) return () => {}

  try {
    const channel = supabase
      .channel('tapqin_profile_live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tapqin_profile' },
        (payload) => {
          if (payload.new && payload.new.data) {
            onUpdate(payload.new.data)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  } catch (err) {
    console.warn('Realtime subscription error:', err)
    return () => {}
  }
}

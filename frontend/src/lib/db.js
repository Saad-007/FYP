import { supabase } from './supabase'

// ─── PROFILE ──────────────────────────────────────────────────────────────────

/** Get current user's full profile */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) console.error('getProfile:', error)
  return data
}

/** Update career track when user selects it */
export async function saveCareerTrack(userId, trackId) {
  const { error } = await supabase
    .from('profiles')
    .update({ career_track: trackId })
    .eq('id', userId)
  if (error) throw error
  return true
}

/** Add XP to user profile + recalculate level */
export async function addXP(userId, amount) {
  // First get current XP
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', userId)
    .maybeSingle()

  if (!profile) return

  const newXP    = (profile.xp || 0) + amount
  const newLevel = Math.floor(newXP / 500) + 1  // level up every 500 XP

  const { error } = await supabase
    .from('profiles')
    .update({
      xp:          newXP,
      level:       newLevel,
      last_active: new Date().toISOString().split('T')[0],
    })
    .eq('id', userId)

  if (error) console.error('addXP:', error)
  return { newXP, newLevel }
}

/** Update streak — call once per day on login */
export async function updateStreak(userId) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('streak, last_active')
    .eq('id', userId)
    .maybeSingle()

  if (!profile) return

  const today     = new Date().toISOString().split('T')[0]
  const lastActive = profile.last_active

  if (lastActive === today) return // already updated today

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const newStreak = lastActive === yesterday
    ? (profile.streak || 0) + 1  // consecutive day
    : 1                           // streak broken — reset

  await supabase
    .from('profiles')
    .update({ streak: newStreak, last_active: today })
    .eq('id', userId)

  return newStreak
}

// ─── MODULES ─────────────────────────────────────────────────────────────────

/** Get all modules for a track from DB (not hardcoded) */
export async function getModules(trackId) {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('track_id', trackId)
    .eq('is_active', true)
    .order('order_index')
  if (error) console.error('getModules:', error)
  return data || []
}

// ─── USER PROGRESS ────────────────────────────────────────────────────────────

/** Get user's progress for all modules in a track */
export async function getUserProgress(userId, trackId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('track_id', trackId)
  if (error) console.error('getUserProgress:', error)
  return data || []
}

/**
 * Merge modules + progress into one array with status
 * Returns modules with status: 'done' | 'active' | 'locked'
 */
export async function getModulesWithStatus(userId, trackId) {
  const [modules, progress] = await Promise.all([
    getModules(trackId),
    getUserProgress(userId, trackId),
  ])

  const progressMap = {}
  progress.forEach(p => { progressMap[p.module_id] = p })

  // Find first incomplete module → that's 'active'
  let activeSet = false
  return modules.map(mod => {
    const p = progressMap[mod.id]

    if (p?.status === 'done') {
      return { ...mod, status: 'done', xp_earned: p.xp_earned }
    }

    if (!activeSet) {
      activeSet = true
      return { ...mod, status: 'active' }
    }

    return { ...mod, status: 'locked' }
  })
}

/**
 * Mark a module as complete:
 * 1. Upsert user_progress row → status: done
 * 2. Add XP to profile
 * 3. Return updated stats
 */
export async function completeModule(userId, trackId, moduleId, xpReward) {
  // 1. Mark done in user_progress
  const { error: progressError } = await supabase
    .from('user_progress')
    .upsert({
      user_id:      userId,
      track_id:     trackId,
      module_id:    moduleId,
      status:       'done',
      xp_earned:    xpReward,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,track_id,module_id' })

  if (progressError) {
    console.error('completeModule progress:', progressError)
    throw progressError
  }

  // 2. Add XP to profile
  const result = await addXP(userId, xpReward)
  return result
}

/** Initialize progress for a track (set first module as active) */
export async function initTrackProgress(userId, trackId) {
  const modules = await getModules(trackId)
  if (!modules.length) return

  // Check if progress already exists
  const existing = await getUserProgress(userId, trackId)
  if (existing.length > 0) return // already initialized

  // Set first module as active
  await supabase
    .from('user_progress')
    .insert({
      user_id:   userId,
      track_id:  trackId,
      module_id: modules[0].id,
      status:    'active',
    })
}

// ─── STATS ────────────────────────────────────────────────────────────────────

/** Get full dashboard stats for a user */
export async function getDashboardStats(userId, trackId) {
  const [profile, modulesWithStatus] = await Promise.all([
    getProfile(userId),
    getModulesWithStatus(userId, trackId),
  ])

  const done   = modulesWithStatus.filter(m => m.status === 'done').length
  const total  = modulesWithStatus.length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  return {
    xp:       profile?.xp    || 0,
    level:    profile?.level || 1,
    streak:   profile?.streak || 0,
    done,
    total,
    progress,
    modules:  modulesWithStatus,
  }
}
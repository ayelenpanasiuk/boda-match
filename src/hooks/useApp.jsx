import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase, uploadPhoto } from '../lib/supabase'
import { FAKE_PROFILES } from '../data/profiles'

const Ctx = createContext(null)

export function AppProvider({ children }) {
  const [me, setMe]               = useState(null)   // perfil del usuario actual
  const [allProfiles, setAll]     = useState([])
  const [swipedIds, setSwiped]    = useState([])
  const [matches, setMatches]     = useState([])
  const [favorites, setFavorites] = useState([])
  const [newMatch, setNewMatch]   = useState(null)
  const [loading, setLoading]     = useState(false)
  const initialized               = useRef(false)

  /* ── Inicialización desde localStorage ─────────────────────── */
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const user = ls('me')
    if (user) setMe(user)
    setSwiped(ls('swipes') || [])
    setMatches(ls('matches') || [])
    setFavorites(ls('favs') || [])

    loadProfiles()
  }, [])

  function ls(key, val) {
    const k = `bm_${key}`
    if (val !== undefined) { localStorage.setItem(k, JSON.stringify(val)); return val }
    try { return JSON.parse(localStorage.getItem(k)) } catch { return null }
  }

  /* ── Cargar perfiles ────────────────────────────────────────── */
  const loadProfiles = useCallback(async () => {
    setLoading(true)
    try {
      if (supabase) {
        const { data, error } = await supabase.from('profiles').select('*').eq('is_fake', false)
        if (!error && data?.length) {
          setAll([...FAKE_PROFILES, ...data])
          setLoading(false)
          return
        }
      }
    } catch {}
    setAll(FAKE_PROFILES)
    setLoading(false)
  }, [])

  /* ── Crear perfil ───────────────────────────────────────────── */
  const createProfile = useCallback(async (formData, photoFile) => {
    setLoading(true)
    let foto = formData.fotoBase64 || ''

    // Intentar subir foto a Supabase Storage
    if (photoFile && supabase) {
      try {
        const tempId = `u${Date.now()}`
        foto = await uploadPhoto(photoFile, tempId)
      } catch { /* quedamos con base64 */ }
    }

    const profile = {
      ...formData,
      foto,
      fotoBase64: undefined,
      is_fake: false,
      created_at: new Date().toISOString(),
    }

    // Intentar guardar en Supabase
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles').insert([profile]).select().single()
        if (!error && data) {
          const full = { ...profile, ...data }
          ls('me', full); setMe(full)
          await loadProfiles()
          setLoading(false)
          return full
        }
      } catch {}
    }

    // Fallback localStorage
    const local = { ...profile, id: `local_${Date.now()}` }
    ls('me', local); setMe(local)
    setLoading(false)
    return local
  }, [loadProfiles])

  /* ── Swipe ──────────────────────────────────────────────────── */
  const doSwipe = useCallback(async (targetId, dir) => {
    if (swipedIds.includes(targetId)) return

    const newSwiped = [...swipedIds, targetId]
    setSwiped(newSwiped); ls('swipes', newSwiped)

    if (dir !== 'right' && dir !== 'superlike') return

    let isMatch = false

    if (supabase && me?.id && !me.id.startsWith('local_')) {
      try {
        // Guardar like
        await supabase.from('likes').upsert([
          { from_user: me.id, to_user: targetId, type: dir }
        ])
        // Revisar like mutuo
        const { data } = await supabase.from('likes')
          .select('id').eq('from_user', targetId).eq('to_user', me.id).maybeSingle()
        if (data) isMatch = true
      } catch {}
    } else {
      // Demo: 55% de match con perfiles fake al dar like
      if (targetId.startsWith('fp') && Math.random() < 0.55) isMatch = true
    }

    if (isMatch) {
      const profile = allProfiles.find(p => p.id === targetId)
      const m = { id: `m${Date.now()}`, profile, at: Date.now() }
      const newMatches = [...matches, m]
      setMatches(newMatches); ls('matches', newMatches)
      setNewMatch(m)
    }
  }, [swipedIds, me, allProfiles, matches])

  /* ── Favoritos ──────────────────────────────────────────────── */
  const toggleFav = useCallback((id) => {
    const next = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites, id]
    setFavorites(next); ls('favs', next)
  }, [favorites])

  /* ── Perfiles filtrados para el feed ────────────────────────── */
  const feedProfiles = useCallback((gender) => {
    return allProfiles.filter(p => {
      if (p.id === me?.id) return false
      if (swipedIds.includes(p.id)) return false
      if (gender && gender !== 'all') return p.genero === gender
      return true
    })
  }, [allProfiles, me, swipedIds])

  const favProfiles   = allProfiles.filter(p => favorites.includes(p.id))
  const matchProfiles = matches.map(m => m.profile).filter(Boolean)

  return (
    <Ctx.Provider value={{
      me, allProfiles, swipedIds, matches: matchProfiles, favorites, favProfiles,
      newMatch, loading,
      setMe: (u) => { setMe(u); ls('me', u) },
      createProfile, doSwipe, toggleFav, feedProfiles,
      clearMatch: () => setNewMatch(null),
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)

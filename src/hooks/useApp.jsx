import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const Ctx = createContext(null)

function ls(key, val) {
  const k = `bm_${key}`

  if (val !== undefined) {
    if (val === null) localStorage.removeItem(k)
    else localStorage.setItem(k, JSON.stringify(val))
    return val
  }

  try {
    return JSON.parse(localStorage.getItem(k))
  } catch {
    return null
  }
}

function sanitizeUserForStorage(user) {
  if (!user) return null
  const { foto, ...rest } = user
  return { ...rest, foto: '' }
}

export function AppProvider({ children }) {
  const [me, setMeState] = useState(null)
  const [allProfiles, setAllProfiles] = useState([])
  const [swipedIds, setSwipedIds] = useState([])
  const [matches, setMatches] = useState([])
  const [favorites, setFavorites] = useState(ls('favs') || [])
  const [newMatch, setNewMatch] = useState(null)
  const [loading, setLoading] = useState(false)

  const setMe = useCallback((user) => {
    setMeState(user)
    ls('me', sanitizeUserForStorage(user))
  }, [])

  const loadProfiles = useCallback(async () => {
    if (!supabase) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_fake', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error cargando perfiles:', error)
      return
    }

    setAllProfiles(data || [])
  }, [])

  const loadMyActivity = useCallback(async (currentMe) => {
    if (!supabase || !currentMe?.id) return

    const { data: myLikes, error: likesError } = await supabase
      .from('likes')
      .select('*')
      .eq('from_user', currentMe.id)

    if (likesError) {
      console.error('Error cargando likes:', likesError)
      return
    }

    const likes = myLikes || []
    const swiped = likes.map(x => x.to_user)
    setSwipedIds(swiped)

    const outgoingPositiveIds = likes
      .filter(x => x.type === 'right' || x.type === 'superlike')
      .map(x => x.to_user)

    if (outgoingPositiveIds.length === 0) {
      setMatches([])
      return
    }

    const { data: reverseLikes, error: reverseError } = await supabase
      .from('likes')
      .select('*')
      .eq('to_user', currentMe.id)
      .in('from_user', outgoingPositiveIds)
      .in('type', ['right', 'superlike'])

    if (reverseError) {
      console.error('Error cargando matches:', reverseError)
      return
    }

    const matchedIds = [...new Set((reverseLikes || []).map(x => x.from_user))]

    if (matchedIds.length === 0) {
      setMatches([])
      return
    }

    const { data: matchedProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', matchedIds)

    if (profilesError) {
      console.error('Error cargando perfiles matcheados:', profilesError)
      return
    }

    setMatches(matchedProfiles || [])
  }, [])

  useEffect(() => {
    const savedMe = ls('me')
    if (savedMe) setMeState(savedMe)
    loadProfiles()
  }, [loadProfiles])

  useEffect(() => {
    if (me?.id) loadMyActivity(me)
  }, [me, loadMyActivity])

  const createProfile = useCallback(async (formData) => {
    if (!supabase) throw new Error('Supabase no está configurado')

    setLoading(true)

    try {
      const payload = {
        nombre: formData.nombre || '',
        edad: Number(formData.edad),
        ciudad: formData.ciudad || '',
        signo: formData.signo || '',
        genero: formData.genero || 'M',
        como_conoce: formData.como_conoce || '',
        hobbies: [],
        bebida: formData.bebida || '',
        instagram: formData.instagram || '',
        whatsapp: formData.whatsapp || '',
        bio: formData.bio || '',
        badges: [],
        foto: formData.fotoBase64 || '',
        is_fake: false,
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([payload])
        .select()
        .single()

      if (error) {
        console.error('ERROR INSERT PROFILE:', error)
        throw error
      }

      setMe(data)
      await loadProfiles()
      await loadMyActivity(data)

      return data
    } finally {
      setLoading(false)
    }
  }, [loadMyActivity, loadProfiles, setMe])

  const doSwipe = useCallback(async (targetId, dir) => {
    if (!supabase || !me?.id) return
    if (swipedIds.includes(targetId)) return

    const { error } = await supabase
      .from('likes')
      .insert([
        {
          from_user: me.id,
          to_user: targetId,
          type: dir,
        },
      ])

    if (error) {
      console.error('Error guardando swipe:', error)
      return
    }

    const nextSwiped = [...swipedIds, targetId]
    setSwipedIds(nextSwiped)

    if (dir === 'right' || dir === 'superlike') {
      const { data: reverseLike, error: reverseError } = await supabase
        .from('likes')
        .select('*')
        .eq('from_user', targetId)
        .eq('to_user', me.id)
        .in('type', ['right', 'superlike'])
        .maybeSingle()

      if (!reverseError && reverseLike) {
        const profile = allProfiles.find(p => p.id === targetId)
        if (profile) setNewMatch({ profile })
      }
    }

    await loadMyActivity(me)
  }, [allProfiles, loadMyActivity, me, swipedIds])

  const toggleFav = useCallback((id) => {
    const next = favorites.includes(id)
      ? favorites.filter(x => x !== id)
      : [...favorites, id]

    setFavorites(next)
    ls('favs', next)
  }, [favorites])

  const feedProfiles = useCallback((gender = 'all') => {
    return allProfiles.filter((p) => {
      if (!me?.id) return false
      if (p.id === me.id) return false
      if (swipedIds.includes(p.id)) return false
      if (gender !== 'all') return p.genero === gender
      return true
    })
  }, [allProfiles, me, swipedIds])

  const favProfiles = allProfiles.filter(p => favorites.includes(p.id))

  const clearMatch = () => setNewMatch(null)

  const reset = () => {
    ls('me', null)
    ls('favs', null)
    setMeState(null)
    setSwipedIds([])
    setMatches([])
    setFavorites([])
    setNewMatch(null)
    window.location.href = '/'
  }

  return (
    <Ctx.Provider
      value={{
        me,
        allProfiles,
        swipedIds,
        matches,
        favorites,
        favProfiles,
        newMatch,
        loading,
        setMe,
        createProfile,
        doSwipe,
        toggleFav,
        feedProfiles,
        clearMatch,
        reset,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)

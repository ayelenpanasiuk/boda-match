import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase, uploadPhoto } from '../lib/supabase'

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

export function AppProvider({ children }) {
  const [me, setMeState] = useState(null)
  const [allProfiles, setAllProfiles] = useState([])
  const [swipedIds, setSwipedIds] = useState([])
  const [matches, setMatches] = useState([])
  const [favorites, setFavorites] = useState(ls('favs') || [])
  const [newMatch, setNewMatch] = useState(null)
  const [loading, setLoading] = useState(false)
  const initialized = useRef(false)

  const setMe = useCallback((user) => {
    setMeState(user)
    ls('me', user)
  }, [])

  const clearLocalSession = useCallback(() => {
    ls('me', null)
    ls('favs', null)
    setMeState(null)
    setSwipedIds([])
    setMatches([])
    setFavorites([])
    setNewMatch(null)
  }, [])

  const loadProfiles = useCallback(async () => {
    if (!supabase) {
      setAllProfiles([])
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_fake', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error cargando profiles:', error)
      setAllProfiles([])
      return
    }

    setAllProfiles(data || [])
  }, [])

  const loadMyActivity = useCallback(async (currentMe) => {
    if (!supabase || !currentMe?.id) {
      setSwipedIds([])
      setMatches([])
      return
    }

    const { data: myLikes, error: likesError } = await supabase
      .from('likes')
      .select('*')
      .eq('from_user', currentMe.id)

    if (likesError) {
      console.error('Error cargando likes del usuario:', likesError)
      setSwipedIds([])
      setMatches([])
      return
    }

    const likesList = myLikes || []
    setSwipedIds(likesList.map(x => x.to_user))

    const positiveOutgoingIds = likesList
      .filter(x => x.type === 'right' || x.type === 'superlike')
      .map(x => x.to_user)

    if (positiveOutgoingIds.length === 0) {
      setMatches([])
      return
    }

    const { data: reverseLikes, error: reverseError } = await supabase
      .from('likes')
      .select('*')
      .eq('to_user', currentMe.id)
      .in('from_user', positiveOutgoingIds)
      .in('type', ['right', 'superlike'])

    if (reverseError) {
      console.error('Error cargando matches:', reverseError)
      setMatches([])
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
      setMatches([])
      return
    }

    setMatches(matchedProfiles || [])
  }, [])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const user = ls('me')
    if (user) setMeState(user)

    loadProfiles()
  }, [loadProfiles])

  useEffect(() => {
    if (!me?.id) return
    loadMyActivity(me)
  }, [me, loadMyActivity])

  const createProfile = useCallback(async (formData, photoFile) => {
    if (!supabase) {
      throw new Error('Supabase no está configurado')
    }

    setLoading(true)

    try {
      let foto = formData.fotoBase64 || ''

      if (photoFile) {
        try {
          const tempId = `u${Date.now()}`
          foto = await uploadPhoto(photoFile, tempId)
        } catch (e) {
          console.warn('No se pudo subir la foto a storage, uso base64:', e)
        }
      }

      const payload = {
        nombre: formData.nombre || '',
        edad: Number(formData.edad),
        ciudad: formData.ciudad || '',
        signo: formData.signo || '',
        genero: formData.genero || 'M',
        como_conoce: formData.como_conoce || '',
        hobbies: Array.isArray(formData.hobbies)
          ? formData.hobbies
          : typeof formData.hobbies === 'string' && formData.hobbies.trim()
            ? formData.hobbies.split(',').map(h => h.trim()).filter(Boolean)
            : [],
        bebida: formData.bebida || '',
        instagram: formData.instagram || '',
        whatsapp: formData.whatsapp || '',
        bio: formData.bio || '',
        badges: Array.isArray(formData.badges) ? formData.badges : [],
        foto,
        is_fake: false,
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([payload])
        .select()
        .single()

      if (error) throw error

      setMe(data)
      await loadProfiles()
      await loadMyActivity(data)

      return data
    } finally {
      setLoading(false)
    }
  }, [loadMyActivity, loadProfiles, setMe])

  const updateProfile = useCallback(async (updates) => {
    if (!supabase || !me?.id) return null

    setLoading(true)
    try {
      const payload = { ...updates }

      if (typeof payload.hobbies === 'string') {
        payload.hobbies = payload.hobbies
          .split(',')
          .map(h => h.trim())
          .filter(Boolean)
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', me.id)
        .select()
        .single()

      if (error) throw error

      setMe(data)
      await loadProfiles()
      return data
    } finally {
      setLoading(false)
    }
  }, [me, loadProfiles, setMe])

  const deleteProfile = useCallback(async () => {
    if (!supabase || !me?.id) {
      clearLocalSession()
      return
    }

    setLoading(true)
    try {
      await supabase.from('likes').delete().eq('from_user', me.id)
      await supabase.from('likes').delete().eq('to_user', me.id)
      await supabase.from('profiles').delete().eq('id', me.id)

      clearLocalSession()
      await loadProfiles()
    } finally {
      setLoading(false)
    }
  }, [me, clearLocalSession, loadProfiles])

  const doSwipe = useCallback(async (targetId, dir) => {
    if (!supabase || !me?.id) return
    if (swipedIds.includes(targetId)) return

    const { error: insertError } = await supabase
      .from('likes')
      .insert([
        {
          from_user: me.id,
          to_user: targetId,
          type: dir,
        },
      ])

    if (insertError) {
      console.error('Error guardando swipe:', insertError)
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
  }, [supabase, me, swipedIds, allProfiles, loadMyActivity])

  const toggleFav = useCallback((id) => {
    const next = favorites.includes(id)
      ? favorites.filter(x => x !== id)
      : [...favorites, id]

    setFavorites(next)
    ls('favs', next)
  }, [favorites])

  const feedProfiles = useCallback((gender) => {
    return allProfiles.filter((p) => {
      if (!me?.id) return false
      if (p.id === me.id) return false
      if (swipedIds.includes(p.id)) return false
      if (gender && gender !== 'all') return p.genero === gender
      return true
    })
  }, [allProfiles, me, swipedIds])

  const favProfiles = allProfiles.filter(p => favorites.includes(p.id))

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
        updateProfile,
        deleteProfile,
        doSwipe,
        toggleFav,
        feedProfiles,
        clearMatch: () => setNewMatch(null),
        resetSession: clearLocalSession,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)

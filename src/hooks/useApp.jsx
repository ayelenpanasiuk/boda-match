import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const Ctx = createContext(null)

export function AppProvider({ children }) {
  const [me, setMe] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [swiped, setSwiped] = useState([])
  const [matches, setMatches] = useState([])
  const [newMatch, setNewMatch] = useState(null)
  const [loading, setLoading] = useState(false)

  // cargar usuario local
  useEffect(() => {
    const saved = localStorage.getItem('bm_me')
    if (saved) setMe(JSON.parse(saved))
  }, [])

  // cargar perfiles desde supabase
  const loadProfiles = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('*')
    setProfiles(data || [])
  }, [])

  useEffect(() => {
    loadProfiles()
  }, [loadProfiles])

  // crear perfil REAL
  const createProfile = async (data) => {
    setLoading(true)

    const payload = {
      ...data,
      edad: Number(data.edad),
      foto: data.fotoBase64 || '',
      is_fake: false,
    }

    const { data: res, error } = await supabase
      .from('profiles')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error(error)
      alert('Error creando perfil')
      setLoading(false)
      return
    }

    setMe(res)
    localStorage.setItem('bm_me', JSON.stringify(res))
    setLoading(false)
    loadProfiles()
  }

  // swipe REAL
  const doSwipe = async (targetId, dir) => {
    if (!me) return

    await supabase.from('likes').insert([
      {
        from_user: me.id,
        to_user: targetId,
        type: dir,
      },
    ])

    setSwiped([...swiped, targetId])

    // check match
    const { data } = await supabase
      .from('likes')
      .select('*')
      .eq('from_user', targetId)
      .eq('to_user', me.id)
      .maybeSingle()

    if (data && (dir === 'right' || dir === 'superlike')) {
      const profile = profiles.find(p => p.id === targetId)
      setNewMatch({ profile })
      setMatches([...matches, profile])
    }
  }

  const feedProfiles = () => {
    return profiles.filter(p => p.id !== me?.id && !swiped.includes(p.id))
  }

  return (
    <Ctx.Provider value={{
      me,
      profiles,
      matches,
      newMatch,
      loading,
      createProfile,
      doSwipe,
      feedProfiles,
      clearMatch: () => setNewMatch(null),
      reset: () => {
        localStorage.clear()
        window.location.href = '/'
      }
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)

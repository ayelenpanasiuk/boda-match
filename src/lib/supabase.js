import { createClient } from '@supabase/supabase-js'

const URL  = import.meta.env.VITE_SUPABASE_URL  || ''
const KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = (URL && KEY) ? createClient(URL, KEY) : null

export const hasBackend = () => !!supabase

/** Sube una foto y devuelve la URL pública */
export async function uploadPhoto(file, userId) {
  if (!supabase) throw new Error('no-backend')
  const ext  = file.name.split('.').pop()
  const name = `${userId}-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('photos').upload(name, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('photos').getPublicUrl(name)
  return data.publicUrl
}

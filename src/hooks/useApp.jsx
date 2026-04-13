const createProfile = useCallback(async (formData) => {
  if (!supabase) {
    throw new Error('Supabase no está configurado')
  }

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
    return data
  } finally {
    setLoading(false)
  }
}, [loadProfiles, setMe])

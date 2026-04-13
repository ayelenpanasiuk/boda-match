import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { Logo } from '../components/Shared'
import { SIGNOS } from '../data/profiles'
import { Camera, ChevronDown } from 'lucide-react'

const STEPS = ['Tu foto', 'Tu info', 'Tu estilo']

export default function CrearPerfil() {
  const { createProfile, loading } = useApp()
  const navigate = useNavigate()
  const fileRef = useRef()
  const [step, setStep] = useState(0)
  const [err, setErr] = useState('')
  const [preview, setPreview] = useState(null)
  const [photoFile, setFile] = useState(null)

  const [f, setF] = useState({
    nombre: '',
    edad: '',
    ciudad: '',
    signo: '',
    genero: 'M',
    como_conoce: '',
    bebida: '',
    instagram: '',
    whatsapp: '',
    bio: ''
  })

  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFile(file)
    const r = new FileReader()
    r.onloadend = () => setPreview(r.result)
    r.readAsDataURL(file)
  }

  const validate = () => {
    if (step === 0 && !preview) return 'Subí tu foto para continuar 📸'
    if (step === 1) {
      if (!f.nombre.trim()) return 'Ingresá tu nombre'
      if (!f.edad || +f.edad < 18 || +f.edad > 80) return 'Edad inválida'
      if (!f.ciudad.trim()) return 'Ingresá tu ciudad'
      if (!f.signo) return 'Elegí tu signo'
      if (!f.como_conoce.trim()) return 'Contanos cómo conocés a los novios'
    }
    return ''
  }

  const next = () => {
    const e = validate()
    if (e) { setErr(e); return }
    setErr('')
    setStep(s => s + 1)
  }

  const submit = async () => {
    const e = validate()
    if (e) { setErr(e); return }
    setErr('')

    await createProfile({
      ...f,
      edad: +f.edad,
      fotoBase64: preview,
    }, photoFile)

    navigate('/feed')
  }

  return (
    <div className="screen-scroll no-scroll">
      <div className="min-h-full flex flex-col px-5 py-8 pb-12">

        <div className="flex items-center justify-between mb-7">
          <Logo size="sm" date={false} />
          <p className="font-body text-white/30 text-xs">{step + 1} / {STEPS.length}</p>
        </div>

        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full transition-all"
              style={{ background: i <= step ? '#6B1530' : 'rgba(255,255,255,.12)' }} />
          ))}
        </div>

        <h1 className="font-display font-bold text-white text-3xl mb-7">
          {STEPS[step]}
        </h1>

        {/* FOTO */}
        {step === 0 && (
          <div className="flex flex-col items-center gap-5 animate-slideUp">
            <button onClick={() => fileRef.current.click()}
              className="relative w-44 h-44 rounded-3xl overflow-hidden border-2 border-dashed border-wine-light/40 flex items-center justify-center">
              {preview
                ? <img src={preview} className="w-full h-full object-cover" />
                : <>
                    <Camera size={38} />
                    <p>Tocá para elegir tu foto</p>
                  </>}
            </button>
            <input ref={fileRef} type="file" className="hidden" onChange={handlePhoto} />
          </div>
        )}

        {/* INFO */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Field label="Tu nombre" value={f.nombre} onChange={v=>set('nombre',v)} />
            <Field label="Tu edad" type="number" value={f.edad} onChange={v=>set('edad',v)} />
            <Field label="Ciudad" value={f.ciudad} onChange={v=>set('ciudad',v)} />

            <div>
              <Label>Signo</Label>
              <select value={f.signo} onChange={e=>set('signo',e.target.value)}>
                <option value="">Elegí tu signo</option>
                {SIGNOS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>

            <Field label="¿Cómo conocés a los novios?" value={f.como_conoce} onChange={v=>set('como_conoce',v)} />
          </div>
        )}

        {/* ESTILO */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <Field label="Instagram" value={f.instagram} onChange={v=>set('instagram',v)} />
            <Field label="WhatsApp" value={f.whatsapp} onChange={v=>set('whatsapp',v)} />
            <Field label="Bebida favorita" value={f.bebida} onChange={v=>set('bebida',v)} />

            <textarea placeholder="Una frase que te describa"
              value={f.bio} onChange={e=>set('bio',e.target.value)} />
          </div>
        )}

        {err && <p>{err}</p>}

        <div className="flex gap-3 mt-8">
          {step > 0 && <button onClick={()=>setStep(s=>s-1)}>Atrás</button>}
          {step < 2
            ? <button onClick={next}>Siguiente</button>
            : <button onClick={submit}>Guardar perfil</button>}
        </div>

      </div>
    </div>
  )
}

function Label({ children }) {
  return <p>{children}</p>
}

function Field({ label, value, onChange, type='text' }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} />
    </div>
  )
}

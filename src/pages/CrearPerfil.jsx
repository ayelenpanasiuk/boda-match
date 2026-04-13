import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { Logo } from '../components/Shared'
import { SIGNOS, BADGES_LIST } from '../data/profiles'
import { Camera, ChevronDown } from 'lucide-react'

const STEPS = ['Tu foto', 'Tu info', 'Tu estilo']

export default function CrearPerfil() {
  const { createProfile, loading } = useApp()
  const navigate = useNavigate()
  const fileRef = useRef()
  const [step, setStep]     = useState(0)
  const [err, setErr]       = useState('')
  const [preview, setPreview] = useState(null)
  const [photoFile, setFile]  = useState(null)

  const [f, setF] = useState({
    nombre:'', edad:'', ciudad:'', signo:'', genero:'M',
    como_conoce:'', hobbies:'', bebida:'', instagram:'', whatsapp:'', bio:'', badges:[],
  })
  const set = (k,v) => setF(p => ({ ...p, [k]:v }))

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFile(file)
    const r = new FileReader()
    r.onloadend = () => setPreview(r.result)
    r.readAsDataURL(file)
  }

  const toggleBadge = (b) => {
    const curr = f.badges
    if (curr.includes(b)) set('badges', curr.filter(x=>x!==b))
    else if (curr.length < 3) set('badges', [...curr, b])
  }

  const validate = () => {
    if (step === 0 && !preview) return 'Subí una foto para continuar 📸'
    if (step === 1) {
      if (!f.nombre.trim()) return 'Ingresá tu nombre'
      if (!f.edad || +f.edad < 18 || +f.edad > 80) return 'Edad inválida'
      if (!f.ciudad.trim()) return 'Ingresá tu ciudad'
      if (!f.signo) return 'Elegí tu signo'
      if (!f.como_conoce.trim()) return '¿Cómo conocés a los novios?'
    }
    return ''
  }

  const next = () => { const e = validate(); if (e) { setErr(e); return } setErr(''); setStep(s=>s+1) }

  const submit = async () => {
    const e = validate(); if (e) { setErr(e); return } setErr('')
    await createProfile({
      ...f,
      edad: +f.edad,
      hobbies: f.hobbies.split(',').map(h=>h.trim()).filter(Boolean),
      fotoBase64: preview,
    }, photoFile)
    navigate('/feed')
  }

  return (
    <div className="screen-scroll no-scroll">
      <div className="min-h-full flex flex-col px-5 py-8 pb-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <Logo size="sm" date={false} />
          <p className="font-body text-white/30 text-xs">{step+1} / {STEPS.length}</p>
        </div>

        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_,i)=>(
            <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ background: i<=step?'#6B1530':'rgba(255,255,255,.12)' }} />
          ))}
        </div>

        <h1 className="font-display font-bold text-white text-3xl mb-7">{STEPS[step]}</h1>

        {/* ── STEP 0: FOTO ── */}
        {step===0 && (
          <div className="flex flex-col items-center gap-5 animate-slideUp">
            <button onClick={()=>fileRef.current.click()}
              className="relative w-44 h-44 rounded-3xl overflow-hidden border-2 border-dashed border-wine-light/40 active:scale-95 transition-transform flex flex-col items-center justify-center"
              style={{ background:'rgba(255,255,255,.05)' }}>
              {preview
                ? <img src={preview} className="w-full h-full object-cover" alt="preview" />
                : <>
                    <Camera size={38} className="text-wine-light/60 mb-2" />
                    <p className="font-body text-white/35 text-sm text-center px-3">Tocá para elegir tu foto</p>
                  </>}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            {preview && <button onClick={()=>fileRef.current.click()} className="font-body text-wine-light text-sm underline">Cambiar foto</button>}
            <p className="font-body text-white/25 text-xs text-center max-w-[15rem]">
              Una foto clara donde se te vea la cara. Primera impresión y todo eso 😉
            </p>
          </div>
        )}

        {/* ── STEP 1: INFO ── */}
        {step===1 && (
          <div className="flex flex-col gap-4 animate-slideUp">
            <Field label="Nombre" value={f.nombre} onChange={v=>set('nombre',v)} placeholder="¿Cómo te llaman?" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Edad" type="number" value={f.edad} onChange={v=>set('edad',v)} placeholder="Años" />
              <div>
                <Label>Género</Label>
                <div className="flex gap-2 h-[52px]">
                  {[['M','👨'],['F','👩']].map(([v,e])=>(
                    <button key={v} onClick={()=>set('genero',v)}
                      className={`flex-1 rounded-2xl text-lg transition-all ${f.genero===v?'border border-wine-light/60':'border border-white/12'}`}
                      style={{ background: f.genero===v?'rgba(107,21,48,.5)':'rgba(255,255,255,.06)' }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Field label="Ciudad" value={f.ciudad} onChange={v=>set('ciudad',v)} placeholder="¿De dónde venís?" />
            <div>
              <Label>Signo zodiacal</Label>
              <div className="relative">
                <select className="field appearance-none pr-10" value={f.signo} onChange={e=>set('signo',e.target.value)}>
                  <option value="">Elegí tu signo</option>
                  {SIGNOS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
              </div>
            </div>
            <Field label="¿Cómo conocés a los novios?" value={f.como_conoce} onChange={v=>set('como_conoce',v)} placeholder="Amiga de la novia, primo del novio..." />
          </div>
        )}

        {/* ── STEP 2: ESTILO ── */}
        {step===2 && (
          <div className="flex flex-col gap-4 animate-slideUp">
            <Field label="Instagram" value={f.instagram} onChange={v=>set('instagram',v)} placeholder="@tu.instagram" />
            <Field label="WhatsApp (opcional)" type="tel" value={f.whatsapp} onChange={v=>set('whatsapp',v)} placeholder="+54 9 11 ..." />
            <Field label="Bebida favorita" value={f.bebida} onChange={v=>set('bebida',v)} placeholder="Fernet, Malbec, Gin tónico..." />
            <Field label="Hobbies (separados por coma)" value={f.hobbies} onChange={v=>set('hobbies',v)} placeholder="Viajes, Cocina, CrossFit..." />
            <div>
              <Label>Mini bio</Label>
              <textarea className="field resize-none" rows={2} maxLength={120}
                placeholder="Una frase que te represente 😏"
                value={f.bio} onChange={e=>set('bio',e.target.value)} />
            </div>
            <div>
              <Label>Tus badges (hasta 3)</Label>
              <div className="flex flex-wrap gap-2">
                {BADGES_LIST.map(b=>(
                  <button key={b} onClick={()=>toggleBadge(b)}
                    className={`text-xs font-body px-3 py-1.5 rounded-full border transition-all ${f.badges.includes(b)?'bg-wine-dark/80 border-wine-light/50 text-white':'border-white/15 text-white/45'}`}
                    style={{ background: f.badges.includes(b)?undefined:'rgba(255,255,255,.05)' }}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {err && <p className="font-body text-red-400 text-sm mt-4 animate-slideUp">{err}</p>}

        {/* Nav */}
        <div className="flex gap-3 mt-8">
          {step>0 && <button className="btn-ghost flex-1" onClick={()=>setStep(s=>s-1)}>← Atrás</button>}
          {step<2
            ? <button className="btn-wine flex-1" onClick={next}>Siguiente →</button>
            : <button className="btn-wine flex-1" onClick={submit} disabled={loading}>{loading?'Guardando...':'¡Listo! Entrar 💍'}</button>}
        </div>

        <p className="font-script text-white/20 text-sm text-center mt-5">Tu match puede estar a un swipe de distancia 💫</p>
      </div>
    </div>
  )
}

function Label({ children }) {
  return <p className="font-body text-white/45 text-[11px] uppercase tracking-wider mb-1.5">{children}</p>
}

function Field({ label, value, onChange, placeholder, type='text' }) {
  return (
    <div>
      <Label>{label}</Label>
      <input className="field" type={type} value={value} placeholder={placeholder}
        onChange={e=>onChange(e.target.value)} />
    </div>
  )
}

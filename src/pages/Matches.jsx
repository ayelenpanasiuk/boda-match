import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Heart, Bookmark, Instagram, MessageCircle, Lock } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { Logo } from '../components/Shared'

export default function Matches() {
  const { matches, favProfiles } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab')==='favs' ? 'favs' : 'matches')
  const [open, setOpen] = useState(null)

  const list = tab === 'matches' ? matches : favProfiles
  const isMatchTab = tab === 'matches'

  return (
    <div className="screen-scroll no-scroll">
      <div className="min-h-full flex flex-col px-4 py-6">

        <div className="flex items-center justify-between mb-6 px-1">
          <button onClick={()=>navigate('/feed')} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 active:scale-90 transition-transform" style={{ background:'rgba(255,255,255,.07)' }}>
            <ArrowLeft size={19} className="text-white" />
          </button>
          <Logo size="sm" date={false} />
          <div className="w-10" />
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl p-1 mb-6 border border-white/10" style={{ background:'rgba(255,255,255,.05)' }}>
          {[['matches','matches',<Heart size={15}/>],['favs','favoritos',<Bookmark size={15}/>]].map(([v,l,icon])=>(
            <button key={v} onClick={()=>setTab(v)}
              className={`flex-1 py-2.5 rounded-xl font-body text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${tab===v?'text-white':'text-white/40'}`}
              style={{ background: tab===v?'rgba(107,21,48,.8)':undefined }}>
              {icon} {l.charAt(0).toUpperCase()+l.slice(1)} ({(tab===v?list:isMatchTab?favProfiles:matches).length})
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-16">
            <div className="text-5xl mb-4 animate-float">{isMatchTab ? '💔' : '🔖'}</div>
            <p className="font-display text-2xl text-white mb-2">{isMatchTab ? 'Sin matches aún' : 'Sin favoritos'}</p>
            <p className="font-body text-white/40 text-sm mb-6">
              {isMatchTab ? 'Seguí swipeando, el amor está en algún lugar de ese salón 🕺' : 'Guardá perfiles con el marcador en las cartas'}
            </p>
            <button className="btn-wine max-w-[200px]" onClick={()=>navigate('/feed')}>Seguir swipeando 🔥</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {list.map(p => (
              <div key={p.id} className="rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
                onClick={()=>setOpen(open===p.id?null:p.id)}>
                <div className="relative h-44">
                  <img src={p.foto} alt={p.nombre} className="w-full h-full object-cover" onError={e=>e.target.style.display='none'} />
                  <div className="absolute inset-0" style={{ background:'linear-gradient(to top,rgba(0,0,0,.8) 0%,rgba(0,0,0,0) 55%)' }} />
                  <div className="absolute bottom-2 left-2.5">
                    <p className="font-display text-base font-bold text-white leading-tight">{p.nombre}, {p.edad}</p>
                    <p className="font-body text-white/55 text-xs">{p.ciudad}</p>
                  </div>
                  {isMatchTab && (
                    <div className="absolute top-2 right-2 rounded-full px-2 py-0.5" style={{ background:'rgba(107,21,48,.75)', backdropFilter:'blur(6px)' }}>
                      <span className="font-body text-white text-[10px]">💕 Match</span>
                    </div>
                  )}
                </div>
                {open === p.id && (
                  <div className="p-3 space-y-2 animate-slideUp" style={{ background:'rgba(255,255,255,.04)' }}>
                    {isMatchTab ? (
                      <>
                        {p.instagram && (
                          <a href={`https://instagram.com/${p.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl p-2.5 active:scale-95 transition-transform border border-purple-500/20"
                            style={{ background:'rgba(88,28,135,.3)' }}>
                            <Instagram size={16} className="text-pink-400 shrink-0" />
                            <span className="font-body text-white text-xs truncate">{p.instagram}</span>
                          </a>
                        )}
                        {p.whatsapp && (
                          <a href={`https://wa.me/${p.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl p-2.5 active:scale-95 transition-transform border border-green-500/20"
                            style={{ background:'rgba(6,78,59,.3)' }}>
                            <MessageCircle size={16} className="text-green-400 shrink-0" />
                            <span className="font-body text-white text-xs truncate">{p.whatsapp}</span>
                          </a>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl p-2.5 border border-white/10" style={{ background:'rgba(255,255,255,.06)' }}>
                        <Lock size={14} className="text-white/30 shrink-0" />
                        <span className="font-body text-white/40 text-xs">Contacto visible al hacer match</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

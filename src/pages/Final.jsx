import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { Logo, Particles } from '../components/Shared'

export default function Final() {
  const { matches } = useApp()
  const navigate = useNavigate()

  return (
    <div className="screen items-center justify-between px-6 py-12">
      <Particles n={12} />
      <Logo size="md" date />

      <div className="flex flex-col items-center text-center z-10">
        <div className="text-6xl mb-5 animate-float">💍</div>

        <h1
          className="font-display font-bold text-white leading-tight mb-3"
          style={{ fontSize:'2.4rem' }}
        >
          ¿Encontraste tu match?<br />
          <span
            className="italic"
            style={{
              background:'linear-gradient(135deg,#C9A96E,#E8D5A3)',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent'
            }}
          >
            Si no… todavía falta para el gran día 😏
          </span>
        </h1>

        <p className="font-body text-white/45 text-base leading-relaxed mb-3 max-w-xs">
          Gracias por jugar 💍
        </p>

        <p className="font-script text-wine-light text-xl mb-7">
          Nos vemos el 26 💃
        </p>

        {matches.length > 0 && (
          <div
            className="rounded-2xl p-5 mb-7 w-full max-w-xs border border-white/10"
            style={{ background:'rgba(255,255,255,.05)' }}
          >
            <p className="font-body text-white/35 text-[11px] uppercase tracking-widest mb-3">
              Tus matches
            </p>

            <div className="flex justify-center gap-2 flex-wrap">
              {matches.slice(0,5).map((p,i)=>(
                <div
                  key={i}
                  className="w-11 h-11 rounded-full overflow-hidden border-2 border-wine-default shrink-0"
                >
                  <img src={p?.foto} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <p className="font-body text-white/55 text-sm mt-3">
              {matches.length} match{matches.length!==1?'es':''} 💕
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full max-w-[240px]">
          <button className="btn-wine" onClick={()=>navigate('/matches')}>
            Ver mis matches 💕
          </button>

          <button className="btn-ghost" onClick={()=>navigate('/feed')}>
            Seguir jugando 🔥
          </button>
        </div>
      </div>

      <div className="z-10 text-center">
        <p className="font-script text-white/20 text-base">
          Con amor, A &amp; A ✨
        </p>
        <p className="font-body text-white/12 text-xs mt-1">
          26 · 09 · 2026
        </p>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { Logo, Particles } from '../components/Shared'
import { useApp } from '../hooks/useApp'

export default function Home() {
  const navigate = useNavigate()
  const { me } = useApp()

  return (
    <div className="screen items-center justify-between px-6 py-14">
      <Particles n={10} />

      <Logo size="lg" date />

      <div className="flex flex-col items-center text-center z-10 px-2">
        <div className="text-5xl mb-5 animate-float">😇 💍 😈</div>

        <h1 className="font-display font-bold text-white leading-tight mb-3" style={{ fontSize:'2.6rem' }}>
          El Tinder<br />
          <span className="italic" style={{ background:'linear-gradient(135deg,#C9A96E,#E8D5A3)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            de la boda
          </span>
        </h1>

        <p className="font-body text-white/55 text-base leading-relaxed mb-2 max-w-[17rem]">
          Swipeá entre los invitados y encontrá tu match <span className="text-wine-light">antes del vals</span>.
        </p>
        <p className="font-script text-white/30 text-lg mb-9">Deslizá con responsabilidad 😏</p>

        {/* Stats */}
        <div className="flex gap-6 mb-12">
          {[['15+','invitados'],['∞','posibilidades'],['1','noche mágica']].map(([n,l])=>(
            <div key={l} className="text-center">
              <p className="font-display font-bold text-xl" style={{ background:'linear-gradient(135deg,#C9A96E,#E8D5A3)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{n}</p>
              <p className="font-body text-white/35 text-xs">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full z-10 flex flex-col gap-3">
        <button className="btn-wine" onClick={() => navigate(me ? '/feed' : '/onboarding')}>
          Entrar a la fiesta 🎊
        </button>
        <p className="font-body text-white/20 text-xs text-center">Solo para invitados · A&amp;A · 26/09/2026</p>
      </div>
    </div>
  )
}

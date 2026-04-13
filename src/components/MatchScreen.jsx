import { Instagram, MessageCircle } from 'lucide-react'
import { Confetti } from './Shared'

export default function MatchScreen({ match, me, onClose }) {
  const { profile } = match
  const mePhoto = me?.foto || `https://api.dicebear.com/8.x/personas/svg?seed=${me?.nombre}`

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{ background:'linear-gradient(160deg,#1c0612 0%,#4A0D20 50%,#1c0612 100%)' }}>
      <Confetti />

      {/* glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{ width:340, height:340, borderRadius:'50%', background:'radial-gradient(circle,#8B1D3F 0%,transparent 70%)', filter:'blur(50px)', opacity:.25 }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-xs" style={{ animation:'popIn .55s cubic-bezier(.175,.885,.32,1.275) both' }}>

        <div className="text-4xl mb-3" style={{ animation:'floatUp 3.5s ease-in-out infinite' }}>😇 💘 😈</div>

        <h1 className="font-display font-bold italic mb-1"
          style={{ fontSize:'3.2rem', lineHeight:1, background:'linear-gradient(135deg,#C9A96E,#E8D5A3,#C9A96E)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          ¡Match!
        </h1>
        <p className="font-body text-white/50 text-sm mb-7">
          La química ya empezó antes de la boda 🥂
        </p>

        {/* Fotos */}
        <div className="flex items-center gap-5 mb-6">
          <Avatar src={mePhoto}    name={me?.nombre} />
          <div className="text-3xl" style={{ animation:'floatUp 2s ease-in-out infinite' }}>💕</div>
          <Avatar src={profile?.foto} name={profile?.nombre} />
        </div>

        <p className="font-display text-xl text-white mb-1">{me?.nombre} &amp; {profile?.nombre}</p>
        <p className="font-body text-white/40 text-sm mb-7">se gustaron mutuamente ✨</p>

        {/* Contacto desbloqueado */}
        <div className="w-full rounded-2xl p-4 mb-5 border border-white/10" style={{ background:'rgba(255,255,255,.05)' }}>
          <p className="font-body text-white/35 text-[11px] uppercase tracking-widest mb-3">🔓 Contacto desbloqueado</p>
          {profile?.instagram && (
            <a href={`https://instagram.com/${profile.instagram.replace('@','')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl p-3 mb-2 active:scale-95 transition-transform border border-purple-500/20"
              style={{ background:'rgba(88,28,135,.35)' }}>
              <Instagram size={19} className="text-pink-400 shrink-0" />
              <span className="font-body text-white font-medium text-sm">{profile.instagram}</span>
            </a>
          )}
          {profile?.whatsapp && (
            <a href={`https://wa.me/${profile.whatsapp.replace(/\D/g,'')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl p-3 active:scale-95 transition-transform border border-green-500/20"
              style={{ background:'rgba(6,78,59,.35)' }}>
              <MessageCircle size={19} className="text-green-400 shrink-0" />
              <span className="font-body text-white font-medium text-sm">{profile.whatsapp}</span>
            </a>
          )}
        </div>

        <p className="font-script text-white/25 text-base mb-6">
          "Ahora solo te falta encontrarlo en la boda" 😏
        </p>

        <button className="btn-wine mb-3" onClick={onClose}>Seguir swipeando 🔥</button>
        <button className="font-body text-white/30 text-sm" onClick={onClose}>Ver mis matches</button>
      </div>
    </div>
  )
}

function Avatar({ src, name }) {
  return (
    <div className="w-28 h-28 rounded-full overflow-hidden border-4 shrink-0"
      style={{ borderColor:'#6B1530', boxShadow:'0 0 24px rgba(107,21,48,.5)' }}>
      <img src={src} alt={name} className="w-full h-full object-cover" onError={e=>e.target.style.display='none'} />
    </div>
  )
}

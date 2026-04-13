import { useState, useRef } from 'react'
import { Heart, X, Star, Bookmark, BookmarkCheck, ChevronUp } from 'lucide-react'
import { useApp } from '../hooks/useApp'

const THRESHOLD = 75

export default function SwipeCard({ profile, onSwipe, isTop, stackIndex = 0 }) {
  const { favorites, toggleFav } = useApp()
  const [dx, setDx]               = useState(0)
  const [dy, setDy]               = useState(0)
  const [dragging, setDragging]   = useState(false)
  const [expanded, setExpanded]   = useState(false)
  const start                     = useRef({ x: 0, y: 0 })
  const isFav                     = favorites.includes(profile.id)

  /* opacity de stamps */
  const likeOp = dx > 30  ? Math.min((dx - 30) / 55, 1) : 0
  const nopeOp = dx < -30 ? Math.min((-dx - 30) / 55, 1) : 0

  /* ── drag helpers ─── */
  const startDrag = (x, y) => { start.current = { x, y }; setDragging(true) }
  const moveDrag  = (x, y) => { if (!dragging) return; setDx(x - start.current.x); setDy(y - start.current.y) }
  const endDrag   = () => {
    setDragging(false)
    if      (dx >  THRESHOLD) flyOut('right')
    else if (dx < -THRESHOLD) flyOut('left')
    else { setDx(0); setDy(0) }
  }
  const flyOut = (dir) => {
    const tx = dir === 'right' ? window.innerWidth * 1.6 : -window.innerWidth * 1.6
    setDx(tx); setDy(dy * 0.3)
    setTimeout(() => onSwipe(profile.id, dir), 320)
  }

  /* touch */
  const onTS = (e) => { if (!isTop) return; const t = e.touches[0]; startDrag(t.clientX, t.clientY) }
  const onTM = (e) => { if (!isTop) return; e.preventDefault(); const t = e.touches[0]; moveDrag(t.clientX, t.clientY) }
  const onTE = () => { if (!isTop) return; endDrag() }

  /* mouse */
  const onMS = (e) => { if (!isTop) return; startDrag(e.clientX, e.clientY) }
  const onMM = (e) => { if (!isTop || !dragging) return; moveDrag(e.clientX, e.clientY) }
  const onMU = () => { if (!isTop || !dragging) return; endDrag() }

  const rot    = dx * 0.07
  const tf     = `translate(${dx}px,${dy * 0.35}px) rotate(${rot}deg)`
  const trans  = dragging ? 'none' : 'transform .32s cubic-bezier(.25,.46,.45,.94)'
  const scale  = isTop ? 1 : 1 - stackIndex * 0.04
  const transY = isTop ? 0 : stackIndex * 10

  return (
    <div
      className="absolute inset-0 rounded-3xl overflow-hidden select-none"
      style={{
        transform: isTop ? tf : `scale(${scale}) translateY(${transY}px)`,
        transition: trans,
        zIndex: isTop ? 10 : 10 - stackIndex,
        boxShadow: '0 24px 60px rgba(0,0,0,.55)',
        willChange: 'transform',
        touchAction: 'none',
        cursor: isTop ? (dragging ? 'grabbing' : 'grab') : 'default',
      }}
      onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}
      onMouseDown={onMS}  onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
    >
      {/* Photo */}
      <div className="absolute inset-0 bg-zinc-900">
        <img src={profile.foto} alt={profile.nombre} draggable={false}
          className="w-full h-full object-cover pointer-events-none"
          onError={e => { e.target.style.display = 'none' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.15) 45%, rgba(0,0,0,0) 100%)' }} />
      </div>

      {/* Stamps */}
      {isTop && <div className="stamp-like" style={{ opacity: likeOp }}>LIKE 💚</div>}
      {isTop && <div className="stamp-nope" style={{ opacity: nopeOp }}>NOPE ❌</div>}

      {/* Fav button */}
      <button className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full active:scale-90 transition-transform"
        style={{ background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(8px)' }}
        onClick={e => { e.stopPropagation(); toggleFav(profile.id) }}>
        {isFav ? <BookmarkCheck size={18} className="text-yellow-400" /> : <Bookmark size={18} className="text-white/60" />}
      </button>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {profile.badges?.slice(0, 2).map(b => <span key={b} className="badge-pill">{b}</span>)}
        </div>

        {/* Name */}
        <div className="flex items-end justify-between mb-1">
          <h2 className="font-display text-[1.75rem] font-bold text-white leading-none">
            {profile.nombre}, <span className="font-normal">{profile.edad}
            </span>
          </h2>
          <span className="text-2xl mb-0.5">{profile.signo?.split(' ')[0]}</span>
        </div>

        {/* Location */}
        <p className="font-body text-white/60 text-sm mb-2">
          📍 {profile.ciudad} · {profile.como_conoce}
        </p>

        {/* Bio */}
        <p className="font-body text-white/75 text-sm leading-relaxed line-clamp-2 mb-2 italic">
          "{profile.bio}"
        </p>

        {/* Expanded */}
        {expanded && (
          <div className="mb-3 space-y-2 animate-slideUp">
            <div className="grid grid-cols-2 gap-2">
              {[['Bebida',profile.bebida],['Instagram',profile.instagram]].map(([k,v])=>(
                <div key={k} className="rounded-xl p-2" style={{ background:'rgba(255,255,255,.09)' }}>
                  <p className="text-white/40 text-[10px] font-body uppercase tracking-wider">{k}</p>
                  <p className="text-white text-sm font-body font-medium truncate">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.hobbies?.map(h => (
                <span key={h} className="text-[11px] text-white/55 font-body px-2 py-0.5 rounded-full" style={{ background:'rgba(255,255,255,.08)' }}>{h}</span>
              ))}
            </div>
          </div>
        )}

        {/* Toggle */}
        <button onClick={e => { e.stopPropagation(); setExpanded(x => !x) }}
          className="flex items-center gap-1 text-white/40 text-xs font-body mb-4">
          <ChevronUp size={13} style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform .2s' }} />
          {expanded ? 'Menos' : 'Ver más'}
        </button>

        {/* Action buttons — only on top card */}
        {isTop && (
          <div className="flex items-center justify-center gap-4">
            <ActionBtn onClick={() => flyOut('left')} size={56} border="rgba(248,113,113,.35)">
              <X size={22} className="text-red-400" />
            </ActionBtn>
            <ActionBtn onClick={() => onSwipe(profile.id,'superlike')} size={46} border="rgba(96,165,250,.35)">
              <Star size={17} className="text-blue-400" />
            </ActionBtn>
            <ActionBtn onClick={() => flyOut('right')} size={56} style={{ background:'linear-gradient(135deg,#8B1D3F,#6B1530)' }}>
              <Heart size={22} className="text-white fill-white" />
            </ActionBtn>
          </div>
        )}
      </div>
    </div>
  )
}

function ActionBtn({ children, onClick, size, border, style = {} }) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick() }}
      className="flex items-center justify-center rounded-full active:scale-90 transition-transform"
      style={{ width: size, height: size, border: border ? `1px solid ${border}` : undefined, background: border ? 'rgba(255,255,255,.08)' : undefined, backdropFilter:'blur(8px)', boxShadow:'0 4px 18px rgba(0,0,0,.3)', ...style }}>
      {children}
    </button>
  )
}

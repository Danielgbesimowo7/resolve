import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUp02Icon } from '@hugeicons/core-free-icons'
import { FACES } from '../faces'
import { STATUS_LABEL, type Conversation, type Status } from '../data/mock'

type IconData = Parameters<typeof HugeiconsIcon>[0]['icon']
export const Icon = ({ icon, size = 20, className }: { icon: IconData; size?: number; className?: string }) => (
  <HugeiconsIcon icon={icon} size={size} strokeWidth={1.5} color="currentColor" className={className} />
)

const TINTS = ['#0f766e', '#334155', '#7c5a3b', '#b45309', '#1e293b', '#9d174d', '#0369a1', '#475569', '#3f6212', '#3b0a45']
export function Avatar({ c, size = 33 }: { c: Pick<Conversation, 'name' | 'avatar'>; size?: number }) {
  const face = c.avatar ? FACES[c.avatar] : undefined
  const initials = c.name.split(' ').map(w => w[0]).slice(0, 2).join('')
  const tint = TINTS[[...c.name].reduce((a, ch) => a + ch.charCodeAt(0), 0) % TINTS.length]
  return (
    <span className="rs-av" style={{ width: size, height: size, fontSize: size * 0.38, background: face ? `url("${face}") center/cover` : tint }}>
      {face ? '' : initials}
    </span>
  )
}

export const StatusPill = ({ s }: { s: Status }) => <span className={`rs-pill rs-${s}`}>{STATUS_LABEL[s]}</span>

// Lucide icons used by the design (the rest come from the Hugeicons set)
export const Scale3d = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#141b34" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 7v11a1 1 0 0 0 1 1h11" /><path d="M5.293 18.707 11 13" /><circle cx="19" cy="19" r="2" /><circle cx="5" cy="5" r="2" /></svg>
)
export const CircleCheckBig = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#141b34" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>
)

export interface StatItem { icon: React.ReactNode; label: string; value: string; delta: number; invert?: boolean; unit?: '%' | 'pts' }
export function StatCards({ items, range }: { items: StatItem[]; range: number }) {
  return (
    <div className="rs-stats">
      {items.map(s => {
        const good = s.invert ? s.delta <= 0 : s.delta >= 0
        return (
          <div className="rs-card" key={s.label}>
            <div className="rs-stat-h"><span className="rs-ib">{s.icon}</span>{s.label}</div>
            <div className="rs-stat-b"><div className="rs-num">{s.value}</div>
              <div className="rs-delrow"><span className={`rs-delta ${good ? '' : 'bad'}`}><HugeiconsIcon icon={ArrowUp02Icon} size={24} strokeWidth={1.5} color="currentColor" className={s.delta < 0 ? 'flip' : ''} />{Math.abs(s.delta).toFixed(1)}%</span><span>vs. previous {range} days</span></div></div>
          </div>
        )
      })}
    </div>
  )
}

/** true on phone-width screens (used to drop chart y-axis labels and their gutter) */
export function useNarrow(max = 700) {
  const q = `(max-width:${max}px)`
  const [n, setN] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => { const m = window.matchMedia(q), f = () => setN(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f) }, [q])
  return n
}

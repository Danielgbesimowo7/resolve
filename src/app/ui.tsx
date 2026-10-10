import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUp02Icon, ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
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


/** Floating menu anchored to an element. position:fixed so table/card overflow never clips it; flips above when there is no room below. */
export function Popover({ anchor, open, onClose, align = 'right', className = '', children, minWidth }: { anchor: RefObject<HTMLElement | null>; open: boolean; onClose: () => void; align?: 'left' | 'right'; className?: string; children: ReactNode; minWidth?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left?: number; right?: number; w: number } | null>(null)
  useLayoutEffect(() => {
    if (!open) { setPos(null); return }
    const a = anchor.current, m = ref.current
    if (!a || !m) return
    const r = a.getBoundingClientRect(), mh = m.offsetHeight, mw = Math.max(m.offsetWidth, r.width, minWidth ?? 0)
    const below = r.bottom + 8 + mh <= innerHeight - 8
    const top = below ? r.bottom + 8 : Math.max(8, r.top - 8 - mh)
    if (align === 'right') setPos({ top, right: Math.max(8, innerWidth - r.right), w: r.width })
    else setPos({ top, left: Math.min(Math.max(8, r.left), Math.max(8, innerWidth - mw - 8)), w: r.width })
  }, [open, anchor, align, minWidth])
  useEffect(() => {
    if (!open) return
    const down = (e: Event) => { const t = e.target as Node; if (!ref.current?.contains(t) && !anchor.current?.contains(t)) onClose() }
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const away = (e: Event) => { if (!ref.current?.contains(e.target as Node)) onClose() }
    document.addEventListener('pointerdown', down); document.addEventListener('keydown', key)
    window.addEventListener('scroll', away, true); window.addEventListener('resize', onClose)
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); window.removeEventListener('scroll', away, true); window.removeEventListener('resize', onClose) }
  }, [open, onClose, anchor])
  if (!open) return null
  return <div ref={ref} className={'rs-fpop ' + className} style={{ top: pos?.top ?? 0, left: pos?.left, right: pos?.right, minWidth: Math.max(pos?.w ?? 0, minWidth ?? 0), visibility: pos ? 'visible' : 'hidden' }}>{children}</div>
}

/** Styled replacement for a native <select>. `cls` is the wrapper look (rs-range, rs-dd, rs-sel); `lead` is an optional leading icon. */
export function Dd({ cls, value, onChange, options, label, display, lead, disabled, align = 'left' }: { cls: string; value: string; onChange: (v: string) => void; options: Array<[string, string]>; label: string; display: ReactNode; lead?: ReactNode; disabled?: boolean; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} className={`${cls} rs-ddw${disabled ? ' off' : ''}`}>
      <button type="button" className="rs-ddb" aria-haspopup="listbox" aria-expanded={open} aria-label={label} disabled={disabled} onClick={() => setOpen(o => !o)}>
        {lead}<span>{display}</span><Icon icon={ArrowDown01Icon} size={24} className={open ? 'rs-flipi' : ''} />
      </button>
      <Popover anchor={ref} open={open} onClose={() => setOpen(false)} align={align} className="rs-dlist" minWidth={180}>
        <div role="listbox" aria-label={label}>
          {options.map(([v, l]) => <button type="button" role="option" aria-selected={v === value} key={v} className={v === value ? 'on' : ''} onClick={() => { onChange(v); setOpen(false) }}><span>{l}</span>{v === value && <Icon icon={Tick02Icon} size={18} />}</button>)}
        </div>
      </Popover>
    </div>
  )
}

/** current pixel width of an element (updates on resize) */
export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el); setW(el.clientWidth)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

/** Wraps a chart so it can be swiped sideways on phones (the chart keeps a fixed minimum width there). */
export function ChartScroll({ children }: { children: ReactNode }) {
  return <div className="rs-cs">{children}</div>
}

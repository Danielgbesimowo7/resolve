import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

/** true once the element is mostly on screen, false when it leaves (used to start/stop looping illustrations) */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, on] as const
}

/** Renders children on a fixed w×h design canvas and scales it to the container width. */
export function Stage({ w, h, children, className = '', minK = 0.5 }: { w: number; h: number; children: ReactNode; className?: string; minK?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [m, setM] = useState({ k: 1, x: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => { const cw = el.clientWidth, k = Math.max(minK, cw / w); setM({ k, x: Math.min(0, (cw - w * k) / 2) }) }
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    fit()
    return () => ro.disconnect()
  }, [w, minK])
  return (
    <div ref={ref} className={'vstage ' + className} style={{ height: h * m.k }}>
      <div className="vcv" style={{ width: w, height: h, transform: `translateX(${m.x}px) scale(${m.k})` }}>{children}</div>
    </div>
  )
}

export const Ic = ({ id, s = 16, c }: { id: string; s?: number; c?: string }) => (
  <svg className="vic" style={{ width: s, height: s, color: c }}><use href={`#${id}`} /></svg>
)

/** counts a number from a to b once `run` flips on */
export function Count({ from = 0, to, dec = 0, suf = '', delay = 0, dur = 1100, run = true }: { from?: number; to: number; dec?: number; suf?: string; delay?: number; dur?: number; run?: boolean }) {
  const [v, setV] = useState(from)
  useEffect(() => {
    if (!run) { setV(from); return }
    let raf = 0
    const t0 = performance.now() + delay
    const tick = (n: number) => {
      const p = Math.min(1, Math.max(0, (n - t0) / dur)), e = 1 - Math.pow(1 - p, 3)
      setV(from + (to - from) * e)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, from, to, delay, dur])
  return <>{v.toFixed(dec)}{suf}</>
}

/** types text char by char once `run` flips on */
export function Type({ text, delay = 0, speed = 38, run = true }: { text: string; delay?: number; speed?: number; run?: boolean }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    if (!run) return
    let iv = 0
    const to = window.setTimeout(() => { iv = window.setInterval(() => setN(x => { if (x >= text.length) { clearInterval(iv); return x } return x + 1 }), speed) }, delay)
    return () => { clearTimeout(to); clearInterval(iv) }
  }, [run, text, delay, speed])
  return <>{text.slice(0, n)}</>
}

export const d = (s: number): CSSProperties => ({ ['--d' as string]: `${s}s` })

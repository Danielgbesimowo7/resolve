import { useCallback, useEffect, useRef, useState } from 'react'
import { Stage } from './stage'
import { AiPerf } from './shots'
import { Intervene, Improve } from './cards'

const STEPS = [
  { t: 'Monitor', d: 'Get a clear view of your AI’s performance and spot what needs attention.' },
  { t: 'Intervene', d: 'Know when AI reaches its limits and step in with the right context.' },
  { t: 'Improve', d: 'Turn recurring problems into better answers' },
]

const BOXES: Array<[number, number, number, number]> = [[133, 30, 900, 523], [64, 97, 1053, 338], [20, 124, 1136, 285]]

/** Scroll-driven: the card stays sticky while the page scrolls through three segments; the stepper can also be clicked. */
export default function HowItWorks() {
  const wrap = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0) // 0..3 continuous
  const [play, setPlay] = useState(false)

  useEffect(() => {
    let raf = 0
    const calc = () => {
      raf = 0
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = Math.max(1, r.height - window.innerHeight)
      const q = Math.min(1, Math.max(0, -r.top / total))
      setP(q * 3)
      setPlay(r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.2)
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(calc) }
    calc()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf) }
  }, [])

  const step = Math.min(2, Math.floor(p))
  const go = useCallback((i: number) => {
    const el = wrap.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const total = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + ((i + 0.5) / 3) * total, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [])

  return (
    <section className="sec how" id="how">
      <div className="pillb"><i className="dot"></i>How It Works</div>
      <h2 className="tw" data-t="See what’s happening. *Step in when it matters.*|Improve what comes next"></h2>
      <p className="lead reveal">Resolve gives your team a clear path from monitoring AI conversations to improving the knowledge behind them.</p>
      <div className="hwrap" ref={wrap}>
        <div className="hsticky">
          <div className="vstep" role="tablist" aria-label="How it works steps">
            {[0, 1, 2].map(i => (
              <span key={i} className="vstep-i">
                <button role="tab" aria-selected={step === i} aria-label={`Step ${i + 1}: ${STEPS[i].t}`} className={'vdot' + (step === i ? ' on' : step > i ? ' done' : '')} onClick={() => go(i)}>{i + 1}</button>
                {i < 2 && <i className="vlink"><u style={{ transform: `scaleX(${Math.min(1, Math.max(0, p - i - 0.0))})` }} /></i>}
              </span>
            ))}
          </div>
          <article className="vcard-big" aria-live="polite">
            <div className="vbh" key={step}>
              <h3>{STEPS[step].t}</h3>
              <p>{STEPS[step].d}</p>
            </div>
            <div className="vframe">
              <Stage w={1166} h={553} minK={0.55} box={BOXES[step]} frameH={Math.round(553 * 0.55)}>
                <div className="vslide" key={step}>
                  {step === 0 && <div className="vpos" style={{ left: 143, top: 36 }}><AiPerf play={play} sidebar wide={880} /></div>}
                  {step === 1 && <Intervene play={play} />}
                  {step === 2 && <Improve play={play} />}
                </div>
              </Stage>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

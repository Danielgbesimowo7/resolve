// Interaction layer for How it works + Features: pointer depth, spotlight, scroll-linked rail and loop restarts.
export function initMotion(): () => void {
  const undo: Array<() => void> = []
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches
  const $$ = <T extends HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)]
  const cards = $$('.hc, .fc')

  // depth: later layers in an illustration travel further with the pointer
  cards.forEach(card => card.querySelectorAll<HTMLElement>('.cv > *').forEach((el, i, all) => el.style.setProperty('--z', String(2 + (i / Math.max(1, all.length)) * 8))))
  if (fine && !reduce) {
    cards.forEach(card => {
      let raf = 0
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--px', `${nx * 100}%`); card.style.setProperty('--py', `${ny * 100}%`)
          card.style.setProperty('--ry', `${((nx - 0.5) * 7).toFixed(2)}deg`); card.style.setProperty('--rx', `${((0.5 - ny) * 5).toFixed(2)}deg`)
          card.style.setProperty('--mx', ((nx - 0.5) * 2).toFixed(3)); card.style.setProperty('--my', ((ny - 0.5) * 2).toFixed(3))
          card.classList.add('tilt')
        })
      }
      const leave = () => { cancelAnimationFrame(raf); card.classList.remove('tilt'); for (const k of ['--rx', '--ry', '--mx', '--my']) card.style.removeProperty(k) }
      card.addEventListener('pointermove', move); card.addEventListener('pointerleave', leave)
      undo.push(() => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave) })
    })
  }

  // scroll-linked rail: draws from step 1 to 3 and lights each badge as it is reached
  const grid = document.querySelector<HTMLElement>('#how .grid'), rail = grid?.querySelector<HTMLElement>('.how-rail'), nums = $$('#how .num')
  let tick = 0
  const upd = () => {
    tick = 0
    if (!grid || !rail) return
    const r = grid.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * 0.8 - r.top) / (innerHeight * 0.42)))
    rail.style.setProperty('--p', p.toFixed(3))
    nums.forEach((n, i) => n.classList.toggle('lit', p >= (i === 0 ? 0.02 : i === 1 ? 0.5 : 0.98)))
  }
  const onScroll = () => { if (!tick) tick = requestAnimationFrame(upd) }
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); upd()
  undo.push(() => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll) })

  // helpers: restart counters / typing for a card
  const runCounts = (root: HTMLElement) => root.querySelectorAll<HTMLElement>('[data-to]').forEach(el => {
    const a = +(el.dataset.from ?? 0), b = +(el.dataset.to ?? 0), dur = +(el.dataset.dur ?? 1400), t0 = performance.now() + +(el.dataset.delay ?? 0), dec = +(el.dataset.dec ?? 0)
    const id = (el as any)._m = ((el as any)._m ?? 0) + 1
    const fmt = (v: number) => (el.dataset.comma ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec)) + (el.dataset.suf ?? '')
    el.textContent = fmt(a)
    const f = (n: number) => { if ((el as any)._m !== id) return; const p = Math.min(1, Math.max(0, (n - t0) / dur)); el.textContent = fmt(a + (b - a) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f) }
    requestAnimationFrame(f)
  })
  const runTyping = (root: HTMLElement) => root.querySelectorAll<HTMLElement>('.ty').forEach(el => {
    const txt = el.dataset.text ?? '', id = (el as any)._t = ((el as any)._t ?? 0) + 1
    el.textContent = ''
    setTimeout(async () => { for (let i = 1; i <= txt.length; i++) { if ((el as any)._t !== id) return; el.textContent = txt.slice(0, i); await new Promise(r => setTimeout(r, 45)) } }, +(el.dataset.delay ?? 0))
  })

  // loops that must restart in step with their CSS timelines (only while the card is on screen)
  const how = $$('.hc'), feat = $$('.fc')
  let n2 = 0, flip = false
  const jobs: Array<[HTMLElement | undefined, number, (el: HTMLElement) => void]> = [
    [how[1], 10000, el => { runCounts(el); runTyping(el) }],
    [feat[0], 9000, el => { flip = !flip; el.classList.toggle('ra', flip); el.classList.toggle('rb', !flip); runCounts(el) }],
    [feat[1], 7500, el => { n2 = (n2 + 1) % 6; const t = el.querySelector('.f2-n'); if (t) t.textContent = String(184 + n2) }],
    [feat[3], 8000, el => runCounts(el)],
  ]
  if (!reduce) jobs.forEach(([el, ms, fn]) => {
    if (!el) return
    let timer = 0
    const sync = () => { if (el.classList.contains('go')) { if (!timer) timer = window.setInterval(() => fn(el), ms) } else if (timer) { clearInterval(timer); timer = 0 } }
    const mo = new MutationObserver(sync); mo.observe(el, { attributes: true, attributeFilter: ['class'] }); sync()
    undo.push(() => { mo.disconnect(); clearInterval(timer) })
  })
  return () => undo.forEach(f => f())
}

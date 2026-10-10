import type { Conversation } from '../data/mock'

const DAY = 86_400_000
export const inWindow = (all: Conversation[], days: number, offset = 0, now = Date.now()) => {
  const end = now - offset * days * DAY, start = end - days * DAY
  return all.filter(c => c.createdAt > start && c.createdAt <= end)
}
export const aiResolved = (c: Conversation) => c.status === 'resolved' && !c.human
const pct = (n: number, d: number) => (d ? (n / d) * 100 : 0)
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

export function summary(all: Conversation[], days: number, offset = 0) {
  const l = inWindow(all, days, offset)
  return { total: l.length, aiRate: pct(l.filter(aiResolved).length, l.length), escRate: pct(l.filter(c => c.human).length, l.length), confidence: avg(l.map(c => c.confidence)), resp: avg(l.map(c => c.respSec)), ai: l.filter(aiResolved).length, human: l.filter(c => c.human).length, unresolved: l.filter(c => !c.human && !aiResolved(c)).length }
}

/** daily (or multi-day) buckets, oldest first, with labels */
export function buckets(all: Conversation[], days: number, n = 7, now = Date.now()) {
  const span = (days * DAY) / n, start = now - days * DAY
  return Array.from({ length: n }, (_, i) => {
    const s = start + i * span, e = s + span
    const l = all.filter(c => c.createdAt > s && c.createdAt <= e)
    return { label: new Date(e - 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), list: l, rate: pct(l.filter(aiResolved).length, l.length), esc: pct(l.filter(c => c.human).length, l.length), conf: avg(l.map(c => c.confidence)), count: l.length }
  })
}

export const INTENT_GROUPS = ['Billing', 'Account', 'Refund', 'Technicals', 'General'] as const
export type IntentGroup = (typeof INTENT_GROUPS)[number]
export function groupOf(c: Conversation): IntentGroup {
  if (c.issue === 'Refund request') return 'Refund'
  if (c.intent === 'Billing') return 'Billing'
  if (c.intent === 'Account') return 'Account'
  if (c.intent === 'Technical') return 'Technicals'
  return 'General'
}
export function intentStats(all: Conversation[], days: number, now = Date.now()) {
  const cur = inWindow(all, days, 0, now), prev = inWindow(all, days, 1, now), bk = buckets(all, days, 7, now)
  return INTENT_GROUPS.map(g => {
    const l = cur.filter(c => groupOf(c) === g), p = prev.filter(c => groupOf(c) === g)
    const rate = pct(l.filter(aiResolved).length, l.length), pr = pct(p.filter(aiResolved).length, p.length)
    return { group: g, count: l.length, rate, delta: rate - pr, spark: bk.map(b => { const x = b.list.filter(c => groupOf(c) === g); return pct(x.filter(aiResolved).length, x.length) }) }
  })
}

/** smooth path through points */
export function smooth(pts: ReadonlyArray<readonly [number, number]>) {
  return pts.reduce((a, p, i) => { if (!i) return `M${p[0]} ${p[1]}`; const q = pts[i - 1], cx = (q[0] + p[0]) / 2; return `${a}C${cx} ${q[1]} ${cx} ${p[1]} ${p[0]} ${p[1]}` }, '')
}

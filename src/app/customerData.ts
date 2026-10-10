import type { Conversation, Plan } from '../data/mock'

export interface Customer { email: string; name: string; avatar: string | null; plan: Plan; conversations: number; last: number; satisfaction: number; status: 'Active' | 'Needs attention'; since: string; convos: Conversation[] }
const SCORE = { Positive: 5, Neutral: 3, Frustrated: 1 } as const

export function buildCustomers(all: Conversation[]): Customer[] {
  const m = new Map<string, Conversation[]>()
  for (const c of all) { const l = m.get(c.email); if (l) l.push(c); else m.set(c.email, [c]) }
  return [...m.entries()].map(([email, convos]): Customer => {
    const sorted = [...convos].sort((a, b) => b.createdAt - a.createdAt), first = sorted[0]
    const sat = Math.min(5, Math.max(1, Math.round(sorted.slice(0, 6).reduce((a, c) => a + SCORE[c.sentiment], 0) / Math.min(6, sorted.length))))
    return { email, name: first.name, avatar: first.avatar, plan: first.plan, conversations: convos.length, last: first.createdAt, satisfaction: sat, status: sorted.slice(0, 3).some(c => c.status === 'needs_attention' && !c.human) ? 'Needs attention' : 'Active', since: first.since, convos: sorted }
  }).sort((a, b) => b.last - a.last)
}

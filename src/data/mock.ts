// Deterministic, realistic mock data. Swap this module for API calls when a backend exists.
export type Status = 'needs_attention' | 'resolved' | 'human' | 'unresolved'
export interface Message { id: string; from: 'customer' | 'ai' | 'agent'; text: string; at: number }
export interface Conversation {
  id: string; name: string; email: string; avatar: string | null
  issue: string; preview: string; status: Status; agent: string; human: boolean
  createdAt: number; confidence: number; respSec: number; messages: Message[]
}

export const STATUS_LABEL: Record<Status, string> = { needs_attention: 'Needs attention', resolved: 'Resolved', human: 'Human', unresolved: 'Unresolved' }
export const TEAM = ['Daniel Gbesimowo', 'Daniel Okafor', 'Amara Eze', 'Tolu Bello']

function rng(seed: number) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}

interface Topic { issue: string; ask: string; fix: string; esc: string; ai: string }
const TOPICS: Topic[] = [
  { issue: 'Refund request', ask: 'Hi, I was charged twice for my plan this month. Can I get a refund?', fix: "I can see the duplicate charge. I've started the refund and it should reach you in 3–5 business days.", esc: "I can see two charges but I'm not able to approve refunds over your plan limit. I'm flagging this for a teammate.", ai: 'Billing AI' },
  { issue: 'Password reset', ask: "I can't log into my account and the reset link never arrives.", fix: "I've sent a fresh reset link. If it isn't there in a minute, check your spam folder.", esc: "The reset email keeps bouncing. I'm handing this to a teammate who can check your account.", ai: 'Support AI' },
  { issue: 'Account locked', ask: 'My account has been locked after too many sign-in attempts.', fix: "I've verified your identity and unlocked the account. You can sign in again now.", esc: "I couldn't verify your identity automatically, so I'm asking a teammate to review it.", ai: 'Support AI' },
  { issue: 'App crashing', ask: 'The app keeps crashing on startup since the last update.', fix: 'Sorry about that. Please update to version 4.2.1, which fixes the startup crash.', esc: "I haven't seen this crash before. I'm escalating it with your device details.", ai: 'Support AI' },
  { issue: 'Feature request', ask: 'Can you add dark mode to the dashboard?', fix: "Great suggestion. I've logged it with the product team and you'll hear when it ships.", esc: "I've logged it, but I'd like a teammate to follow up on timing.", ai: 'Support AI' },
  { issue: 'Billing question', ask: 'When will my invoice be available to download?', fix: 'Invoices appear on the 1st of each month under Billing → Invoices.', esc: "Your invoice shows a different amount than I expected. Flagging for a teammate to check.", ai: 'Billing AI' },
  { issue: 'Technical issue', ask: 'The integration with our CRM stopped syncing yesterday.', fix: "I've restarted the sync and it's catching up now.", esc: "I'm not sure what's causing this one. I'm flagging it for a teammate who can read the sync logs.", ai: 'Support AI' },
  { issue: 'Change plan', ask: "I'd like to upgrade my plan to Growth.", fix: 'Done. Your plan is now Growth and the new limits apply immediately.', esc: 'Your account has a custom contract, so a teammate needs to confirm the change.', ai: 'Billing AI' },
  { issue: 'Login issue', ask: "I can't open my dashboard. It just shows a blank page.", fix: "That's usually a cached session. I've cleared yours, so please refresh and sign in again.", esc: "Clearing your session didn't help. I'm escalating with your browser details.", ai: 'Support AI' },
  { issue: 'Shipping delay', ask: "My order hasn't arrived and tracking hasn't updated in five days.", fix: "I've contacted the carrier and your package is out for delivery tomorrow.", esc: "The carrier shows the parcel as lost. A teammate will arrange a replacement.", ai: 'Support AI' },
  { issue: 'Cancel subscription', ask: 'I want to cancel my annual subscription.', fix: "I've scheduled the cancellation for the end of your billing period. You keep access until then.", esc: 'Annual cancellations need a quick check from a teammate before I confirm.', ai: 'Billing AI' },
  { issue: 'Invoice copy', ask: 'Can you resend my last invoice to a different email address?', fix: "Sent. You'll find it in the new inbox in a moment.", esc: "That address isn't on the account, so I'm asking a teammate to verify.", ai: 'Billing AI' },
  { issue: 'Data export', ask: 'How can I export all of my data?', fix: 'Go to Settings → Data → Export. I have started one for you and will email a link.', esc: 'Your workspace is large, so a teammate will prepare the export manually.', ai: 'Support AI' },
  { issue: 'Team invite', ask: "My teammate didn't get the invite email.", fix: "I've resent the invite. It can take a couple of minutes to arrive.", esc: "The invite is blocked by their mail server. A teammate will find another way in.", ai: 'Support AI' },
]

const NAMES = ['Maya Chen', 'Alex Morgan', 'Jordan Lee', 'Taylor Kim', 'Casey Brown', 'Riley Patel', 'Quinn Foster', 'Morgan Bell', 'Avery Wllson', 'Reese Hall']
const EXTRA = ['Sam Rivera', 'Jamie Park', 'Drew Collins', 'Skyler Nguyen', 'Harper Lane', 'Emerson Cole', 'Rowan Blake', 'Kai Mitchell', 'Sage Turner', 'Parker Hayes', 'Dakota Reed', 'Finley Brooks', 'Logan Price', 'Marley Stone', 'Phoenix Ward', 'Remy Fox', 'Blair Hughes', 'Ellis Shaw', 'Noel Grant', 'Tatum Webb', 'Oakley Frost', 'Lennon Pierce', 'Sutton Hale', 'Wren Dalton', 'Arden Moss', 'Zion Hart', 'Briar Cole', 'Indigo Vale', 'Emery Rhodes', 'Shiloh West']
const DOMAINS = ['acme.com', 'techo.com', 'pixel.com', 'goblex.com', 'northstar.com', 'zenith.co', 'orbitlabs.com', 'horizon.co', 'valleyco.com', 'lumen.co', 'brightly.io', 'kitebox.app']

// The first ten rows reproduce the Conversations design exactly.
const DESIGN: Array<[number, number, Status, string]> = [
  [0, 2, 'needs_attention', 'Billing AI'], [1, 8, 'resolved', 'Support AI'], [2, 14, 'human', 'Daniel Okafor'], [3, 21, 'needs_attention', 'Billing AI'], [4, 28, 'resolved', 'Billing AI'],
  [5, 30, 'human', 'Daniel Gbesimowo'], [6, 42, 'resolved', 'Billing AI'], [7, 60, 'unresolved', 'Billing AI'], [8, 65, 'resolved', 'Billing AI'], [9, 120, 'needs_attention', 'Billing AI'],
]
const DESIGN_TOPIC = [0, 1, 2, 0, 3, 4, 5, 6, 7, 8]

function email(name: string, i: number) {
  const [f, l] = name.toLowerCase().split(' ')
  return `${f}@${DOMAINS[i % DOMAINS.length]}`.replace('wllson', 'wilson') && `${f}${i < 10 ? '' : '.' + l}@${DOMAINS[i % DOMAINS.length]}`
}

function thread(r: () => number, t: Topic, status: Status, human: boolean, agent: string, at: number): Message[] {
  const m: Message[] = []
  let k = 0
  const add = (from: Message['from'], text: string, dt: number) => m.push({ id: `m${k++}`, from, text, at: at + dt * 1000 })
  add('customer', t.ask, 0)
  if (status === 'resolved' && !human) { add('ai', t.fix, 12); add('customer', 'That worked, thank you!', 60 + r() * 100) }
  else if (human) { add('ai', t.esc, 14); add('agent', `Hi, this is ${agent.split(' ')[0]} from the support team. I've taken over and I'm looking into it now.`, 240 + r() * 300); if (status === 'resolved') add('customer', 'Thanks, all sorted now.', 900) }
  else if (status === 'unresolved') { add('ai', t.fix, 12); add('customer', "That didn't fix it, I'm still having the problem.", 140) }
  else { add('ai', t.esc, 14); add('customer', 'Okay, I will wait to hear back.', 90) }
  return m
}

export function buildConversations(now = Date.now()): Conversation[] {
  const r = rng(42), out: Conversation[] = []
  const make = (i: number, name: string, avatar: string | null, ti: number, status: Status, agentName: string | null, createdAt: number): Conversation => {
    const t = TOPICS[ti]
    const human = status === 'human' || (agentName !== null && !agentName.includes('AI'))
    const agent = agentName ?? (human ? TEAM[1 + Math.floor(r() * 3)] : t.ai)
    const messages = thread(r, t, status, human, agent, createdAt)
    return { id: `c${i + 1}`, name, email: email(name, i), avatar, issue: t.issue, preview: t.ask, status, agent, human, createdAt, confidence: status === 'needs_attention' ? 28 + Math.round(r() * 24) : 72 + Math.round(r() * 26), respSec: 22 + Math.round(r() * 48), messages }
  }
  DESIGN.forEach(([ni, mins, status, agent], i) => out.push(make(i, NAMES[ni], NAMES[ni].split(' ')[0].toLowerCase(), DESIGN_TOPIC[i], status, agent, now - mins * 60_000)))
  const day = 86_400_000
  for (let i = 10; i < 640; i++) {
    const p = r(), status: Status = p < 0.62 ? 'resolved' : p < 0.8 ? 'human' : p < 0.92 ? 'needs_attention' : 'unresolved'
    const age = Math.pow(r(), 0.9) * 60 * day + 3 * 3_600_000
    const name = i % 4 === 0 ? NAMES[Math.floor(r() * NAMES.length)] : EXTRA[Math.floor(r() * EXTRA.length)]
    const known = NAMES.includes(name) ? name.split(' ')[0].toLowerCase() : null
    out.push(make(i, name, known, Math.floor(r() * TOPICS.length), status, null, now - age))
  }
  return out.sort((a, b) => b.createdAt - a.createdAt)
}

export function timeAgo(ts: number, now = Date.now()) {
  const m = Math.max(1, Math.round((now - ts) / 60_000))
  if (m < 60) return `${m}min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  return d === 1 ? 'Yesterday' : `${d}d ago`
}

export interface Stats { total: number; aiRate: number; avgResp: number; escalations: number; ai: number; human: number; unresolved: number; series: Array<{ label: string; count: number }> }
export function computeStats(all: Conversation[], days: number, now = Date.now(), offset = 0): Stats {
  const day = 86_400_000, end = now - offset * days * day, start = end - days * day
  const list = all.filter(c => c.createdAt > start && c.createdAt <= end)
  const ai = list.filter(c => c.status === 'resolved' && !c.human).length
  const human = list.filter(c => c.human).length
  const unresolved = list.length - ai - human
  const series = Array.from({ length: Math.min(days, 14) }, (_, i) => {
    const span = days / Math.min(days, 14), s = start + i * span * day, e = s + span * day
    const d = new Date(e - 1)
    return { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count: list.filter(c => c.createdAt > s && c.createdAt <= e).length }
  })
  return { total: list.length, aiRate: list.length ? (ai / list.length) * 100 : 0, avgResp: list.length ? list.reduce((a, c) => a + c.respSec, 0) / list.length : 0, escalations: human, ai, human, unresolved, series }
}

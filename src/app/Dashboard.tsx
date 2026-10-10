import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown01Icon, ArrowRight02Icon, ArrowUp02Icon, BotIcon, Calendar05Icon, Clock01Icon, GoogleGeminiIcon, Message02Icon, UserMultipleIcon } from '@hugeicons/core-free-icons'
import { useStore, type Range } from '../state/store'
import { computeStats, timeAgo, type Conversation, type Status } from '../data/mock'
import { Avatar, ChartScroll, Dd, Icon, StatusPill, useNarrow, useWidth } from './ui'
import { useAuth } from '../state/auth'

export function RangePicker() {
  const { state, dispatch } = useStore()
  return <Dd cls="rs-range" label="Date range" align="right" value={String(state.range)} onChange={v => dispatch({ type: 'range', range: Number(v) as Range })} options={[['7', 'Last 7 days'], ['14', 'Last 14 days'], ['30', 'Last 30 days']]} lead={<Icon icon={Calendar05Icon} size={24} />} display={`Last ${state.range} days`} />
}

export function Delta({ cur, prev, invert }: { cur: number; prev: number; invert?: boolean }) {
  const pct = prev ? ((cur - prev) / prev) * 100 : 0
  const good = invert ? pct <= 0 : pct >= 0
  return <span className={`rs-delta ${good ? '' : 'bad'}`}><Icon icon={ArrowUp02Icon} size={24} className={pct < 0 ? 'flip' : ''} />{Math.abs(pct).toFixed(1)}%</span>
}

export const fmtK = (n: number) => (n >= 1000 ? `${+(n / 1000).toFixed(1)}k` : `${n}`)
function niceMax(v: number) { const p = Math.pow(10, Math.floor(Math.log10(Math.max(v, 4)))); for (const m of [1, 2, 4, 5, 8, 10]) if (m * p >= v) return m * p; return 10 * p }

export function LineChart({ series, title = 'conversations' }: { series: Array<{ label: string; count: number }>; title?: string }) {
  const narrow = useNarrow()
  const [hover, setHover] = useState<number | null>(null)
  const W = 736, X0 = narrow ? 10 : 51, PW = W - X0, H = 202, Y0 = 6
  const max = niceMax(Math.max(...series.map(s => s.count)))
  const pts = series.map((s, i) => [X0 + (i * PW) / Math.max(1, series.length - 1), Y0 + H - (s.count / max) * H] as const)
  const d = pts.reduce((a, p, i) => { if (!i) return `M${p[0]} ${p[1]}`; const q = pts[i - 1], cx = (q[0] + p[0]) / 2; return `${a}C${cx} ${q[1]} ${cx} ${p[1]} ${p[0]} ${p[1]}` }, '')
  const active = hover ?? Math.round((series.length - 1) * 0.57)
  const [wref, cw] = useWidth<HTMLDivElement>()
  const [ax, ay] = pts[active], px = (ax / W) * cw, flip = cw > 0 && px + 22 + 156 > cw - 4
  return (
    <ChartScroll><div ref={wref} className="rs-chartw" onMouseLeave={() => setHover(null)} onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W; setHover(pts.reduce((b, p, i) => (Math.abs(p[0] - x) < Math.abs(pts[b][0] - x) ? i : b), 0)) }}>
      {[0, 1, 2, 3, 4].map(i => <span key={i} className="rs-yl" style={{ top: Y0 + (H * (4 - i)) / 4 }}>{i === 0 ? '0' : fmtK((max * i) / 4)}</span>)}
      <svg viewBox={`0 0 ${W} 250`} preserveAspectRatio="none">
        <defs><linearGradient id="rsg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#01c88a" stopOpacity=".22" /><stop offset="1" stopColor="#01c88a" stopOpacity="0" /></linearGradient></defs>
        {[0, 1, 2, 3, 4].map(i => <line key={i} x1={X0} x2={W} y1={Y0 + (H * i) / 4} y2={Y0 + (H * i) / 4} stroke="#eef0f0" />)}
        {pts.map((p, i) => <line key={i} x1={p[0]} x2={p[0]} y1={Y0} y2={Y0 + H} stroke="#f1f3f3" />)}
        <path d={`${d}L${pts[pts.length - 1][0]} ${Y0 + H}L${pts[0][0]} ${Y0 + H}Z`} fill="url(#rsg)" /><path d={d} fill="none" stroke="#01c88a" strokeWidth="2.2" />
        <line x1={ax} x2={ax} y1={Y0} y2={Y0 + H} stroke="#555" strokeDasharray="3 3" />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === active ? 7 : 6} fill="#01c88a" />)}
      </svg>
      {pts.map((p, i) => (series.length <= 8 || i % 2 === 0) && <span key={i} className="rs-xl" style={{ left: `${(p[0] / W) * 100}%` }}>{series[i].label}</span>)}
      <div className="rs-tip" style={{ left: `calc(${(ax / W) * 100}% ${flip ? '- 178px' : '+ 22px'})`, top: Math.max(0, ay - 36) }}><span>{series[active].label}</span><b>{series[active].count.toLocaleString()} {title}</b><i className={flip ? 'r' : 'l'} /></div>
    </div></ChartScroll>
  )
}

export function Donut({ segs }: { segs: Array<{ v: number; c: string }> }) {
  const r = 90, circ = 2 * Math.PI * r, gap = 10, total = segs.reduce((a, s) => a + s.v, 0) || 1
  let acc = 0
  return (
    <svg viewBox="0 0 208 208" style={{ transform: 'rotate(-90deg)' }}>
      {segs.filter(s => s.v > 0).map((s, i) => { const len = Math.max(2, (s.v / total) * circ - gap), start = (acc / total) * circ + gap / 2; acc += s.v; return <circle key={i} cx="104" cy="104" r={r} fill="none" stroke={s.c} strokeWidth="28" strokeLinecap="round" strokeDasharray={`${len} ${circ}`} strokeDashoffset={-start} /> })}
    </svg>
  )
}

const FILTERS: Array<{ k: 'all' | Status; l: string; c?: string }> = [{ k: 'all', l: 'All' }, { k: 'resolved', l: 'AI resolved', c: '#01c88a' }, { k: 'needs_attention', l: 'Needs attention', c: '#fb2239' }, { k: 'human', l: 'Human', c: '#398ef9' }, { k: 'unresolved', l: 'Unresolved', c: '#fbc014' }]

export function AgentCell({ c }: { c: Conversation }) {
  return c.human ? <span className="rs-ag"><Avatar c={{ name: c.agent, avatar: c.agent.startsWith('Daniel Gbesimowo') ? 'daniel' : null }} size={24} />{c.agent}</span> : <span className="rs-ag"><Icon icon={BotIcon} size={24} />{c.agent}</span>
}

export default function Dashboard() {
  const { conversations, state } = useStore()
  const { user } = useAuth()
  const [f, setF] = useState<'all' | Status>('all')
  const cur = useMemo(() => computeStats(conversations, state.range), [conversations, state.range])
  const prev = useMemo(() => computeStats(conversations, state.range, Date.now(), 1), [conversations, state.range])
  const h = new Date().getHours(), hello = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  const rows = conversations.filter(c => f === 'all' || c.status === f).slice(0, 4)
  const pct = (n: number) => (cur.total ? (n / cur.total) * 100 : 0)
  const stats = [
    { icon: Message02Icon, label: 'Total conversations', val: cur.total.toLocaleString(), p: prev.total, c: cur.total },
    { icon: GoogleGeminiIcon, label: 'AI resolution rate', val: `${cur.aiRate.toFixed(1)}%`, p: prev.aiRate, c: cur.aiRate },
    { icon: Clock01Icon, label: 'Average response time', val: `${Math.round(cur.avgResp)}s`, p: prev.avgResp, c: cur.avgResp, invert: true },
    { icon: UserMultipleIcon, label: 'Escalations to human', val: cur.escalations.toLocaleString(), p: prev.escalations, c: cur.escalations, invert: true },
  ]
  return (
    <div className="rs-page">
      <div className="rs-head"><div><h2>{hello}, <span>{user?.name.split(' ')[0]} 👋</span></h2><p>Here is what is happening with your customer support {state.range === 7 ? 'today' : `over the last ${state.range} days`}</p></div><RangePicker /></div>
      <div className="rs-stats">{stats.map(s => <div className="rs-card" key={s.label}><div className="rs-stat-h"><span className="rs-ib"><Icon icon={s.icon} size={24} /></span>{s.label}</div><div className="rs-stat-b"><div className="rs-num">{s.val}</div><div className="rs-delrow"><Delta cur={s.c} prev={s.p} invert={s.invert} /><span>vs. previous {state.range} days</span></div></div></div>)}</div>
      <div className="rs-two">
        <div className="rs-card rs-pad"><div className="rs-ttl">Conversion volume</div><LineChart series={cur.series} /></div>
        <div className="rs-card" style={{ padding: '20px 22px' }}><div className="rs-ttl">Resolution perfomance</div>
          <div className="rs-donut-w"><div className="rs-donut"><Donut segs={[{ v: cur.ai, c: '#01c88a' }, { v: cur.human, c: '#398ef9' }, { v: cur.unresolved, c: '#fbc014' }]} /><div className="rs-donut-c"><b>{cur.aiRate.toFixed(1)}%</b><span>AI resolved</span></div></div>
            <ul className="rs-legend">{[['AI resolved', '#01c88a', cur.ai], ['Human', '#398ef9', cur.human], ['Unresolved', '#fbc014', cur.unresolved]].map(([l, c, n]) => <li key={l as string}><div><i style={{ background: c as string }} />{l}</div><span>{pct(n as number).toFixed(1)}% <small>({(n as number).toLocaleString()})</small></span></li>)}</ul></div></div>
      </div>
      <div className="rs-card rs-pad" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="rs-between"><div className="rs-ttl">Recent conversations</div><Link className="rs-link" to="/app/conversations">View all conversations <Icon icon={ArrowRight02Icon} size={24} /></Link></div>
          <div className="rs-chip-row">{FILTERS.map(x => <button key={x.k} className={`rs-chip ${f === x.k ? 'on' : ''}`} onClick={() => setF(x.k)}>{x.c && <i style={{ background: x.c }} />}{x.l}</button>)}</div>
        </div>
        <div className="rs-tbl rs-scroll"><div className="rs-tr rs-th rs-c5"><span>Customer</span><span>Issue</span><span>Status</span><span>Agent</span><span>Time</span></div>
          {rows.map(c => <Link key={c.id} to={`/app/conversations/${c.id}`} className="rs-tr rs-c5"><span className="rs-cu"><Avatar c={c} size={40} /><span><b>{c.name}</b><small>{c.email}</small></span></span><span className="rs-plain">{c.issue}</span><span><StatusPill s={c.status} /></span><span><AgentCell c={c} /></span><span className="rs-plain">{timeAgo(c.createdAt)}</span></Link>)}
          {rows.length === 0 && <p className="rs-empty">No conversations match this filter.</p>}</div></div>
    </div>
  )
}
